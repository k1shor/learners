const Header = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <nav
      className="relative z-20 flex min-h-[68px] border-b border-slate-800 bg-slate-900 px-4 py-2 md:px-8"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
        <a
          href="#"
          className="min-w-9 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <span className="sr-only">E-LearnersHub</span>
          <h1 className="font-bold text-white">E-LearnersHub</h1>
        </a>

        <div
          id="collapseMenu"
          tabindex="-1"
          className="hidden outline-none max-lg:fixed max-lg:right-0 max-lg:top-0 max-lg:z-50 max-lg:h-full max-lg:w-1/2 max-lg:overflow-auto max-lg:border-l max-lg:border-slate-700 max-lg:bg-slate-900 max-lg:shadow-md max-sm:w-full lg:block"
        >
          <div className="sticky top-0 flex items-center justify-between border-b b
          order-slate-700 bg-slate-900 px-4 py-2 max-lg:min-h-[68px] lg:hidden">
            <a
              href="#"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <span className="text-base font-bold text-white">
                E-LearnersHub
              </span>
            </a>
            <button
              type="button"
              aria-controls="collapseMenu"
              id="toggleClose"
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <span className="sr-only">Close main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 fill-slate-50"
                aria-hidden="true"
                viewBox="0 0 329.269 329"
              >
                <path
                  d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"
                  data-original="#000000"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded text-sm font-semibold text-white hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="rounded text-sm font-semibold text-white hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Log in
            </button>
          )}
          <a
            href="#"
            className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Sign up
          </a>

          <button
            type="button"
            aria-controls="collapseMenu"
            aria-expanded="false"
            aria-haspopup="true"
            id="toggleOpen"
            className="cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-7 fill-slate-900 dark:fill-slate-50"
              aria-hidden="true"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
