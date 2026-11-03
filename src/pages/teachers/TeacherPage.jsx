import { useState } from "react";
import { coursesData } from "../student/coursesData";
import {
  getTeacherAssignments,
  saveTeacherAssignment,
} from "./teacherAssignments";

const navigation = [
  { id: "students", label: "Students" },
  { id: "classes", label: "Classes" },
  { id: "assignments", label: "Assignments" },
];

function SearchField({ value, onChange, label }) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{label}</span>
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function StatCard({ label, value, note, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className={`mt-1 h-3 w-3 rounded-full ${color}`} />
      </div>
      <p className="mt-3 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function SectionHeading({ title, description, search, onSearchChange }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <SearchField
        value={search}
        onChange={onSearchChange}
        label={`Search ${title.toLowerCase()}...`}
      />
    </div>
  );
}

function TeacherPage({ userName, userEmail, courseCodes = [], onLogout }) {
  const [activeSection, setActiveSection] = useState("students");
  const [search, setSearch] = useState("");
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentCourse, setNewAssignmentCourse] = useState(
    courseCodes[0] ?? "",
  );
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");
  const [newAssignmentDetails, setNewAssignmentDetails] = useState("");
  const [assignmentSaveError, setAssignmentSaveError] = useState("");
  const [customAssignmentState, setCustomAssignmentState] = useState(() => {
    try {
      return { assignments: getTeacherAssignments(userEmail), error: "" };
    } catch (error) {
      return {
        assignments: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load your saved assignments.",
      };
    }
  });
  const teacherCourses = coursesData.filter((course) =>
    courseCodes.includes(course["Course-Code"]),
  );
  const studentsByName = new Map();
  teacherCourses.forEach((course) => {
    course.participants.forEach((participant) => {
      const student = studentsByName.get(participant.name) ?? {
        ...participant,
        classes: [],
      };
      student.classes.push({
        code: course["Course-Code"],
        name: course.Title,
      });
      studentsByName.set(participant.name, student);
    });
  });
  const teacherStudents = [...studentsByName.values()];
  const filteredStudents = teacherStudents.filter((student) =>
    `${student.name} ${student.classes
      .map((course) => `${course.name} ${course.code}`)
      .join(" ")}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const filteredCourses = teacherCourses.filter((course) =>
    `${course.Title} ${course["Course-Code"]} ${course.Time} ${course.Duration}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const teacherAssignments = [
    ...teacherCourses.flatMap((course) =>
      course.assignments.map((assignment, index) => ({
        ...assignment,
        id: `${course["Course-Code"]}-${index}`,
        courseCode: course["Course-Code"],
        courseName: course.Title,
        studentCount: course.participants.length,
      })),
    ),
    ...customAssignmentState.assignments
      .filter((assignment) =>
        teacherCourses.some(
          (course) => course["Course-Code"] === assignment.courseCode,
        ),
      )
      .map((assignment) => ({
        ...assignment,
        courseName:
          teacherCourses.find(
            (course) => course["Course-Code"] === assignment.courseCode,
          )?.Title ?? assignment.courseCode,
        studentCount:
          teacherCourses.find(
            (course) => course["Course-Code"] === assignment.courseCode,
          )?.participants.length ?? 0,
      })),
  ];
  const filteredAssignments = teacherAssignments.filter((assignment) =>
    `${assignment.title} ${assignment.courseName} ${assignment.courseCode} ${assignment.details}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const activeSectionLabel =
    navigation.find((item) => item.id === activeSection)?.label ?? "Students";
  const stats = [
    {
      label: "My students",
      value: teacherStudents.length,
      note: "Across all your classes",
      color: "bg-indigo-500",
    },
    {
      label: "Classes",
      value: teacherCourses.length,
      note: "Courses on your timetable",
      color: "bg-violet-500",
    },
    {
      label: "Assignments",
      value: teacherAssignments.length,
      note: "Tasks shared with your classes",
      color: "bg-emerald-500",
    },
  ];

  const changeSection = (section) => {
    setActiveSection(section);
    setSearch("");
  };

  const handleCreateAssignment = (event) => {
    event.preventDefault();
    setAssignmentSaveError("");

    const course = teacherCourses.find(
      (item) => item["Course-Code"] === newAssignmentCourse,
    );
    if (!course) {
      setAssignmentSaveError("Choose one of your assigned classes.");
      return;
    }

    const assignment = {
      title: newAssignmentTitle.trim(),
      courseCode: course["Course-Code"],
      dueDate: newAssignmentDueDate,
      details: newAssignmentDetails.trim(),
    };

    try {
      setCustomAssignmentState({
        assignments: saveTeacherAssignment(userEmail, assignment),
        error: "",
      });
      setNewAssignmentTitle("");
      setNewAssignmentDueDate("");
      setNewAssignmentDetails("");
      setIsAddingAssignment(false);
    } catch (error) {
      setAssignmentSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save this assignment.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 md:h-screen md:flex-row md:overflow-hidden">
      <aside className="flex shrink-0 flex-col border-b border-indigo-100 bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-5 py-4 md:px-6 md:py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-sm">
            E
          </div>
          <div>
            <p className="font-bold tracking-tight text-slate-900">
              E-Learners Hub
            </p>
            <p className="text-xs text-slate-500">Teacher workspace</p>
          </div>
        </div>

        <div className="hidden border-y border-slate-100 px-5 py-5 md:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-700">
              {userName
                .split(/\s+/)
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>
              <p className="text-xs text-slate-500">Teacher account</p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Teacher navigation"
          className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:gap-1 md:px-3 md:py-5"
        >
          <p className="hidden px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:block">
            Workspace
          </p>
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeSection(item.id)}
              aria-current={activeSection === item.id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors md:w-full ${
                activeSection === item.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-medium text-indigo-600">Teacher portal</p>
            <p className="truncate text-sm font-semibold text-slate-800">
              {activeSectionLabel}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              {userName}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
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
              Your teaching dashboard
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome, {userName}!
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                  Keep up with your students, classes, and assignments—all in
                  one place.
                </p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Teacher workspace
              </span>
            </div>
          </section>

          <section
            aria-label="Teaching summary"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          {activeSection === "students" && (
            <section>
              <SectionHeading
                title="Students"
                description={`Showing ${filteredStudents.length} of ${teacherStudents.length} students in your assigned classes`}
                search={search}
                onSearchChange={setSearch}
              />
              {filteredStudents.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredStudents.map((student) => (
                    <article
                      key={student.name}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                          {student.name
                            .split(/\s+/)
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {student.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Student · {student.classes.length}{" "}
                            {student.classes.length === 1 ? "class" : "classes"}
                          </p>
                        </div>
                        <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Enrolled class
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {student.classes.map((course) => (
                            <span
                              key={course.code}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                            >
                              {course.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No students found" />
              )}
            </section>
          )}

          {activeSection === "classes" && (
            <section>
              <SectionHeading
                title="My classes"
                description={`Showing ${filteredCourses.length} of ${teacherCourses.length} assigned classes`}
                search={search}
                onSearchChange={setSearch}
              />
              {filteredCourses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <article
                      key={course["Course-Code"]}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            {course["Course-Code"]}
                          </p>
                          <h3 className="mt-1 font-semibold text-slate-900">
                            {course.Title}
                          </h3>
                        </div>
                        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {course.Duration}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {course.Description}
                      </p>

                      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Schedule
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-700">
                            {course.Time}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Starts
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-700">
                            {course["Start-date"]}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Students
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-700">
                            {course.participants.length} enrolled
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Assignments
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-700">
                            {course.assignments.length} tasks
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Students in this class
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {course.participants.map((participant) => (
                            <span
                              key={participant.name}
                              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
                            >
                              {participant.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection("students");
                          setSearch(course["Course-Code"]);
                        }}
                        className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        View these students
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    teacherCourses.length === 0
                      ? "No classes assigned yet"
                      : "No matching classes"
                  }
                  description={
                    teacherCourses.length === 0
                      ? "Ask your administrator to assign classes to your account."
                      : undefined
                  }
                />
              )}
            </section>
          )}

          {activeSection === "assignments" && (
            <section>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assignments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {filteredAssignments.length} of{" "}
                    {teacherAssignments.length} assignments in your classes
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <SearchField
                    value={search}
                    onChange={setSearch}
                    label="Search assignments..."
                  />
                  <button
                    type="button"
                    disabled={teacherCourses.length === 0}
                    onClick={() => {
                      setAssignmentSaveError("");
                      setIsAddingAssignment((current) => !current);
                    }}
                    className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAddingAssignment ? "Cancel" : "+ Add assignment"}
                  </button>
                </div>
              </div>

              {customAssignmentState.error && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {customAssignmentState.error}
                </p>
              )}

              {isAddingAssignment && (
                <form
                  onSubmit={handleCreateAssignment}
                  className="mb-5 grid gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5"
                >
                  <div className="sm:col-span-2">
                    <h3 className="font-semibold text-slate-900">
                      Add a class assignment
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      This assignment will be saved to your teacher account.
                    </p>
                  </div>
                  <label className="text-sm font-medium text-slate-700">
                    Assignment title
                    <input
                      required
                      maxLength={100}
                      value={newAssignmentTitle}
                      onChange={(event) =>
                        setNewAssignmentTitle(event.target.value)
                      }
                      placeholder="e.g. Build a React component"
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Class
                    <select
                      required
                      value={newAssignmentCourse}
                      onChange={(event) =>
                        setNewAssignmentCourse(event.target.value)
                      }
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    >
                      {teacherCourses.map((course) => (
                        <option
                          key={course["Course-Code"]}
                          value={course["Course-Code"]}
                        >
                          {course["Course-Code"]} · {course.Title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Due date
                    <input
                      required
                      type="date"
                      value={newAssignmentDueDate}
                      onChange={(event) =>
                        setNewAssignmentDueDate(event.target.value)
                      }
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                    Instructions
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={newAssignmentDetails}
                      onChange={(event) =>
                        setNewAssignmentDetails(event.target.value)
                      }
                      placeholder="Add instructions for your students (optional)"
                      className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  {assignmentSaveError && (
                    <p
                      role="alert"
                      className="text-sm text-rose-600 sm:col-span-2"
                    >
                      {assignmentSaveError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:col-span-2 sm:justify-self-start"
                  >
                    Save assignment
                  </button>
                </form>
              )}

              {filteredAssignments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAssignments.map((assignment) => (
                    <article
                      key={assignment.id}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {assignment.courseCode}
                        </span>
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Due {assignment.dueDate}
                        </span>
                      </div>
                      <h3 className="mt-4 font-semibold leading-6 text-slate-900">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {assignment.courseName}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                        {assignment.details || "No additional instructions."}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-500">
                          For {assignment.studentCount}{" "}
                          {assignment.studentCount === 1 ? "student" : "students"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSection("classes");
                            setSearch(assignment.courseCode);
                          }}
                          className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                          View class
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    teacherAssignments.length === 0
                      ? "No assignments in your classes yet"
                      : "No matching assignments"
                  }
                  description={
                    teacherAssignments.length === 0
                      ? "Assignments will appear here when they are added to your classes."
                      : undefined
                  }
                />
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-semibold text-indigo-600">
        ?
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {description ?? "Try another search, or clear the search field."}
      </p>
    </div>
  );
}

export default TeacherPage;
