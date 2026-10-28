import { useState } from "react";

const getCourseStatus = (course) => {
  const startDate = new Date(course["Start-date"]);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + course.durationWeeks * 7);
  const now = new Date();

  if (now < startDate) return "Pending";
  if (now <= endDate) return "Ongoing";
  return "Completed";
};

const statusClass = {
  Ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function CoursesPage({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);

  if (selectedCourse) {
    const status = getCourseStatus(selectedCourse);

    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setSelectedCourse(null)}
          className="self-start rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
        >
          ← Back to Courses
        </button>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="rounded bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {selectedCourse["Course-Code"]}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass[status]}`}
                >
                  {status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-indigo-900">
                {selectedCourse.Title}
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                {selectedCourse.Description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-indigo-100 bg-slate-50 p-4 sm:grid-cols-2">
              <CourseMetadata label="Instructor" value={selectedCourse.Instructor} />
              <CourseMetadata label="Duration" value={selectedCourse.Duration} />
              <CourseMetadata
                label="Start Time & Date"
                value={`${selectedCourse["Start-date"]} (${selectedCourse.Time})`}
              />
              <CourseMetadata
                label="Materials Included"
                value={selectedCourse.Materials}
              />
            </div>

            <details className="group cursor-pointer rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <summary className="flex select-none items-center justify-between font-bold text-indigo-900">
                <span>Course Videos</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-3 flex flex-col gap-2 border-t border-indigo-100 pt-3">
                {selectedCourse.videos.map((video) => (
                  <details
                    key={video.title}
                    className="overflow-hidden rounded border border-slate-200 bg-white"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <span className="text-sm font-medium text-slate-800">
                        {video.title}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {video.duration}
                      </span>
                    </summary>
                    <div className="flex items-center justify-between border-t border-indigo-100 bg-indigo-50/50 p-3 text-xs text-slate-600">
                      <p>
                        <strong>Lesson Preview Overview:</strong> {video.content}
                      </p>
                      <button
                        onClick={() => alert(`Playing video: ${video.title}`)}
                        className="ml-4 shrink-0 rounded bg-indigo-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Play
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            </details>

            <details className="group cursor-pointer rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <summary className="flex select-none items-center justify-between font-bold text-indigo-900">
                <span>Course Syllabus</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-3 flex flex-col gap-2 border-t border-indigo-100 pt-3">
                {selectedCourse.syllabus.map((item) => (
                  <details
                    key={item.title}
                    className="overflow-hidden rounded border border-slate-200 bg-white"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <span className="text-sm font-semibold text-indigo-900">
                        {item.title}
                      </span>
                      <span className="text-xs font-medium text-indigo-600">
                        Details
                      </span>
                    </summary>
                    <p className="border-t border-indigo-100 bg-indigo-50/50 p-3 text-xs text-slate-600">
                      <strong>Module Details:</strong> {item.desc}
                    </p>
                  </details>
                ))}
              </div>
            </details>

            <section className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-slate-50 p-4">
              <h3 className="font-bold text-indigo-900">
                Assessment & Assignments
              </h3>
              <div className="flex flex-col gap-2">
                {selectedCourse.assignments.map((assignment, index) => (
                  <details
                    key={assignment.title}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                    onToggle={(event) =>
                      setActiveAssignment(
                        event.currentTarget.open ? index : null,
                      )
                    }
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {assignment.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Due: {assignment.dueDate}
                        </p>
                      </div>
                      <span
                        className={`rounded border px-2.5 py-1 text-xs font-semibold ${assignment.isCompleted ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                      >
                        {assignment.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </summary>
                    {activeAssignment === index && (
                      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <p>
                          <strong>Instructions:</strong> {assignment.details}
                        </p>
                        <button
                          onClick={() => {
                            if (assignment.isCompleted) {
                              alert(
                                `Viewing submitted assignment: ${assignment.title}`,
                              );
                            } else {
                              assignment.isCompleted = true;
                              alert(
                                `Submitted assignment: ${assignment.title}`,
                              );
                            }
                          }}
                          className="self-start rounded bg-indigo-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                          {assignment.isCompleted ? "View" : "Submit Assignment"}
                        </button>
                      </div>
                    )}
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-indigo-100 bg-slate-50 p-4 lg:w-72">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
              Enrolled Participants ({selectedCourse.participants.length})
            </h3>
            <div className="flex flex-col gap-2">
              {selectedCourse.participants.map((participant) => (
                <div
                  key={participant.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="h-7 w-7 rounded-full border border-indigo-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {participant.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {participant.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {participant.role}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800">Available Courses</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const status = getCourseStatus(course);
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
                  className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass[status]}`}
                >
                  {status}
                </span>
                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600">
                  <p>Instructor: {course.Instructor}</p>
                  <p>Duration: {course.Duration}</p>
                  <p>Time: {course.Time}</p>
                  <p>Start Date: {course["Start-date"]}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setActiveAssignment(null);
                }}
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                View Details
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CourseMetadata({ label, value }) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="mt-0.5 font-medium text-slate-700">{value}</p>
    </div>
  );
}
