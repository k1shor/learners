export default function Sidebar({
  userName,
  setUserName,
  activeTab,
  setActiveTab,
}) {
  const menuItems = [
    { id: "courses", label: " Courses" },
    { id: "tasks", label: " Tasks" },
    { id: "certificates", label: " Certificates" },
    { id: "referrals", label: " Referrals" },
    { id: "payment", label: " Payment" },
  ];

  return (
    <aside className="w-64 bg-slate-100 border-r-2 border-indigo-200 flex flex-col p-4 shrink-0">
      {/* User Profile Section with Dummy Picture */}
      <div className="flex flex-col items-center pb-6 border-b border-indigo-200">
        <div className="w-20 h-20 bg-indigo-300 rounded-full overflow-hidden mb-3 border-2 border-indigo-600 flex items-center justify-center shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-slate-800">{userName}</h3>
        <span className="text-xs text-slate-500 mb-3">Student Account</span>

        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Change name..."
          className="text-xs px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:border-indigo-600 w-full text-center bg-white"
        />
      </div>

      {/* Navigation Menu Buttons */}
      <nav className="flex flex-col gap-2 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === item.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-indigo-900 hover:bg-indigo-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
