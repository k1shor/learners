import { useEffect, useMemo, useState } from "react";

const emptyCourse = {
  title: "",
  course_code: "",
  instructor: "",
  category: "General",
  status: "Available",
  duration: "",
  start_date: "",
  time: "",
  description: "",
  takeaway: "",
  materials: [],
  videos: [],
  assignments: [],
  syllabus: [],
  participants: [],
  meeting_url: "",
  isActive: true,
};
const listFields = [
  "materials",
  "videos",
  "assignments",
  "syllabus",
  "participants",
];
const toForm = (course) => ({
  ...emptyCourse,
  ...course,
  instructor: course.instructorSourceName || course.instructor || "",
  ...Object.fromEntries(
    listFields.map((field) => [field, (course[field] || []).join("\n")]),
  ),
});
const toPayload = (form) => ({
  ...form,
  ...Object.fromEntries(
    listFields.map((field) => [
      field,
      form[field]
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    ]),
  ),
});

const AdminCoursesPage = () => {
  const isLocalDevelopment = import.meta.env.DEV;
  const [adminKey, setAdminKey] = useState("");
  const [authorizedKey, setAuthorizedKey] = useState(
    isLocalDevelopment ? "local-development" : "",
  );
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyCourse);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isLocalDevelopment);
  const [saving, setSaving] = useState(false);

  const headers = (key = authorizedKey) => ({
    ...(key && key !== "local-development" ? { "x-admin-key": key } : {}),
  });

  const loadData = async (key) => {
    const [courseResponse, instructorResponse] = await Promise.all([
      fetch("/api/admin/courses", { headers: headers(key) }),
      fetch("/api/instructors"),
    ]);
    const courseResult = await courseResponse.json().catch(() => ({}));
    const instructorResult = await instructorResponse.json().catch(() => ({}));
    if (!courseResponse.ok)
      throw new Error(courseResult.error || "Could not load courses.");
    setCourses(courseResult.courses);
    setInstructors(instructorResult.instructors || []);
    setError("");
  };

  useEffect(() => {
    if (!isLocalDevelopment) return undefined;
    let mounted = true;
    Promise.all([fetch("/api/admin/courses"), fetch("/api/instructors")])
      .then(async ([courseResponse, instructorResponse]) => {
        const courseResult = await courseResponse.json().catch(() => ({}));
        const instructorResult = await instructorResponse
          .json()
          .catch(() => ({}));
        if (!courseResponse.ok)
          throw new Error(courseResult.error || "Could not load courses.");
        if (mounted) {
          setCourses(courseResult.courses);
          setInstructors(instructorResult.instructors || []);
        }
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isLocalDevelopment]);

  const visibleCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses.filter(
      (course) =>
        !term ||
        `${course.title} ${course.course_code} ${course.instructor}`
          .toLowerCase()
          .includes(term),
    );
  }, [courses, query]);

  const unlock = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await loadData(adminKey.trim());
      setAuthorizedKey(adminKey.trim());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (course) => {
    setSelected(course);
    setForm(toForm(course));
    setMode("view");
    setError("");
  };
  const startAdd = () => {
    setSelected(null);
    setForm({
      ...toForm(emptyCourse),
      instructor:
        instructors.find(
          (instructor) => instructor.name !== "Instructor unavailable",
        )?.sourceName || "",
    });
    setMode("edit");
    setError("");
  };
  const startEdit = (course) => {
    setSelected(course);
    setForm(toForm(course));
    setMode("edit");
    setError("");
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        selected
          ? `/api/admin/courses/${selected.courseId}`
          : "/api/admin/courses",
        {
          method: selected ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json", ...headers() },
          body: JSON.stringify(toPayload(form)),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Could not save course.");
      setCourses((current) =>
        selected
          ? current.map((item) =>
              item.courseId === result.course.courseId ? result.course : item,
            )
          : [...current, result.course],
      );
      setSelected(result.course);
      setForm(toForm(result.course));
      setMode("view");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  if (!authorizedKey)
    return (
      <section className="mx-auto w-full max-w-xl" aria-label="Admin access">
        <h1 className="text-3xl font-bold text-[#173c35]">Course management</h1>
        <form
          onSubmit={unlock}
          className="app-card mt-6 space-y-4 rounded-2xl border p-6"
        >
          <label
            htmlFor="course-admin-key"
            className="block text-sm font-semibold"
          >
            Admin key
          </label>
          <input
            id="course-admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className="min-h-11 w-full rounded-xl border px-3"
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="min-h-11 w-full rounded-xl bg-[#173c35] text-white"
          >
            {loading ? "Loading…" : "Open course management"}
          </button>
        </form>
      </section>
    );

  return (
    <section
      className="mx-auto w-full max-w-6xl"
      aria-label="Course administration"
    >
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#173c35] sm:text-4xl">
            Courses
          </h1>
          <p className="mt-2 text-sm text-[#64756c]">
            View, add, edit, and archive courses.
          </p>
        </div>
        <button
          type="button"
          onClick={startAdd}
          className="min-h-11 rounded-xl bg-[#173c35] px-4 font-semibold text-white hover:bg-[#28584a]"
        >
          Add course
        </button>
      </header>
      <section
        className="app-card overflow-hidden rounded-2xl border shadow-sm"
        aria-label="All courses"
      >
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">All courses</h2>
            <p className="text-xs text-[#78877b]">
              {visibleCourses.length} course(s)
            </p>
          </div>
          <input
            aria-label="Search courses"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, code, instructor"
            className="min-h-10 rounded-xl border px-3 sm:w-80"
          />
        </div>
        {error && (
          <p
            role="alert"
            className="m-4 rounded-xl bg-[#f8eee8] p-3 text-sm text-[#80523b]"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p role="status" className="p-8 text-center">
            Loading courses…
          </p>
        ) : visibleCourses.length === 0 ? (
          <p className="p-8 text-center">No courses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f7f5ef] text-xs uppercase text-[#78877b]">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Instructor</th>
                  <th className="px-5 py-3">Schedule</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleCourses.map((course) => (
                  <tr key={course.courseId}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#203832]">
                        {course.title}
                      </p>
                      <p className="text-xs">{course.course_code}</p>
                    </td>
                    <td className="px-5 py-4">{course.instructor}</td>
                    <td className="px-5 py-4">
                      {course.start_date || "No class"} {course.time}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${course.isActive ? "bg-[#e4efda] text-[#355c4c]" : "bg-[#f8e7e2] text-[#9b3d2c]"}`}
                      >
                        {course.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openDetails(course)}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(course)}
                          className="rounded-lg bg-[#173c35] px-3 py-2 text-xs font-semibold text-white"
                        >
                          Edit
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
      {mode && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#173c35]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMode("");
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border bg-[#fffefa] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#63824d]">
                  Course information
                </p>
                <h2
                  id="course-modal-title"
                  className="mt-1 text-2xl font-bold text-[#173c35]"
                >
                  {mode === "edit"
                    ? selected
                      ? "Edit course"
                      : "Add course"
                    : selected?.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMode("")}
                aria-label="Close"
                className="size-9 rounded-lg text-xl hover:bg-[#f5f3ec]"
              >
                ×
              </button>
            </div>
            {mode === "edit" ? (
              <form
                onSubmit={saveCourse}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                {[
                  ["title", "Course title"],
                  ["course_code", "Course code"],
                  ["category", "Category"],
                  ["duration", "Duration"],
                  ["start_date", "Class date"],
                  ["time", "Class time"],
                  ["takeaway", "Key takeaway"],
                  ["meeting_url", "Meeting URL"],
                ].map(([field, label]) => (
                  <label
                    key={field}
                    className="block text-sm font-semibold text-[#29483f]"
                  >
                    {label}
                    <input
                      required={field === "title" || field === "course_code"}
                      maxLength={field === "title" ? 120 : 254}
                      value={form[field] || ""}
                      onChange={(event) => setField(field, event.target.value)}
                      className="mt-1.5 min-h-10 w-full rounded-xl border border-[#d9d4c7] px-3 font-normal"
                    />
                  </label>
                ))}
                <label className="block text-sm font-semibold text-[#29483f]">
                  Instructor
                  <select
                    required
                    value={form.instructor}
                    onChange={(event) =>
                      setField("instructor", event.target.value)
                    }
                    className="mt-1.5 min-h-10 w-full rounded-xl border border-[#d9d4c7] px-3 font-normal"
                  >
                    {instructors
                      .filter((item) => item.name !== "Instructor unavailable")
                      .map((item) => (
                        <option key={item.sourceName} value={item.sourceName}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-[#29483f]">
                  Availability
                  <select
                    value={form.isActive ? "active" : "archived"}
                    onChange={(event) =>
                      setField("isActive", event.target.value === "active")
                    }
                    className="mt-1.5 min-h-10 w-full rounded-xl border border-[#d9d4c7] px-3 font-normal"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-[#29483f] sm:col-span-2">
                  Description
                  <textarea
                    rows={3}
                    value={form.description || ""}
                    onChange={(event) =>
                      setField("description", event.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#d9d4c7] p-3 font-normal"
                  />
                </label>
                {listFields.map((field) => (
                  <label
                    key={field}
                    className="block text-sm font-semibold capitalize text-[#29483f]"
                  >
                    {field}
                    <textarea
                      rows={3}
                      value={form[field] || ""}
                      onChange={(event) => setField(field, event.target.value)}
                      placeholder="One item per line"
                      className="mt-1.5 w-full rounded-xl border border-[#d9d4c7] p-3 font-normal"
                    />
                  </label>
                ))}
                {error && (
                  <p
                    role="alert"
                    className="text-sm text-[#9b3d2c] sm:col-span-2"
                  >
                    {error}
                  </p>
                )}
                <div className="flex justify-end gap-3 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setMode(selected ? "view" : "")}
                    className="min-h-10 rounded-lg px-4"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    className="min-h-10 rounded-xl bg-[#173c35] px-4 font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save course"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 rounded-xl bg-[#f7f5ef] p-4 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Code:</strong> {selected.course_code}
                  </p>
                  <p>
                    <strong>Instructor:</strong> {selected.instructor}
                  </p>
                  <p>
                    <strong>Category:</strong> {selected.category}
                  </p>
                  <p>
                    <strong>Duration:</strong> {selected.duration}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {selected.start_date}{" "}
                    {selected.time}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selected.isActive ? "Active" : "Archived"}
                  </p>
                </div>
                <p className="text-sm leading-6">{selected.description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {listFields.map((field) => (
                    <div key={field} className="rounded-xl border p-3">
                      <h3 className="font-semibold capitalize">{field}</h3>
                      <ul className="mt-2 list-inside list-disc text-sm text-[#64756c]">
                        {(selected[field] || []).map((item, index) => (
                          <li key={`${field}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("")}
                    className="min-h-10 rounded-lg px-4"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(selected)}
                    className="min-h-10 rounded-xl bg-[#173c35] px-4 font-semibold text-white"
                  >
                    Edit course
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminCoursesPage;
