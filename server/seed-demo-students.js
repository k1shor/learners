import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

// Local demo data only. The reserved example.test addresses cannot receive mail.
const serverDir = path.dirname(fileURLToPath(import.meta.url));
const database = new Database(
  process.env.DATABASE_PATH || path.join(serverDir, "data", "learners.sqlite"),
);
const columns = database.prepare("PRAGMA table_info(users)").all();
if (!columns.some((column) => column.name === "is_active")) {
  database.exec(
    "ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1",
  );
}

const students = [
  ["Anisha Sharma", "student01@example.test"],
  ["Suman Karki", "student02@example.test"],
  ["Priya Thapa", "student03@example.test"],
  ["Bikash Gurung", "student04@example.test"],
  ["Nisha Adhikari", "student05@example.test"],
  ["Rohan Shrestha", "student06@example.test"],
  ["Sabina Rai", "student07@example.test"],
  ["Dipesh Tamang", "student08@example.test"],
  ["Kriti Basnet", "student09@example.test"],
  ["Aayush Poudel", "student10@example.test"],
];

const insertStudent = database.prepare(
  `INSERT OR IGNORE INTO users (name, email, password_hash, is_active)
   VALUES (?, ?, ?, 1)`,
);
const updateDemoName = database.prepare(
  "UPDATE users SET name = ? WHERE email = ?",
);
const seedStudents = database.transaction(() => {
  for (const [name, email] of students) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    insertStudent.run(name, email, bcrypt.hashSync(randomPassword, 4));
    updateDemoName.run(name, email);
  }
});

seedStudents();
const count = database
  .prepare("SELECT COUNT(*) AS count FROM users WHERE email LIKE ?")
  .get("student%@example.test").count;
database.close();
console.log(`Demo students in database: ${count}`);
