import { NavLink } from 'react-router-dom'

const navigationItems = [
  {
    label: 'Courses',
    to: '/student-dashboard/courses',
    icon: (
      <>
        <path d="M3.75 5.25A1.5 1.5 0 0 1 5.25 3.75h4.5a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-4.5a1.5 1.5 0 0 1-1.5-1.5V5.25Z" />
        <path d="M13.5 5.25a1.5 1.5 0 0 1 1.5-1.5h3.75a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1-1.5-1.5v-3Zm0 8.25A1.5 1.5 0 0 1 15 12h3.75a1.5 1.5 0 0 1 1.5 1.5v4.5a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1-1.5-1.5v-4.5Z" />
      </>
    ),
  },
  {
    label: 'Task',
    to: '/student-dashboard/tasks',
    icon: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V3h6v1m-6 6h6m-6 4h6" />
      </>
    ),
  },
  {
    label: 'Certification',
    to: '/student-dashboard/certification',
    icon: (
      <>
        <path d="M12 3.75 14.55 9l5.7.83-4.13 4.02.98 5.68L12 16.85l-5.1 2.68.98-5.68-4.13-4.02L9.45 9 12 3.75Z" />
        <path d="m9.5 16.25-.75 4 3.25-1.75 3.25 1.75-.75-4" />
      </>
    ),
  },
  {
    label: 'Referral',
    to: '/student-dashboard/referral',
    icon: (
      <>
        <circle cx="9" cy="8" r="3.25" />
        <path d="M3.75 19.5v-1.25A4.25 4.25 0 0 1 8 14h2a4.25 4.25 0 0 1 4.25 4.25v1.25" />
        <path d="M16 5.25a3.25 3.25 0 0 1 0 6.3m2.25 2.7a4.25 4.25 0 0 1 2 3.6v1.65" />
      </>
    ),
  },
  {
    label: 'Payment',
    to: '/student-dashboard/payment',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 9h18m-14 6h3" />
      </>
    ),
  },
]

const profileImageUrl = 'https://imgs.search.brave.com/zJaFBgHaYbUFcjXNr-kWxfICMmU03d3XI_Y1RiJe9kQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjEy/MDc2MjU1Ni9waG90/by9wb3J0cmFpdC1v/Zi1hLW1hbi10YWtp/bmctc2VsZmllLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1o/ODNZZmtrN0xMOV9t/dmpEczFnV1NDVzYx/eUxfdElyLVlteTVI/eV91WEJBPQ'

const Sidebar = () => (
  <aside className="h-full w-full border-r border-slate-200 bg-white px-5 py-8 md:w-64">
    <div className="mb-9 flex flex-col items-center text-center">
      <div
        role={profileImageUrl ? undefined : 'img'}
        aria-label={profileImageUrl ? undefined : 'Blank profile photo'}
        className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 ring-4 ring-indigo-50"
      >
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Learner profile"
            className="h-full w-full rounded-full object-cover"
          />
        )}
      </div>
      <p className="text-sm font-semibold text-slate-800">My Learning</p>
      <p className="mt-1 text-xs text-slate-500">Learner account</p>
    </div>

    <nav aria-label="Learner navigation">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Menu
      </p>
      <ul className="space-y-1.5">
        {navigationItems.map(({ label, to, icon }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {icon}
              </svg>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
)

export default Sidebar