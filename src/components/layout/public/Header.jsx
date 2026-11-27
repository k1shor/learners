export default function Header({
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onMyCourseClick,
}) {
  return (
    <header className="app-topbar relative z-10 flex items-center justify-between border-b px-5 py-3.5 sm:px-8">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-bold text-white shadow-md shadow-indigo-200">
          E
        </div>
        <div>
          <span className="block font-bold tracking-tight text-slate-900">
            E-learners Hub
          </span>
          <span className="hidden text-[11px] font-medium tracking-wide text-slate-500 sm:block">
            LEARN SOMETHING GREAT
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={onMyCourseClick}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
            >
              My Course
            </button>
            <button
              onClick={onLogoutClick}
              className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              Log out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLoginClick}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
