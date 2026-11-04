const assignments = [
  { title: 'Build a responsive landing page', course: 'Web Development', due: 'Today · 11:59 PM', submitted: 23, total: 32, status: 'Review needed' },
  { title: 'JavaScript array methods', course: 'JavaScript Essentials', due: 'Tomorrow · 11:59 PM', submitted: 16, total: 24, status: 'In progress' },
  { title: 'Mobile app wireframes', course: 'UI Design Fundamentals', due: 'Nov 8 · 11:59 PM', submitted: 10, total: 18, status: 'In progress' },
]

const TeacherAssignments = () => (
  <section className="mx-auto max-w-7xl space-y-7" aria-labelledby="teacher-assignments-title">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teaching / Assignments</p><h1 id="teacher-assignments-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Assignments</h1><p className="mt-2 text-slate-500">Track submissions and review work across your courses.</p></div><button type="button" className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">+ Create assignment</button></header>
    <div className="grid gap-4 sm:grid-cols-3">{[['3', 'Active assignments'], ['49', 'Submissions'], ['23', 'Awaiting review']].map(([value, label]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value}</p></article>)}</div>
    <div className="space-y-3">{assignments.map((assignment) => <article key={assignment.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{assignment.course}</span><h2 className="mt-1 text-lg font-bold text-slate-900">{assignment.title}</h2><p className="mt-2 text-sm text-slate-500">Due {assignment.due}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${assignment.status === 'Review needed' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{assignment.status}</span></div><div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }} /></div><span className="whitespace-nowrap text-sm font-semibold text-slate-700">{assignment.submitted} / {assignment.total} submitted</span></div></article>)}</div>
  </section>
)

export default TeacherAssignments
