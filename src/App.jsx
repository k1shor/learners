import MyRoutes from './MyRoutes'
import './App.css'

const App = () => {
  return (
    <div className="site-layout">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label="E-learners Hub home">
          E-learners Hub
        </a>
        <nav className="header-actions" aria-label="Account">
          <button className="button button-login" type="button">
            Login
          </button>
          <button className="button button-signup" type="button">
            Sign up
          </button>
        </nav>
      </header>
      <main className="site-main">
        <MyRoutes />
      </main>
      <footer className="site-footer" aria-label="Footer">
        @copywrite 2026
      </footer>
    </div>
  )
}

export default App