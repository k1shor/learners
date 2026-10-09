import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import MyRoutes from './MyRoutes'
import './App.css'

const HeaderActions = () => {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <nav className="header-actions" aria-label="Account">
        <Link className="button button-logout" to="/">
          Log out
        </Link>
      </nav>
    )
  }

  return (
    <nav className="header-actions" aria-label="Account">
      <Link className="button button-login" to="/dashboard">
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