import { useEffect, useMemo, useState } from "react";

const AdminInstructorsPage = () => {
  const isLocalDevelopment = import.meta.env.DEV;
  const [adminKey, setAdminKey] = useState("");
  const [authorizedKey, setAuthorizedKey] = useState(
    isLocalDevelopment ? "local-development" : "",
  );
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isLocalDevelopment);
  const [isSaving, setIsSaving] = useState(false);
  const [busyInstructorId, setBusyInstructorId] = useState(null);

  const adminHeaders = (key) =>
    key && key !== "local-development" ? { "x-admin-key": key } : {};

  const loadInstructors = async (key) => {
    const response = await fetch("/api/admin/instructors", {
      headers: adminHeaders(key),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || "Could not load instructors.");
    }
    setInstructors(result.instructors);
    setError("");
    return result.instructors;
  };

  useEffect(() => {
    if (!isLocalDevelopment) return undefined;
    let mounted = true;
    fetch("/api/admin/instructors")
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || "Could not load instructors.");
        }
        return result.instructors;
      })
      .then((loadedInstructors) => {
        if (mounted) setInstructors(loadedInstructors);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isLocalDevelopment]);

  const filteredInstructors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return instructors;
    return instructors.filter((instructor) =>
      `${instructor.name} ${instructor.email} ${instructor.bio} ${instructor.courses
        .map((course) => `${course.courseCode} ${course.title}`)
        .join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }, [instructors, search]);

  const unlockAdmin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const loaded = await loadInstructors(adminKey.trim());
      setInstructors(loaded);
      setAuthorizedKey(adminKey.trim());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openInstructor = async (id, edit = false) => {
    setError("");
    try {
      const response = await fetch(`/api/admin/instructors/${id}`, {
        headers: adminHeaders(authorizedKey),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Could not load instructor details.");
      }
      setSelectedInstructor(result.instructor);
      setForm({
        name: result.instructor.name,
        email: result.instructor.email,
        bio: result.instructor.bio,
      });
      setIsEditing(edit);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const saveInstructor = async (event) => {
    event.preventDefault();
    if (!selectedInstructor) return;
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/instructors/${selectedInstructor.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...adminHeaders(authorizedKey),
          },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Could not save instructor details.");
      }
      setSelectedInstructor(result.instructor);
      setInstructors((current) =>
        current.map((instructor) =>
          instructor.id === result.instructor.id
            ? result.instructor
            : instructor,
        ),
      );
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInstructorStatus = async (instructor) => {
    setBusyInstructorId(instructor.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/instructors/${instructor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders(authorizedKey),
        },
        body: JSON.stringify({
          name: instructor.name,
          email: instructor.email,
          bio: instructor.bio,
          isActive: !instructor.isActive,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Could not update instructor status.");
      }
      setInstructors((current) =>
        current.map((item) =>
          item.id === instructor.id ? result.instructor : item,
        ),
      );
      setSelectedInstructor((current) =>
        current?.id === instructor.id ? result.instructor : current,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyInstructorId(null);
    }
  };

  const closeDetails = () => {
    setSelectedInstructor(null);
    setIsEditing(false);
  };

  if (!authorizedKey) {
    return (
      <section className="mx-auto w-full max-w-xl" aria-label="Admin access">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35]">
          Instructor management
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64756c]">
          Enter the admin key to view and edit instructor profiles.
        </p>
        <form
          onSubmit={unlockAdmin}
          className="app-card mt-6 space-y-4 rounded-2xl border p-6 shadow-sm"
        >
          <label
            htmlFor="instructor-admin-key"
            className="block text-sm font-semibold text-[#29483f]"
          >
            Admin key
          </label>
          <input
            id="instructor-admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
            placeholder="Enter your admin key"
          />
          {error && (
            <p role="alert" className="text-sm text-[#9b3d2c]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-11 w-full rounded-xl bg-[#173c35] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {isLoading ? "Checking…" : "Open instructor management"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section
      className="mx-auto w-full max-w-6xl"
      aria-label="Admin instructor management"
    >
      <header className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#173c35] sm:text-4xl">
          Teachers &amp; instructors
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64756c]">
          Browse the instructor directory, see assigned courses, and edit
          profile details. Name updates appear across courses and certificates.
        </p>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <article className="app-card rounded-2xl border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">
            Total instructors
          </p>
          <p className="mt-1 text-2xl font-bold text-[#203832]">
            {instructors.length}
          </p>
        </article>
        <article className="app-card rounded-2xl border p-4 shadow-sm">
          <p className="text-xs font-medium text-[#78877b]">
            Active instructors
          </p>
          <p className="mt-1 text-2xl font-bold text-[#527f69]">
            {instructors.filter((instructor) => instructor.isActive).length}
          </p>
        </article>
      </div>

      <section
        className="app-card overflow-hidden rounded-2xl border shadow-sm"
        aria-label="All instructors"
      >
        <div className="flex flex-col gap-3 border-b border-[#e5e0d5] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-[#203832]">All instructors</h2>
            <p className="mt-1 text-xs text-[#78877b]">
              {filteredInstructors.length} instructor(s)
            </p>
          </div>
          <input
            type="search"
            aria-label="Search instructors"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or course"
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
            Loading instructors…
          </p>
        ) : filteredInstructors.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#64756c]">
            No instructors found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#f7f5ef] text-xs uppercase tracking-wide text-[#78877b]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Instructor</th>
                  <th className="px-5 py-3 font-semibold">Courses</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae1]">
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} className="text-[#53685e]">
                    <td className="px-5 py-4 font-semibold text-[#203832]">
                      {instructor.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {instructor.courses.map((course) => (
                          <span
                            key={`${course.courseCode}-${course.title}`}
                            className="rounded-full bg-[#f3f6e8] px-2.5 py-1 text-xs font-medium text-[#355c4c]"
                          >
                            {course.courseCode}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {instructor.email || (
                        <span className="text-[#9aa398]">Not added</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${instructor.isActive ? "bg-[#e4efda] text-[#355c4c]" : "bg-[#f8e7e2] text-[#9b3d2c]"}`}
                      >
                        {instructor.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openInstructor(instructor.id)}
                          className="rounded-lg border border-[#d9d4c7] px-3 py-2 text-xs font-semibold text-[#355c4c] hover:bg-[#f3f6e8]"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => openInstructor(instructor.id, true)}
                          className="rounded-lg bg-[#173c35] px-3 py-2 text-xs font-semibold text-white hover:bg-[#28584a]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleInstructorStatus(instructor)}
                          disabled={busyInstructorId === instructor.id}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-60 ${instructor.isActive ? "bg-[#f8e7e2] text-[#9b3d2c] hover:bg-[#f2d8d0]" : "bg-[#e4efda] text-[#355c4c] hover:bg-[#d7e8c8]"}`}
                        >
                          {busyInstructorId === instructor.id
                            ? "Saving…"
                            : instructor.isActive
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

      {selectedInstructor && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#173c35]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="instructor-dialog-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-[#ded9cd] bg-[#fffefa] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#63824d]">
                  Instructor profile
                </p>
                <h2
                  id="instructor-dialog-title"
                  className="mt-1 text-2xl font-bold text-[#173c35]"
                >
                  {isEditing ? "Edit instructor" : selectedInstructor.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close instructor details"
                onClick={closeDetails}
                className="grid size-9 place-items-center rounded-lg text-xl text-[#78877b] hover:bg-[#f5f3ec]"
              >
                ×
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={saveInstructor} className="mt-5 space-y-4">
                <label className="block text-sm font-semibold text-[#29483f]">
                  Full name
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#29483f]">
                  Email address
                  <input
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#29483f]">
                  About
                  <textarea
                    maxLength={500}
                    rows={4}
                    value={form.bio}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                    placeholder="Add a short instructor bio"
                    className="mt-1.5 w-full resize-y rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 font-normal text-[#203832] outline-none focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
                  />
                </label>
                {error && (
                  <p role="alert" className="text-sm text-[#9b3d2c]">
                    {error}
                  </p>
                )}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="min-h-10 rounded-lg px-4 text-sm font-semibold text-[#53685e] hover:bg-[#f5f3ec]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="min-h-10 rounded-xl bg-[#173c35] px-4 text-sm font-semibold text-white hover:bg-[#28584a] disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <dl className="mt-5 grid gap-4 rounded-xl bg-[#f7f5ef] p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#78877b]">Status</dt>
                    <dd className="mt-1 font-semibold text-[#203832]">
                      {selectedInstructor.isActive ? "Active" : "Disabled"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#78877b]">Email</dt>
                    <dd className="mt-1 break-all font-semibold text-[#203832]">
                      {selectedInstructor.email || "Not added"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#78877b]">Courses assigned</dt>
                    <dd className="mt-1 font-semibold text-[#203832]">
                      {selectedInstructor.courses.length}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#78877b]">About</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-[#203832]">
                      {selectedInstructor.bio || "No bio added yet."}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#78877b]">Assigned courses</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {selectedInstructor.courses.map((course) => (
                        <span
                          key={`${course.courseCode}-${course.title}`}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#355c4c]"
                        >
                          {course.courseCode} · {course.title}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="min-h-10 rounded-lg px-4 text-sm font-semibold text-[#53685e] hover:bg-[#f5f3ec]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        name: selectedInstructor.name,
                        email: selectedInstructor.email,
                        bio: selectedInstructor.bio,
                      });
                      setIsEditing(true);
                    }}
                    className="min-h-10 rounded-xl bg-[#173c35] px-4 text-sm font-semibold text-white hover:bg-[#28584a]"
                  >
                    Edit details
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleInstructorStatus(selectedInstructor)}
                    disabled={busyInstructorId === selectedInstructor.id}
                    className={`min-h-10 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-60 ${selectedInstructor.isActive ? "bg-[#9b3d2c] hover:bg-[#813322]" : "bg-[#28584a] hover:bg-[#173c35]"}`}
                  >
                    {busyInstructorId === selectedInstructor.id
                      ? "Saving…"
                      : selectedInstructor.isActive
                        ? "Disable instructor"
                        : "Enable instructor"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminInstructorsPage;
