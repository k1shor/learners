const STORAGE_KEY = "learners.disabledCourseCodes";

export function getDisabledCourseCodes() {
  const storedCodes = localStorage.getItem(STORAGE_KEY);
  if (storedCodes === null) return [];

  let courseCodes;
  try {
    courseCodes = JSON.parse(storedCodes);
  } catch {
    throw new Error("Saved course availability is invalid.");
  }

  if (
    !Array.isArray(courseCodes) ||
    courseCodes.some((courseCode) => typeof courseCode !== "string")
  ) {
    throw new Error("Saved course availability is invalid.");
  }

  return courseCodes;
}

export function saveDisabledCourseCodes(courseCodes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courseCodes));
}
