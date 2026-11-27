import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import './Demo.css'

const demoSections = {
  Courses: {
    icon: '01',
    description: 'Learners browse their learning paths and open a course to review its syllabus, materials, and schedule.',
    steps: ['Browse available learning paths', 'Open a course overview', 'Use course materials to guide learning'],
    previewTitle: 'Course catalog',
    previewCopy: 'Course cards and course-specific information appear here after login.',
  },
  Tasks: {
    icon: '02',
    description: 'The tasks area brings practice activities together so learners can understand what to work on for each course.',
    steps: ['Review activities by course', 'Read the task instructions', 'Return to track learning progress'],
    previewTitle: 'Learning activities',
    previewCopy: 'Task instructions and progress details appear here after login.',
  },
  Certificates: {
    icon: '03',
    description: 'Learners can review course completion requirements and access certificate information when it becomes available.',
    steps: ['Check course completion requirements', 'Review the certificate pathway', 'Save certificate details when eligible'],
    previewTitle: 'Certificate pathways',
    previewCopy: 'Completion information and certificate options appear here after login.',
  },
  Referrals: {
    icon: '04',
    description: 'The referrals area helps learners share courses with people who may be interested in the same skills.',
    steps: ['Explore who a course is suited for', 'Review the learning focus', 'Share a course with a friend'],
    previewTitle: 'Share learning',
    previewCopy: 'Course referral information and sharing options appear here after login.',
  },
  Payments: {
    icon: '05',
    description: 'The payments area is where learners can review account charges and payment information associated with their learning.',
    steps: ['Review payment information', 'Check transaction details', 'Keep track of account records'],
    previewTitle: 'Payment information',
    previewCopy: 'Payment records and account details appear here after login.',
  },
  Admin: {
    icon: 'A',
    description: 'The admin workspace provides tools for overseeing the learning hub and keeping its records organized.',
    steps: ['Manage learner and instructor records', 'Organize courses and classes', 'Coordinate schedules'],
    previewTitle: 'Admin workspace',
    previewCopy: 'Administrative records and management tools appear here after login.',
  },
}

const Demo = ({ onLogin }) => {
  const [activeSection, setActiveSection] = useState('Courses')
  const section = demoSections[activeSection]
  const sectionNames = Object.keys(demoSections)

  return (
    <div className="dashboard demo-dashboard">
      <aside className="dashboard-sidebar" aria-label="Demo dashboard sections">
        <div className="profile-card demo-profile">
          <span className="demo-profile-mark" aria-hidden="true">D</span>
          <div>
            <strong>Demo preview</strong>
            <span>Dashboard overview</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          {sectionNames.map((name) => (
            <button
              key={name}
              className={`sidebar-link${activeSection === name ? ' is-active' : ''}`}
              type="button"
              aria-current={activeSection === name ? 'page' : undefined}
              onClick={() => setActiveSection(name)}
            >
              <span>{name === 'Admin' ? 'Admin workspace' : name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="dashboard-content demo-content" aria-live="polite">
        <div className="dashboard-heading course-heading">
          <div>
            <p className="dashboard-eyebrow">DASHBOARD DEMO</p>
            <h1>{activeSection === 'Admin' ? 'Admin workspace' : activeSection}</h1>
          </div>
          <p className="section-heading-copy">{section.description}</p>
        </div>

        <article className="demo-explainer">
          <header className="demo-explainer-header">
            <span className="demo-section-icon" aria-hidden="true">{section.icon}</span>
            <div>
              <p className="demo-card-eyebrow">HOW IT WORKS</p>
              <h2>{section.previewTitle}</h2>
            </div>
          </header>

          <p className="demo-explainer-copy">{section.previewCopy}</p>

          <ol className="demo-steps">
            {section.steps.map((step, index) => (
              <li key={step}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </article>

        <aside className="demo-empty-state" aria-label="Demo data notice">
          <span className="demo-empty-icon" aria-hidden="true">i</span>
          <div>
            <h2>This is a feature preview</h2>
            <p>
              No learner, course, payment, or administrative records are shown in the demo.
              Log in to open the full dashboard.
            </p>
          </div>
        </aside>

        <div className="demo-actions">
          <Link className="demo-login" to="/dashboard" onClick={onLogin}>
            Log in to open dashboard <span aria-hidden="true">→</span>
          </Link>
          <Link className="demo-home" to="/">Back to home</Link>
        </div>
      </section>
    </div>
  )
}

export default Demo
