function getStorageKey(email) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("A teacher email is required to save assignments.");
  }
  return `learners.teacherAssignments.${encodeURIComponent(normalizedEmail)}`;
}

function getDeletedStorageKey(email) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("A teacher email is required to manage assignments.");
  }
  return `learners.deletedTeacherAssignments.${encodeURIComponent(normalizedEmail)}`;
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

export function getDeletedTeacherAssignmentIds(email) {
  const storedIds = localStorage.getItem(getDeletedStorageKey(email));
  if (!storedIds) return [];

  const ids = JSON.parse(storedIds);
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    throw new Error(
      "Saved assignment removals are invalid. Clear them and try again.",
    );
  }

  return ids;
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

export function deleteTeacherAssignment(email, assignment) {
  if (typeof assignment.id !== "string" || !assignment.id) {
    throw new Error("An assignment ID is required to delete an assignment.");
  }

  const assignments = getTeacherAssignments(email);
  const deletedIds = getDeletedTeacherAssignmentIds(email);

  if (assignment.isCustom) {
    const updatedAssignments = assignments.filter(
      (item) => item.id !== assignment.id,
    );
    localStorage.setItem(
      getStorageKey(email),
      JSON.stringify(updatedAssignments),
    );
    return { assignments: updatedAssignments, deletedIds };
  }

  const updatedDeletedIds = deletedIds.includes(assignment.id)
    ? deletedIds
    : [...deletedIds, assignment.id];
  localStorage.setItem(
    getDeletedStorageKey(email),
    JSON.stringify(updatedDeletedIds),
  );
  return { assignments, deletedIds: updatedDeletedIds };
}
