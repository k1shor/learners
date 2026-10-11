import { Link } from "react-router-dom";
import categoryTheme from "../utils/categoryTheme";

const TaskCourseCard = ({ course, progress, onToggleTask }) => {
  const courseUrl = `/courses/${course.course_code}/${encodeURIComponent(course.title)}`;
  const theme = categoryTheme[course.category];

  return (
    <article
      className={`app-card flex flex-col overflow-hidden rounded-[22px] border shadow-sm transition-shadow hover:shadow-lg ${
        progress.isCompleted
          ? "border-[#b4c99c]"
          : (theme?.border ?? "border-[#e5e0d5]")
      }`}
    >
      <header
        className={`border-l-4 bg-linear-to-r ${theme?.panel ?? "from-[#f5f3ec] to-[#fffefa]"} p-5 pb-4 ${progress.isCompleted ? "border-l-[#75984b]" : (theme?.leftBorder ?? "border-l-[#d9d4c7]")}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.14em] ${theme?.accent ?? "text-[#63824d]"}`}
            >
              {course.category} <span className="px-1 text-slate-300">/</span>
              {course.course_code}
            </p>
            <h3 className="mt-2 text-lg font-bold leading-snug text-[#203832]">
              {course.title}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              progress.isCompleted
                ? "bg-[#e4efda] text-[#355c4c]"
                : "bg-[#fffefa]/80 text-[#53685e]"
            }`}
          >
            {progress.completedTaskCount}/{progress.taskCount}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress.isCompleted
                  ? "bg-[#75984b]"
                  : (theme?.progress ?? "bg-[#63824d]")
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="w-9 text-right text-xs font-semibold text-slate-500">
            {progress.percent}%
          </span>
        </div>
      </header>

      <ul className="flex-1 border-t border-slate-100 px-5">
        {course.assignments.map((task, index) => {
          const isDone = progress.completedTaskIds.includes(String(index));

          return (
            <li
              key={`${index}-${task}`}
              className="border-b border-[#ebe7de] last:border-0"
            >
              <label className="flex cursor-pointer items-start gap-3 py-3.5">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTask(course, index)}
                  aria-label={`${isDone ? "Mark incomplete" : "Mark complete"}: ${task}`}
                  className="mt-0.5 size-4 shrink-0 accent-[#527f69] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527f69]"
                />
                <span
                  className={`text-sm leading-5 ${
                    isDone ? "text-slate-400 line-through" : "text-slate-700"
                  }`}
                >
                  {task}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <footer
        className={`flex items-center justify-between gap-3 border-t px-5 py-3.5 ${
          progress.isCompleted
            ? "border-[#dce9d1] bg-[#f0f5e9]"
            : "border-[#ebe7de] bg-[#f8f6f0]"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            progress.isCompleted ? "text-[#355c4c]" : "text-[#64756c]"
          }`}
        >
          {progress.isCompleted
            ? "Certificate unlocked"
            : `${progress.taskCount - progress.completedTaskCount} tasks left`}
        </p>
        {progress.isCompleted ? (
          <Link
            to="/certificates"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#527f69] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#355c4c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69] focus-visible:ring-offset-2"
          >
            View certificate <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link
            to={courseUrl}
            className="text-xs font-semibold text-[#527f69] transition hover:text-[#173c35]"
          >
            Course details <span aria-hidden="true">→</span>
          </Link>
        )}
      </footer>
    </article>
  );
};

export default TaskCourseCard;
