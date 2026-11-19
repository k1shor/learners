import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <section className="mx-auto grid min-h-[68vh] max-w-7xl items-center gap-10 overflow-hidden px-6 py-6 sm:gap-12 sm:px-8 sm:py-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Make room to grow
        </span>
        <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Small steps.
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Big possibilities.
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
          Pick up a new skill, explore a topic you love, and learn at a pace that works for you.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/signin"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Start learning
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            I have an account
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-500">Your learning journey starts with one click.</p>
      </div>

      <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-6 lg:py-0" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-200/70 via-violet-200/60 to-cyan-100 blur-3xl" />
        <div className="absolute right-8 top-2 h-20 w-20 rotate-12 rounded-3xl border border-white/80 bg-white/60 shadow-sm" />
        <div className="absolute bottom-3 left-3 h-16 w-16 rounded-full border border-white/80 bg-white/60 shadow-sm" />
        <div className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Your learning space</p>
              <p className="mt-1 text-xs text-slate-500">A little progress adds up</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg">✦</div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-5 text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">YOUR NEXT CHAPTER</span>
              <span className="text-lg" aria-hidden="true">✧</span>
            </div>
            <p className="mt-8 text-2xl font-bold">Curiosity looks good on you.</p>
            <p className="mt-2 text-sm text-blue-100">Find a course and see where it takes you.</p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-10 rounded-full bg-white" />
              <span className="h-1.5 w-5 rounded-full bg-white/45" />
              <span className="h-1.5 w-5 rounded-full bg-white/45" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">✳</div>
              <p className="mt-3 text-sm font-semibold text-slate-800">Learn your way</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Go at your own pace</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">↗</div>
              <p className="mt-3 text-sm font-semibold text-slate-800">Keep growing</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">One step at a time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Homepage
