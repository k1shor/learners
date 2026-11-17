import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import ProfileAvatar from '../../components/ProfileAvatar'

const items = [
  { label: 'Overview', to: '/teacher-dashboard', icon: '▦', end: true },
  { label: 'My courses', to: '/teacher-dashboard/courses', icon: '▤' },
  { label: 'My classes', to: '/teacher-dashboard/classes', icon: '▣' },
  { label: 'Students', to: '/teacher-dashboard/students', icon: '♙' },
  { label: 'Assignments', to: '/teacher-dashboard/assignments', icon: '✓' },
  { label: 'Schedule', to: '/teacher-dashboard/schedule', icon: '◷' },
]

const TeacherSidebar = () => {
  const { user } = useAuth()

  return (
  <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r md:p-5">
    <div className="mb-5 flex items-center gap-3 px-2 md:mb-8">
      <ProfileAvatar name={user?.name || 'Teacher'} role="teacher" />
      <div>
        <p className="font-bold text-slate-900">Teacher portal</p>
        <p className="text-xs text-slate-500">Learning management</p>
      </div>
    </div>
    <nav aria-label="Teacher navigation" className="flex gap-2 overflow-x-auto md:flex-col">
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
      <div className="mt-3 flex items-center gap-3">
        <ProfileAvatar name={user?.name || 'Teacher'} role="teacher" size="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'Teacher'}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
    </div>
  </aside>
  )
}

export default TeacherSidebar
