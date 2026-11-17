import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../context/useAuth'

const Header = ({ studentMode = false }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const authButtons = studentMode || isAuthenticated ? (
    <div className="flex items-center gap-2">
      {user && (
        <span className="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:inline-flex">
          {user.name}
        </span>
      )}
      {user?.role === 'student' && (
        <Link
          to="/student-dashboard/courses"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-4"
        >
          My Courses
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-100 sm:px-4"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="px-3 py-2 text-sm rounded-md border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition sm:px-4"
      >
        Login
      </Link>
      <Link
        to="/signin"
        className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition sm:px-4"
      >
        Sign Up
      </Link>
    </div>
  )

  return (
    <header className="bg-white fixed w-full z-20 top-0 inset-s-0 border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-3 sm:gap-4">
        <Link to={studentMode ? '/student-dashboard' : '/'} className="flex min-w-0 items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-7 w-7 shrink-0"
            alt="Flowbite Logo"
          />
          <span className="self-center text-lg sm:text-xl font-semibold whitespace-nowrap text-slate-800">
            E-lernersHUB
          </span>
        </Link>

        <div className="hidden md:block">
          {authButtons}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="inline-flex items-center justify-center p-2 w-10 h-10 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
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

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex justify-end">{authButtons}</div>
        </div>
      )}
    </header>
  )
}

export default Header