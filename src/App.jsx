import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import MyRoutes from './MyRoutes'
import './App.css'

const AUTH_STORAGE_KEY = 'learners-demo-authenticated'
const PROFILE_STORAGE_KEY = 'learners-demo-profile'
const ACCOUNTS_STORAGE_KEY = 'learners-demo-accounts'
const ACTIVE_ACCOUNT_STORAGE_KEY = 'learners-demo-active-account'
const TASK_COMPLETION_STORAGE_KEY = 'learners-demo-task-completions'
const PAYMENT_STORAGE_KEY = 'learners-demo-payments'
const THEME_STORAGE_KEY = 'learners-demo-theme'
const THEMES = ['light', 'warm', 'dark']

const HeaderActions = ({
  isAuthenticated,
  accounts,
  activeAccountId,
  profile,
  onLogin,
  onLogout,
  onSwitchAccount,
  theme,
  onThemeChange,
}) => {
  const { pathname } = useLocation()
  const accountMenuRef = useRef(null)

  useEffect(() => {
    const closeAccountMenu = (event) => {
      const accountMenu = accountMenuRef.current
      if (accountMenu?.open && !accountMenu.contains(event.target)) {
        accountMenu.open = false
      }
    }

    document.addEventListener('click', closeAccountMenu)
    return () => document.removeEventListener('click', closeAccountMenu)
  }, [])

  const logout = () => {
    onLogout()
    window.location.assign('/')
  }

  const profileName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ')
      || profile.username
      || 'Learner account'
    : 'Set up your profile'
  const profileDetail = profile?.username
    ? `@${profile.username}`
    : profile?.email || 'View or edit your profile'

  if (isAuthenticated) {
    return (
      <nav className="header-actions" aria-label="Account">
        {pathname !== '/dashboard' && (
          <Link className="button button-login" to="/dashboard">
            Dashboard
          </Link>
        )}
        <details className="account-menu" ref={accountMenuRef}>
          <summary className="account-menu-trigger" aria-label="More account options" title="More account options">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" aria-hidden="true" focusable="false">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <div className="account-menu-panel">
            <section className="account-profile" aria-label="My profile">
              <Link
                className="account-profile-link"
                onClick={(event) => {
                  event.currentTarget.closest('details').open = false
                }}
                to="/profile"
              >
                <span className="account-profile-avatar" aria-hidden="true">
                  {profileName.charAt(0).toUpperCase()}
                </span>
                <span className="account-profile-copy">
                  <strong>My profile</strong>
                  <span>{profileName}</span>
                  <small>{profileDetail}</small>
                </span>
              </Link>
            </section>
            <section className="account-switcher" aria-labelledby="switch-account-heading">
              <h2 id="switch-account-heading">Switch account</h2>
              {accounts.length > 0 ? (
                <div className="account-list">
                  {accounts.map((account) => {
                    const profile = account.profile
                    const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
                      || profile.username
                      || profile.email
                      || 'Learner account'

                    return (
                      <button
                        key={account.id}
                        className="account-option"
                        disabled={account.id === activeAccountId}
                        onClick={() => onSwitchAccount(account)}
                        type="button"
                      >
                        <span>{name}</span>
                        <small>
                          {account.id === activeAccountId
                            ? 'Current account'
                            : profile.email || profile.username || 'Switch to this account'}
                        </small>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="account-list-empty">No saved accounts yet.</p>
              )}
              <Link
                className="account-add-link"
                onClick={(event) => {
                  event.currentTarget.closest('details').open = false
                }}
                to="/signup"
              >
                Add another account
              </Link>
            </section>
            <label className="theme-control">
              <span>Theme</span>
              <select
                aria-label="Choose page theme"
                onChange={(event) => onThemeChange(event.target.value)}
                value={theme}
              >
                <option value="light">Light</option>
                <option value="warm">Warm</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <button className="button button-logout" type="button" onClick={logout}>
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M14 17l5-5-5-5M19 12H9" />
                <path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
              </svg>
              Log out
            </button>
          </div>
        </details>
      </nav>
    )
  }

  return (
    <nav className="header-actions" aria-label="Account">
      <Link className="button button-login" to="/dashboard" onClick={onLogin}>
        <svg className="button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M10 17l5-5-5-5M15 12H3" />
          <path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
        </svg>
        Login
      </Link>
      <Link className="button button-signup" to="/signup">
        Sign up
      </Link>
    </nav>
  )
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true',
  )
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = window.sessionStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (savedAccounts) return JSON.parse(savedAccounts)

    const savedProfile = window.sessionStorage.getItem(PROFILE_STORAGE_KEY)
    return savedProfile
      ? [{ id: 'legacy', profile: JSON.parse(savedProfile) }]
      : []
  })
  const [activeAccountId, setActiveAccountId] = useState(() =>
    window.sessionStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY)
      || (window.sessionStorage.getItem(PROFILE_STORAGE_KEY) ? 'legacy' : ''),
  )
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(savedTheme) ? savedTheme : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const changeTheme = (nextTheme) => {
    if (!THEMES.includes(nextTheme)) return

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  const login = () => {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(PROFILE_STORAGE_KEY)
    window.sessionStorage.removeItem(ACCOUNTS_STORAGE_KEY)
    window.sessionStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY)
    window.sessionStorage.removeItem(TASK_COMPLETION_STORAGE_KEY)
    window.sessionStorage.removeItem(PAYMENT_STORAGE_KEY)
    setAccounts([])
    setActiveAccountId('')
    setIsAuthenticated(false)
  }

  const signup = (profile) => {
    const account = { id: `account-${accounts.length}`, profile }
    const updatedAccounts = [...accounts, account]

    window.sessionStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts))
    window.sessionStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, account.id)
    window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
    setAccounts(updatedAccounts)
    setActiveAccountId(account.id)
    setIsAuthenticated(true)
  }

  const switchAccount = (account) => {
    window.sessionStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, account.id)
    window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(account.profile))
    window.location.assign('/dashboard')
  }

  const updateProfile = (profile) => {
    let updatedAccounts

    if (accounts.some((account) => account.id === activeAccountId)) {
      updatedAccounts = accounts.map((account) =>
        account.id === activeAccountId ? { ...account, profile } : account,
      )
    } else {
      const accountId = `account-${accounts.length}`
      updatedAccounts = [...accounts, { id: accountId, profile }]
      window.sessionStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, accountId)
      setActiveAccountId(accountId)
    }

    window.sessionStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts))
    window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    setAccounts(updatedAccounts)
  }

  const activeProfile = accounts.find((account) => account.id === activeAccountId)?.profile ?? null

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
          <HeaderActions
            accounts={accounts}
            activeAccountId={activeAccountId}
            isAuthenticated={isAuthenticated}
            profile={activeProfile}
            onLogin={login}
            onLogout={logout}
            onSwitchAccount={switchAccount}
            onThemeChange={changeTheme}
            theme={theme}
          />
        </header>
        <main className="site-main">
          <MyRoutes
            isAuthenticated={isAuthenticated}
            onLogin={login}
            onSignup={signup}
            onUpdateProfile={updateProfile}
            profile={activeProfile}
          />
        </main>
        <footer className="site-footer" aria-label="Footer">
          <span className="footer-copy">@copywrite 2026</span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App