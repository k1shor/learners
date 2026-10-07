import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Courses", to: "/" },
  { label: "Tasks", to: "/tasks" },
  { label: "Certificates", to: "/certificates" },
  { label: "Referrals", to: "/referrals" },
  { label: "Payments", to: "/payments" },
];

const LearnerSidebar = () => {
  return (
    <aside className="w-full border-r border-slate-200 bg-white px-6 py-7 sm:w-60">
      <div
        aria-label="Default user profile image"
        role="img"
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-400"
      >
        <svg
          aria-hidden="true"
          className="h-10 w-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
        </svg>
      </div>
      <nav aria-label="Learner navigation" className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2.5 text-sm ${
                isActive
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default LearnerSidebar;
