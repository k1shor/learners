const courses = [
  { name: 'Introduction to Web Development', category: 'Development', students: 32, progress: 68, color: 'bg-indigo-500' },
  { name: 'JavaScript Essentials', category: 'Development', students: 24, progress: 42, color: 'bg-amber-500' },
  { name: 'UI Design Fundamentals', category: 'Design', students: 18, progress: 84, color: 'bg-emerald-500' },
]

const TeacherCourses = () => (
  <section className="mx-auto max-w-7xl space-y-7" aria-labelledby="teacher-courses-title">
    <header>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teaching / Courses</p>
      <h1 id="teacher-courses-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My courses</h1>
      <p className="mt-2 text-slate-500">Manage your course content and keep track of learner progress.</p>
    </header>
    <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
      {courses.map((course) => (
        <article key={course.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className={`h-2 ${course.color}`} />
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{course.category}</p><h2 className="mt-2 text-lg font-bold text-slate-900">{course.name}</h2></div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Active</span>
            </div>
            <div className="mt-6 flex justify-between text-sm"><span className="text-slate-500">Course completion</span><span className="font-bold text-slate-800">{course.progress}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} /></div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500"><span className="font-semibold text-slate-800">{course.students}</span> enrolled students</p>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export default TeacherCourses
