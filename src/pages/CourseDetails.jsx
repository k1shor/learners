import { Link, useParams } from "react-router-dom";
import courses from "../data/courses.json";
import { getTaskProgress } from "../utils/taskProgress";

const CourseDetails = () => {
  const { courseCode, courseTitle } = useParams();
  const course = courses.find(
    (item) => item.course_code === courseCode && item.title === courseTitle,
  );
  const taskProgress = course ? getTaskProgress(course) : null;

  if (!course) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Course not found
        </h2>
        <Link
          to="/"
          className="mt-3 inline-block text-sm font-medium text-[#355c4c] hover:underline"
        >
          Back to courses
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-label={`${course.title} details`}
      className="w-full max-w-none"
    >
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#53685e] transition hover:text-[#173c35]"
      >
        <span aria-hidden="true">←</span> All courses
      </Link>

      <header className="relative mb-6 overflow-hidden rounded-[28px] bg-[#173c35] p-6 text-white shadow-xl shadow-[#173c35]/15 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 size-64 rounded-full border-32 border-white/5"
        />
        <div className="relative max-w-4xl">
          <p className="text-sm font-semibold text-[#e0eadb]">
            <span className="rounded-full bg-white/15 px-3 py-1.5">
              {course.category}
            </span>
            <span className="px-2">·</span>
            {course.course_code}
          </p>
          <p
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
              taskProgress.isCompleted
                ? "bg-emerald-400/15 text-emerald-100"
                : "bg-white/15 text-[#e0eadb]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${taskProgress.isCompleted ? "bg-emerald-300" : "bg-[#d9ef79]"}`}
            />
            Status:{" "}
            {taskProgress.isCompleted
              ? "Completed"
              : taskProgress.completedTaskCount > 0
                ? "In progress"
                : course.status}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#e0eadb] sm:text-base">
            {course.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {course.meeting_url ? (
              <a
                href={course.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#d9ef79] px-4 py-2 text-sm font-bold text-[#173c35] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#e6f6a8] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9ef79] sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-lg bg-[#eff8cc] text-[#173c35]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="6" width="13" height="12" rx="2" />
                    <path d="m16 10 5-3v10l-5-3" />
                  </svg>
                </span>
                <span>Join online class</span>
                <span
                  aria-hidden="true"
                  className="text-base transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="The instructor has not added a class link yet."
                className="inline-flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/70 sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-lg bg-white/10 text-white/70"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="6" width="13" height="12" rx="2" />
                    <path d="m16 10 5-3v10l-5-3" />
                  </svg>
                </span>
                <span>Join online class</span>
              </button>
            )}
            {!course.meeting_url && (
              <span className="text-xs text-[#c5d7c4]">
                Class link will appear here when available
              </span>
            )}
          </div>
          <div className="mt-6 grid gap-4 border-t border-white/15 pt-5 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#c5d7c4]">Instructor</p>
              <p className="mt-1 font-semibold">{course.instructor}</p>
            </div>
            <div>
              <p className="text-xs text-[#c5d7c4]">Duration</p>
              <p className="mt-1 font-semibold">{course.duration}</p>
            </div>
            <div>
              <p className="text-xs text-[#c5d7c4]">Starts</p>
              <p className="mt-1 font-semibold">
                {course.start_date} · {course.time}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/15 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-md">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#e0eadb]">Course tasks</span>
                <span className="font-bold text-white">
                  {taskProgress.completedTaskCount} of {taskProgress.taskCount}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Course task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={taskProgress.percent}
                className="h-2 overflow-hidden rounded-full bg-white/20"
              >
                <div
                  className="h-full rounded-full bg-emerald-300 transition-all"
                  style={{ width: `${taskProgress.percent}%` }}
                />
              </div>
            </div>
            <Link
              to="/tasks"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d9ef79] px-4 py-2 text-sm font-bold text-[#173c35] transition hover:bg-[#e6f6a8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ef79] focus-visible:ring-offset-2 focus-visible:ring-offset-[#173c35]"
            >
              View course tasks <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-5">
          <details className="app-card group overflow-hidden rounded-[22px] border shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#527f69]">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl bg-[#edf3e3] text-[#355c4c]"
                >
                  ☷
                </span>
                <span>
                  <span className="block">Course syllabus</span>
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {course.syllabus.length} ordered topics
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-slate-400 transition group-open:rotate-180"
              >
                ⌄
              </span>
            </summary>
            <ol className="mx-5 mb-5 space-y-1 border-l border-[#d8e3cd] pl-5">
              {course.syllabus.map((topic, index) => (
                <li
                  key={topic}
                  className="relative flex min-h-11 items-center py-2 text-sm text-slate-600"
                >
                  <span className="absolute left-[-1.63rem] grid size-5 place-items-center rounded-full border border-[#d8e3cd] bg-[#fffefa] text-[10px] font-bold text-[#527f69]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {topic}
                </li>
              ))}
            </ol>
          </details>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-3 font-semibold text-slate-900">
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-700"
                >
                  ▤
                </span>
                Materials
              </h3>
              <ul className="mt-4 space-y-2">
                {course.materials.map((material) => (
                  <li
                    key={material}
                    className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-3 font-semibold text-slate-900">
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-700"
                >
                  ▶
                </span>
                Videos
              </h3>
              <ul className="mt-4 space-y-2">
                {course.videos.map((video, index) => (
                  <li
                    key={video}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                  >
                    <span className="text-xs font-bold text-[#63824d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {video}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">
                Assessments &amp; assignments
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {course.assignments.length} activities
              </span>
            </div>
            <ul className="mt-3 divide-y divide-slate-100">
              {course.assignments.map((assignment, index) => (
                <li
                  key={assignment}
                  className="flex items-center gap-3 py-3 text-sm text-slate-700 first:pt-0 last:pb-0"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf3e3] text-xs font-bold text-[#355c4c]">
                    {index + 1}
                  </span>
                  {assignment}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:sticky md:top-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">Participants</h3>
              <p className="mt-1 text-xs text-slate-500">
                Meet your classmates
              </p>
            </div>
            <span className="rounded-full bg-[#edf3e3] px-2.5 py-1 text-xs font-semibold text-[#355c4c]">
              {course.participants.length}
            </span>
          </div>
          <ul className="mt-5 divide-y divide-slate-100">
            {course.participants.map((participant, index) => (
              <li
                key={participant}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold ${index % 2 === 0 ? "bg-[#edf3e3] text-[#355c4c]" : "bg-[#f8eee0] text-[#805c35]"}`}
                >
                  <span>
                    {participant
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(participant)}&skinColor=ae5d29,c68642,edb98a&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                    className="absolute inset-0 size-full object-cover"
                  />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {participant}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default CourseDetails;
