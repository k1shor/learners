const STORAGE_KEY = "e-learnershub-task-progress";

export const getCourseKey = (course) =>
  `${course.course_code}::${course.title}`;

export const readTaskProgressStore = () => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const getTaskProgress = (course, store = readTaskProgressStore()) => {
  const taskCount = course.assignments?.length ?? 0;
  const record = store[getCourseKey(course)] ?? {};
  const completedTaskIds = Array.isArray(record.completedTaskIds)
    ? [...new Set(record.completedTaskIds)].filter((id) => {
        const index = Number(id);
        return Number.isInteger(index) && index >= 0 && index < taskCount;
      })
    : [];
  const completedTaskCount = completedTaskIds.length;
  const isCompleted = taskCount > 0 && completedTaskCount === taskCount;

  return {
    completedTaskIds,
    completedTaskCount,
    taskCount,
    isCompleted,
    percent: taskCount ? Math.round((completedTaskCount / taskCount) * 100) : 0,
    completedAt: isCompleted ? (record.completedAt ?? null) : null,
  };
};

export const saveTaskProgress = (course, completedTaskIds) => {
  const store = readTaskProgressStore();
  const key = getCourseKey(course);
  const uniqueIds = [...new Set(completedTaskIds.map(String))].filter((id) => {
    const index = Number(id);
    return (
      Number.isInteger(index) &&
      index >= 0 &&
      index < (course.assignments?.length ?? 0)
    );
  });
  const isCompleted =
    (course.assignments?.length ?? 0) > 0 &&
    uniqueIds.length === course.assignments.length;

  store[key] = {
    completedTaskIds: uniqueIds,
    completedAt: isCompleted
      ? (store[key]?.completedAt ?? new Date().toISOString())
      : null,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  return store;
};
