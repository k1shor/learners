import { Link } from "react-router-dom";
import { getTaskProgress, readTaskProgressStore } from "../utils/taskProgress";
import categoryTheme from "../utils/categoryTheme";
import useCourses from "../hooks/useCourses";

const categoryIcons = {
  Marketing: "↗",
  Technology: "✳",
  "Creative practice": "✎",
};

const Courses = () => {
  const courses = useCourses();
  const progressStore = readTaskProgressStore();

  return (
    <section aria-label="Courses page" className="w-full max-w-none">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#58776a]">
            The learning atelier
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
            Find your next spark.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#64756c]">
            Small steps, practical ideas, and room to grow at your own pace.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9d4c7] bg-[#fffefa] px-3.5 py-2 text-sm font-semibold text-[#53685e] shadow-sm">
          <span
            className="size-2 rounded-full bg-[#94b64c]"
            aria-hidden="true"
          />
          {courses.length} courses available
        </span>
      </header>

      <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const courseDetailsUrl = `/courses/${course.course_code}/${encodeURIComponent(course.title)}`;
          const progress = getTaskProgress(course, progressStore);
          const theme = categoryTheme[course.category];

          return (
            <article
              key={`${course.course_code}-${course.title}`}
              className="app-card group flex h-full flex-col overflow-hidden rounded-[22px] border shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#b8c9a0] hover:shadow-lg"
            >
              <div
                className={`flex items-start justify-between bg-linear-to-br ${theme?.panel ?? "from-slate-50 to-slate-100"} px-5 py-4`}
              >
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${theme?.badge ?? "bg-slate-100 text-slate-700"}`}
                >
                  {course.category}
                </span>
                <div className="flex items-center gap-2">
                  {progress.isCompleted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e4efda] px-2.5 py-1 text-xs font-semibold text-[#355c4c]">
                      <span aria-hidden="true">✓</span> Completed
                    </span>
                  )}
                  <span
                    className={`grid size-9 place-items-center rounded-xl bg-[#fffefa]/90 text-lg font-semibold shadow-sm ${theme?.accent ?? "text-[#53685e]"}`}
                    aria-hidden="true"
                  >
                    {categoryIcons[course.category] ?? "✦"}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#89958a]">
                    Course
                  </p>
                  <span className="font-mono text-xs text-[#78877b]">
                    {course.course_code}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-[#203832] transition group-hover:text-[#527537]">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#64756c]">
                  {course.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f5f3ec] p-3.5 text-xs">
                  <div>
                    <p className="text-[#78877b]">Instructor</p>
                    <p className="mt-1 truncate font-semibold text-[#29483f]">
                      {course.instructor}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#78877b]">Duration</p>
                    <p className="mt-1 font-semibold text-[#29483f]">
                      {course.duration}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-[#e5e0d5] pt-2">
                    <p className="text-[#78877b]">Starts</p>
                    <p className="mt-1 font-semibold text-[#29483f]">
                      {course.start_date} · {course.time}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      Course tasks
                    </span>
                    <span className="font-semibold text-slate-700">
                      {progress.completedTaskCount}/{progress.taskCount}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${course.title} task completion`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress.percent}
                    className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                  >
                    <div
                      className={`h-full rounded-full transition-all ${progress.isCompleted ? "bg-[#75984b]" : "bg-[#527f69]"}`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={courseDetailsUrl}
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#173c35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28584a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90aa66] focus-visible:ring-offset-2"
                >
                  View course
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Courses;
