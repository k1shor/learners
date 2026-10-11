import { useState } from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState('student')
  const [notice, setNotice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get('password') !== formData.get('confirm-password')) {
      setNotice('Your passwords do not match. Please check and try again.')
      return
    }
    setNotice(`This ${accountType} sign-up is a preview. Account creation is not connected yet.`)
  }

  return (
    <section className="mx-4 grid min-h-170 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:mx-auto md:grid-cols-2" aria-labelledby="signup-title">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-violet-700 via-indigo-700 to-indigo-800 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
        <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border-36 border-white/10" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-300/15 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/20" aria-hidden="true">L</span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">Start learning today</p>
          <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight tracking-tight lg:text-5xl">Make room for what you can become.</h2>
          <p className="mt-5 max-w-sm leading-7 text-indigo-100">Create your learner profile and keep your courses, assignments, and achievements together.</p>
        </div>
        <div className="relative grid grid-cols-3 gap-3">
          {[['01', 'Learn'], ['02', 'Practice'], ['03', 'Grow']].map(([number, label]) => (
            <div key={number} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold text-indigo-200">{number}</p>
              <p className="mt-2 text-sm font-semibold text-white">{label}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mb-7 flex items-center justify-between gap-4 md:justify-end">
            <span className="text-sm font-bold tracking-tight text-slate-800 md:hidden">E-Learners Hub</span>
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