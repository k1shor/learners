import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'learners-task-list'

const dateFromToday = (offset) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const initialTasks = [
  {
    id: 'task-1',
    title: 'Finish responsive landing page',
    description: 'Polish the mobile layout and check the page at tablet size.',
    course: 'Introduction to Web Development',
    dueDate: dateFromToday(1),
    priority: 'High',
    status: 'in-progress',
  },
  {
    id: 'task-2',
    title: 'Complete JavaScript array exercises',
    description: 'Work through the practice set and submit your solutions.',
    course: 'JavaScript: From Basics to Projects',
    dueDate: dateFromToday(2),
    priority: 'Medium',
    status: 'todo',
  },
  {
    id: 'task-3',
    title: 'Review color and typography notes',
    description: 'Gather a few visual references for your next design study.',
    course: 'UI/UX Design Fundamentals',
    dueDate: dateFromToday(4),
    priority: 'Low',
    status: 'todo',
  },
  {
    id: 'task-4',
    title: 'Clean and inspect the sample dataset',
    description: 'Find missing values and write down three useful observations.',
    course: 'Python for Data Analysis',
    dueDate: dateFromToday(-1),
    priority: 'High',
    status: 'completed',
  },
]

const filters = [
  { label: 'All tasks', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
]

const priorityStyles = {
  High: 'bg-rose-50 text-rose-700 ring-rose-100',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-100',
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const statusStyles = {
  todo: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-indigo-50 text-indigo-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

const statusLabels = {
  todo: 'To do',
  'in-progress': 'In progress',
  completed: 'Completed',
}

const getStoredTasks = () => {
  try {
    const storedTasks = window.localStorage.getItem(STORAGE_KEY)
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks)
      if (Array.isArray(parsedTasks)) return parsedTasks
    }
  } catch {
    // Fall back to the sample tasks if saved data cannot be read.
  }
  return initialTasks
}

const formatDueDate = (dateValue) => {
  const today = new Date(`${dateFromToday(0)}T00:00:00`)
  const dueDate = new Date(`${dateValue}T00:00:00`)
  const dayDifference = Math.round((dueDate - today) / 86400000)

  if (dayDifference === 0) return 'Due today'
  if (dayDifference === 1) return 'Due tomorrow'
  if (dayDifference === -1) return '1 day overdue'
  if (dayDifference < -1) return `${Math.abs(dayDifference)} days overdue`
  if (dayDifference < 7) return `Due in ${dayDifference} days`
  return `Due ${dueDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
}

const Tasks = () => {
  const [tasks, setTasks] = useState(getStoredTasks)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    course: 'Introduction to Web Development',
    dueDate: dateFromToday(3),
    priority: 'Medium',
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The task list remains usable if browser storage is unavailable.
    }
  }, [tasks])

  const taskCounts = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length
    const dueSoon = tasks.filter((task) => {
      if (task.status === 'completed') return false
      const daysUntilDue = Math.round((new Date(`${task.dueDate}T00:00:00`) - new Date(`${dateFromToday(0)}T00:00:00`)) / 86400000)
      return daysUntilDue >= 0 && daysUntilDue <= 3
    }).length

    return {
      all: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      completed,
      dueSoon,
    }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return tasks
      .filter((task) => activeFilter === 'all' || task.status === activeFilter)
      .filter((task) => !normalizedSearch || `${task.title} ${task.description} ${task.course}`.toLowerCase().includes(normalizedSearch))
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
  }, [activeFilter, searchTerm, tasks])

  const updateTaskStatus = (taskId, status) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, status } : task
    )))
  }

  const handleAddTask = (event) => {
    event.preventDefault()
    const title = newTask.title.trim()
    if (!title) return

    setTasks((currentTasks) => [{
      ...newTask,
      id: `task-${Date.now()}`,
      title,
      description: newTask.description.trim(),
      status: 'todo',
    }, ...currentTasks])
    setActiveFilter('all')
    setSearchTerm('')
    setNewTask({
      title: '',
      description: '',
      course: 'Introduction to Web Development',
      dueDate: dateFromToday(3),
      priority: 'Medium',
    })
    setIsAddDialogOpen(false)
  }

  const completionPercent = tasks.length ? Math.round((taskCounts.completed / tasks.length) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl space-y-8" aria-labelledby="tasks-title">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Your learning workspace</p>
          <h1 id="tasks-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Tasks & assignments</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Keep your coursework moving. One small step at a time.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddDialogOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <span className="text-lg leading-none" aria-hidden="true">+</span> Add a task
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Task overview">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">All tasks</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{taskCounts.all}</p>
          <p className="mt-1 text-xs text-slate-400">Across your courses</p>
        </article>
        <article className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">In progress</p>
          <p className="mt-3 text-3xl font-bold text-indigo-950">{taskCounts.inProgress}</p>
          <p className="mt-1 text-xs text-indigo-600/70">Keep up the momentum</p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">Due soon</p>
          <p className="mt-3 text-3xl font-bold text-amber-950">{taskCounts.dueSoon}</p>
          <p className="mt-1 text-xs text-amber-700/70">Within the next 3 days</p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Completed</p>
          <p className="mt-3 text-3xl font-bold text-emerald-950">{taskCounts.completed}</p>
          <p className="mt-1 text-xs text-emerald-700/70">Nice work getting it done</p>
        </article>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="task-list-title">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 id="task-list-title" className="text-lg font-bold text-slate-900">Your task list</h2>
                <p className="mt-1 text-sm text-slate-500">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} to view</p>
              </div>
              <label className="relative block w-full sm:max-w-xs">
                <span className="sr-only">Search tasks</span>
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search tasks or courses"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter tasks">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${activeFilter === filter.value ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                >
                  {filter.label}
                  {filter.value === 'all' && <span className={`ml-2 text-xs ${activeFilter === 'all' ? 'text-indigo-100' : 'text-slate-400'}`}>{taskCounts.all}</span>}
                </button>
              ))}
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600" aria-hidden="true">✓</span>
              <h3 className="mt-4 font-semibold text-slate-900">No tasks found</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Try another filter or search, or add a task to your list.</p>
              <button type="button" onClick={() => setIsAddDialogOpen(true)} className="mt-4 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Add a task</button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleTasks.map((task) => (
                <li key={task.id} className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:px-6">
                  <button
                    type="button"
                    onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                    aria-label={task.status === 'completed' ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                    aria-pressed={task.status === 'completed'}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${task.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-500'}`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" /></svg>
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
                    {task.description && <p className="mt-1 line-clamp-1 text-sm text-slate-500">{task.description}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="max-w-full truncate rounded-md bg-slate-100 px-2 py-1">{task.course}</span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className={task.status !== 'completed' && task.dueDate < dateFromToday(0) ? 'font-semibold text-rose-600' : ''}>{formatDueDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityStyles[task.priority] || priorityStyles.Medium}`}>{task.priority}</span>
                    <label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label>
                    <select
                      id={`status-${task.id}`}
                      value={task.status}
                      onChange={(event) => updateTaskStatus(task.id, event.target.value)}
                      className={`max-w-32 cursor-pointer rounded-full border-0 py-1.5 pl-3 pr-7 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-300 ${statusStyles[task.status] || statusStyles.todo}`}
                    >
                      {filters.slice(1).map((filter) => <option key={filter.value} value={filter.value}>{statusLabels[filter.value]}</option>)}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm" aria-labelledby="progress-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">A little progress, daily</p>
                <h2 id="progress-title" className="mt-2 text-lg font-bold">Your progress</h2>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg" aria-hidden="true">✦</span>
            </div>
            <div className="mt-7 flex items-end justify-between">
              <span className="text-4xl font-bold tracking-tight">{completionPercent}%</span>
              <span className="pb-1 text-sm text-slate-300">of tasks complete</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Tasks completed" aria-valuenow={completionPercent} aria-valuemin="0" aria-valuemax="100">
              <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{taskCounts.completed ? 'Every finished task is a win. Keep building on it.' : 'Finish your first task to start your progress streak.'}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="focus-title">
            <div className="flex items-center justify-between gap-3">
              <h2 id="focus-title" className="font-bold text-slate-900">Quick overview</h2>
              <span className="text-lg" aria-hidden="true">◷</span>
            </div>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Still to do</span><span className="font-semibold text-slate-800">{taskCounts.todo}</span></li>
              <li className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">In progress</span><span className="font-semibold text-slate-800">{taskCounts.inProgress}</span></li>
              <li className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Completed</span><span className="font-semibold text-slate-800">{taskCounts.completed}</span></li>
            </ul>
            <div className="mt-5 rounded-xl bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-900">Make time for learning</p>
              <p className="mt-1 text-xs leading-5 text-indigo-800/80">Pick one task and give it your full focus for 25 minutes.</p>
            </div>
          </section>
        </aside>
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddDialogOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-task-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Stay on track</p>
                <h2 id="add-task-title" className="mt-1 text-xl font-bold text-slate-900">Add a new task</h2>
              </div>
              <button type="button" onClick={() => setIsAddDialogOpen(false)} aria-label="Close add task dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Task name
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={newTask.title}
                  onChange={(event) => setNewTask((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Finish module one assignment"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Description <span className="font-normal text-slate-400">(optional)</span>
                <textarea
                  rows="2"
                  maxLength={200}
                  value={newTask.description}
                  onChange={(event) => setNewTask((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Add a few helpful details"
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Course
                <select value={newTask.course} onChange={(event) => setNewTask((current) => ({ ...current, course: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                  <option>Introduction to Web Development</option>
                  <option>JavaScript: From Basics to Projects</option>
                  <option>UI/UX Design Fundamentals</option>
                  <option>Python for Data Analysis</option>
                  <option>React Application Development</option>
                  <option>Database Design Essentials</option>
                  <option>Personal task</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Due date
                  <input type="date" required value={newTask.dueDate} onChange={(event) => setNewTask((current) => ({ ...current, dueDate: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Priority
                  <select value={newTask.priority} onChange={(event) => setNewTask((current) => ({ ...current, priority: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsAddDialogOpen(false)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
                <button type="submit" className="min-h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Create task</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Tasks
