import { Link } from 'react-router-dom'
import './Homepage.css'

const Homepage = () => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-eyebrow">E-LEARNERS HUB</p>
        <h1>Learning starts here.</h1>
        <p className="home-intro">
          Explore your courses or manage the learning hub from a dedicated admin workspace.
        </p>
        <div className="home-actions">
          <Link className="home-action home-action-primary" to="/dashboard">
            Open dashboard <span aria-hidden="true">→</span>
          </Link>
          <Link className="home-action home-action-secondary" to="/admin">
            Open admin <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="home-features" aria-label="Platform areas">
        <article>
          <span className="home-feature-mark learner-mark" aria-hidden="true">L</span>
          <div><h2>Learner dashboard</h2><p>Browse courses, tasks, certificates, and more.</p></div>
        </article>
        <article>
          <span className="home-feature-mark home-admin-mark" aria-hidden="true">A</span>
          <div><h2>Admin workspace</h2><p>Manage teachers, courses, classes, and schedules.</p></div>
        </article>
      </div>
    </section>
  )
}

export default Homepage