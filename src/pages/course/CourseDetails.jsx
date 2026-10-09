import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Papa from 'papaparse'

const courseContent = {
  'WEB-101': {
    summary: 'Learn how the web works and build responsive, accessible pages from the ground up.',
    syllabus: [
      'How the web works and your development setup',
      'HTML structure and accessible content',
      'CSS foundations, layout, and responsive design',
      'JavaScript essentials and browser interaction',
      'Building and polishing a complete web page',
      'Publishing your project and next steps',
    ],
  },
  'JS-204': {
    summary: 'Turn JavaScript fundamentals into practical browser projects and confident coding habits.',
    syllabus: [
      'Modern JavaScript syntax and values',
      'Functions, scope, and reusable logic',
      'Arrays, objects, and data transformations',
      'DOM events and interactive interfaces',
      'Async JavaScript and working with APIs',
      'Plan, build, and present a final project',
    ],
  },
  'DES-110': {
    summary: 'Explore the principles and tools behind clear, thoughtful digital experiences.',
    syllabus: [
      'Design thinking and user research',
      'Information architecture and user flows',
      'Visual hierarchy, color, and typography',
      'Wireframes and low-fidelity prototypes',
      'High-fidelity screens and design systems',
      'Usability testing and portfolio presentation',
    ],
  },
  'PY-305': {
    summary: 'Use Python to clean, explore, and communicate insights from real-world datasets.',
    syllabus: [
      'Python essentials for data work',
      'Loading, cleaning, and shaping datasets',
      'Exploratory analysis with pandas',
      'Visualizing patterns and relationships',
      'Working with statistics and conclusions',
      'Presenting a complete data analysis',
    ],
  },
  'RE-220': {
    summary: 'Create responsive React applications with reusable components and modern workflows.',
    syllabus: [
      'React foundations and component thinking',
      'Props, composition, and reusable UI',
      'State, events, and interactive features',
      'Effects, data fetching, and app behavior',
      'Routing, forms, and application structure',
      'Build and deploy a complete React app',
    ],
  },
  'DB-150': {
    summary: 'Design reliable relational databases and write queries to work with structured data.',
    syllabus: [
      'Relational database concepts and data modeling',
      'Tables, keys, and relationships',
      'SQL queries and filtering data',
      'Joins, grouping, and useful reports',
      'Normalization and data integrity',
      'Design and query a small database project',
    ],
  },
}

const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const CourseDetails = () => {
  const { courseCode } = useParams()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch('/data/MOCK_DATA.csv')
        if (!response.ok) throw new Error('Could not load the course data.')

        const { data, errors } = Papa.parse(await response.text(), {
          header: true,
          skipEmptyLines: 'greedy',
        })
        if (errors.length > 0) throw new Error('The course data could not be read.')

        const foundCourse = data.find((item) => item.course_code === courseCode)
        if (!foundCourse) throw new Error('We could not find that course.')
        setCourse(foundCourse)
      } catch (loadError) {
        setError(loadError.message || 'Something went wrong while loading this course.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseCode])

  if (isLoading) return <p className="text-slate-500">Loading course details…</p>

  if (error || !course) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <p role="alert" className="text-slate-600">{error || 'Course not found.'}</p>
        <Link to="/student-dashboard/courses" className="mt-4 inline-flex font-semibold text-indigo-700 hover:text-indigo-900">
          Back to courses
        </Link>
      </section>
    )
  }

  const content = courseContent[course.course_code] || {
    summary: 'Build practical skills with guided lessons, helpful resources, and a hands-on final project.',
    syllabus: [
      'Course foundations and learning setup',
      'Core concepts and essential vocabulary',
      'Tools, workflows, and practical techniques',
      'Guided practice and problem solving',
      'Build and refine a hands-on project',
      'Review, share, and plan your next steps',
    ],
  }
  const resources = [
    { type: 'PDF', title: 'Course overview & learning guide', detail: 'PDF · Course outline' },
    { type: 'DOC', title: 'Day-by-day lesson notes', detail: 'Reading · 6 short lessons' },
    { type: 'ZIP', title: 'Practice files and starter materials', detail: 'Resources · Project files' },
  ]

  return (
    <section className="mx-auto max-w-6xl space-y-7" aria-labelledby="course-title">
      <Link to="/student-dashboard/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
        <span aria-hidden="true">←</span> All courses
      </Link>

      <header className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-sm">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90">{course.course_code}</span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">Enrollment open</span>
            </div>
            <h1 id="course-title" className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">{content.summary}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span><strong className="font-semibold text-white">Duration:</strong> {course.duration}</span>
              <span><strong className="font-semibold text-white">Starts:</strong> {formatDate(course.start_date)}</span>
              <span><strong className="font-semibold text-white">Schedule:</strong> {course.time}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotice('This course is under construction. Enrollment will be available soon.')}
            className="w-full rounded-xl bg-slate-200 px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 lg:w-auto"
          >
            Join course
          </button>
        </div>
      </header>

      {notice && (
        <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className="font-bold text-indigo-700 hover:text-indigo-950">✕</button>
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-7">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9" aria-labelledby="syllabus-heading">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Your learning path</p>
                <h2 id="syllabus-heading" className="mt-1 text-xl font-bold text-slate-900">Course syllabus</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">6 modules</span>
            </div>
            <div className="divide-y divide-slate-100">
              {content.syllabus.slice(0, 6).map((topic, index) => (
                <details key={topic} className="group py-1" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center gap-4 rounded-lg py-3 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">{String(index + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-sm font-semibold text-slate-800">{topic}</span>
                    <span className="text-slate-400 transition group-open:rotate-180" aria-hidden="true">⌄</span>
                  </summary>
                  <p className="pb-4 pl-13 pr-8 text-sm leading-6 text-slate-500">A focused lesson with a short walkthrough, guided practice, and a quick knowledge check.</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9" aria-labelledby="materials-heading">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Learn at your pace</p>
              <h2 id="materials-heading" className="mt-1 text-xl font-bold text-slate-900">Course materials</h2>
              <p className="mt-1 text-sm text-slate-500">Guides, lesson notes, and files for your coursework.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => (
                <button
                  key={resource.title}
                  type="button"
                  onClick={() => setNotice(`${resource.title} will be available when course materials are published.`)}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-extrabold text-slate-600">{resource.type}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{resource.title}</span><span className="mt-1 block text-xs text-slate-500">{resource.detail}</span></span>
                  <span className="ml-auto text-slate-400" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9" aria-labelledby="videos-heading">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Watch and practice</p>
              <h2 id="videos-heading" className="mt-1 text-xl font-bold text-slate-900">Video lessons</h2>
              <p className="mt-1 text-sm text-slate-500">Follow the course one day at a time.</p>
            </div>
            {activeVideo !== null && (
              <div className="mb-4 rounded-xl bg-slate-900 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Player area · Day {activeVideo + 1}</p>
                <p className="mt-2 text-sm text-slate-300">The video player will be connected here.</p>
                {/* TODO: Add a video player here or navigate to a dedicated lesson playback route. */}
              </div>
            )}
            <ol className="space-y-2">
              {content.syllabus.slice(0, 6).map((topic, index) => (
                <li key={topic}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideo(index)
                      setNotice('Video playback is under construction.')
                    }}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Day {index + 1}</span><span className="mt-1 block truncate text-sm font-semibold text-slate-800">{topic}</span></span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600" aria-label={`Play Day ${index + 1}`}>▶</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9" aria-labelledby="assessment-heading">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Show what you know</p>
            <h2 id="assessment-heading" className="mt-1 text-xl font-bold text-slate-900">Assessments & assignments</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl bg-slate-50 p-6">
                <span className="text-xs font-bold uppercase tracking-wide text-indigo-700">Assessment</span>
                <h3 className="mt-2 font-semibold text-slate-900">Module knowledge checks</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Quick practice questions help you review key ideas after each lesson.</p>
              </article>
              <article className="rounded-xl bg-slate-50 p-6">
                <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Assignment</span>
                <h3 className="mt-2 font-semibold text-slate-900">Final hands-on project</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Put your new skills together in a practical project to share with your instructor.</p>
              </article>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm" aria-labelledby="instructor-heading">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Learn from an expert</p>
            <h2 id="instructor-heading" className="mt-1 text-lg font-bold text-slate-900">Your instructor</h2>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">{course.instructor.charAt(0)}</div>
              <div><p className="font-semibold text-slate-900">{course.instructor}</p><p className="mt-0.5 text-xs text-slate-500">Course instructor</p></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">Your instructor will guide you through the lessons and provide support along the way.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm" aria-labelledby="participants-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="participants-heading" className="text-lg font-bold text-slate-900">Participants</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Class group</span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3.5 19v-1.2A4.3 4.3 0 0 1 7.8 13.5h2.4a4.3 4.3 0 0 1 4.3 4.3V19M16 5.5a3 3 0 0 1 0 5.8m1.2 2.5a4.2 4.2 0 0 1 3.3 4.1V19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm leading-5 text-slate-600">Classmates and their course activity will appear here as they join.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-7" aria-label="Course at a glance">
            <h2 className="font-bold text-slate-900">Course at a glance</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-slate-500">Duration</dt><dd className="mt-1 font-semibold text-slate-800">{course.duration}</dd></div>
              <div><dt className="text-slate-500">First session</dt><dd className="mt-1 font-semibold text-slate-800">{formatDate(course.start_date)}</dd></div>
              <div><dt className="text-slate-500">Meeting time</dt><dd className="mt-1 font-semibold text-slate-800">{course.time}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default CourseDetails
