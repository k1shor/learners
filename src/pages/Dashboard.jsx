import { useState } from 'react'
import './Dashboard.css'
import profileAvatar from '../assets/profile-avatar.svg'
import courses from '../data/courses.json'

const sections = ['Courses', 'Tasks', 'Certificates', 'Referrals', 'Payments']

const formatStartDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('Courses')

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar" aria-label="Learner dashboard">
        <div className="profile-card">
          <img className="profile-avatar" src={profileAvatar} alt="Profile" />
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          {sections.map((name) => (
            <button
              key={name}
              className={`sidebar-link${activeSection === name ? ' is-active' : ''}`}
              type="button"
              aria-current={activeSection === name ? 'page' : undefined}
              onClick={() => setActiveSection(name)}
            >
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="dashboard-content" aria-live="polite">
        {activeSection === 'Courses' ? (
          <>
            <div className="dashboard-heading course-heading">
              <h1>Courses</h1>
            </div>
            <div className="course-grid">
              {courses.map((course) => (
                <article className="course-card" key={course.course_code}>
                  <div className="course-card-top">
                    <h2 className="course-title">{course.title}</h2>
                    <span className="course-code">{course.course_code}</span>
                  </div>
                  <dl className="course-details">
                    <div className="course-detail">
                      <dt>Instructor</dt>
                      <dd>{course.instructor}</dd>
                    </div>
                    <div className="course-detail">
                      <dt>Duration</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div className="course-detail">
                      <dt>Time</dt>
                      <dd>{course.time}</dd>
                    </div>
                    <div className="course-detail">
                      <dt>Start date</dt>
                      <dd>{formatStartDate(course.start_date)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}

export default Dashboard
