import React, { useState } from 'react'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const authButtons = isLoggedIn ? (
    <div className="flex items-center gap-2">
      <button className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition sm:px-4">
        My Courses
      </button>
      <button
        onClick={() => setIsLoggedIn(false)}
        className="px-3 py-2 text-sm rounded-md border border-gray-300 text-slate-700 font-medium hover:bg-gray-100 transition sm:px-4"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsLoggedIn(true)}
        className="px-3 py-2 text-sm rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition sm:px-4"
      >
        Login
      </button>
      <button
        onClick={() => setIsLoggedIn(true)}
        className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition sm:px-4"
      >
        Sign Up
      </button>
    </div>
  )

  return (
    <header className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between p-4 gap-3 sm:gap-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-7 w-7 shrink-0"
            alt="Flowbite Logo"
          />
          <span className="self-center text-lg sm:text-xl font-semibold whitespace-nowrap text-slate-800">
            E-lernersHUB
          </span>
        </a>

        <div className="hidden md:block">
          {authButtons}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center p-2 w-10 h-10 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>
      </nav>

      <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex justify-end">{authButtons}</div>
      </div>
    </header>
  )
}

export default Header