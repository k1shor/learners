import { useState } from "react";
import { coursesData } from "../student/coursesData";

const demoEmail = (name) =>
  `${name
    .replace(/^(dr\.?|prof\.?)\s+/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")}@example.com`;

const studentsByName = new Map();
const teachersByName = new Map();
const totalDemoStudents = new Set();

coursesData.forEach((course) => {
  const teacher =
    teachersByName.get(course.Instructor) ??
    {
      instructor: course.Instructor,
      email: demoEmail(course.Instructor),
      courses: [],
      status: "Active",
    };
  teacher.courses.push(course.Title);
  teachersByName.set(course.Instructor, teacher);

  course.participants.forEach((participant) => {
    totalDemoStudents.add(participant.name);
    const student =
      studentsByName.get(participant.name) ??
      {
        student: participant.name,
        email: demoEmail(participant.name),
        enrollment: [],
        status: "Active",
        avatar: participant.avatar,
      };
    student.enrollment.push(course.Title);
    studentsByName.set(participant.name, student);
  });
});

const getCourseStatusForAdmin = (course) => {
  const startDate = new Date(course["Start-date"]);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + course.durationWeeks * 7);
  const now = new Date();

  if (now < startDate) return "Pending";
  if (now <= endDate) return "Ongoing";
  return "Completed";
};

const initialCourseRows = coursesData.map((course) => ({
  course: course.Title,
  courseCode: course["Course-Code"],
  instructor: course.Instructor,
  status: getCourseStatusForAdmin(course),
  enabled: true,
}));

const initialClassRows = coursesData.map((course) => ({
  class: `${course["Course-Code"]} Session`,
  courseCode: course["Course-Code"],
  course: course.Title,
  schedule: `${course["Start-date"]} • ${course.Time}`,
  instructor: course.Instructor,
  students: course.participants.length,
  status: getCourseStatusForAdmin(course),
}));

const coursePrices = {
  CS101: 299,
  CS201: 349,
  DS105: 249,
  CS301: 499,
  CS202: 399,
};

const initialPayments = coursesData.flatMap((course, courseIndex) =>
  course.participants.map((participant, participantIndex) => ({
    transaction: `ELH-${course["Course-Code"]}-${String(participantIndex + 1).padStart(3, "0")}`,
    student: participant.name,
    course: course.Title,
    date: course["Start-date"],
    amount: coursePrices[course["Course-Code"]],
    status: (courseIndex + participantIndex) % 3 === 0 ? "Pending" : "Paid",
  })),
);

const sections = [
  {
    id: "students",
    label: "Students",
    description: "Manage student accounts and enrollment records.",
    columns: [
      { key: "student", label: "Student" },
      { key: "email", label: "Email" },
      { key: "enrollment", label: "Enrollment" },
      { key: "status", label: "Status" },
    ],
    rows: [...studentsByName.values()],
  },
  {
    id: "teachers",
    label: "Teachers/Instructors",
    description: "Manage instructor profiles and teaching assignments.",
    columns: [
      { key: "instructor", label: "Instructor" },
      { key: "email", label: "Email" },
      { key: "courses", label: "Courses" },
      { key: "status", label: "Status" },
    ],
    rows: [...teachersByName.values()],
  },
  {
    id: "courses",
    label: "Courses",
    description: "Review and manage courses on the learning platform.",
    columns: [
      { key: "course", label: "Course" },
      { key: "courseCode", label: "Course code" },
      { key: "instructor", label: "Instructor" },
      { key: "status", label: "Status" },
      { key: "enabled", label: "Course access" },
    ],
    rows: initialCourseRows,
  },
  {
    id: "classes",
    label: "Classes",
    description: "Manage class schedules and course sessions.",
    columns: [
      { key: "class", label: "Class" },
      { key: "course", label: "Course" },
      { key: "schedule", label: "Schedule" },
      { key: "instructor", label: "Instructor" },
      { key: "students", label: "Students" },
      { key: "status", label: "Status" },
    ],
    rows: initialClassRows,
  },
  {
    id: "payment",
    label: "Payment",
    description: "Review student payments and billing records.",
    columns: [
      { key: "transaction", label: "Transaction" },
      { key: "student", label: "Student" },
      { key: "date", label: "Date" },
      { key: "course", label: "Course" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
    ],
    rows: initialPayments,
  },
];

const getInitials = (name) =>
  name
    .replace(/^(dr\.?|prof\.?)\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function StatCard({ label, value, detail, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`mt-1 h-3 w-3 rounded-full ${accent}`}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function AdminPaymentSummary({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

function DirectoryCard({ person, type }) {
  const isStudent = type === "students";
  const list = isStudent ? person.enrollment : person.courses;

  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
            {getInitials(isStudent ? person.student : person.instructor)}
          </div>
          <span
            aria-label="Active"
            className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">
            {isStudent ? person.student : person.instructor}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {isStudent ? "Student account" : "Course instructor"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
          {person.status}
        </span>
      </div>

      <a
        href={`mailto:${person.email}`}
        className="mt-4 truncate text-sm text-indigo-600 transition-colors hover:text-indigo-800"
      >
        {person.email}
      </a>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {isStudent ? "Enrolled courses" : "Teaching"}
          </p>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {list.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {list.map((item) => (
            <span
              key={item}
              className="max-w-full truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
              title={item}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function DirectoryDashboard({ section, search, onSearchChange }) {
  const isStudentDirectory = section.id === "students";
  const filteredRows = section.rows.filter((person) => {
    const searchableText = [
      person.student,
      person.instructor,
      person.email,
      ...(person.enrollment ?? []),
      ...(person.courses ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return searchableText.includes(search.trim().toLowerCase());
  });
  const enrollmentCount = [...studentsByName.values()].reduce(
    (total, student) => total + student.enrollment.length,
    0,
  );

  const stats = isStudentDirectory
    ? [
        {
          label: "Students",
          value: studentsByName.size,
          detail: "Learners in the demo directory",
          accent: "bg-indigo-500",
        },
        {
          label: "Course enrollments",
          value: enrollmentCount,
          detail: `Across ${coursesData.length} demo courses`,
          accent: "bg-violet-500",
        },
        {
          label: "Avg. courses per student",
          value: (enrollmentCount / Math.max(studentsByName.size, 1)).toFixed(1),
          detail: "A quick view of learner activity",
          accent: "bg-emerald-500",
        },
      ]
    : [
        {
          label: "Instructors",
          value: teachersByName.size,
          detail: "Teaching staff in the demo directory",
          accent: "bg-indigo-500",
        },
        {
          label: "Course assignments",
          value: coursesData.length,
          detail: "Courses currently assigned",
          accent: "bg-violet-500",
        },
        {
          label: "Students supported",
          value: totalDemoStudents.size,
          detail: "Unique learners across all courses",
          accent: "bg-emerald-500",
        },
      ];

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-7 text-white shadow-md sm:px-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border-[32px] border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-36 -z-10 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
          Admin directory
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isStudentDirectory ? "Your student community" : "Meet the teachers"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
              {isStudentDirectory
                ? "Browse demo learners, see what they are studying, and quickly find a student."
                : "Explore your demo teaching team and the courses each instructor leads."}
            </p>
          </div>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            Demo data
          </span>
        </div>
      </section>

      <section
        aria-label={`${section.label} summary`}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isStudentDirectory ? "Student directory" : "Instructor directory"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredRows.length} of {section.rows.length}{" "}
              {isStudentDirectory ? "students" : "instructors"}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">
              Search {isStudentDirectory ? "students" : "instructors"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={`Search ${isStudentDirectory ? "students" : "instructors"}...`}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        {filteredRows.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRows.map((person) => (
              <DirectoryCard
                key={person.student ?? person.instructor}
                person={person}
                type={section.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4M8 11h6" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              No matching {isStudentDirectory ? "students" : "instructors"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another name, email, or course.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function CourseClassDashboard({
  section,
  courses,
  classes,
  search,
  onSearchChange,
  onToggleCourse,
}) {
  const isCourses = section.id === "courses";
  const records = isCourses ? courses : classes;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredRecords = records.filter((record) =>
    Object.values(record).join(" ").toLowerCase().includes(normalizedSearch),
  );
  const stats = isCourses
    ? [
        {
          label: "Courses",
          value: courses.length,
          detail: "Courses in the learning catalog",
          accent: "bg-indigo-500",
        },
        {
          label: "Enabled",
          value: courses.filter((course) => course.enabled).length,
          detail: "Available to students",
          accent: "bg-emerald-500",
        },
        {
          label: "Students enrolled",
          value: classes.reduce((total, item) => total + item.students, 0),
          detail: "Across all courses",
          accent: "bg-violet-500",
        },
      ]
    : [
        {
          label: "Classes",
          value: classes.length,
          detail: "Scheduled course sessions",
          accent: "bg-indigo-500",
        },
        {
          label: "Upcoming",
          value: classes.filter((item) => item.status === "Pending").length,
          detail: "Sessions not yet started",
          accent: "bg-amber-500",
        },
        {
          label: "Students enrolled",
          value: classes.reduce((total, item) => total + item.students, 0),
          detail: "Across all class sessions",
          accent: "bg-violet-500",
        },
      ];

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-7 text-white shadow-md sm:px-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border-[32px] border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-36 -z-10 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
          Admin catalog
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isCourses ? "Manage your courses" : "Manage your classes"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
              {isCourses
                ? "Browse course details, track enrollment, and control student access."
                : "Review class schedules, instructors, enrollment, and availability."}
            </p>
          </div>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            Demo data
          </span>
        </div>
      </section>

      <section
        aria-label={`${section.label} summary`}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isCourses ? "Course catalog" : "Class schedule"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredRecords.length} of {records.length}{" "}
              {isCourses ? "courses" : "classes"}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">
              Search {isCourses ? "courses" : "classes"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={`Search ${isCourses ? "courses" : "classes"}...`}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRecords.map((record) => {
              const isEnabled = record.enabled;
              return (
                <article
                  key={isCourses ? record.courseCode : record.class}
                  className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        {isCourses ? record.courseCode : record.class}
                      </p>
                      <h3 className="mt-1 font-semibold text-slate-900">
                        {record.course}
                      </h3>
                    </div>
                    <StatusBadge status={isEnabled ? record.status : "Disabled"} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Instructor
                      </p>
                      <p className="mt-1 font-medium text-slate-700">
                        {record.instructor}
                      </p>
                    </div>
                    {isCourses ? (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {record.duration}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Students
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {record.students} enrolled
                        </p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {isCourses ? "Schedule" : "Class schedule"}
                      </p>
                      <p className="mt-1 font-medium text-slate-700">
                        {isCourses
                          ? `${record.startDate} · ${record.time}`
                          : record.schedule}
                      </p>
                    </div>
                  </div>

                  {isCourses && (
                    <button
                      type="button"
                      aria-pressed={record.enabled}
                      onClick={() => onToggleCourse(record.courseCode)}
                      className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        record.enabled
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {record.enabled ? "Disable course" : "Enable course"}
                    </button>
                  )}
                  {!isCourses && !record.enabled && (
                    <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      This class is unavailable while its course is disabled.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h3 className="font-semibold text-slate-900">
              No matching {isCourses ? "courses" : "classes"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different name, course code, instructor, or schedule.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === "Ongoing"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "Completed"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : status === "Pending"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-100 text-slate-700";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("students");
  const [search, setSearch] = useState("");
  const [courseRows, setCourseRows] = useState(initialCourseRows);
  const paymentRows = initialPayments;
  const section =
    sections.find((item) => item.id === activeSection) ?? sections[0];
  const classRows = initialClassRows.map((classRow) => {
    const course = courseRows.find(
      (row) => row.courseCode === classRow.courseCode,
    );
    return {
      ...classRow,
      enabled: Boolean(course?.enabled),
      status: course?.enabled ? classRow.status : "Disabled",
    };
  });
  const tableRows = activeSection === "payment" ? paymentRows : section.rows;
  const filteredTableRows = tableRows.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const paidTotal = paymentRows
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);
  const pendingTotal = paymentRows
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-indigo-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-indigo-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-sm">
              E
            </div>
            <div>
              <p className="font-bold text-indigo-950">E-learners Hub</p>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto p-3 md:flex-col md:gap-1 md:overflow-visible md:p-4"
        >
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setSearch("");
              }}
              aria-current={activeSection === item.id ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors md:w-full ${
                activeSection === item.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-indigo-900 hover:bg-indigo-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-indigo-600">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {section.label}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{section.description}</p>
        </header>

        {section.id === "students" || section.id === "teachers" ? (
          <DirectoryDashboard
            section={section}
            search={search}
            onSearchChange={setSearch}
          />
        ) : section.id === "courses" || section.id === "classes" ? (
          <CourseClassDashboard
            section={section}
            courses={courseRows.map((course) => {
              const source = coursesData.find(
                (item) => item["Course-Code"] === course.courseCode,
              );
              return {
                ...course,
                duration: source.Duration,
                startDate: source["Start-date"],
                time: source.Time,
                students: source.participants.length,
              };
            })}
            classes={classRows}
            search={search}
            onSearchChange={setSearch}
            onToggleCourse={(courseCode) =>
              setCourseRows((currentRows) =>
                currentRows.map((course) =>
                  course.courseCode === courseCode
                    ? { ...course, enabled: !course.enabled }
                    : course,
                ),
              )
            }
          />
        ) : (
          <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
            {activeSection === "payment" && (
              <div className="grid gap-4 border-b border-indigo-100 bg-slate-50 p-5 sm:grid-cols-3">
                <AdminPaymentSummary label="Transactions" value={paymentRows.length} />
                <AdminPaymentSummary
                  label="Paid"
                  value={`$${paidTotal.toLocaleString("en-US")}`}
                />
                <AdminPaymentSummary
                  label="Outstanding"
                  value={`$${pendingTotal.toLocaleString("en-US")}`}
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">{section.label}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Showing {filteredTableRows.length} of {tableRows.length} records
                </p>
              </div>
              <label className="w-full sm:max-w-xs">
                <span className="sr-only">Search {section.label}</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${section.label.toLowerCase()}...`}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="bg-indigo-50 text-xs uppercase tracking-wide text-indigo-900">
                  <tr>
                    {section.columns.map(({ key, label }) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-5 py-3 font-semibold"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTableRows.length > 0 ? (
                    filteredTableRows.map((row, index) => (
                      <tr
                        key={
                          row.transaction ??
                          row.class ??
                          row.courseCode ??
                          row.course ??
                          row.student ??
                          row.instructor ??
                          `${section.id}-${index}`
                        }
                        className="border-t border-slate-100 align-top"
                      >
                        {section.columns.map(({ key }) => {
                          const value = row[key];
                          const displayValue = Array.isArray(value)
                            ? value.join(", ")
                            : value ?? "—";

                          if (key === "enabled") {
                            return (
                              <td key={key} className="px-5 py-3">
                                <button
                                  type="button"
                                  aria-pressed={row.enabled}
                                  onClick={() =>
                                    setCourseRows((currentRows) =>
                                      currentRows.map((course) =>
                                        course.courseCode === row.courseCode
                                          ? { ...course, enabled: !course.enabled }
                                          : course,
                                      ),
                                    )
                                  }
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    row.enabled
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                >
                                  {row.enabled ? "Disable" : "Enable"}
                                </button>
                              </td>
                            );
                          }

                          if (key === "status") {
                            const tone =
                              displayValue === "Ongoing"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : displayValue === "Completed"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : displayValue === "Pending"
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200";

                            return (
                              <td key={key} className="px-5 py-3 text-sm">
                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
                                >
                                  {displayValue}
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td key={key} className="px-5 py-3 text-sm text-slate-700">
                              {key === "amount"
                                ? `$${Number(value).toLocaleString("en-US")}`
                                : displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={section.columns.length}
                        className="px-5 py-14 text-center"
                      >
                        <h3 className="font-semibold text-slate-800">
                        No matching {section.label.toLowerCase()}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                        Try a different search, or clear the search field.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
