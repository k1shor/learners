import { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice('This is a sign-in preview. Authentication is not connected yet.')
  }

  return (
    <section className="mx-4 grid min-h-155 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:mx-auto md:grid-cols-2" aria-labelledby="login-title">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-indigo-700 via-indigo-700 to-violet-800 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
        <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border-36 border-white/10" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/20" aria-hidden="true">L</span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">Welcome back</p>
          <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight tracking-tight lg:text-5xl">Keep your learning moving forward.</h2>
          <p className="mt-5 max-w-sm leading-7 text-indigo-100">Pick up where you left off, check your course progress, and keep building skills that matter.</p>
        </div>
        <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <div className="flex gap-1 text-amber-300" aria-label="Five stars">★★★★★</div>
          <p className="mt-3 text-sm leading-6 text-indigo-50">“A little progress each day adds up to big results.”</p>
          <p className="mt-3 text-xs font-semibold text-indigo-200">Your learning journey, at your pace</p>
        </div>
      </aside>

      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4 md:justify-end">
            <span className="text-sm font-bold tracking-tight text-slate-800 md:hidden">E-Learners Hub</span>
            <p className="text-sm text-slate-500">New here? <Link to="/signin" className="font-semibold text-indigo-700 hover:text-indigo-900">Create an account</Link></p>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Learner sign in</p>
          <h1 id="login-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to access your learning dashboard.</p>

          {notice && <p role="status" className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</p>}

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