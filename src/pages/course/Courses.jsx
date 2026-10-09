import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`flex h-32 items-end justify-between bg-linear-to-br ${courseColors[index % courseColors.length]} p-5`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white ring-1 ring-white/30">
                  {course.title.charAt(0)}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30">
                  {course.course_code}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
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
                </div>
                <Link
                  to={`/student-dashboard/courses/${course.course_code}`}
                  className="group mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  View details
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  )
}

export default Courses
