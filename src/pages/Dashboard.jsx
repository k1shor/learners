import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import profileAvatar from '../assets/profile-avatar.svg'
import courses from '../data/courses.json'
import courseResources from '../data/course-resources.json'

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
  const [printCourseCode, setPrintCourseCode] = useState(null)

  useEffect(() => {
    if (!printCourseCode) {
      return undefined
    }

    const handleAfterPrint = () => setPrintCourseCode(null)
    const printTimer = window.setTimeout(() => window.print(), 150)
    window.addEventListener('afterprint', handleAfterPrint)

    return () => {
      window.clearTimeout(printTimer)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [printCourseCode])

  const printableCourse = courses.find((course) => course.course_code === printCourseCode)
  const printableModules = printableCourse
    ? courseResources[printableCourse.course_code]?.syllabus ?? []
    : []

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar" aria-label="Learner dashboard">
        <div className="profile-card">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=85"
            alt="Learner profile portrait"
            onError={(event) => {
              event.currentTarget.src = profileAvatar
            }}
          />
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
              <p className="section-heading-copy">
                Explore your learning paths, course details, and the skills you will build.
              </p>
            </div>
            <div className="course-grid">
              {courses.map((course) => {
                const modules = courseResources[course.course_code]?.syllabus ?? []
                const topics = modules.flatMap((module) => module.topics).slice(0, 3)

                return (
                  <article className="course-card" key={course.course_code}>
                    <div className="course-card-top">
                      <span className="course-code">{course.course_code}</span>
                      <span className="course-module-count">
                        {modules.length} learning modules
                      </span>
                    </div>
                    <h2 className="course-title">{course.title}</h2>
                    <ul className="course-topic-list" aria-label="Course highlights">
                      {topics.map((topic) => <li key={topic}>{topic}</li>)}
                    </ul>
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
                        <dt>Schedule</dt>
                        <dd>{course.time}</dd>
                      </div>
                      <div className="course-detail">
                        <dt>Starts</dt>
                        <dd>{formatStartDate(course.start_date)}</dd>
                      </div>
                    </dl>
                    <Link className="course-detail-link" to={`/courses/${course.course_code}`}>
                      Explore course <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                )
              })}
            </div>
          </>
        ) : null}

        {activeSection === 'Tasks' ? (
          <>
            <div className="dashboard-heading course-heading">
              <h1>Tasks</h1>
              <p className="section-heading-copy">
                Put your learning into practice with hands-on work from each course.
              </p>
            </div>
            <div className="task-groups">
              {courses.map((course) => {
                const tasks = courseResources[course.course_code]?.tasks ?? []

                if (!tasks.length) {
                  return null
                }

                return (
                  <section className="task-group" key={course.course_code}>
                    <div className="task-group-header">
                      <div>
                        <p className="task-group-label">{course.course_code}</p>
                        <h2>{course.title}</h2>
                      </div>
                      <span className="task-count">{tasks.length}</span>
                    </div>

                    <ul className="task-list">
                      {tasks.map((task) => (
                        <li className="task-item" key={`${course.course_code}-${task.title}`}>
                          <span className="task-bullet" aria-hidden="true" />
                          <div className="task-copy">
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Link className="task-course-link" to={`/courses/${course.course_code}`}>
                      View course <span aria-hidden="true">→</span>
                    </Link>
                  </section>
                )
              })}
            </div>
          </>
        ) : null}

        {activeSection === 'Certificates' ? (
          <>
            <div className="dashboard-heading course-heading">
              <h1>Certificates</h1>
              <p className="section-heading-copy">
                Review each course certificate outline. Use Save PDF and choose “Save as PDF”
                in the print dialog to keep a copy.
              </p>
            </div>
            <div className="certificate-groups">
              {courses.map((course) => {
                const modules = courseResources[course.course_code]?.syllabus ?? []

                return (
                  <article className="certificate-card" key={course.course_code}>
                    <header className="certificate-card-header">
                      <div>
                        <p className="certificate-course-code">{course.course_code}</p>
                        <h2>{course.title}</h2>
                      </div>
                      <span className="certificate-seal" aria-hidden="true">✓</span>
                    </header>

                    <p className="certificate-note">
                      Certificate awarded upon successful course completion · {course.duration}
                    </p>

                    <div className="certificate-curriculum">
                      <h3>Certificate curriculum</h3>
                      {modules.map((module, index) => (
                        <section className="certificate-module" key={module.title}>
                          <h4>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {module.title}
                          </h4>
                          <ul>
                            {module.topics.map((topic) => <li key={topic}>{topic}</li>)}
                          </ul>
                        </section>
                      ))}
                    </div>
                    <div className="certificate-card-actions">
                      <Link className="certificate-course-link" to={`/courses/${course.course_code}`}>
                        Explore course <span aria-hidden="true">→</span>
                      </Link>
                      <button
                        className="certificate-download-button"
                        type="button"
                        onClick={() => setPrintCourseCode(course.course_code)}
                        aria-label={`Save ${course.title} certificate details as PDF`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                          <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                        </svg>
                        Save PDF
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        ) : null}

        {activeSection === 'Referrals' ? (
          <>
            <div className="referral-hero">
              <div className="referral-hero-copy">
                <p className="referral-eyebrow">LEARN BETTER TOGETHER</p>
                <h1>Share a course worth learning.</h1>
                <p>
                  Help friends discover a course that fits their goals. Each invite below is
                  tailored to the skills and projects they will explore.
                </p>
              </div>
              <div className="referral-hero-count" aria-label={`${courses.length} courses to share`}>
                <strong>{courses.length}</strong>
                <span>courses<br />to share</span>
              </div>
            </div>

            <div className="referral-grid">
              {courses.map((course) => {
                const referral = courseResources[course.course_code]?.referral

                if (!referral) {
                  return null
                }

                return (
                  <article className="referral-card" key={course.course_code}>
                    <header className="referral-card-header">
                      <div>
                        <p className="referral-course-code">{course.course_code}</p>
                        <h2>{course.title}</h2>
                      </div>
                      <span className="referral-mark" aria-hidden="true">↗</span>
                    </header>

                    <div className="referral-card-body">
                      <div className="referral-fit">
                        <span className="referral-section-label">A great fit for</span>
                        <p>{referral.idealFor}</p>
                      </div>

                      <div className="referral-focus">
                        {referral.focusAreas.map((area) => (
                          <span key={area}>{area}</span>
                        ))}
                      </div>

                      <blockquote className="referral-invite">
                        <span className="referral-section-label">Ready-to-share invite</span>
                        <p>“{referral.invite}”</p>
                      </blockquote>

                      <div className="referral-card-footer">
                        <span>{course.duration} <span aria-hidden="true">·</span> Starts {formatStartDate(course.start_date)}</span>
                        <Link to={`/courses/${course.course_code}`}>
                          Course details <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        ) : null}

      </section>
      {printableCourse && (
        <article className="certificate-printout" aria-hidden="true">
          <div className="certificate-print-sheet">
            <p className="certificate-print-brand">E-LEARNERS HUB <span>·</span> COURSE RECORD</p>
            <div className="certificate-print-rule" />
            <p className="certificate-print-eyebrow">CERTIFICATE PATHWAY</p>
            <h1>{printableCourse.title}</h1>
            <p className="certificate-print-code">{printableCourse.course_code}</p>
            <p className="certificate-print-summary">
              Course curriculum and certificate completion overview
            </p>

            <dl className="certificate-print-meta">
              <div>
                <dt>Instructor</dt>
                <dd>{printableCourse.instructor}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{printableCourse.duration}</dd>
              </div>
            </dl>

            <div className="certificate-print-modules">
              {printableModules.map((module, index) => (
                <section key={module.title}>
                  <h2><span>{String(index + 1).padStart(2, '0')}</span> {module.title}</h2>
                  <p>{module.topics.join(' · ')}</p>
                </section>
              ))}
            </div>

            <p className="certificate-print-disclaimer">
              Certificate eligibility is subject to successful course completion. This document
              is a course overview, not proof that a certificate has been earned.
            </p>
          </div>
        </article>
      )}
    </div>
  )
}

export default Dashboard
