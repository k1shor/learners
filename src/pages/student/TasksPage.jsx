import { useState } from "react";

export default function TasksPage({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  if (selectedCourse) {
    const allCompleted = selectedCourse.assignments.every(
      (assignment) => assignment.isCompleted,
    );

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-800">Tasks & Assignments</h2>
        <section className="flex flex-col gap-6 rounded-xl border border-indigo-100 bg-slate-50 p-6">
          <button
            onClick={() => {
              setSelectedCourse(null);
              setActiveAssignment(null);
            }}
            className="self-start rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
          >
            ← Back to Courses
          </button>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="rounded bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {selectedCourse["Course-Code"]}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${allCompleted ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-amber-200 bg-amber-100 text-amber-700"}`}
              >
                {allCompleted ? "Completed" : "Pending"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-indigo-900">
              {selectedCourse.Title}
            </h3>
            <p className="text-sm text-slate-600">
              Instructor: {selectedCourse.Instructor}
            </p>
          </div>
          <section className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-white p-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
              Course Assignments
            </h4>
            <div className="flex flex-col gap-2">
              {selectedCourse.assignments.map((assignment, index) => (
                <div
                  key={assignment.title}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                  <button
                    type="button"
                    aria-expanded={activeAssignment === index}
                    onClick={() =>
                      setActiveAssignment(
                        activeAssignment === index ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between p-3 text-left hover:bg-slate-100"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {assignment.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        Due: {assignment.dueDate}
                      </span>
                    </span>
                    <span
                      className={`rounded border px-2.5 py-1 text-xs font-semibold ${assignment.isCompleted ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                    >
                      {assignment.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </button>
                  {activeAssignment === index && (
                    <div className="flex flex-col gap-2 border-t border-slate-200 bg-white p-3 text-xs text-slate-600">
                      <p>
                        <strong>Instructions:</strong> {assignment.details}
                      </p>
                      <button
                        onClick={() => {
                          if (assignment.isCompleted) {
                            alert(
                              `Viewing submitted assignment details for: ${assignment.title}`,
                            );
                          } else {
                            assignment.isCompleted = true;
                            alert(`Submitted assignment: ${assignment.title}`);
                          }
                        }}
                        className={`self-start rounded px-4 py-1.5 font-medium text-white transition-colors ${assignment.isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                      >
                        {assignment.isCompleted ? "View" : "Submit Assignment"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">Tasks & Assignments</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const completedCount = course.assignments.filter(
            (assignment) => assignment.isCompleted,
          ).length;
          const allCompleted = completedCount === course.assignments.length;

          return (
            <article
              key={course["Course-Code"]}
              className="flex flex-col justify-between gap-4 rounded-lg border border-indigo-200 bg-slate-50 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold leading-snug text-indigo-900">
                    {course.Title}
                  </h3>
                  <span className="shrink-0 rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                    {course["Course-Code"]}
                  </span>
                </div>
                <span
                  className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${allCompleted ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-amber-200 bg-amber-100 text-amber-700"}`}
                >
                  {allCompleted ? "Completed" : "Pending"}
                </span>
                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600">
                  <p>Instructor: {course.Instructor}</p>
                  <p>Total Tasks: {course.assignments.length}</p>
                  <p>
                    Completed: {completedCount} / {course.assignments.length}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(course)}
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                View Tasks
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
