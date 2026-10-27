import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(serverDir, "..");
const database = new Database(
  process.env.DATABASE_PATH || path.join(serverDir, "data", "learners.sqlite"),
);
database.exec(`
  CREATE TABLE IF NOT EXISTS instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
const columns = database.prepare("PRAGMA table_info(instructors)").all();
if (!columns.some((column) => column.name === "is_active")) {
  database.exec(
    "ALTER TABLE instructors ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1",
  );
}

const catalog = JSON.parse(
  fs.readFileSync(path.join(projectDir, "src", "data", "courses.json"), "utf8"),
);
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
const insertInstructor = database.prepare(
  "INSERT OR IGNORE INTO instructors (source_name, name, email, bio) VALUES (?, ?, ?, ?)",
);
const seed = database.transaction(() => {
  for (const name of new Set(catalog.map((course) => course.instructor))) {
    insertInstructor.run(name, name, "", "");
  }
  for (const instructor of demoInstructors) {
    insertInstructor.run(...instructor);
  }
});
seed();
const instructors = database
  .prepare("SELECT id, name, email FROM instructors ORDER BY id")
  .all();
database.close();
console.log(`Instructors in database: ${instructors.length}`);
console.log(instructors.map(({ name }) => `- ${name}`).join("\n"));
