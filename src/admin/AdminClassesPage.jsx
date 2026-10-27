import { useEffect, useMemo, useState } from "react";

const blankSchedule = {
  courseId: "",
  instructorSourceName: "",
  startDate: "",
  time: "",
  duration: "",
  meetingUrl: "",
  status: "Scheduled",
};

const AdminClassesPage = () => {
  const isLocalDevelopment = import.meta.env.DEV;
  const [adminKey, setAdminKey] = useState("");
  const [authorizedKey, setAuthorizedKey] = useState(
    isLocalDevelopment ? "local-development" : "",
  );
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankSchedule);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isLocalDevelopment);
  const [saving, setSaving] = useState(false);

  const headers = (key = authorizedKey) => ({
    ...(key && key !== "local-development" ? { "x-admin-key": key } : {}),
  });

  useEffect(() => {
    if (!isLocalDevelopment) return undefined;
    let mounted = true;
    Promise.all([
      fetch("/api/admin/classes"),
      fetch("/api/admin/courses"),
      fetch("/api/instructors"),
    ])
      .then(async ([classResponse, courseResponse, instructorResponse]) => {
        const [classResult, courseResult, instructorResult] = await Promise.all(
          [
            classResponse.json().catch(() => ({})),
            courseResponse.json().catch(() => ({})),
            instructorResponse.json().catch(() => ({})),
          ],
        );
        if (!classResponse.ok)
          throw new Error(classResult.error || "Could not load classes.");
        if (mounted) {
          setClasses(classResult.classes);
          setCourses(courseResult.courses || []);
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

  const loadData = async (key) => {
    const [classResponse, courseResponse, instructorResponse] =
      await Promise.all([
        fetch("/api/admin/classes", { headers: headers(key) }),
        fetch("/api/admin/courses", { headers: headers(key) }),
        fetch("/api/instructors"),
      ]);
    const [classResult, courseResult, instructorResult] = await Promise.all([
      classResponse.json().catch(() => ({})),
      courseResponse.json().catch(() => ({})),
      instructorResponse.json().catch(() => ({})),
    ]);
    if (!classResponse.ok)
      throw new Error(classResult.error || "Could not load classes.");
    setClasses(classResult.classes);
    setCourses(courseResult.courses || []);
    setInstructors(instructorResult.instructors || []);
    setError("");
  };

  const visibleClasses = useMemo(() => {
    const term = query.trim().toLowerCase();
    return classes.filter(
      (item) =>
        !term ||
        `${item.courseTitle} ${item.courseCode} ${item.instructor} ${item.startDate}`
          .toLowerCase()
          .includes(term),
    );
  }, [classes, query]);

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

  const openClass = async (item, edit = false) => {
    setError("");
    try {
      const response = await fetch(`/api/admin/classes/${item.id}`, {
        headers: headers(),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Could not load class details.");
      const record = result.class;
      setSelected(record);
      setForm({
        courseId: String(record.courseId),
        instructorSourceName: record.instructorSourceName,
        startDate: record.startDate,
        time: record.time,
        duration: record.duration,
        meetingUrl: record.meetingUrl,
        status: record.status,
      });
      setMode(edit ? "edit" : "view");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startSchedule = () => {
    const firstCourse = courses.find((course) => course.isActive) || courses[0];
    setSelected(null);
    setForm({
      ...blankSchedule,
      courseId: firstCourse ? String(firstCourse.courseId) : "",
      instructorSourceName: instructors[0]?.sourceName || "",
    });
    setError("");
    setMode("edit");
  };

  const saveSchedule = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        selected ? `/api/admin/classes/${selected.id}` : "/api/admin/classes",
        {
          method: selected ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json", ...headers() },
          body: JSON.stringify({ ...form, courseId: Number(form.courseId) }),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Could not save class schedule.");
      setClasses((current) =>
        selected
          ? current.map((item) =>
              item.id === result.class.id ? result.class : item,
            )
          : [...current, result.class],
      );
      setSelected(result.class);
      setMode("view");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  if (!authorizedKey)
    return (
      <section className="mx-auto w-full max-w-xl" aria-label="Admin access">
        <h1 className="text-3xl font-bold text-[#173c35]">Class scheduling</h1>
        <form
          onSubmit={unlock}
          className="app-card mt-6 space-y-4 rounded-2xl border p-6"
        >
          <label
            htmlFor="class-admin-key"
            className="block text-sm font-semibold"
          >
            Admin key
          </label>
          <input
            id="class-admin-key"
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
            {loading ? "Loading…" : "Open class scheduling"}
          </button>
        </form>
      </section>
    );

  return (
    <section
      className="mx-auto w-full max-w-6xl"
      aria-label="Class administration"
    >
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#173c35] sm:text-4xl">
            Classes &amp; schedules
          </h1>
          <p className="mt-2 text-sm text-[#64756c]">
            View class details, schedule new sessions, and update meeting
            information.
          </p>
        </div>
        <button
          type="button"
          onClick={startSchedule}
          className="min-h-11 rounded-xl bg-[#173c35] px-4 font-semibold text-white hover:bg-[#28584a]"
        >
          Schedule class
        </button>
      </header>
      <section
        className="app-card overflow-hidden rounded-2xl border shadow-sm"
        aria-label="All classes"
      >
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">All classes</h2>
            <p className="text-xs text-[#78877b]">
              {visibleClasses.length} scheduled session(s)
            </p>
          </div>
          <input
            aria-label="Search classes"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search course, instructor, date"
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
            Loading classes…
          </p>
        ) : visibleClasses.length === 0 ? (
          <p className="p-8 text-center">No classes scheduled.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f7f5ef] text-xs uppercase text-[#78877b]">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Instructor</th>
                  <th className="px-5 py-3">Date &amp; time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleClasses.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#203832]">
                        {item.courseTitle}
                      </p>
                      <p className="text-xs">{item.courseCode}</p>
                    </td>
                    <td className="px-5 py-4">{item.instructor}</td>
                    <td className="px-5 py-4">
                      {item.startDate} · {item.time}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "Cancelled" ? "bg-[#f8e7e2] text-[#9b3d2c]" : "bg-[#e4efda] text-[#355c4c]"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openClass(item)}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => openClass(item, true)}
                          className="rounded-lg bg-[#173c35] px-3 py-2 text-xs font-semibold text-white"
                        >
                          Update
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
            aria-labelledby="class-modal-title"
            className="my-auto w-full max-w-2xl rounded-2xl border bg-[#fffefa] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#63824d]">
                  Class session
                </p>
                <h2
                  id="class-modal-title"
                  className="mt-1 text-2xl font-bold text-[#173c35]"
                >
                  {mode === "edit"
                    ? selected
                      ? "Update schedule"
                      : "Schedule a class"
                    : selected?.courseTitle}
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
                onSubmit={saveSchedule}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <label className="text-sm font-semibold">
                  Course
                  <select
                    required
                    value={form.courseId}
                    onChange={(event) => {
                      const selectedCourse = courses.find(
                        (course) =>
                          String(course.courseId) === event.target.value,
                      );
                      setForm((current) => ({
                        ...current,
                        courseId: event.target.value,
                        instructorSourceName:
                          instructors.find(
                            (instructor) =>
                              instructor.name === selectedCourse?.instructor,
                          )?.sourceName || current.instructorSourceName,
                      }));
                    }}
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  >
                    {courses
                      .filter((course) => course.isActive)
                      .map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.course_code} · {course.title}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Instructor
                  <select
                    required
                    value={form.instructorSourceName}
                    onChange={(event) =>
                      field("instructorSourceName", event.target.value)
                    }
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  >
                    {instructors.map((instructor) => (
                      <option
                        key={instructor.sourceName}
                        value={instructor.sourceName}
                      >
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Date
                  <input
                    required
                    value={form.startDate}
                    onChange={(event) => field("startDate", event.target.value)}
                    placeholder="e.g. 2026-11-15"
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Time
                  <input
                    required
                    value={form.time}
                    onChange={(event) => field("time", event.target.value)}
                    placeholder="e.g. 6:30 PM"
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Duration
                  <input
                    value={form.duration}
                    onChange={(event) => field("duration", event.target.value)}
                    placeholder="e.g. 1.5 hours"
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => field("status", event.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Meeting URL
                  <input
                    type="url"
                    value={form.meetingUrl}
                    onChange={(event) =>
                      field("meetingUrl", event.target.value)
                    }
                    placeholder="https://…"
                    className="mt-1.5 min-h-11 w-full rounded-xl border px-3 font-normal"
                  />
                </label>
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
                    {saving
                      ? "Saving…"
                      : selected
                        ? "Update schedule"
                        : "Schedule class"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 space-y-4">
                <dl className="grid gap-3 rounded-xl bg-[#f7f5ef] p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#78877b]">Course</dt>
                    <dd className="mt-1 font-semibold">
                      {selected.courseCode} · {selected.courseTitle}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#78877b]">Instructor</dt>
                    <dd className="mt-1 font-semibold">
                      {selected.instructor}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#78877b]">Date &amp; time</dt>
                    <dd className="mt-1 font-semibold">
                      {selected.startDate} · {selected.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#78877b]">Duration/status</dt>
                    <dd className="mt-1 font-semibold">
                      {selected.duration || "Not set"} · {selected.status}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#78877b]">Meeting link</dt>
                    <dd className="mt-1 break-all font-semibold">
                      {selected.meetingUrl || "Not added"}
                    </dd>
                  </div>
                </dl>
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
                    onClick={() => openClass(selected, true)}
                    className="min-h-10 rounded-xl bg-[#173c35] px-4 font-semibold text-white"
                  >
                    Update schedule
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

export default AdminClassesPage;
