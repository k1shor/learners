function getStorageKey(email) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("A teacher email is required to save assignments.");
  }
  return `learners.teacherAssignments.${encodeURIComponent(normalizedEmail)}`;
}

export function getTeacherAssignments(email) {
  const storedAssignments = localStorage.getItem(getStorageKey(email));
  if (!storedAssignments) return [];

  const assignments = JSON.parse(storedAssignments);
  if (
    !Array.isArray(assignments) ||
    assignments.some(
      (assignment) =>
        typeof assignment.id !== "string" ||
        typeof assignment.title !== "string" ||
        typeof assignment.courseCode !== "string" ||
        typeof assignment.dueDate !== "string" ||
        typeof assignment.details !== "string",
    )
  ) {
    throw new Error("Saved assignments are invalid. Clear them and try again.");
  }

  return assignments;
}

export function saveTeacherAssignment(email, assignment) {
  const storageKey = getStorageKey(email);
  const assignments = getTeacherAssignments(email);
  const updatedAssignments = [
    { ...assignment, id: crypto.randomUUID() },
    ...assignments,
  ];
  localStorage.setItem(storageKey, JSON.stringify(updatedAssignments));
  return updatedAssignments;
}
