import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import { useAuth } from '../../../context/useAuth'
import { getCourseStatus } from '../../../utils/courseStatus'

const courseColors = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-400',
  'from-rose-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-violet-500 to-fuchsia-400',
  'from-amber-500 to-yellow-400',
]

const statusStyles = {
  Upcoming: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  Ongoing: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Completed: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All courses')
  const { user } = useAuth()
  const enrollmentStorageKey = `learnershub-enrollments-${user?.id ?? user?.email ?? 'student'}`

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
        try {
          const savedEnrollments = JSON.parse(
            window.localStorage.getItem(enrollmentStorageKey) || '[]',
          )
          setEnrolledCourses(
            Array.isArray(savedEnrollments)
              ? savedEnrollments.filter((code) => typeof code === 'string')
              : [],
          )
        } catch {
          setEnrolledCourses([])
        }
      } catch (loadError) {
        setError(loadError.message || 'Something went wrong while loading courses.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [enrollmentStorageKey])

  if (isLoading) {
    return (
      <section aria-label="Loading courses" aria-busy="true">
        <div className="mb-8 h-20 max-w-xl animate-pulse rounded-2xl bg-slate-200" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-32 animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>
  }

  const visibleCourses = courses.filter((course) => {
    const matchesQuery = `${course.title} ${course.instructor} ${course.course_code}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
    const status = getCourseStatus(course.start_date, course.duration)
    return matchesQuery && (statusFilter === 'All courses' || status === statusFilter)
  })

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
        <>
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search courses</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, instructor, or code..." className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
          </label>
          <label>
            <span className="sr-only">Filter by course status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-44">
              <option>All courses</option>
              <option>Upcoming</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </label>
        </div>
        {visibleCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-slate-800">No matching courses</p>
            <button type="button" onClick={() => { setQuery(''); setStatusFilter('All courses') }} className="mt-3 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Clear search and filters</button>
          </div>
        ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course, index) => (
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
                <span className={`mt-2 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[getCourseStatus(course.start_date, course.duration)]}`}>
                  {getCourseStatus(course.start_date, course.duration)}
                </span>
                {enrolledCourses.includes(course.course_code) && (
                  <span className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                    Enrolled
                  </span>
                )}
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
        </>
      )}
    </section>
  )
}

export default Courses
