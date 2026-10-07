export default function Header({
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onMyCourseClick,
}) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-indigo-50 border-b-2 border-indigo-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold rounded-lg shadow-sm">
          E
        </div>
        <span className="font-bold text-lg text-indigo-900">
          E-learners Hub
        </span>
      </div>

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <button
              onClick={onMyCourseClick}
              className="cursor-pointer font-medium text-indigo-700 hover:text-indigo-900 bg-transparent border-none transition-colors"
            >
              My Course
            </button>
            <button
              onClick={onLogoutClick}
              className="px-4 py-1.5 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
            >
              Log out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-1.5 font-medium text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-100 transition-all cursor-pointer bg-white"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="px-4 py-1.5 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
