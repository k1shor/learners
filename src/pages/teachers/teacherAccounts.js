const STORAGE_KEY = "learners.teacherAccounts";

export function getTeacherAccounts() {
  const storedAccounts = localStorage.getItem(STORAGE_KEY);
  if (!storedAccounts) return [];

  const accounts = JSON.parse(storedAccounts);
  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        typeof account.name !== "string" ||
        typeof account.email !== "string" ||
        typeof account.password !== "string",
    )
  ) {
    throw new Error("Saved teacher accounts are invalid. Clear them and try again.");
  }

  return accounts;
}

export function createTeacherAccount({ name, email, password, courseCodes }) {
  const accounts = getTeacherAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
    throw new Error("A teacher account with this email already exists.");
  }
  if (!Array.isArray(courseCodes) || courseCodes.length === 0) {
    throw new Error("Assign at least one class to this teacher.");
  }

  const updatedAccounts = [
    ...accounts,
    {
      name: name.trim(),
      email: normalizedEmail,
      password,
      courseCodes: [...new Set(courseCodes)],
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

  return updatedAccounts;
}

export function removeTeacherAccount(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const updatedAccounts = getTeacherAccounts().filter(
    (account) => account.email.toLowerCase() !== normalizedEmail,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
  return updatedAccounts;
}

export function authenticateTeacher(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    getTeacherAccounts().find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password,
    ) ?? null
  );
}
