const STORAGE_KEY = "learners.assignmentSubmissions";

export function getAssignmentSubmissions() {
  const storedSubmissions = localStorage.getItem(STORAGE_KEY);
  if (!storedSubmissions) return [];

  const submissions = JSON.parse(storedSubmissions);
  if (
    !Array.isArray(submissions) ||
    submissions.some(
      (submission) =>
        typeof submission.studentId !== "string" ||
        typeof submission.studentName !== "string" ||
        typeof submission.courseCode !== "string" ||
        typeof submission.assignmentTitle !== "string" ||
        typeof submission.submittedAt !== "string",
    )
  ) {
    throw new Error(
      "Saved assignment submissions are invalid. Clear them and try again.",
    );
  }

  return submissions;
}

export function saveAssignmentSubmission({
  studentId,
  studentName,
  courseCode,
  assignmentTitle,
}) {
  const normalizedStudentId = studentId.trim().toLowerCase();
  const normalizedStudentName = studentName.trim();
  const normalizedCourseCode = courseCode.trim();
  const normalizedAssignmentTitle = assignmentTitle.trim();

  if (
    !normalizedStudentId ||
    !normalizedStudentName ||
    !normalizedCourseCode ||
    !normalizedAssignmentTitle
  ) {
    throw new Error("Student and assignment details are required to submit.");
  }

  const submissions = getAssignmentSubmissions();
  const submission = {
    studentId: normalizedStudentId,
    studentName: normalizedStudentName,
    courseCode: normalizedCourseCode,
    assignmentTitle: normalizedAssignmentTitle,
    submittedAt: new Date().toISOString(),
  };
  const updatedSubmissions = [
    submission,
    ...submissions.filter(
      (item) =>
        item.studentId !== normalizedStudentId ||
        item.courseCode !== normalizedCourseCode ||
        item.assignmentTitle !== normalizedAssignmentTitle,
    ),
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubmissions));
  return updatedSubmissions;
}
