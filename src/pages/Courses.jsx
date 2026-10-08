import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const courseColors = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-400',
  'from-rose-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-violet-500 to-fuchsia-400',
  'from-amber-500 to-yellow-400',
]

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/data/MOCK_DATA.csv')
        if (!response.ok) {
          throw new Error('Could not load the course data.')
        }

        const csvText = await response.text()
        const { data, errors } = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: 'greedy',
        })

        if (errors.length > 0) {
          throw new Error('The course CSV could not be read. Please check its format.')
        }

        const requiredFields = ['title', 'course_code', 'instructor', 'duration', 'start_date', 'time']
        const validCourses = data.filter((course) =>
          requiredFields.every((field) => course[field]?.trim()),
        )

        setCourses(validCourses)
      } catch (loadError) {
        setError(loadError.message || 'Something went wrong while loading courses.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (isLoading) {
    return <p className="text-slate-500">Loading courses…</p>
  }

  if (error) {
    return <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>
  }

  return (
    <section aria-labelledby="courses-heading">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Keep learning
          </p>
          <h1 id="courses-heading" className="text-3xl font-bold tracking-tight text-slate-900">
            Explore courses
          </h1>
          <p className="mt-2 max-w-xl text-slate-500">
            Build practical skills with courses led by experienced instructors.
          </p>
        </div>
        <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
          {courses.length} courses available
        </span>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No courses were found in the course data file.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <article
              key={course.course_code}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`flex h-32 items-end justify-between bg-linear-to-br ${courseColors[index % courseColors.length]} p-5`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white ring-1 ring-white/30">
                  {course.title.charAt(0)}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30">
                  {course.course_code}
                </span>
              </div>

              <div className="p-5">
                <h2 className="min-h-14 text-lg font-semibold leading-7 text-slate-900">
                  {course.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Instructor <span className="font-medium text-slate-700">{course.instructor}</span>
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <div className="flex items-center justify-between gap-2">
                    <span>{course.duration}</span>
                    <span>{course.time}</span>
                  </div>
                  <p>
                    Starts{' '}
                    <time dateTime={course.start_date} className="font-medium text-slate-700">
                      {new Date(`${course.start_date}T00:00:00`).toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedCourse(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Course details · {selectedCourse.course_code}
                </p>
                <h2 id="course-dialog-title" className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedCourse.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close course details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Instructor</dt>
                <dd className="mt-1 font-medium text-slate-800">{selectedCourse.instructor}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Duration</dt>
                <dd className="mt-1 font-medium text-slate-800">{selectedCourse.duration}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Start date</dt>
                <dd className="mt-1 font-medium text-slate-800">
                  {new Date(`${selectedCourse.start_date}T00:00:00`).toLocaleDateString('en', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Schedule</dt>
                <dd className="mt-1 font-medium text-slate-800">{selectedCourse.time}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </section>
  )
}

export default Courses
