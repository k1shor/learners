import { useEffect, useMemo, useState } from "react";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "Unknown";

const AdminStudentsPage = () => {
  const isLocalDevelopment = import.meta.env.DEV;
  const [adminKey, setAdminKey] = useState("");
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [authorizedKey, setAuthorizedKey] = useState(
    isLocalDevelopment ? "local-development" : "",
  );
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [busyStudentId, setBusyStudentId] = useState(null);

  const adminHeaders = (key) =>
    key && key !== "local-development" ? { "x-admin-key": key } : {};

  const requestStudents = async (key) => {
    const response = await fetch("/api/admin/students", {
      headers: adminHeaders(key),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(result.error || "Could not load students.");
    setStudents(result.students);
    setError("");
    return result.students;
  };

  useEffect(() => {
    if (!isLocalDevelopment) return undefined;
    let active = true;
    setIsLoading(true);
    requestStudents("")
      .then((loadedStudents) => {
        if (active) setStudents(loadedStudents);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isLocalDevelopment]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return students;
    return students.filter((student) =>
      `${student.name} ${student.email} ${student.id}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [search, students]);

  const unlockAdmin = async (event) => {
    event.preventDefault();
    const key = adminKey.trim();
    if (!key) {
      setError("Enter the admin key to continue.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const loadedStudents = await requestStudents(key);
      setStudents(loadedStudents);
      setAuthorizedKey(key);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewStudent = async (studentId) => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        headers: adminHeaders(authorizedKey),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Could not load student.");
      setSelectedStudent(result.student);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleStudentStatus = async (student) => {
    setBusyStudentId(student.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders(authorizedKey),
        },
        body: JSON.stringify({ isActive: !student.isActive }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Could not update student.");
      setStudents((current) =>
        current.map((item) => (item.id === student.id ? result.student : item)),
      );
      setSelectedStudent((current) =>
        current?.id === student.id ? result.student : current,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyStudentId(null);
    }
  };

  const lockAdmin = () => {
    setAdminKey("");
    setAuthorizedKey("");
    setStudents([]);
    setSelectedStudent(null);
    setError("");
  };

  if (!authorizedKey) {
    return (
      <section className="mx-auto w-full max-w-xl" aria-label="Admin access">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35]">
          Student management
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64756c]">
          Enter the server admin key to view student records and manage account
          access.
        </p>
        <form
          onSubmit={unlockAdmin}
          className="app-card mt-6 space-y-4 rounded-2xl border p-6 shadow-sm"
        >
          <label
            htmlFor="admin-key"
            className="block text-sm font-semibold text-[#29483f]"
          >
            Admin key
          </label>
          <div className="flex gap-2">
            <input
              id="admin-key"
              type={showAdminKey ? "text" : "password"}
              autoComplete="current-password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
              placeholder="Enter your admin key"
            />
            <button
              type="button"
              onClick={() => setShowAdminKey((visible) => !visible)}
              aria-pressed={showAdminKey}
              aria-label={showAdminKey ? "Hide admin key" : "Show admin key"}
              className="min-h-11 rounded-xl border border-[#d9d4c7] px-3 text-sm font-semibold text-[#53685e] transition hover:bg-[#f3f6e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#527f69]"
            >
              {showAdminKey ? "Hide" : "Show"}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-[#9b3d2c]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-11 w-full rounded-xl bg-[#173c35] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#28584a] disabled:opacity-60"
          >
            {isLoading ? "Checking…" : "Open student management"}
          </button>
          <p className="text-xs leading-5 text-[#78877b]">
            Set ADMIN_API_KEY in the server environment before using this page.
          </p>
        </form>
      </section>
    );
  }

  const activeCount = students.filter((student) => student.isActive).length;

  return (
    <section
      className="mx-auto w-full max-w-6xl"
      aria-label="Admin student management"
    >
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
            Students
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64756c]">
            View student records, inspect account information, and enable or
            disable access.
          </p>
        </div>
        {!isLocalDevelopment && (
          <button
            type="button"
            onClick={lockAdmin}
            className="min-h-10 rounded-xl border border-[#d9d4c7] bg-[#fffefa] px-4 py-2 text-sm font-semibold text-[#53685e] transition hover:bg-white"
          >
            Lock admin panel
          </button>
        )}
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <article className="app-card rounded-2xl border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">Total students</p>
          <p className="mt-1 text-2xl font-bold text-[#203832]">
            {students.length}
          </p>
        </article>
        <article className="app-card rounded-2xl border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">Active accounts</p>
          <p className="mt-1 text-2xl font-bold text-[#527f69]">
            {activeCount}
          </p>
        </article>
      </div>

      <section
        className="app-card overflow-hidden rounded-2xl border shadow-sm"
        aria-label="All students"
      >
        <div className="flex flex-col gap-3 border-b border-[#e5e0d5] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-[#203832]">All students</h2>
            <p className="mt-1 text-xs text-[#78877b]">
              {filteredStudents.length} record(s) shown
            </p>
          </div>
          <input
            type="search"
            aria-label="Search students"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, or ID"
            className="min-h-10 w-full rounded-xl border border-[#d9d4c7] bg-white px-3 text-sm text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda] sm:max-w-xs"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="m-4 rounded-xl bg-[#f8eee8] px-4 py-3 text-sm text-[#80523b]"
          >
            {error}
          </p>
        )}
        {isLoading ? (
          <p role="status" className="p-8 text-center text-sm text-[#64756c]">
            Loading students…
          </p>
        ) : filteredStudents.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#64756c]">
            {students.length
              ? "No students match your search."
              : "No student accounts have been created yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#f7f5ef] text-xs uppercase tracking-wide text-[#78877b]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae1]">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="text-[#53685e]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#203832]">
                        {student.name}
                      </p>
                      <p className="mt-0.5 text-xs">
                        {student.email} · ID {student.id}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${student.isActive ? "bg-[#e4efda] text-[#355c4c]" : "bg-[#f8e7e2] text-[#9b3d2c]"}`}
                      >
                        {student.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => viewStudent(student.id)}
                          className="rounded-lg border border-[#d9d4c7] px-3 py-2 text-xs font-semibold text-[#355c4c] hover:bg-[#f3f6e8]"
                        >
                          View info
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(student)}
                          disabled={busyStudentId === student.id}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-60 ${student.isActive ? "bg-[#f8e7e2] text-[#9b3d2c] hover:bg-[#f2d8d0]" : "bg-[#e4efda] text-[#355c4c] hover:bg-[#d7e8c8]"}`}
                        >
                          {busyStudentId === student.id
                            ? "Saving…"
                            : student.isActive
                              ? "Disable"
                              : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#173c35]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedStudent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-info-title"
            className="w-full max-w-lg rounded-2xl border border-[#ded9cd] bg-[#fffefa] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#63824d]">
                  Student information
                </p>
                <h2
                  id="student-info-title"
                  className="mt-1 text-2xl font-bold text-[#173c35]"
                >
                  {selectedStudent.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close student information"
                onClick={() => setSelectedStudent(null)}
                className="grid size-9 place-items-center rounded-lg text-xl text-[#78877b] hover:bg-[#f5f3ec]"
              >
                ×
              </button>
            </div>
            <dl className="mt-6 grid gap-4 rounded-xl bg-[#f7f5ef] p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#78877b]">Student ID</dt>
                <dd className="mt-1 font-semibold text-[#203832]">
                  {selectedStudent.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#78877b]">Account status</dt>
                <dd className="mt-1 font-semibold text-[#203832]">
                  {selectedStudent.isActive ? "Active" : "Disabled"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-[#78877b]">Email address</dt>
                <dd className="mt-1 break-all font-semibold text-[#203832]">
                  {selectedStudent.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#78877b]">Joined</dt>
                <dd className="mt-1 font-semibold text-[#203832]">
                  {formatDate(selectedStudent.createdAt)}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="min-h-10 rounded-lg px-4 text-sm font-semibold text-[#53685e] hover:bg-[#f5f3ec]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => toggleStudentStatus(selectedStudent)}
                disabled={busyStudentId === selectedStudent.id}
                className={`min-h-10 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-60 ${selectedStudent.isActive ? "bg-[#9b3d2c] hover:bg-[#813322]" : "bg-[#28584a] hover:bg-[#173c35]"}`}
              >
                {busyStudentId === selectedStudent.id
                  ? "Saving…"
                  : selectedStudent.isActive
                    ? "Disable student"
                    : "Enable student"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminStudentsPage;
