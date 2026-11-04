const schedule = [
  { time: '09:00 AM', period: '9:00 AM – 10:30 AM', title: 'Frontend Development · Cohort A', type: 'Live class', place: 'Virtual room 1', color: 'border-indigo-500 bg-indigo-50' },
  { time: '11:00 AM', period: '11:00 AM – 12:00 PM', title: 'Assignment review & office hours', type: 'Office hours', place: 'Online', color: 'border-emerald-500 bg-emerald-50' },
  { time: '02:00 PM', period: '2:00 PM – 3:30 PM', title: 'JavaScript Essentials · Evening', type: 'Live class', place: 'Room 204', color: 'border-amber-500 bg-amber-50' },
  { time: '04:00 PM', period: '4:00 PM – 4:30 PM', title: 'Course planning', type: 'Planning', place: 'Personal', color: 'border-violet-500 bg-violet-50' },
]

const TeacherSchedule = () => (
  <section className="mx-auto max-w-5xl space-y-7" aria-labelledby="teacher-schedule-title">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teaching / Schedule</p><h1 id="teacher-schedule-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Your schedule</h1><p className="mt-2 text-slate-500">A quick look at today's classes and teaching time.</p></div><span className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Wednesday · November 4</span></header>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Today</p><h2 className="mt-1 text-xl font-bold text-slate-900">Wednesday, November 4</h2></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">4 events</span></div><div className="space-y-5">{schedule.map((event) => <article key={event.time} className="grid gap-3 sm:grid-cols-[100px_1fr]"><p className="pt-4 text-sm font-semibold text-slate-500">{event.time}</p><div className={`rounded-xl border-l-4 p-4 ${event.color}`}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><span className="text-xs font-semibold text-slate-500">{event.period} · {event.type}</span><h3 className="mt-1 font-bold text-slate-900">{event.title}</h3><p className="mt-1 text-sm text-slate-600">{event.place}</p></div></div></div></article>)}</div></div>
  </section>
)

export default TeacherSchedule
