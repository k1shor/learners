const navigationItems = [
  { label: "Courses", active: true },
  { label: "Tasks" },
  { label: "Certificates" },
  { label: "Referrals" },
  { label: "Payments" },
];

const Homepage = () => {
  return (
    <div className="flex min-h-[calc(100vh-68px)] bg-white">
      <aside className="w-full border-r border-slate-200 bg-white px-6 py-7 sm:w-60">
        <div
          aria-label="Profile placeholder"
          className="mx-auto mb-8 h-20 w-20 rounded-full border border-slate-300 bg-slate-50"
        />
        <nav aria-label="Learner navigation" className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? "page" : undefined}
              className={`block rounded-md px-3 py-2.5 text-sm ${
                item.active
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1" aria-label="Page content" />
    </div>
  );
};

export default Homepage;
