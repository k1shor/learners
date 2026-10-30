import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import MyRoutes from './MyRoutes'
import './App.css'

const HeaderActions = () => {
  const location = useLocation()
  const isDashboard =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/courses/')

  if (isDashboard) {
    return (
      <nav className="header-actions" aria-label="Account">
        <Link className="button button-logout" to="/">
          <svg className="button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M14 17l5-5-5-5M19 12H9" />
            <path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
          </svg>
          Log out
        </Link>
      </nav>
    )
  }

  return (
    <nav className="header-actions" aria-label="Account">
      <Link className="button button-login" to="/dashboard">
        <svg className="button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M10 17l5-5-5-5M15 12H3" />
          <path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
        </svg>
        Login
      </Link>
      <button className="button button-signup" type="button">
        Sign up
      </button>
    </nav>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <div className="site-layout">
        <header className="site-header">
          <Link className="site-brand" to="/" aria-label="E-learners Hub home">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-name">
              E-learners <strong>Hub</strong>
            </span>
          </Link>
          <HeaderActions />
        </header>
        <main className="site-main">
          <MyRoutes />
        </main>
        <footer className="site-footer" aria-label="Footer">
          <span className="footer-copy">@copywrite 2026</span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App