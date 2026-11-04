const classes = [
  { name: 'Frontend Development · Cohort A', course: 'Introduction to Web Development', schedule: 'Mon, Wed, Fri · 9:00 AM', room: 'Virtual room 1', students: 18, status: 'In progress' },
  { name: 'JavaScript Essentials · Evening', course: 'JavaScript Essentials', schedule: 'Tue, Thu · 6:30 PM', room: 'Room 204', students: 14, status: 'In progress' },
  { name: 'UI Design · Cohort B', course: 'UI Design Fundamentals', schedule: 'Sat · 10:00 AM', room: 'Design lab', students: 18, status: 'Upcoming' },
]

const TeacherClasses = () => (
  <section className="mx-auto max-w-7xl space-y-7" aria-labelledby="teacher-classes-title">
    <header>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teaching / Classes</p>
      <h1 id="teacher-classes-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My classes</h1>
      <p className="mt-2 text-slate-500">Review class rosters, locations, and upcoming sessions.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['3', 'Assigned classes'], ['2', 'In progress'], ['50', 'Total learners']].map(([value, label]) => (
        <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value}</p></article>
      ))}
    </div>
    <div className="space-y-3">
      {classes.map((classItem) => (
        <article key={classItem.name} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{classItem.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classItem.status === 'In progress' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{classItem.status}</span></div><p className="mt-1 text-sm text-slate-500">{classItem.course}</p></div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:min-w-72"><p><span className="text-slate-400">Schedule</span><span className="mt-0.5 block font-medium text-slate-700">{classItem.schedule}</span></p><p><span className="text-slate-400">Room · learners</span><span className="mt-0.5 block font-medium text-slate-700">{classItem.room} · {classItem.students}</span></p></div>
        </article>
      ))}
    </div>
  </section>
)

export default TeacherClasses
