import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/useAuth'

const roleHomeMap = {
  student: '/student-dashboard',
  teacher: '/teacher-dashboard',
  admin: '/admin-dashboard',
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState('student')
  const [notice, setNotice] = useState('')
  const { user, isAuthenticated, registerNewUser } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated && user) {
    return <Navigate to={roleHomeMap[user.role] ?? '/'} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirm-password') ?? '')

    if (password !== confirmPassword) {
      setNotice('Your passwords do not match. Please check and try again.')
      return
    }

    const result = registerNewUser({
      name,
      email,
      password,
      role: accountType,
    })

    if (!result.success) {
      setNotice(result.message)
      return
    }

    setNotice(`Account created successfully. Welcome, ${name}!`)
    navigate(roleHomeMap[accountType] ?? '/', { replace: true })
  }

  return (
    <section className="mx-4 grid min-h-170 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:mx-auto md:grid-cols-2" aria-labelledby="signup-title">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-violet-950 via-violet-800 to-indigo-700 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
        <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border-32 border-white/5" aria-hidden="true" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" aria-hidden="true" />
        <div className="absolute right-10 top-1/3 h-40 w-40 rounded-full bg-fuchsia-300/10 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-violet-800">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-lg shadow-violet-950/20" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-5 9 5-9 5-9-5Z" />
                <path d="M7 11.2V16c2.8 2.4 7.2 2.4 10 0v-4.8M21 9v6" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">Learners<span className="text-violet-200">Hub</span></span>
          </Link>
          <p className="mt-14 text-xs font-bold uppercase tracking-[0.22em] text-violet-200">Start something great</p>
          <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight tracking-tight lg:text-5xl">Turn your curiosity into new skills.</h2>
          <p className="mt-5 max-w-sm leading-7 text-violet-100">Create your profile and bring your courses, assignments, and achievements together in one place.</p>
        </div>
        <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl shadow-violet-950/10 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">A path that moves with you</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[['01', 'Learn'], ['02', 'Practice'], ['03', 'Grow']].map(([number, label]) => (
              <div key={number} className="rounded-xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-bold text-violet-200">{number}</p>
                <p className="mt-2 text-sm font-semibold text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mb-7 flex items-center justify-between gap-4 md:justify-end">
            <Link to="/" className="text-sm font-bold tracking-tight text-slate-800 md:hidden">Learners<span className="text-indigo-600">Hub</span></Link>
            <p className="text-sm text-slate-500">Already a learner? <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-900">Sign in</Link></p>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Create your profile</p>
          <h1 id="signup-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Join the learning hub</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">A few details are all you need to get started.</p>

          {notice && <p role="status" className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700">
              Full name
              <input id="signup-name" name="name" type="text" autoComplete="name" required placeholder="Your name" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            </label>

            <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700">
              Email address
              <input id="signup-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            </label>

            <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-700">
              Password
              <span className="relative mt-1.5 block">
                <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-20 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 my-auto h-fit rounded px-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
              <span className="mt-1 block text-xs font-normal text-slate-400">Use at least 8 characters.</span>
            </label>

            <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-slate-700">
              Re-enter password
              <input id="signup-confirm-password" name="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="Type your password again" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            </label>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-700">I am joining as a</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', title: 'Student', detail: 'Learn and complete courses' },
                  { value: 'teacher', title: 'Teacher', detail: 'Teach and guide learners' },
                ].map((role) => (
                  <label key={role.value} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${accountType === role.value ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="account-type" value={role.value} checked={accountType === role.value} onChange={() => setAccountType(role.value)} className="mt-1 h-4 w-4 shrink-0 accent-indigo-600" />
                    <span><span className="block text-sm font-semibold text-slate-800">{role.title}</span><span className="mt-0.5 block text-xs leading-4 text-slate-500">{role.detail}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex items-start gap-2.5 text-xs leading-5 text-slate-500">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500" />
              <span>I agree to the terms of use and understand this is a UI preview.</span>
            </label>

            <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              Create account <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">No account is created yet. Authentication can be connected later.</p>
        </div>
      </div>
    </section>
  )
}

export default SignIn