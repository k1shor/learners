const STORAGE_KEY_PREFIX = "learners.studentEnrollments.";

function getStorageKey(studentId) {
  const normalizedStudentId = studentId.trim().toLowerCase();
  if (!normalizedStudentId) {
    throw new Error("A student account is required to manage course enrollments.");
  }
  return `${STORAGE_KEY_PREFIX}${encodeURIComponent(normalizedStudentId)}`;
}

export function getJoinedCourseCodes(studentId) {
  const storedCodes = localStorage.getItem(getStorageKey(studentId));
  if (storedCodes === null) return [];

  const courseCodes = JSON.parse(storedCodes);
  if (
    !Array.isArray(courseCodes) ||
    courseCodes.some((courseCode) => typeof courseCode !== "string")
  ) {
    throw new Error("Saved course enrollments are invalid. Clear them and try again.");
  }

  return courseCodes;
}

export function joinStudentToCourse(studentId, courseCode) {
  const normalizedCourseCode = courseCode.trim();
  if (!normalizedCourseCode) {
    throw new Error("A course code is required to join a course.");
  }

  const joinedCourseCodes = getJoinedCourseCodes(studentId);
  if (joinedCourseCodes.includes(normalizedCourseCode)) {
    return joinedCourseCodes;
  }

  const updatedCourseCodes = [...joinedCourseCodes, normalizedCourseCode];
  localStorage.setItem(
    getStorageKey(studentId),
    JSON.stringify(updatedCourseCodes),
  );
  return updatedCourseCodes;
}
