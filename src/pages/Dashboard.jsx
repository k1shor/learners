import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import profileAvatar from '../assets/profile-avatar.svg'
import courses from '../data/courses.json'
import courseResources from '../data/course-resources.json'

const sections = ['Courses', 'Tasks', 'Certificates', 'Referrals', 'Payments']
const TASK_COMPLETION_STORAGE_KEY = 'learners-demo-task-completions'
const PROFILE_STORAGE_KEY = 'learners-demo-profile'
const PAYMENT_STORAGE_KEY = 'learners-demo-payments'
const PAYMENT_METHODS = ['eSewa', 'Khalti', 'Bank transfer', 'Card']
const COURSE_FEES = {
  'WEB-101': 15000,
  'DES-120': 12000,
  'PY-110': 18000,
  'DA-205': 16000,
  'DM-130': 10000,
}
const PAYMENT_DUE_DATES = {
  'DES-120': '2026-11-28',
  'DA-205': '2026-12-05',
}
const SAMPLE_PAYMENT_DATA = {
  paidCourseCodes: ['WEB-101', 'PY-110', 'DM-130'],
  transactions: [
    { id: 'TXN-20261010-WEB101', courseCode: 'WEB-101', amount: 15000, method: 'eSewa', paidOn: '2026-10-10' },
    { id: 'TXN-20261018-PY110', courseCode: 'PY-110', amount: 18000, method: 'Khalti', paidOn: '2026-10-18' },
    { id: 'TXN-20261021-DM130', courseCode: 'DM-130', amount: 10000, method: 'Bank transfer', paidOn: '2026-10-21' },
  ],
}
const SAMPLE_CERTIFICATE = {
  candidateName: 'Aarav Sharma',
  courseCode: 'WEB-101',
  completedOn: '2026-10-28',
  cohortStartDate: '2026-08-31',
}

const formatStartDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount)

const getCourseEndDate = (course) => {
  const endDate = new Date(`${course.start_date}T00:00:00Z`)
  endDate.setUTCDate(endDate.getUTCDate() + Number.parseInt(course.duration, 10) * 7)
  return endDate.toISOString().slice(0, 10)
}

const sampleCourse = courses.find((course) => course.course_code === SAMPLE_CERTIFICATE.courseCode)
const sampleCourseEndDate = sampleCourse
  ? getCourseEndDate({ ...sampleCourse, start_date: SAMPLE_CERTIFICATE.cohortStartDate })
  : null

const CertificateDocument = ({ candidateName, course, completedOn, issueDate }) => (
  <div className="certificate-print-sheet">
    <span className="certificate-corner certificate-corner-top-left" aria-hidden="true" />
    <span className="certificate-corner certificate-corner-top-right" aria-hidden="true" />
    <span className="certificate-corner certificate-corner-bottom-left" aria-hidden="true" />
    <span className="certificate-corner certificate-corner-bottom-right" aria-hidden="true" />
    <div className="certificate-honor-seal" aria-hidden="true"><span>✦</span></div>
    <p className="certificate-print-brand">
      <span className="certificate-brand-symbol" aria-hidden="true">✦</span>
      E-LEARNERS HUB
    </p>
    <div className="certificate-print-rule" />
    <p className="certificate-print-eyebrow">CERTIFICATE OF ACHIEVEMENT</p>
    <p className="certificate-print-preamble">This certificate is proudly presented to</p>
    <h1>{candidateName}</h1>
    <p className="certificate-print-summary">
      for successfully completing <strong>{course.title}</strong>
    </p>
    <p className="certificate-print-code">{course.course_code}</p>
    <dl className="certificate-print-meta">
      <div>
        <dt>Instructor</dt>
        <dd>{course.instructor}</dd>
      </div>
      <div>
        <dt>Course duration</dt>
        <dd>{course.duration}</dd>
      </div>
      <div>
        <dt>Course completed</dt>
        <dd>{formatStartDate(completedOn)}</dd>
      </div>
      <div>
        <dt>Issued</dt>
        <dd>{formatStartDate(issueDate)}</dd>
      </div>
    </dl>
    <p className="certificate-print-signature">E-learners Hub · Learning Achievement</p>
  </div>
)

const Dashboard = ({ profile }) => {
  const [activeSection, setActiveSection] = useState('Courses')
  const [previewCertificate, setPreviewCertificate] = useState(null)
  const [printCertificate, setPrintCertificate] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentData, setPaymentData] = useState(() => {
    const savedPayments = window.sessionStorage.getItem(PAYMENT_STORAGE_KEY)
    return savedPayments ? JSON.parse(savedPayments) : SAMPLE_PAYMENT_DATA
  })
  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedTasks = window.sessionStorage.getItem(TASK_COMPLETION_STORAGE_KEY)
    return savedTasks ? JSON.parse(savedTasks) : {}
  })
  const [learnerName] = useState(() => {
    const savedProfile = window.sessionStorage.getItem(PROFILE_STORAGE_KEY)
    if (!savedProfile) {
      return 'Learner'
    }

    const profile = JSON.parse(savedProfile)
    return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Learner'
  })

  useEffect(() => {
    if (!printCertificate) {
      return undefined
    }

    const handleAfterPrint = () => setPrintCertificate(null)
    const printTimer = window.setTimeout(() => window.print(), 150)
    window.addEventListener('afterprint', handleAfterPrint)

    return () => {
      window.clearTimeout(printTimer)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [printCertificate])

  useEffect(() => {
    if (!previewCertificate) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPreviewCertificate(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewCertificate])

  const printableCourse = courses.find((course) => course.course_code === printCertificate?.courseCode)
  const previewCourse = courses.find((course) => course.course_code === previewCertificate?.courseCode)
  const certificateIssueDate = new Date().toISOString().slice(0, 10)
  const paidCourseCodes = new Set(paymentData.paidCourseCodes)
  const outstandingInvoices = courses.filter((course) => !paidCourseCodes.has(course.course_code))
  const balanceDue = outstandingInvoices.reduce((total, course) => total + COURSE_FEES[course.course_code], 0)
  const totalPaid = paymentData.transactions.reduce((total, transaction) => total + transaction.amount, 0)

  const toggleTask = (courseCode, taskTitle) => {
    setCompletedTasks((currentTasks) => {
      const courseTasks = new Set(currentTasks[courseCode] ?? [])
      if (courseTasks.has(taskTitle)) {
        courseTasks.delete(taskTitle)
      } else {
        courseTasks.add(taskTitle)
      }

      const updatedTasks = { ...currentTasks, [courseCode]: Array.from(courseTasks) }
      window.sessionStorage.setItem(TASK_COMPLETION_STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  const recordDemoPayment = (course) => {
    const transaction = {
      id: `TXN-${Date.now()}-${course.course_code}`,
      courseCode: course.course_code,
      amount: COURSE_FEES[course.course_code],
      method: selectedPaymentMethod,
      paidOn: new Date().toISOString().slice(0, 10),
    }
    const updatedPayments = {
      paidCourseCodes: [...paymentData.paidCourseCodes, course.course_code],
      transactions: [transaction, ...paymentData.transactions],
    }

    window.sessionStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updatedPayments))
    setPaymentData(updatedPayments)
    setPaymentMessage(
      `Demo payment recorded for ${course.title} using ${selectedPaymentMethod}. No money was transferred.`,
    )
  }

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar" aria-label="Learner dashboard">
        <div className="profile-card">
          <img
            className="profile-avatar"
            src={profile?.profilePicture || profileAvatar}
            alt={profile?.profilePicture ? 'Your profile picture' : 'Default learner profile'}
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
          <Link className="sidebar-link" to="/admin">
            <span>Admin</span>
          </Link>
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
                      <span className="task-count">
                        {(completedTasks[course.course_code] ?? []).filter((title) =>
                          tasks.some((task) => task.title === title),
                        ).length}/{tasks.length}
                      </span>
                    </div>

                    <ul className="task-list">
                      {tasks.map((task) => {
                        const isComplete = (completedTasks[course.course_code] ?? []).includes(task.title)

                        return (
                          <li className="task-item" key={`${course.course_code}-${task.title}`}>
                            <label className="task-completion">
                              <input
                                checked={isComplete}
                                className="task-checkbox"
                                onChange={() => toggleTask(course.course_code, task.title)}
                                type="checkbox"
                              />
                              <span className="task-copy">
                                <strong>{task.title}</strong>
                                <span className="task-description">{task.description}</span>
                              </span>
                            </label>
                          </li>
                        )
                      })}
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
                Achievement certificates unlock after every course task is complete and the course has ended.
              </p>
            </div>
            <div className="certificate-groups">
              {courses.map((course) => {
                const tasks = courseResources[course.course_code]?.tasks ?? []
                const courseEndDate = getCourseEndDate(course)
                const finishedTaskCount = tasks.filter((task) =>
                  (completedTasks[course.course_code] ?? []).includes(task.title),
                ).length
                const allTasksComplete = tasks.length > 0 && finishedTaskCount === tasks.length
                const courseHasEnded = new Date().toISOString().slice(0, 10) > courseEndDate
                const isEligible = allTasksComplete && courseHasEnded

                return (
                  <article className={`certificate-card${isEligible ? ' is-earned' : ''}`} key={course.course_code}>
                    <header className="certificate-card-header">
                      <div>
                        <p className="certificate-course-code">{course.course_code}</p>
                        <h2>{course.title}</h2>
                      </div>
                      <span className="certificate-seal" aria-label={isEligible ? 'Certificate earned' : 'Certificate locked'}>
                        {isEligible ? '✓' : '•'}
                      </span>
                    </header>

                    <div className="certificate-status">
                      <strong>{isEligible ? 'Certificate earned' : 'Certificate locked'}</strong>
                      <p>
                        {allTasksComplete
                          ? courseHasEnded
                            ? 'Your course is complete and your certificate is ready.'
                            : `All tasks complete. Available after the course ends on ${formatStartDate(courseEndDate)}.`
                          : `${finishedTaskCount} of ${tasks.length} tasks complete. Finish every task to qualify.`}
                      </p>
                      <span>{course.duration} · Course ends {formatStartDate(courseEndDate)}</span>
                    </div>

                    <div className="certificate-card-actions">
                      <Link className="certificate-course-link" to={`/courses/${course.course_code}`}>
                        View course <span aria-hidden="true">→</span>
                      </Link>
                      <button
                        className="certificate-preview-button"
                        type="button"
                        onClick={() => setPreviewCertificate({
                          courseCode: course.course_code,
                          candidateName: learnerName,
                          completedOn: courseEndDate,
                        })}
                        disabled={!isEligible}
                        aria-label={`Preview ${course.title} achievement certificate`}
                      >
                        Preview
                      </button>
                      <button
                        className="certificate-download-button"
                        type="button"
                        onClick={() => setPrintCertificate({
                          courseCode: course.course_code,
                          candidateName: learnerName,
                          completedOn: courseEndDate,
                        })}
                        disabled={!isEligible}
                        aria-label={`Download ${course.title} achievement certificate as PDF`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                          <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </article>
                )
              })}
              {sampleCourse && sampleCourseEndDate && (
                <article className="certificate-card certificate-reference-card is-earned">
                  <header className="certificate-card-header">
                    <div>
                      <p className="certificate-course-code">SAMPLE CANDIDATE · PAST COHORT</p>
                      <h2>{sampleCourse.title}</h2>
                    </div>
                    <span className="certificate-seal" aria-label="Certificate earned">✓</span>
                  </header>
                  <div className="certificate-status">
                    <strong>{SAMPLE_CERTIFICATE.candidateName}</strong>
                    <p>
                      All course tasks completed. This sample shows an earned achievement
                      certificate from a completed past cohort.
                    </p>
                    <span>
                      Completed {formatStartDate(SAMPLE_CERTIFICATE.completedOn)} · Course ended {formatStartDate(sampleCourseEndDate)}
                    </span>
                  </div>
                  <div className="certificate-card-actions">
                    <button
                      className="certificate-preview-button"
                      type="button"
                      onClick={() => setPreviewCertificate({
                        courseCode: sampleCourse.course_code,
                        candidateName: SAMPLE_CERTIFICATE.candidateName,
                        completedOn: SAMPLE_CERTIFICATE.completedOn,
                      })}
                      aria-label={`Preview ${SAMPLE_CERTIFICATE.candidateName}'s sample achievement certificate`}
                    >
                      Preview
                    </button>
                    <button
                      className="certificate-download-button"
                      type="button"
                      onClick={() => setPrintCertificate({
                        courseCode: sampleCourse.course_code,
                        candidateName: SAMPLE_CERTIFICATE.candidateName,
                        completedOn: SAMPLE_CERTIFICATE.completedOn,
                      })}
                      aria-label={`Download ${SAMPLE_CERTIFICATE.candidateName}'s sample achievement certificate as PDF`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                        <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                      </svg>
                      Download sample PDF
                    </button>
                  </div>
                </article>
              )}
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

        {activeSection === 'Payments' ? (
          <>
            <div className="dashboard-heading course-heading">
              <div>
                <p className="dashboard-eyebrow">LEARNER BILLING</p>
                <h1>Payments</h1>
              </div>
              <p className="section-heading-copy">
                Review course fees, choose a payment method, and keep track of your transactions.
              </p>
            </div>

            <aside className="payment-demo-notice" aria-label="Sample payment data notice">
              <span className="payment-notice-icon" aria-hidden="true">i</span>
              <p>
                <strong>Sample billing records</strong>
                These example fees and transactions are for demonstration only. Payments here do not charge a real account.
              </p>
            </aside>

            <div className="payment-summary-grid" aria-label="Payment summary">
              <article className="payment-summary-card payment-summary-due">
                <span>Balance due</span>
                <strong>{formatCurrency(balanceDue)}</strong>
                <small>{outstandingInvoices.length} outstanding {outstandingInvoices.length === 1 ? 'invoice' : 'invoices'}</small>
              </article>
              <article className="payment-summary-card payment-summary-paid">
                <span>Total paid</span>
                <strong>{formatCurrency(totalPaid)}</strong>
                <small>{paymentData.transactions.length} recorded transactions</small>
              </article>
              <article className="payment-summary-card payment-summary-courses">
                <span>Courses billed</span>
                <strong>{courses.length}</strong>
                <small>Sample course invoices</small>
              </article>
            </div>

            <section className="payment-panel" aria-labelledby="invoices-heading">
              <header className="payment-panel-heading">
                <div>
                  <p className="payment-section-label">COURSE CHARGES</p>
                  <h2 id="invoices-heading">Invoices</h2>
                </div>
                <label className="payment-method-control">
                  <span>Payment method</span>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(event) => setSelectedPaymentMethod(event.target.value)}
                  >
                    {PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}
                  </select>
                </label>
              </header>

              {paymentMessage && (
                <p className="payment-feedback" role="status">{paymentMessage}</p>
              )}

              <ul className="payment-invoice-list">
                {courses.map((course) => {
                  const isPaid = paidCourseCodes.has(course.course_code)
                  const latestTransaction = paymentData.transactions.find(
                    (transaction) => transaction.courseCode === course.course_code,
                  )

                  return (
                    <li className="payment-invoice" key={course.course_code}>
                      <div className="payment-invoice-main">
                        <span className="payment-invoice-code">{course.course_code}</span>
                        <div>
                          <h3>{course.title}</h3>
                          <p>
                            {isPaid
                              ? `Paid ${formatStartDate(latestTransaction.paidOn)}`
                              : `Due ${formatStartDate(PAYMENT_DUE_DATES[course.course_code] ?? course.start_date)}`}
                          </p>
                        </div>
                      </div>
                      <div className="payment-invoice-action">
                        <strong>{formatCurrency(COURSE_FEES[course.course_code])}</strong>
                        <span className={`payment-status${isPaid ? ' is-paid' : ' is-due'}`}>
                          {isPaid ? 'Paid' : 'Due'}
                        </span>
                        {!isPaid && (
                          <button
                            className="payment-action-button"
                            type="button"
                            onClick={() => recordDemoPayment(course)}
                          >
                            Record demo payment
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="payment-panel" aria-labelledby="transactions-heading">
              <header className="payment-panel-heading payment-transactions-heading">
                <div>
                  <p className="payment-section-label">ACCOUNT ACTIVITY</p>
                  <h2 id="transactions-heading">Transaction history</h2>
                </div>
                <span>{paymentData.transactions.length} records</span>
              </header>
              {paymentData.transactions.length ? (
                <div className="payment-transactions">
                  {paymentData.transactions.map((transaction) => {
                    const course = courses.find((item) => item.course_code === transaction.courseCode)

                    return (
                      <article className="payment-transaction" key={transaction.id}>
                        <span className="payment-transaction-mark" aria-hidden="true">✓</span>
                        <div className="payment-transaction-copy">
                          <strong>{course?.title ?? transaction.courseCode}</strong>
                          <span>{transaction.courseCode} · {transaction.method} · {formatStartDate(transaction.paidOn)}</span>
                        </div>
                        <strong className="payment-transaction-amount">{formatCurrency(transaction.amount)}</strong>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p className="payment-empty-state">No payments have been recorded yet.</p>
              )}
            </section>
          </>
        ) : null}

      </section>
      {printableCourse && (
        <article className="certificate-printout" aria-hidden="true">
          <CertificateDocument
            candidateName={printCertificate.candidateName}
            course={printableCourse}
            completedOn={printCertificate.completedOn}
            issueDate={certificateIssueDate}
          />
        </article>
      )}
      {previewCertificate && previewCourse && (
        <div
          className="certificate-preview-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewCertificate(null)
            }
          }}
        >
          <section
            className="certificate-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-preview-title"
          >
            <header className="certificate-preview-heading">
              <div>
                <p className="certificate-preview-eyebrow">CERTIFICATE PREVIEW</p>
                <h2 id="certificate-preview-title">{previewCourse.title}</h2>
              </div>
              <button
                className="certificate-preview-close"
                type="button"
                onClick={() => setPreviewCertificate(null)}
                aria-label="Close certificate preview"
              >
                ×
              </button>
            </header>
            <div className="certificate-preview-canvas">
              <CertificateDocument
                candidateName={previewCertificate.candidateName}
                course={previewCourse}
                completedOn={previewCertificate.completedOn}
                issueDate={certificateIssueDate}
              />
            </div>
            <footer className="certificate-preview-footer">
              <button
                className="certificate-preview-cancel"
                type="button"
                onClick={() => setPreviewCertificate(null)}
              >
                Close preview
              </button>
              <button
                className="certificate-download-button certificate-preview-download"
                type="button"
                onClick={() => setPrintCertificate(previewCertificate)}
              >
                Download PDF
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}

export default Dashboard
