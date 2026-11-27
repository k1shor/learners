export default function Sidebar({
  userName,
  setUserName,
  activeTab,
  setActiveTab,
}) {
  const menuItems = [
    { id: "courses", label: "All Courses", icon: ["M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z", "M4 5.5v16", "M8 7h8", "M8 11h7"] },
    { id: "myCourses", label: "My Courses", icon: ["M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z", "M4 5.5v16", "M8 7h8", "M8 11h7"] },
    { id: "tasks", label: "Tasks", icon: ["M9 11l2 2 4-4", "M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"] },
    { id: "certificates", label: "Certificates", icon: ["M12 3l2.2 2.2 3.1-.1.8 3 2.6 1.7-1.1 2.9 1.1 2.9-2.6 1.7-.8 3-3.1-.1L12 22l-2.2-2.2-3.1.1-.8-3-2.6-1.7 1.1-2.9-1.1-2.9 2.6-1.7.8-3 3.1.1z", "M9 12l2 2 4-4"] },
    { id: "files", label: "Files", icon: ["M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
    { id: "referrals", label: "Referrals", icon: ["M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M20 8v6", "M17 11h6"] },
    { id: "payment", label: "Payment", icon: ["M3 6h18v13H3z", "M3 10h18", "M7 15h3"] },
  ];

  return (
    <aside className="app-sidebar flex w-full shrink-0 flex-col border-b p-4 md:w-60 md:border-b-0 md:border-r md:p-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 md:flex-col md:pb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-100 md:mb-1 md:h-16 md:w-16 md:text-lg">
          {userName
            .split(/\s+/)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 md:w-full md:flex-none md:text-center">
          <h3 className="truncate text-sm font-bold text-slate-800">{userName}</h3>
          <span className="text-xs text-slate-500">Student account</span>
          <input
            type="text"
            aria-label="Change your display name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Change name..."
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <nav aria-label="Student navigation" className="mt-3 flex gap-1 overflow-x-auto md:mt-6 md:flex-col md:gap-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer md:w-full ${
              activeTab === item.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px] shrink-0"
            >
              {item.icon.map((path) => (
                <path key={path} d={path} />
              ))}
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
