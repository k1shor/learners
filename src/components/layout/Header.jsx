import { Link } from "react-router-dom";

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <nav
      className="app-header sticky top-0 z-30 border-b shadow-lg shadow-[#173c35]/10"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ef79] focus-visible:ring-offset-2 focus-visible:ring-offset-[#173c35]"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-[#d9ef79] text-[#173c35] shadow-[0_5px_18px_-7px_#d9ef79]">
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"
              />
              <path
                strokeLinecap="round"
                d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            E-LearnersHub
            <span className="ml-2 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c5d7c4] sm:inline">
              Learn with intent
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="hidden max-w-44 truncate text-sm font-semibold text-[#e1e9df] sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#e1e9df] transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ef79]"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#d9ef79] px-4 py-2 text-sm font-bold text-[#173c35] shadow-sm transition hover:bg-[#e6f6a8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ef79] focus-visible:ring-offset-2 focus-visible:ring-offset-[#173c35]"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
