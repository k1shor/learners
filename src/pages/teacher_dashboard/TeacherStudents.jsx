const students = [
  { initials: 'JM', name: 'Jordan Miller', email: 'jordan.miller@example.com', course: 'Web Development', progress: 82, status: 'On track', color: 'bg-indigo-100 text-indigo-700' },
  { initials: 'SK', name: 'Samira Khan', email: 'samira.khan@example.com', course: 'JavaScript Essentials', progress: 64, status: 'On track', color: 'bg-rose-100 text-rose-700' },
  { initials: 'LT', name: 'Leo Thomas', email: 'leo.thomas@example.com', course: 'UI Design Fundamentals', progress: 38, status: 'Needs support', color: 'bg-amber-100 text-amber-700' },
  { initials: 'AP', name: 'Avery Parker', email: 'avery.parker@example.com', course: 'Web Development', progress: 91, status: 'On track', color: 'bg-emerald-100 text-emerald-700' },
  { initials: 'RC', name: 'Riley Chen', email: 'riley.chen@example.com', course: 'JavaScript Essentials', progress: 56, status: 'On track', color: 'bg-violet-100 text-violet-700' },
]

const TeacherStudents = () => (
  <section className="mx-auto max-w-7xl space-y-7" aria-labelledby="teacher-students-title">
    <header>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Teaching / Students</p>
      <h1 id="teacher-students-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My students</h1>
      <p className="mt-2 text-slate-500">Check learner progress and identify who may need extra help.</p>
    </header>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Student roster">
      <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4 font-semibold">Student</th><th className="px-5 py-4 font-semibold">Course</th><th className="px-5 py-4 font-semibold">Progress</th><th className="px-5 py-4 font-semibold">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{students.map((student) => (
          <tr key={student.email} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${student.color}`}>{student.initials}</span><span><span className="block font-semibold text-slate-900">{student.name}</span><span className="mt-0.5 block text-xs text-slate-500">{student.email}</span></span></div></td><td className="px-5 py-4 text-slate-600">{student.course}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${student.progress}%` }} /></div><span className="font-medium text-slate-700">{student.progress}%</span></div></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${student.status === 'On track' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{student.status}</span></td></tr>
        ))}</tbody>
      </table></div>
      <footer className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {students.length} students from your active courses</footer>
    </section>
  </section>
)

export default TeacherStudents
