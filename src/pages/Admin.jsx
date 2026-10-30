import { useMemo, useState } from 'react'
import courseData from '../data/courses.json'
import './Admin.css'

const adminSections = ['Students', 'Teachers & Instructors', 'Courses', 'Classes', 'Schedules']

const initialStudents = [
  { id: 'STU-001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', program: 'Web Development', enrolledOn: '2026-09-15' },
  { id: 'STU-002', name: 'Maya Thapa', email: 'maya.thapa@example.com', program: 'UI/UX Design', enrolledOn: '2026-09-18' },
  { id: 'STU-003', name: 'Sanjay Rai', email: 'sanjay.rai@example.com', program: 'Python Programming', enrolledOn: '2026-09-22' },
  { id: 'STU-004', name: 'Nima Lama', email: 'nima.lama@example.com', program: 'Data Analytics', enrolledOn: '2026-09-25' },
  { id: 'STU-005', name: 'Riya Gurung', email: 'riya.gurung@example.com', program: 'Digital Marketing', enrolledOn: '2026-09-29' },
]

const formatStartDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const Admin = () => {
  const [activeSection, setActiveSection] = useState('Courses')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState(courseData)
  const [students, setStudents] = useState(initialStudents)
  const [disabledRecords, setDisabledRecords] = useState({})
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [recordAction, setRecordAction] = useState(null)

  const instructors = useMemo(() => {
    const courseMap = new Map()

    courses.forEach((course) => {
      const instructorCourses = courseMap.get(course.instructor) ?? []
      instructorCourses.push(course)
      courseMap.set(course.instructor, instructorCourses)
    })

    return Array.from(courseMap, ([name, instructorCourses]) => ({
      name,
      courses: instructorCourses,
    }))
  }, [courses])

  const query = search.trim().toLowerCase()
  const visibleCourses = courses.filter((course) =>
    `${course.title} ${course.course_code} ${course.instructor}`.toLowerCase().includes(query),
  )
  const visibleInstructors = instructors.filter((instructor) =>
    `${instructor.name} ${instructor.courses.map((course) => course.title).join(' ')}`
      .toLowerCase()
      .includes(query),
  )
  const visibleStudents = students.filter((student) =>
    `${student.id} ${student.name} ${student.email} ${student.program}`
      .toLowerCase()
      .includes(query),
  )

  const selectSection = (section) => {
    setActiveSection(section)
    setSearch('')
  }

  const openRecord = (record, action, section = activeSection) => {
    setSelectedRecord({ ...record, section })
    setRecordAction(action)
  }

  const isDisabled = (record) =>
    Boolean(disabledRecords[`${record.section}:${record.id}`])

  const toggleDisabled = (record) => {
    const key = `${record.section}:${record.id}`
    setDisabledRecords((current) => ({ ...current, [key]: !current[key] }))
  }

  const saveRecord = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const updates = Object.fromEntries(formData.entries())
    const targetSection = selectedRecord.section

    if (targetSection === 'Students') {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === selectedRecord.id ? { ...student, ...updates } : student,
        ),
      )
    } else {
      setCourses((currentCourses) =>
        currentCourses.map((course) => {
          const isSelectedRecord = targetSection === 'Teachers & Instructors'
            ? course.instructor === selectedRecord.name
            : course.course_code === selectedRecord.course_code

          return isSelectedRecord ? { ...course, ...updates } : course
        }),
      )
    }
    setSelectedRecord(null)
    setRecordAction(null)
  }

  const renderActions = (record, section = activeSection) => {
    const actionRecord = {
      ...record,
      section,
      id: section === 'Students'
        ? record.id
        : section === 'Teachers & Instructors'
          ? record.name
          : record.course_code,
    }
    const actions = section === 'Students' || section === 'Teachers & Instructors'
      ? ['View details', 'Edit', 'Disable']
      : section === 'Courses'
        ? ['View details', 'Edit']
        : ['View details', 'Update']

    return (
      <div className="admin-row-actions" aria-label={`Actions for ${record.title ?? record.name}`}>
        {actions.map((action) => action === 'Disable' ? (
          <button
            key={action}
            className={isDisabled(actionRecord) ? 'is-enable' : 'is-disable'}
            type="button"
            onClick={() => toggleDisabled(actionRecord)}
          >
            {isDisabled(actionRecord) ? 'Enable' : action}
          </button>
        ) : (
          <button
            key={action}
            type="button"
            onClick={() => openRecord(actionRecord, action, section)}
          >
            {action}
          </button>
        ))}
      </div>
    )
  }

  const closeRecord = () => {
    setSelectedRecord(null)
    setRecordAction(null)
  }

  const editableFields = !selectedRecord
    ? []
    : selectedRecord.section === 'Students'
      ? [
          { name: 'name', label: 'Student name', value: selectedRecord.name },
          { name: 'email', label: 'Email', value: selectedRecord.email, type: 'email' },
          { name: 'program', label: 'Program', value: selectedRecord.program },
          { name: 'enrolledOn', label: 'Enrollment date', value: selectedRecord.enrolledOn, type: 'date' },
        ]
      : selectedRecord.section === 'Teachers & Instructors'
        ? [{ name: 'instructor', label: 'Name', value: selectedRecord.name }]
        : selectedRecord.section === 'Courses'
          ? [
        { name: 'title', label: 'Course / class name', value: selectedRecord.title },
        { name: 'instructor', label: 'Instructor', value: selectedRecord.instructor },
        { name: 'duration', label: 'Duration', value: selectedRecord.duration },
        { name: 'time', label: 'Class time', value: selectedRecord.time },
        { name: 'start_date', label: 'Start date', value: selectedRecord.start_date, type: 'date' },
      ]
          : selectedRecord.section === 'Classes'
            ? [
                { name: 'title', label: 'Class name', value: selectedRecord.title },
                { name: 'instructor', label: 'Instructor', value: selectedRecord.instructor },
                { name: 'duration', label: 'Duration', value: selectedRecord.duration },
                { name: 'start_date', label: 'Start date', value: selectedRecord.start_date, type: 'date' },
              ]
            : [
                { name: 'title', label: 'Course / class name', value: selectedRecord.title },
                { name: 'instructor', label: 'Instructor', value: selectedRecord.instructor },
                { name: 'time', label: 'Class time', value: selectedRecord.time },
                { name: 'start_date', label: 'Start date', value: selectedRecord.start_date, type: 'date' },
              ]

  return (
    <div className="admin-page">
      <aside className="admin-sidebar" aria-label="Administration">
        <div className="admin-sidebar-heading">
          <span className="admin-mark" aria-hidden="true">A</span>
          <div>
            <strong>Administration</strong>
            <span>Manage your learning hub</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          {adminSections.map((section) => (
            <button
              key={section}
              className={`admin-nav-link${activeSection === section ? ' is-active' : ''}`}
              type="button"
              aria-current={activeSection === section ? 'page' : undefined}
              onClick={() => selectSection(section)}
            >
              <span>{section}</span>
              <span className="admin-nav-count">
                {section === 'Students' ? students.length :
                  section === 'Teachers & Instructors' ? instructors.length : courses.length}
              </span>
            </button>
          ))}
        </nav>
        <p className="admin-sidebar-note">E-learners Hub · Admin</p>
      </aside>

      <main className="admin-content" aria-live="polite">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">LEARNING HUB MANAGEMENT</p>
            <h1>Admin dashboard</h1>
            <p>Manage students, teaching staff, courses, classes, and schedules.</p>
          </div>
          <span className="admin-access-badge"><span aria-hidden="true" /> Admin access</span>
        </header>

        <section className="admin-metrics" aria-label="Platform overview">
          <article className="admin-metric-card">
            <span className="admin-metric-icon students-icon" aria-hidden="true">S</span>
            <div><span>Students</span><strong>{students.length}</strong><small>In the demo roster</small></div>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-icon instructors-icon" aria-hidden="true">T</span>
            <div><span>Teachers & instructors</span><strong>{instructors.length}</strong><small>Assigned to courses</small></div>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-icon courses-icon" aria-hidden="true">C</span>
            <div><span>Courses</span><strong>{courses.length}</strong><small>Available in catalog</small></div>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-icon schedules-icon" aria-hidden="true">↗</span>
            <div><span>Classes & schedules</span><strong>{courses.length}</strong><small>Upcoming course cohorts</small></div>
          </article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-panel-label">DIRECTORY</p>
              <h2>{activeSection}</h2>
            </div>
            <label className="admin-search">
                <span className="visually-hidden">Search {activeSection.toLowerCase()}</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                />
            </label>
          </div>

          {activeSection === 'Students' && (
            visibleStudents.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Student</th><th>Email</th><th>Program</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr key={student.id}>
                        <td><span className="admin-person"><span className="admin-person-avatar">{student.name.charAt(0)}</span><strong>{student.name}</strong></span></td>
                        <td>{student.email}</td>
                        <td>{student.program}</td>
                        <td>{formatStartDate(student.enrolledOn)}</td>
                        <td><span className={`admin-status${isDisabled({ section: 'Students', id: student.id }) ? ' is-disabled' : ''}`}>{isDisabled({ section: 'Students', id: student.id }) ? 'Disabled' : 'Active'}</span></td>
                        <td>{renderActions(student, 'Students')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="admin-no-results">No students match “{search}”.</p>
          )}

          {activeSection === 'Teachers & Instructors' && (
            visibleInstructors.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Courses</th><th>Assigned courses</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleInstructors.map(({ name, courses: instructorCourses }) => (
                      <tr key={name}>
                        <td><span className="admin-person"><span className="admin-person-avatar">{name.charAt(0)}</span><strong>{name}</strong></span></td>
                        <td>{instructorCourses.length}</td>
                        <td>{instructorCourses.map((course) => course.title).join(', ')}</td>
                        <td><span className={`admin-status${isDisabled({ section: 'Teachers & Instructors', id: name }) ? ' is-disabled' : ''}`}>{isDisabled({ section: 'Teachers & Instructors', id: name }) ? 'Disabled' : 'Active'}</span></td>
                        <td>{renderActions({ name, courses: instructorCourses }, 'Teachers & Instructors')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="admin-no-results">No instructors match “{search}”.</p>
          )}

          {activeSection === 'Courses' && (
            visibleCourses.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Course</th><th>Instructor</th><th>Duration</th><th>Starts</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleCourses.map((course) => (
                      <tr key={course.course_code}>
                        <td><span className="admin-course-cell"><strong>{course.title}</strong><small>{course.course_code}</small></span></td>
                        <td>{course.instructor}</td>
                        <td>{course.duration}</td>
                        <td>{formatStartDate(course.start_date)}</td>
                        <td>{renderActions(course)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="admin-no-results">No courses match “{search}”.</p>
          )}

          {activeSection === 'Classes' && (
            visibleCourses.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Class / course</th><th>Instructor</th><th>Duration</th><th>Starts</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleCourses.map((course) => (
                      <tr key={course.course_code}>
                        <td><span className="admin-course-cell"><strong>{course.title}</strong><small>{course.course_code}</small></span></td>
                        <td>{course.instructor}</td>
                        <td>{course.duration}</td>
                        <td>{renderActions(course, 'Classes')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="admin-no-results">No classes match “{search}”.</p>
          )}

          {activeSection === 'Schedules' && (
            visibleCourses.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Course / class</th><th>Instructor</th><th>Class time</th><th>Start date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleCourses.map((course) => (
                      <tr key={course.course_code}>
                        <td><span className="admin-course-cell"><strong>{course.title}</strong><small>{course.course_code}</small></span></td>
                        <td>{course.instructor}</td>
                        <td>{course.time}</td>
                        <td>{formatStartDate(course.start_date)}</td>
                        <td>{renderActions(course, 'Schedules')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="admin-no-results">No schedules match “{search}”.</p>
          )}
        </section>
      </main>
      {selectedRecord && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeRecord()
        }}>
          <section
            className="admin-record-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-record-title"
          >
            <header className="admin-modal-header">
              <div>
                <p className="admin-panel-label">{selectedRecord.section}</p>
                <h2 id="admin-record-title">{recordAction} {selectedRecord.title ?? selectedRecord.name}</h2>
              </div>
              <button className="admin-modal-close" type="button" onClick={closeRecord} aria-label="Close dialog">×</button>
            </header>
            {recordAction === 'View details' ? (
              <dl className="admin-record-details">
                {Object.entries({
                  ...(selectedRecord.id && selectedRecord.section === 'Students' ? { 'Student ID': selectedRecord.id } : {}),
                  ...(selectedRecord.course_code ? { 'Course code': selectedRecord.course_code } : {}),
                  ...(selectedRecord.name ? { Name: selectedRecord.name } : {}),
                  ...(selectedRecord.title ? { Course: selectedRecord.title } : {}),
                  ...(selectedRecord.instructor ? { Instructor: selectedRecord.instructor } : {}),
                  ...(selectedRecord.email ? { Email: selectedRecord.email } : {}),
                  ...(selectedRecord.program ? { Program: selectedRecord.program } : {}),
                  ...(selectedRecord.enrolledOn ? { Enrolled: formatStartDate(selectedRecord.enrolledOn) } : {}),
                  ...(selectedRecord.duration ? { Duration: selectedRecord.duration } : {}),
                  ...(selectedRecord.time ? { 'Class time': selectedRecord.time } : {}),
                  ...(selectedRecord.start_date ? { 'Start date': formatStartDate(selectedRecord.start_date) } : {}),
                  ...(selectedRecord.courses?.length
                    ? { 'Assigned courses': selectedRecord.courses.map((course) => course.title).join(', ') }
                    : {}),
                  Status: isDisabled(selectedRecord) ? 'Disabled' : 'Active',
                }).map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
                <div className="admin-modal-actions">
                  <button type="button" className="admin-modal-secondary" onClick={closeRecord}>Close</button>
                </div>
              </dl>
            ) : (
              <form className="admin-record-form" onSubmit={saveRecord}>
                {editableFields.map(({ name, label, value, type = 'text' }) => (
                  <label key={name}>
                    <span>{label}</span>
                    <input name={name} type={type} defaultValue={value} required />
                  </label>
                ))}
                <div className="admin-modal-actions">
                  <button type="button" className="admin-modal-secondary" onClick={closeRecord}>Cancel</button>
                  <button type="submit" className="admin-modal-primary">{recordAction} record</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default Admin
