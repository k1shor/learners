import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import express from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(serverDir, "..");
const dataDir = path.join(serverDir, "data");
fs.mkdirSync(dataDir, { recursive: true });

const database = new Database(
  process.env.DATABASE_PATH || path.join(dataDir, "learners.sqlite"),
);
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_expiration_idx ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS password_reset_expiration_idx ON password_reset_tokens(expires_at);
`);

const userColumns = database.prepare("PRAGMA table_info(users)").all();
if (!userColumns.some((column) => column.name === "is_active")) {
  database.exec(
    "ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1",
  );
}

database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());

const app = express();
const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === "production";
const cookieName = "learner_session";
const sessionLifetime = 7 * 24 * 60 * 60 * 1000;
const resetTokenLifetime = 60 * 60 * 1000;
const appBaseUrl = (
  process.env.APP_BASE_URL || "http://localhost:5173"
).replace(/\/$/, "");
const mailer =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

if (production) app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (request.path.startsWith("/api/")) {
    response.setHeader("Cache-Control", "no-store");
  }
  next();
});
app.use(express.json({ limit: "10kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many sign-in attempts. Wait a few minutes and try again.",
  },
});
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many password reset requests. Try again later." },
});

const readCookie = (request, name) => {
  const entry = (request.headers.cookie ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
});

const setSessionCookie = (response, token, maxAgeSeconds) => {
  const parts = [
    `${cookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (production) parts.push("Secure");
  response.setHeader("Set-Cookie", parts.join("; "));
};

const createSession = (response, userId) => {
  const token = crypto.randomBytes(32).toString("base64url");
  database
    .prepare(
      "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .run(hashToken(token), userId, Date.now() + sessionLifetime);
  setSessionCookie(response, token, Math.floor(sessionLifetime / 1000));
};

const expireSessionCookie = (response) => {
  setSessionCookie(response, "", 0);
};

const requireSession = (request, response, next) => {
  const token = readCookie(request, cookieName);
  if (!token) return response.status(401).json({ error: "Please sign in." });

  const tokenHash = hashToken(token);
  const record = database
    .prepare(
      `
            SELECT users.id, users.name, users.email, users.created_at,
              users.is_active,
             sessions.expires_at
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
    `,
    )
    .get(tokenHash);

  if (!record || record.expires_at <= Date.now()) {
    if (record) {
      database
        .prepare("DELETE FROM sessions WHERE token_hash = ?")
        .run(tokenHash);
    }
    expireSessionCookie(response);
    return response
      .status(401)
      .json({ error: "Your session expired. Please sign in again." });
  }

  if (!record.is_active) {
    database.prepare("DELETE FROM sessions WHERE user_id = ?").run(record.id);
    expireSessionCookie(response);
    return response.status(403).json({ error: "This account is disabled." });
  }

  request.user = record;
  request.sessionHash = tokenHash;
  return next();
};

const requireAdminKey = (request, response, next) => {
  if (!production) return next();

  const expectedKey = process.env.ADMIN_API_KEY || "";
  const providedKey = request.get("x-admin-key") || "";
  if (
    !expectedKey ||
    (production && Buffer.byteLength(expectedKey, "utf8") < 32)
  ) {
    return response
      .status(503)
      .json({ error: "Admin access is not configured on this server." });
  }

  const expectedBuffer = Buffer.from(expectedKey);
  const providedBuffer = Buffer.from(providedKey);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return response.status(401).json({ error: "Admin key is invalid." });
  }
  return next();
};

const adminStudent = (student) => ({
  id: student.id,
  name: student.name,
  email: student.email,
  createdAt: student.created_at,
  isActive: Boolean(student.is_active),
});

app.get("/api/health", (_request, response) => response.json({ ok: true }));

app.post("/api/auth/signup", authLimiter, (request, response) => {
  const name =
    typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const email =
    typeof request.body?.email === "string"
      ? request.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof request.body?.password === "string" ? request.body.password : "";

  if (name.length < 2 || name.length > 80) {
    return response
      .status(400)
      .json({ error: "Name must be between 2 and 80 characters." });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return response.status(400).json({
      error:
        "Password must be at least 8 characters and no more than 72 bytes.",
    });
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 12);
    const result = database
      .prepare(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      )
      .run(name, email, passwordHash);
    const user = database
      .prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    createSession(response, user.id);
    return response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return response
        .status(409)
        .json({ error: "That email already has an account. Try signing in." });
    }
    console.error("Account creation failed:", error);
    return response
      .status(500)
      .json({ error: "Could not create your account. Please try again." });
  }
});

app.post("/api/auth/login", authLimiter, (request, response) => {
  const email =
    typeof request.body?.email === "string"
      ? request.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof request.body?.password === "string" ? request.body.password : "";
  const user = database
    .prepare(
      "SELECT id, name, email, password_hash, created_at, is_active FROM users WHERE email = ?",
    )
    .get(email);

  if (
    !user ||
    !bcrypt.compareSync(password, user.password_hash) ||
    !user.is_active
  ) {
    return response
      .status(401)
      .json({ error: "Email or password is incorrect." });
  }

  createSession(response, user.id);
  return response.json({ user: publicUser(user) });
});

app.post(
  "/api/auth/forgot-password",
  resetLimiter,
  async (request, response) => {
    const email =
      typeof request.body?.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return response
        .status(400)
        .json({ error: "Enter a valid email address." });
    }

    if (production && !mailer) {
      return response.status(503).json({
        error: "Password recovery email is not configured on this server yet.",
      });
    }

    const user = database
      .prepare("SELECT id, email FROM users WHERE email = ?")
      .get(email);
    let developmentResetUrl;

    if (user) {
      const token = crypto.randomBytes(32).toString("base64url");
      const tokenHash = hashToken(token);
      const expiresAt = Date.now() + resetTokenLifetime;
      database
        .prepare("DELETE FROM password_reset_tokens WHERE user_id = ?")
        .run(user.id);
      database
        .prepare(
          "INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
        )
        .run(tokenHash, user.id, expiresAt);
      const resetUrl = `${appBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;

      if (mailer) {
        try {
          await mailer.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: user.email,
            subject: "Reset your E-LearnersHub password",
            text: `Use this link to reset your password within one hour: ${resetUrl}\nIf you did not request a reset, ignore this email.`,
            html: `<p>Use the link below to reset your password. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
          });
        } catch (error) {
          database
            .prepare("DELETE FROM password_reset_tokens WHERE token_hash = ?")
            .run(tokenHash);
          console.error("Could not send password reset email:", error);
          return response.status(503).json({
            error:
              "We could not send the recovery email. Please try again later.",
          });
        }
      } else {
        developmentResetUrl = resetUrl;
        console.info(
          `Development password reset link for ${user.email}: ${resetUrl}`,
        );
      }
    }

    return response.json({
      message:
        "If an account exists for that email, password reset instructions have been sent.",
      ...(developmentResetUrl ? { developmentResetUrl } : {}),
    });
  },
);

app.post("/api/auth/reset-password", resetLimiter, (request, response) => {
  const token =
    typeof request.body?.token === "string" ? request.body.token : "";
  const password =
    typeof request.body?.password === "string" ? request.body.password : "";
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return response.status(400).json({
      error:
        "Password must be at least 8 characters and no more than 72 bytes.",
    });
  }

  const tokenHash = hashToken(token);
  const resetRecord = database
    .prepare(
      "SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = ?",
    )
    .get(tokenHash);
  if (!resetRecord || resetRecord.expires_at <= Date.now()) {
    if (resetRecord) {
      database
        .prepare("DELETE FROM password_reset_tokens WHERE token_hash = ?")
        .run(tokenHash);
    }
    return response.status(400).json({
      error: "This reset link is invalid or has expired. Request a new one.",
    });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const resetPassword = database.transaction(() => {
    database
      .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .run(passwordHash, resetRecord.user_id);
    database
      .prepare("DELETE FROM sessions WHERE user_id = ?")
      .run(resetRecord.user_id);
    database
      .prepare("DELETE FROM password_reset_tokens WHERE user_id = ?")
      .run(resetRecord.user_id);
  });
  resetPassword();

  return response.json({
    message: "Password updated. Please sign in with your new password.",
  });
});

app.get("/api/auth/me", requireSession, (request, response) => {
  response.json({ user: publicUser(request.user) });
});

app.post("/api/auth/logout", (request, response) => {
  const token = readCookie(request, cookieName);
  if (token) {
    database
      .prepare("DELETE FROM sessions WHERE token_hash = ?")
      .run(hashToken(token));
  }
  expireSessionCookie(response);
  return response.status(204).end();
});

app.get("/api/admin/students", requireAdminKey, (_request, response) => {
  const students = database
    .prepare(
      "SELECT id, name, email, created_at, is_active FROM users ORDER BY created_at DESC, id DESC",
    )
    .all()
    .map(adminStudent);
  return response.json({ students });
});

app.get("/api/admin/students/:id", requireAdminKey, (request, response) => {
  const studentId = Number(request.params.id);
  if (!Number.isInteger(studentId) || studentId < 1) {
    return response.status(400).json({ error: "Invalid student ID." });
  }
  const student = database
    .prepare(
      "SELECT id, name, email, created_at, is_active FROM users WHERE id = ?",
    )
    .get(studentId);
  if (!student) {
    return response.status(404).json({ error: "Student not found." });
  }
  return response.json({ student: adminStudent(student) });
});

app.patch("/api/admin/students/:id", requireAdminKey, (request, response) => {
  const studentId = Number(request.params.id);
  const isActive = request.body?.isActive;
  if (!Number.isInteger(studentId) || studentId < 1) {
    return response.status(400).json({ error: "Invalid student ID." });
  }
  if (typeof isActive !== "boolean") {
    return response
      .status(400)
      .json({ error: "isActive must be true or false." });
  }

  const updateStudent = database.transaction(() => {
    const result = database
      .prepare("UPDATE users SET is_active = ? WHERE id = ?")
      .run(Number(isActive), studentId);
    if (result.changes === 0) return null;
    if (!isActive) {
      database.prepare("DELETE FROM sessions WHERE user_id = ?").run(studentId);
    }
    return database
      .prepare(
        "SELECT id, name, email, created_at, is_active FROM users WHERE id = ?",
      )
      .get(studentId);
  });
  const student = updateStudent();
  if (!student) {
    return response.status(404).json({ error: "Student not found." });
  }
  return response.json({ student: adminStudent(student) });
});

if (production) {
  const distDir = path.join(projectDir, "dist");
  app.use(express.static(distDir, { index: false }));
  app.use((request, response, next) => {
    if (request.method === "GET" && !request.path.startsWith("/api/")) {
      return response.sendFile(path.join(distDir, "index.html"));
    }
    return next();
  });
}

app.listen(port, production ? "0.0.0.0" : "127.0.0.1", () => {
  console.log(`E-LearnersHub server listening on port ${port}`);
});
