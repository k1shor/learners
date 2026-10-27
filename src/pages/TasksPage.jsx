import { useState } from "react";
import { Link } from "react-router-dom";
import TaskCourseCard from "../components/TaskCourseCard";
import useCourses from "../hooks/useCourses";
import {
  getTaskProgress,
  readTaskProgressStore,
  saveTaskProgress,
} from "../utils/taskProgress";

const TasksPage = () => {
  const courses = useCourses();
  const [progressStore, setProgressStore] = useState(readTaskProgressStore);
  const allTasks = courses.reduce(
    (total, course) => total + (course.assignments?.length ?? 0),
    0,
  );
  const doneTasks = courses.reduce(
    (total, course) =>
      total + getTaskProgress(course, progressStore).completedTaskCount,
    0,
  );
  const earnedCertificates = courses.filter(
    (course) => getTaskProgress(course, progressStore).isCompleted,
  ).length;
  const remainingTasks = allTasks - doneTasks;
  const overallPercent = allTasks
    ? Math.round((doneTasks / allTasks) * 100)
    : 0;

  const toggleTask = (course, taskIndex) => {
    const progress = getTaskProgress(course, progressStore);
    const taskId = String(taskIndex);
    const completedTaskIds = progress.completedTaskIds.includes(taskId)
      ? progress.completedTaskIds.filter((id) => id !== taskId)
      : [...progress.completedTaskIds, taskId];

    setProgressStore(saveTaskProgress(course, completedTaskIds));
  };

  return (
    <section aria-label="Course tasks" className="mx-auto w-full max-w-6xl">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
            Learning checklist
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
            Your tasks
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#64756c]">
            Check off course tasks as you finish. Completing a course unlocks
            its certificate.
          </p>
        </div>
        <Link
          to="/certificates"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#d9d4c7] bg-[#fffefa] px-3.5 py-2 text-sm font-semibold text-[#355c4c] shadow-sm transition hover:border-[#b8c9a1] hover:bg-[#f3f6e8] hover:text-[#173c35]"
        >
          Certificates <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <article className="app-card rounded-[18px] border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">Tasks remaining</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#203832]">
            {remainingTasks}
            <span className="ml-1 text-sm font-medium text-[#9aa398]">
              / {allTasks}
            </span>
          </p>
        </article>
        <article className="app-card rounded-[18px] border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">Tasks completed</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#527f69]">
            {doneTasks}
            <span className="ml-1 text-sm font-medium text-[#9aa398]">
              / {allTasks}
            </span>
          </p>
        </article>
        <article className="app-card rounded-[18px] border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">
            Certificates unlocked
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#527f69]">
            {earnedCertificates}
            <span className="ml-1 text-sm font-medium text-[#9aa398]">
              / {courses.length}
            </span>
          </p>
        </article>
      </div>

      <section className="app-card mb-7 rounded-[18px] border p-4 shadow-sm sm:px-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#29483f]">
            Overall progress
          </p>
          <p className="text-sm font-bold text-[#527f69]">{overallPercent}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Overall task progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={overallPercent}
          className="h-2 overflow-hidden rounded-full bg-[#e9e6dc]"
        >
          <div
            className="h-full rounded-full bg-[#527f69] transition-all duration-300"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#78877b]">
          Your checklist is saved in this browser. Mark tasks complete when you
          finish them.
        </p>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {courses.map((course) => {
          const progress = getTaskProgress(course, progressStore);

          return (
            <TaskCourseCard
              key={`${course.course_code}-${course.title}`}
              course={course}
              progress={progress}
              onToggleTask={toggleTask}
            />
          );
        })}
      </div>
    </section>
  );
};

export default TasksPage;
