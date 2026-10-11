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
    <aside className="app-sidebar w-full shrink-0 border-b px-4 py-4 sm:w-60 sm:border-b-0 sm:border-r sm:px-5 sm:py-7">
      <div
        aria-label="Aarav Shrestha profile picture"
        role="img"
        className="mb-4 flex items-center gap-3 sm:mb-8 sm:flex-col sm:gap-3"
      >
        <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#c9d8ae] bg-[#d9ef79] text-sm font-extrabold text-[#173c35] shadow-sm sm:size-[68px] sm:rounded-[22px]">
          AS
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aarav%20Shrestha&skinColor=ae5d29,c68642,edb98a&backgroundColor=b6e3f4,c0aede,d1d4f9"
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            className="absolute inset-0 size-full object-cover"
          />
        </span>
        <span className="sm:text-center">
          <span className="block text-sm font-bold text-[#203832]">
            Aarav Shrestha
          </span>
          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#78877b]">
            Learner profile
          </span>
        </span>
      </div>
      <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a968d] sm:block">
        Workspace
      </p>
      <nav
        aria-label="Learner navigation"
        className="flex flex-wrap gap-2 sm:block sm:space-y-1"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition sm:flex ${
                isActive
                  ? "bg-[#173c35] font-semibold text-[#fffefa] shadow-sm"
                  : "text-[#53685e] hover:bg-[#fffefa] hover:text-[#173c35]"
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
