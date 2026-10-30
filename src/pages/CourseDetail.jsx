import { Link, useParams } from 'react-router-dom'
import courses from '../data/courses.json'
import courseResources from '../data/course-resources.json'
import './CourseDetail.css'

const participants = ['Learner 01', 'Learner 02', 'Learner 03', 'Learner 04']

const formatStartDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const CourseDetail = () => {
  const { courseCode } = useParams()
  const course = courses.find((item) => item.course_code === courseCode)
  const resources = courseResources[courseCode]

  if (!course) {
    return (
      <main className="course-detail-page">
        <section className="course-detail-panel">
          <p className="course-detail-eyebrow">COURSE NOT FOUND</p>
          <h1>This course isn&apos;t available.</h1>
          <Link className="course-detail-back" to="/dashboard">
            <span aria-hidden="true">←</span> Back to courses
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="course-detail-page">
      <Link className="course-detail-back" to="/dashboard">
        <span aria-hidden="true">←</span> Back to courses
      </Link>

      <div className="course-detail-layout">
        <div className="course-detail-main">
          <article className="course-detail-panel">
            <div className="course-detail-panel-heading">
              <div>
                <p className="course-detail-eyebrow">COURSE DETAILS</p>
                <h1>{course.title}</h1>
              </div>
              <span className="course-detail-code">{course.course_code}</span>
            </div>

            <dl className="course-detail-list">
              <div>
                <dt>Instructor</dt>
                <dd>{course.instructor}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{course.time}</dd>
              </div>
              <div>
                <dt>Start</dt>
                <dd>{formatStartDate(course.start_date)}</dd>
              </div>
            </dl>
          </article>

          {resources && (
            <>
              <section className="course-resource-section" aria-labelledby="syllabus-heading">
                <h2 id="syllabus-heading">Course syllabus</h2>
                <div className="syllabus-list">
                  {resources.syllabus.map((module, index) => (
                    <details className="syllabus-item" key={module.title} open={index === 0}>
                      <summary>
                        <span className="syllabus-module-number">{String(index + 1).padStart(2, '0')}</span>
                        <span>{module.title}</span>
                        <span className="syllabus-chevron" aria-hidden="true">⌄</span>
                      </summary>
                      <ul>
                        {module.topics.map((topic) => <li key={topic}>{topic}</li>)}
                      </ul>
                    </details>
                  ))}
                </div>
              </section>

              <div className="course-resource-columns">
                <section className="course-resource-section" aria-labelledby="materials-heading">
                  <h2 id="materials-heading">Materials</h2>
                  <ul className="resource-list">
                    {resources.materials.map((material) => (
                      <li className="resource-item" key={material}>
                        <span className="resource-type resource-type-file" aria-hidden="true">PDF</span>
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="course-resource-section" aria-labelledby="videos-heading">
                  <h2 id="videos-heading">Videos</h2>
                  <ul className="resource-list">
                    {resources.videos.map((video) => (
                      <li className="resource-item" key={video.title}>
                        <span className="resource-type resource-type-video" aria-hidden="true">▶</span>
                        <span className="video-resource-copy">
                          <span>{video.title}</span>
                          <small>{video.duration}</small>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

            </>
          )}
        </div>

        <aside className="participants-panel" aria-labelledby="participants-heading">
          <div className="participants-heading">
            <div>
              <h2 id="participants-heading">Participants</h2>
              <p>Course community</p>
            </div>
            <span>{participants.length}</span>
          </div>
          <ul className="participants-list">
            {participants.map((participant, index) => (
              <li key={participant}>
                <span className={`participant-avatar participant-avatar-${index + 1}`} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{participant}</span>
              </li>
            ))}
          </ul>
          <p className="participants-note">Example participants</p>
        </aside>
      </div>
    </main>
  )
}

export default CourseDetail
