import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { demoUsers } from '../../../context/demoUsers'
import { useAuth } from '../../../context/useAuth'

const roleHomeMap = {
  student: '/student-dashboard',
  teacher: '/teacher-dashboard',
  admin: '/admin-dashboard',
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const { user, isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated && user) {
    return <Navigate to={roleHomeMap[user.role] ?? '/'} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    const result = login({ email, password })

    if (!result.success) {
      setNotice(result.message)
      return
    }

    navigate(roleHomeMap[result.user.role] ?? '/', { replace: true })
  }

  return (
    <section className="mx-4 grid min-h-155 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:mx-auto md:grid-cols-2" aria-labelledby="login-title">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-indigo-950 via-indigo-800 to-violet-700 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
        <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border-32 border-white/5" aria-hidden="true" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" aria-hidden="true" />
        <div className="absolute right-10 top-1/3 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-indigo-800">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-lg shadow-indigo-950/20" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-5 9 5-9 5-9-5Z" />
                <path d="M7 11.2V16c2.8 2.4 7.2 2.4 10 0v-4.8M21 9v6" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">Learners<span className="text-indigo-200">Hub</span></span>
          </Link>
          <p className="mt-14 text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">Your learning space</p>
          <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight tracking-tight lg:text-5xl">Make today a good day to learn.</h2>
          <p className="mt-5 max-w-sm leading-7 text-indigo-100">Pick up where you left off, track your progress, and keep building skills that move you forward.</p>
        </div>
        <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl shadow-indigo-950/10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Your next chapter</p>
              <p className="mt-2 text-base font-semibold text-white">Small steps. Real progress.</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300/15 text-lg text-emerald-200" aria-hidden="true">↗</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15" aria-label="Learning progress preview">
            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-cyan-300 to-emerald-300" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-indigo-100">
            <span>Keep your momentum going</span>
            <span>One lesson at a time</span>
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4 md:justify-end">
            <Link to="/" className="text-sm font-bold tracking-tight text-slate-800 md:hidden">Learners<span className="text-indigo-600">Hub</span></Link>
            <p className="text-sm text-slate-500">New here? <Link to="/signin" className="font-semibold text-indigo-700 hover:text-indigo-900">Create an account</Link></p>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Learner sign in</p>
          <h1 id="login-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to access your learning dashboard.</p>

          {notice && <p role="status" className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</p>}

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Demo accounts</p>
            <ul className="mt-2 space-y-1">
              {Object.values(demoUsers).map((demoUser) => (
                <li key={demoUser.role}>
                  <span className="font-medium capitalize text-slate-800">{demoUser.role}:</span> {demoUser.email} / {demoUser.password}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700">
              Email address
              <input id="login-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            </label>

            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">
              Password
              <span className="relative mt-2 block">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-20 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 my-auto h-fit rounded px-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <button type="button" onClick={() => setNotice('Password reset will be available when authentication is connected.')} className="font-semibold text-indigo-700 hover:text-indigo-900">Forgot password?</button>
            </div>

            <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              Sign in <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </button>
          </form>

          <p className="mt-8 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">By continuing, you agree to use your learner account responsibly.</p>
        </div>
      </div>
    </section>
  )
}

export default Login