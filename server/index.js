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
  CREATE TABLE IF NOT EXISTS instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_key TEXT NOT NULL UNIQUE,
    course_code TEXT NOT NULL,
    title TEXT NOT NULL,
    instructor_source_name TEXT NOT NULL,
    details_json TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    instructor_source_name TEXT NOT NULL,
    start_date TEXT NOT NULL DEFAULT '',
    time TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    meeting_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Scheduled',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS sessions_expiration_idx ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS password_reset_expiration_idx ON password_reset_tokens(expires_at);
`);

const courseCatalog = JSON.parse(
  fs.readFileSync(path.join(projectDir, "src", "data", "courses.json"), "utf8"),
);
const instructorColumns = database
  .prepare("PRAGMA table_info(instructors)")
  .all();
if (!instructorColumns.some((column) => column.name === "is_active")) {
  database.exec(
    "ALTER TABLE instructors ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1",
  );
}
const demoInstructors = [
  [
    "Demo Instructor: Ritu Maharjan",
    "Ritu Maharjan",
    "ritu.maharjan@example.test",
    "Nepali language and literature instructor.",
  ],
  [
    "Demo Instructor: Kiran Bista",
    "Kiran Bista",
    "kiran.bista@example.test",
    "Science and mathematics instructor.",
  ],
  [
    "Demo Instructor: Pooja KC",
    "Pooja KC",
    "pooja.kc@example.test",
    "Business and communication instructor.",
  ],
  [
    "Demo Instructor: Nabin Lama",
    "Nabin Lama",
    "nabin.lama@example.test",
    "Technology and digital skills instructor.",
  ],
  [
    "Demo Instructor: Manisha Joshi",
    "Manisha Joshi",
    "manisha.joshi@example.test",
    "Creative arts and writing instructor.",
  ],
];
const seedInstructor = database.prepare(
  "INSERT OR IGNORE INTO instructors (source_name, name, email, bio) VALUES (?, ?, ?, ?)",
);
const seedInstructors = database.transaction(() => {
  for (const sourceName of new Set(
    courseCatalog.map((course) => course.instructor),
  )) {
    seedInstructor.run(sourceName, sourceName, "", "");
  }
  for (const instructor of demoInstructors) {
    seedInstructor.run(...instructor);
  }
});
seedInstructors();

const demoCourses = [
  {
    title: "Nepali Language and Communication",
    course_code: "NEP101",
    status: "Available",
    instructor: "Demo Instructor: Ritu Maharjan",
    duration: "2 hours",
    time: "10:00 AM",
    start_date: "11/15/2026",
    category: "Language",
    description:
      "Build confidence in Nepali reading, writing, and everyday communication.",
    takeaway: "Practice clear and confident Nepali communication.",
    materials: ["Nepali reading guide", "Conversation practice sheet"],
    videos: ["Everyday Nepali conversations", "Writing with clarity"],
    assignments: [
      "Write a short personal introduction",
      "Practice a guided conversation",
    ],
    syllabus: [
      "Everyday vocabulary",
      "Reading for meaning",
      "Writing short passages",
      "Speaking with confidence",
    ],
    participants: [],
  },
  {
    title: "Mathematics for Everyday Problem Solving",
    course_code: "MATH110",
    status: "Available",
    instructor: "Demo Instructor: Kiran Bista",
    duration: "2 hours",
    time: "11:30 AM",
    start_date: "11/17/2026",
    category: "Mathematics",
    description:
      "Use practical mathematics to reason through everyday calculations and problems.",
    takeaway: "Apply useful math strategies to real situations.",
    materials: ["Problem-solving workbook", "Formula reference sheet"],
    videos: ["Estimation and mental math", "Working through word problems"],
    assignments: [
      "Solve a household budgeting exercise",
      "Explain a multi-step solution",
    ],
    syllabus: [
      "Number sense",
      "Fractions and percentages",
      "Ratios in daily life",
      "Problem-solving strategies",
    ],
    participants: [],
  },
  {
    title: "Small Business and Entrepreneurship in Nepal",
    course_code: "BUS205",
    status: "Available",
    instructor: "Demo Instructor: Pooja KC",
    duration: "2.5 hours",
    time: "1:00 PM",
    start_date: "11/19/2026",
    category: "Business",
    description:
      "Explore how to shape a practical business idea, understand customers, and plan next steps.",
    takeaway: "Turn a promising idea into a simple business plan.",
    materials: ["Business idea canvas", "Customer interview guide"],
    videos: ["Finding a customer need", "Planning a small venture"],
    assignments: [
      "Draft a one-page business idea",
      "Describe a target customer",
    ],
    syllabus: [
      "Ideas and opportunities",
      "Customer needs",
      "Simple budgeting",
      "Planning and next steps",
    ],
    participants: [],
  },
  {
    title: "Digital Skills for Study and Work",
    course_code: "DIG120",
    status: "Available",
    instructor: "Demo Instructor: Nabin Lama",
    duration: "2 hours",
    time: "2:30 PM",
    start_date: "11/21/2026",
    category: "Technology",
    description:
      "Practice useful digital skills for organizing information, communicating, and staying safe online.",
    takeaway: "Work more confidently with everyday digital tools.",
    materials: ["Digital skills checklist", "Online safety guide"],
    videos: ["Organizing digital files", "Staying safe online"],
    assignments: [
      "Create a clear folder structure",
      "Review privacy settings on a sample account",
    ],
    syllabus: [
      "Files and documents",
      "Online communication",
      "Information checking",
      "Privacy and safety",
    ],
    participants: [],
  },
  {
    title: "Creative Writing and Storytelling",
    course_code: "WRI130",
    status: "Available",
    instructor: "Demo Instructor: Manisha Joshi",
    duration: "1.5 hours",
    time: "4:00 PM",
    start_date: "11/23/2026",
    category: "Creative practice",
    description:
      "Develop a short story using vivid details, a memorable character, and a clear point of view.",
    takeaway: "Shape an original idea into a compelling short story.",
    materials: ["Story prompt cards", "Character planning worksheet"],
    videos: ["Building a memorable character", "Revising a first draft"],
    assignments: [
      "Write a short scene",
      "Revise a paragraph with sensory details",
    ],
    syllabus: [
      "Finding story ideas",
      "Character and setting",
      "Scene structure",
      "Revision and sharing",
    ],
    participants: [],
  },
];

const insertCourse = database.prepare(`
  INSERT OR IGNORE INTO courses
    (source_key, course_code, title, instructor_source_name, details_json)
  VALUES (?, ?, ?, ?, ?)
`);
const findCourse = database.prepare(
  "SELECT id FROM courses WHERE source_key = ?",
);
const insertClass = database.prepare(`
  INSERT INTO classes
    (course_id, instructor_source_name, start_date, time, duration, meeting_url, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const seedCoursesAndClasses = database.transaction(() => {
  for (const course of [...courseCatalog, ...demoCourses]) {
    const sourceKey = `${course.course_code}::${course.title}`;
    insertCourse.run(
      sourceKey,
      course.course_code,
      course.title,
      course.instructor,
      JSON.stringify(course),
    );
    const savedCourse = findCourse.get(sourceKey);
    const hasClass = database
      .prepare("SELECT 1 FROM classes WHERE course_id = ? LIMIT 1")
      .get(savedCourse.id);
    if (!hasClass) {
      insertClass.run(
        savedCourse.id,
        course.instructor,
        course.start_date ?? "",
        course.time ?? "",
        course.duration ?? "",
        course.meeting_url ?? "",
        "Scheduled",
      );
    }
  }
});
seedCoursesAndClasses();
database
  .prepare("UPDATE classes SET status = 'Scheduled' WHERE status = 'Available'")
  .run();

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

const serializeInstructor = (instructor) => ({
  id: instructor.id,
  sourceName: instructor.source_name,
  name: instructor.name,
  email: instructor.email,
  bio: instructor.bio,
  isActive: Boolean(instructor.is_active),
  updatedAt: instructor.updated_at,
  courses: database
    .prepare(
      "SELECT course_code, title FROM courses WHERE instructor_source_name = ? ORDER BY id",
    )
    .all(instructor.source_name)
    .map(({ course_code, title }) => ({ courseCode: course_code, title })),
});

const courseById = database.prepare("SELECT * FROM courses WHERE id = ?");
const classesForCourse = database.prepare(
  "SELECT * FROM classes WHERE course_id = ? ORDER BY start_date, time, id",
);
const getInstructorName = database.prepare(
  "SELECT name, is_active FROM instructors WHERE source_name = ?",
);
const serializeCourse = (record) => {
  const details = JSON.parse(record.details_json);
  const instructor = getInstructorName.get(record.instructor_source_name);
  const classes = classesForCourse.all(record.id).map((classRecord) => ({
    id: classRecord.id,
    start_date: classRecord.start_date,
    time: classRecord.time,
    duration: classRecord.duration,
    meeting_url: classRecord.meeting_url,
    status: classRecord.status,
  }));
  const nextClass = classes.find((item) => item.status !== "Cancelled");
  return {
    ...details,
    courseId: record.id,
    instructorSourceName: record.instructor_source_name,
    isActive: Boolean(record.is_active),
    instructor: instructor?.is_active
      ? instructor.name
      : "Instructor unavailable",
    ...(nextClass
      ? {
          start_date: nextClass.start_date,
          time: nextClass.time,
          duration: nextClass.duration || details.duration,
          meeting_url: nextClass.meeting_url,
          status: nextClass.status,
        }
      : {}),
    classes,
  };
};

const serializeClass = (record) => {
  const course = courseById.get(record.course_id);
  const instructor = getInstructorName.get(record.instructor_source_name);
  return {
    id: record.id,
    courseId: record.course_id,
    courseCode: course.course_code,
    courseTitle: course.title,
    instructorSourceName: record.instructor_source_name,
    instructor: instructor?.name ?? record.instructor_source_name,
    startDate: record.start_date,
    time: record.time,
    duration: record.duration,
    meetingUrl: record.meeting_url,
    status: record.status,
    updatedAt: record.updated_at,
  };
};

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
  const name = request.body?.name;
  const email = request.body?.email;
  if (!Number.isInteger(studentId) || studentId < 1) {
    return response.status(400).json({ error: "Invalid student ID." });
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return response
      .status(400)
      .json({ error: "isActive must be true or false." });
  }
  if (
    name !== undefined &&
    (typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 80)
  ) {
    return response
      .status(400)
      .json({ error: "Name must be between 2 and 80 characters." });
  }
  if (
    email !== undefined &&
    (typeof email !== "string" ||
      email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  ) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }

  try {
    const updateStudent = database.transaction(() => {
      const currentStudent = database
        .prepare("SELECT * FROM users WHERE id = ?")
        .get(studentId);
      if (!currentStudent) return null;
      const nextIsActive = isActive ?? Boolean(currentStudent.is_active);
      database
        .prepare(
          "UPDATE users SET name = ?, email = ?, is_active = ? WHERE id = ?",
        )
        .run(
          name === undefined ? currentStudent.name : name.trim(),
          email === undefined
            ? currentStudent.email
            : email.trim().toLowerCase(),
          Number(nextIsActive),
          studentId,
        );
      if (!nextIsActive) {
        database
          .prepare("DELETE FROM sessions WHERE user_id = ?")
          .run(studentId);
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
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return response.status(409).json({
        error: "That email address is already used by another student.",
      });
    }
    console.error("Could not update student:", error);
    return response.status(500).json({ error: "Could not update student." });
  }
});

app.get("/api/instructors", (_request, response) => {
  const instructors = database
    .prepare(
      "SELECT source_name, name, is_active FROM instructors ORDER BY name COLLATE NOCASE",
    )
    .all()
    .map(({ source_name, name, is_active }) => ({
      sourceName: source_name,
      name: is_active ? name : "Instructor unavailable",
    }));
  return response.json({ instructors });
});

app.get("/api/admin/instructors", requireAdminKey, (_request, response) => {
  const instructors = database
    .prepare("SELECT * FROM instructors ORDER BY name COLLATE NOCASE")
    .all()
    .map(serializeInstructor);
  return response.json({ instructors });
});

app.get("/api/admin/instructors/:id", requireAdminKey, (request, response) => {
  const instructorId = Number(request.params.id);
  if (!Number.isInteger(instructorId) || instructorId < 1) {
    return response.status(400).json({ error: "Invalid instructor ID." });
  }
  const instructor = database
    .prepare("SELECT * FROM instructors WHERE id = ?")
    .get(instructorId);
  if (!instructor) {
    return response.status(404).json({ error: "Instructor not found." });
  }
  return response.json({ instructor: serializeInstructor(instructor) });
});

app.patch(
  "/api/admin/instructors/:id",
  requireAdminKey,
  (request, response) => {
    const instructorId = Number(request.params.id);
    const name =
      typeof request.body?.name === "string" ? request.body.name.trim() : "";
    const email =
      typeof request.body?.email === "string" ? request.body.email.trim() : "";
    const bio =
      typeof request.body?.bio === "string" ? request.body.bio.trim() : "";
    const isActive = request.body?.isActive;
    if (!Number.isInteger(instructorId) || instructorId < 1) {
      return response.status(400).json({ error: "Invalid instructor ID." });
    }
    if (name.length < 2 || name.length > 80) {
      return response
        .status(400)
        .json({ error: "Name must be between 2 and 80 characters." });
    }
    if (
      email.length > 254 ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return response
        .status(400)
        .json({ error: "Enter a valid email address." });
    }
    if (bio.length > 500) {
      return response
        .status(400)
        .json({ error: "Bio must be 500 characters or fewer." });
    }
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return response
        .status(400)
        .json({ error: "isActive must be true or false." });
    }

    const result = database
      .prepare(
        "UPDATE instructors SET name = ?, email = ?, bio = ?, is_active = COALESCE(?, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      )
      .run(
        name,
        email,
        bio,
        isActive === undefined ? null : Number(isActive),
        instructorId,
      );
    if (result.changes === 0) {
      return response.status(404).json({ error: "Instructor not found." });
    }
    const instructor = database
      .prepare("SELECT * FROM instructors WHERE id = ?")
      .get(instructorId);
    return response.json({ instructor: serializeInstructor(instructor) });
  },
);

app.get("/api/courses", (_request, response) => {
  const courses = database
    .prepare("SELECT * FROM courses WHERE is_active = 1 ORDER BY id")
    .all()
    .map(serializeCourse);
  return response.json({ courses });
});

app.get("/api/admin/courses", requireAdminKey, (_request, response) => {
  const courses = database
    .prepare("SELECT * FROM courses ORDER BY id")
    .all()
    .map(serializeCourse);
  return response.json({ courses });
});

app.get("/api/admin/courses/:id", requireAdminKey, (request, response) => {
  const courseId = Number(request.params.id);
  if (!Number.isInteger(courseId) || courseId < 1) {
    return response.status(400).json({ error: "Invalid course ID." });
  }
  const course = courseById.get(courseId);
  if (!course) return response.status(404).json({ error: "Course not found." });
  return response.json({ course: serializeCourse(course) });
});

const validateCoursePayload = (payload, current = {}) => {
  const details = { ...current };
  const stringFields = [
    "title",
    "course_code",
    "status",
    "instructor",
    "duration",
    "time",
    "start_date",
    "category",
    "description",
    "takeaway",
    "meeting_url",
  ];
  for (const field of stringFields) {
    if (payload[field] !== undefined) {
      if (typeof payload[field] !== "string") {
        return { error: `${field} must be text.` };
      }
      details[field] = payload[field].trim();
    }
  }
  for (const field of [
    "materials",
    "videos",
    "assignments",
    "syllabus",
    "participants",
  ]) {
    if (payload[field] !== undefined) {
      if (
        !Array.isArray(payload[field]) ||
        payload[field].some((item) => typeof item !== "string")
      ) {
        return { error: `${field} must be a list of text values.` };
      }
      details[field] = payload[field];
    }
  }
  if (!details.title || details.title.length > 120)
    return {
      error: "Course title is required and must be 120 characters or fewer.",
    };
  if (!details.course_code || details.course_code.length > 30)
    return {
      error: "Course code is required and must be 30 characters or fewer.",
    };
  if (!details.instructor) return { error: "Choose an instructor." };
  const instructor = getInstructorName.get(details.instructor);
  if (!instructor) return { error: "Selected instructor was not found." };
  if (
    typeof payload.isActive !== "undefined" &&
    typeof payload.isActive !== "boolean"
  ) {
    return { error: "isActive must be true or false." };
  }
  return { details, instructorSourceName: details.instructor };
};

app.post("/api/admin/courses", requireAdminKey, (request, response) => {
  const validated = validateCoursePayload(request.body ?? {});
  if (validated.error)
    return response.status(400).json({ error: validated.error });
  const details = {
    status: "Available",
    duration: "",
    time: "",
    start_date: "",
    category: "General",
    description: "",
    takeaway: "",
    materials: [],
    videos: [],
    assignments: [],
    syllabus: [],
    participants: [],
    ...validated.details,
  };
  const sourceKey = `admin:${crypto.randomUUID()}`;
  const result = database
    .prepare(
      `
    INSERT INTO courses (source_key, course_code, title, instructor_source_name, details_json, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      sourceKey,
      details.course_code,
      details.title,
      validated.instructorSourceName,
      JSON.stringify(details),
      Number(request.body?.isActive ?? true),
    );
  const course = courseById.get(result.lastInsertRowid);
  return response.status(201).json({ course: serializeCourse(course) });
});

app.patch("/api/admin/courses/:id", requireAdminKey, (request, response) => {
  const courseId = Number(request.params.id);
  if (!Number.isInteger(courseId) || courseId < 1)
    return response.status(400).json({ error: "Invalid course ID." });
  const current = courseById.get(courseId);
  if (!current)
    return response.status(404).json({ error: "Course not found." });
  const currentDetails = JSON.parse(current.details_json);
  const validated = validateCoursePayload(request.body ?? {}, currentDetails);
  if (validated.error)
    return response.status(400).json({ error: validated.error });
  const isActive = request.body?.isActive ?? Boolean(current.is_active);
  database
    .prepare(
      `
    UPDATE courses SET course_code = ?, title = ?, instructor_source_name = ?, details_json = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
    )
    .run(
      validated.details.course_code,
      validated.details.title,
      validated.instructorSourceName,
      JSON.stringify(validated.details),
      Number(isActive),
      courseId,
    );
  return response.json({ course: serializeCourse(courseById.get(courseId)) });
});

const allClassRecords = () =>
  database
    .prepare(
      `
  SELECT classes.* FROM classes
  JOIN courses ON courses.id = classes.course_id
  ORDER BY classes.start_date, classes.time, classes.id
`,
    )
    .all();

app.get("/api/admin/classes", requireAdminKey, (_request, response) => {
  return response.json({ classes: allClassRecords().map(serializeClass) });
});

app.get("/api/admin/classes/:id", requireAdminKey, (request, response) => {
  const classId = Number(request.params.id);
  if (!Number.isInteger(classId) || classId < 1)
    return response.status(400).json({ error: "Invalid class ID." });
  const record = database
    .prepare("SELECT * FROM classes WHERE id = ?")
    .get(classId);
  if (!record) return response.status(404).json({ error: "Class not found." });
  return response.json({ class: serializeClass(record) });
});

const validateClassPayload = (payload) => {
  const courseId = Number(payload.courseId);
  const course = courseById.get(courseId);
  if (!Number.isInteger(courseId) || !course)
    return { error: "Choose a valid course." };
  const instructorSourceName =
    typeof payload.instructorSourceName === "string"
      ? payload.instructorSourceName
      : course.instructor_source_name;
  if (!getInstructorName.get(instructorSourceName))
    return { error: "Choose a valid instructor." };
  const startDate =
    typeof payload.startDate === "string" ? payload.startDate.trim() : "";
  const time = typeof payload.time === "string" ? payload.time.trim() : "";
  const duration =
    typeof payload.duration === "string" ? payload.duration.trim() : "";
  const meetingUrl =
    typeof payload.meetingUrl === "string" ? payload.meetingUrl.trim() : "";
  const status =
    typeof payload.status === "string" ? payload.status.trim() : "Scheduled";
  if (!startDate || startDate.length > 80)
    return { error: "Enter a class date." };
  if (!time || time.length > 40) return { error: "Enter a class time." };
  if (meetingUrl && !/^https?:\/\//i.test(meetingUrl))
    return { error: "Meeting URL must start with http:// or https://." };
  if (!new Set(["Scheduled", "Completed", "Cancelled"]).has(status))
    return { error: "Choose a valid class status." };
  return {
    courseId,
    instructorSourceName,
    startDate,
    time,
    duration,
    meetingUrl,
    status,
  };
};

app.post("/api/admin/classes", requireAdminKey, (request, response) => {
  const validated = validateClassPayload(request.body ?? {});
  if (validated.error)
    return response.status(400).json({ error: validated.error });
  const result = database
    .prepare(
      `
    INSERT INTO classes (course_id, instructor_source_name, start_date, time, duration, meeting_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      validated.courseId,
      validated.instructorSourceName,
      validated.startDate,
      validated.time,
      validated.duration,
      validated.meetingUrl,
      validated.status,
    );
  const record = database
    .prepare("SELECT * FROM classes WHERE id = ?")
    .get(result.lastInsertRowid);
  return response.status(201).json({ class: serializeClass(record) });
});

app.patch("/api/admin/classes/:id", requireAdminKey, (request, response) => {
  const classId = Number(request.params.id);
  if (!Number.isInteger(classId) || classId < 1)
    return response.status(400).json({ error: "Invalid class ID." });
  const existing = database
    .prepare("SELECT * FROM classes WHERE id = ?")
    .get(classId);
  if (!existing)
    return response.status(404).json({ error: "Class not found." });
  const validated = validateClassPayload({
    courseId: request.body?.courseId ?? existing.course_id,
    instructorSourceName:
      request.body?.instructorSourceName ?? existing.instructor_source_name,
    startDate: request.body?.startDate ?? existing.start_date,
    time: request.body?.time ?? existing.time,
    duration: request.body?.duration ?? existing.duration,
    meetingUrl: request.body?.meetingUrl ?? existing.meeting_url,
    status: request.body?.status ?? existing.status,
  });
  if (validated.error)
    return response.status(400).json({ error: validated.error });
  database
    .prepare(
      `
    UPDATE classes SET course_id = ?, instructor_source_name = ?, start_date = ?, time = ?, duration = ?, meeting_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
    )
    .run(
      validated.courseId,
      validated.instructorSourceName,
      validated.startDate,
      validated.time,
      validated.duration,
      validated.meetingUrl,
      validated.status,
      classId,
    );
  const record = database
    .prepare("SELECT * FROM classes WHERE id = ?")
    .get(classId);
  return response.json({ class: serializeClass(record) });
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
