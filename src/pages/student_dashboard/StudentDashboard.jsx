import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const stats = [
  { label: 'Enrolled courses', value: '06', tone: 'bg-indigo-50 text-indigo-700' },
  { label: 'Completed', value: '03', tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'This week', value: '04 tasks', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Certificates', value: '02', tone: 'bg-violet-50 text-violet-700' },
]

const upcomingCourses = [
  { name: 'React Fundamentals', date: 'Wed, 09:00 AM', status: 'Ongoing' },
  { name: 'Data Visualization', date: 'Thu, 02:30 PM', status: 'Upcoming' },
  { name: 'UI Design Lab', date: 'Fri, 11:15 AM', status: 'Upcoming' },
]

const StudentDashboard = () => {
  const { user } = useAuth()

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Student dashboard
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="mt-2 text-slate-500">
              Your learning progress is on track. Here’s a quick overview of your current goals.
            </p>
          </div>
          <Link
            to="/student-dashboard/courses"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Browse courses
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
              {label}
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Upcoming sessions</h2>
            <Link to="/student-dashboard/tasks" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
              View tasks
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingCourses.map(({ name, date, status }) => (
              <div key={name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{name}</p>
                  <p className="mt-1 text-sm text-slate-500">{date}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    status === 'Ongoing'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="mt-5 space-y-3">
            <Link to="/student-dashboard/courses" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
              Continue learning
            </Link>
            <Link to="/student-dashboard/payment" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
              View payment details
            </Link>
            <Link to="/student-dashboard/certification" className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
              Check certificates
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentDashboard
