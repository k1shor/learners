export default function Sidebar({ userName = "User" }) {
  return (
    <aside className="w-64 bg-slate-100 border-r-2 border-indigo-200 flex flex-col p-4 shrink-0">
      <div className="flex flex-col items-center pb-6 border-b border-indigo-200">
        <div className="w-20 h-20 bg-indigo-300 rounded-full overflow-hidden mb-3 border-2 border-indigo-600 flex items-center justify-center">
          <img
            src="https://via.placeholder.com/80"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-slate-800">{userName}</h3>
        <span className="text-xs text-slate-500">Student Account</span>
      </div>

      <nav className="flex flex-col gap-2 mt-6">
        <a
          href="#courses"
          className="px-3 py-2 rounded-lg font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
           Courses
        </a>
        <a
          href="#tasks"
          className="px-3 py-2 rounded-lg font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
           Tasks
        </a>
        <a
          href="#certificates"
          className="px-3 py-2 rounded-lg font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
           Certificates
        </a>
        <a
          href="#referrals"
          className="px-3 py-2 rounded-lg font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
           Referrals
        </a>
        <a
          href="#payment"
          className="px-3 py-2 rounded-lg font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
           Payment
        </a>
      </nav>
    </aside>
  );
}
