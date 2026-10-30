import { Link } from 'react-router-dom'
import useAdminData from './useAdminData'

const shortcuts = [
  { key: 'students', title: 'Students', detail: 'Learner accounts and enrollment', icon: '♙' },
  { key: 'teachers', title: 'Teachers', detail: 'Instructor accounts and subjects', icon: '♧' },
  { key: 'courses', title: 'Courses', detail: 'Course catalog and publishing', icon: '▤' },
  { key: 'classes', title: 'Classes', detail: 'Class schedules and rooms', icon: '▣' },
]

const AdminDashboard = () => {
  const [data] = useAdminData()
  const paidTotal = data.payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((sum, payment) => sum + Number(payment.amount.replace(/[^\d.]/g, '')), 0)

  const stats = [
    { label: 'Total students', value: data.students.length, note: `${data.students.filter((item) => item.status === 'Active').length} active accounts`, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Instructors', value: data.teachers.length, note: `${data.teachers.filter((item) => item.status === 'Active').length} active accounts`, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Courses', value: data.courses.length, note: `${data.courses.filter((item) => item.status === 'Published').length} published`, color: 'bg-amber-50 text-amber-700' },
    { label: 'Paid revenue', value: `$${paidTotal.toLocaleString()}`, note: `${data.payments.length} payment records`, color: 'bg-violet-50 text-violet-700' },
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-8" aria-labelledby="admin-title">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Administration</p>
          <h1 id="admin-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Dashboard overview</h1>
          <p className="mt-2 text-slate-500">Welcome to the admin dashboard. Choose a section to get started.</p>
        </div>
        <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Workspace active</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p></div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.color}`} aria-hidden="true">↗</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{stat.note}</p>
          </article>
        ))}
      </div>

      <section aria-labelledby="management-title">
        <div className="mb-4">
          <h2 id="management-title" className="text-xl font-bold text-slate-900">Dashboard sections</h2>
          <p className="mt-1 text-sm text-slate-500">Open a section to manage your learning platform.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {shortcuts.map((item) => (
            <Link key={item.key} to={item.key} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-700" aria-hidden="true">{item.icon}</span>
              <span className="min-w-0 flex-1"><span className="block font-bold text-slate-900">{item.title}</span><span className="mt-1 block text-sm text-slate-500">{item.detail}</span></span>
              <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" aria-hidden="true">→</span>
            </Link>
          ))}
          <Link to="payments" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-700" aria-hidden="true">$</span>
            <span className="min-w-0 flex-1"><span className="block font-bold text-slate-900">Payments</span><span className="mt-1 block text-sm text-slate-500">Payment records and billing</span></span>
            <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
