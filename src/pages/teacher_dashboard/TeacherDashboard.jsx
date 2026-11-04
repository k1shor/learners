import { Link } from 'react-router-dom'

const stats = [
  { label: 'Active courses', value: '3', note: 'Across 3 subjects', icon: '▤', tone: 'bg-indigo-50 text-indigo-700' },
  { label: 'My students', value: '74', note: 'Across all classes', icon: '♙', tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'To review', value: '23', note: 'Assignment submissions', icon: '✓', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Teaching hours', value: '18.5', note: 'This week', icon: '◷', tone: 'bg-violet-50 text-violet-700' },
]

const upcomingClasses = [
  { time: '09:00 AM', title: 'Frontend Development', detail: 'Cohort A · Virtual room 1', color: 'bg-indigo-500' },
  { time: '02:00 PM', title: 'JavaScript Essentials', detail: 'Evening class · Room 204', color: 'bg-amber-500' },
  { time: '04:00 PM', title: 'Student office hours', detail: 'Open Q&A · Online', color: 'bg-emerald-500' },
]

const TeacherDashboard = () => (
  <section className="mx-auto max-w-7xl space-y-8" aria-labelledby="teacher-title">
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teacher workspace</p>
        <h1 id="teacher-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Good morning, Alex <span aria-hidden="true">☀️</span></h1>
        <p className="mt-2 text-slate-500">Here’s what’s happening with your classes today.</p>
      </div>
      <Link to="schedule" className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">View today's schedule</Link>
    </header>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.tone}`} aria-hidden="true">{stat.icon}</span></div>
          <p className="mt-3 text-xs text-slate-500">{stat.note}</p>
        </article>
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="today-classes-title">
        <div className="mb-5 flex items-center justify-between gap-4"><div><h2 id="today-classes-title" className="text-lg font-bold text-slate-900">Today's schedule</h2><p className="mt-1 text-sm text-slate-500">Wednesday, November 4</p></div><Link to="schedule" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Full schedule →</Link></div>
        <div className="space-y-4">{upcomingClasses.map((classItem) => <article key={classItem.time} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"><span className="w-20 shrink-0 text-xs font-bold text-slate-500">{classItem.time}</span><span className={`h-10 w-1 shrink-0 rounded-full ${classItem.color}`} aria-hidden="true"/><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-900">{classItem.title}</h3><p className="mt-1 text-xs text-slate-500">{classItem.detail}</p></div></article>)}</div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="attention-title">
        <div className="mb-5"><h2 id="attention-title" className="text-lg font-bold text-slate-900">Needs your attention</h2><p className="mt-1 text-sm text-slate-500">A few things to follow up on.</p></div>
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl bg-amber-50 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600" aria-hidden="true">!</span><div><p className="text-sm font-semibold text-slate-900">23 assignments to review</p><p className="mt-1 text-xs text-slate-600">Most are from your web development class.</p></div></div>
          <div className="flex gap-3 rounded-xl bg-indigo-50 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600" aria-hidden="true">♙</span><div><p className="text-sm font-semibold text-slate-900">3 students may need support</p><p className="mt-1 text-xs text-slate-600">Check their recent course progress.</p></div></div>
        </div>
        <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4"><Link to="assignments" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Review assignments →</Link><Link to="students" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View students →</Link></div>
      </section>
    </div>

    <section aria-labelledby="quick-links-title"><div className="mb-4"><h2 id="quick-links-title" className="text-lg font-bold text-slate-900">Your teaching space</h2><p className="mt-1 text-sm text-slate-500">Jump back into a section.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[{ to: 'courses', name: 'My courses', detail: 'Update lessons and monitor course progress', icon: '▤' }, { to: 'classes', name: 'My classes', detail: 'See class rosters and upcoming sessions', icon: '▣' }, { to: 'students', name: 'Students', detail: 'Review learner progress and engagement', icon: '♙' }].map((item) => <Link key={item.to} to={item.to} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700" aria-hidden="true">{item.icon}</span><span className="min-w-0 flex-1"><span className="block font-bold text-slate-900">{item.name}</span><span className="mt-1 block text-sm text-slate-500">{item.detail}</span></span><span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" aria-hidden="true">→</span></Link>)}</div></section>
  </section>
)

export default TeacherDashboard
