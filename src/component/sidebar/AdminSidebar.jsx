import { NavLink } from 'react-router-dom'

const items = [
  { label: 'Overview', to: '/admin-dashboard', icon: '▦', end: true },
  { label: 'Students', to: '/admin-dashboard/students', icon: '♙' },
  { label: 'Teachers', to: '/admin-dashboard/teachers', icon: '♧' },
  { label: 'Courses', to: '/admin-dashboard/courses', icon: '▤' },
  { label: 'Classes', to: '/admin-dashboard/classes', icon: '▣' },
  { label: 'Payments', to: '/admin-dashboard/payments', icon: '$' },
]

const AdminSidebar = () => (
  <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r md:p-5">
    <div className="mb-5 flex items-center gap-3 px-2 md:mb-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">A</span>
      <div>
        <p className="font-bold text-slate-900">Admin portal</p>
        <p className="text-xs text-slate-500">Learning management</p>
      </div>
    </div>
    <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto md:flex-col">
      {items.map(({ label, to, icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition md:w-full ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <span className="flex h-6 w-6 items-center justify-center text-base" aria-hidden="true">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="mt-8 hidden rounded-2xl bg-slate-50 p-4 md:block">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">Administrator</p>
      <p className="text-xs text-slate-500">admin@learnershub.com</p>
    </div>
  </aside>
)

export default AdminSidebar
