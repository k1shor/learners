import { useEffect, useState } from 'react'

const initialClasses = [
	{ id: 'CLS-2401', name: 'Frontend Development — Cohort A', course: 'Introduction to Web Development', teacher: 'Ava Thompson', schedule: 'Mon, Wed, Fri · 9:00 AM', room: 'Room 204', students: 24, status: 'In progress' },
	{ id: 'CLS-2402', name: 'Python Analytics — Evening', course: 'Python for Data Analysis', teacher: 'Liam Patel', schedule: 'Tue, Thu · 6:30 PM', room: 'Virtual room 1', students: 18, status: 'Upcoming' },
	{ id: 'CLS-2403', name: 'Product Design — Cohort B', course: 'UI/UX Design Fundamentals', teacher: 'Mia Chen', schedule: 'Mon, Wed · 1:00 PM', room: 'Design lab', students: 16, status: 'In progress' },
	{ id: 'CLS-2404', name: 'Frontend Development — Cohort B', course: 'Introduction to Web Development', teacher: 'Ava Thompson', schedule: 'Sat · 10:00 AM', room: 'Virtual room 2', students: 21, status: 'Upcoming' },
	{ id: 'CLS-2405', name: 'Data Analysis — Cohort A', course: 'Python for Data Analysis', teacher: 'Liam Patel', schedule: 'Sun · 11:00 AM', room: 'Room 108', students: 19, status: 'Completed' },
]

const statusStyles = {
	'In progress': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
	Upcoming: 'bg-blue-50 text-blue-700 ring-blue-600/20',
	Completed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

const Classes = () => {
	const [classList, setClassList] = useState(() => {
		try {
			const savedClasses = window.localStorage.getItem('learnershub-admin-classes')
			return savedClasses ? JSON.parse(savedClasses) : initialClasses
		} catch {
			return initialClasses
		}
	})
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('All classes')
	const [isAddFormOpen, setIsAddFormOpen] = useState(false)

	useEffect(() => {
		window.localStorage.setItem('learnershub-admin-classes', JSON.stringify(classList))
	}, [classList])

	const filteredClasses = classList.filter((classItem) => {
		const matchesQuery = `${classItem.name} ${classItem.course} ${classItem.teacher} ${classItem.id}`
			.toLowerCase()
			.includes(query.toLowerCase())
		return matchesQuery && (statusFilter === 'All classes' || classItem.status === statusFilter)
	})

	const stats = [
		{ label: 'Total classes', value: classList.length, icon: '▣', color: 'bg-indigo-50 text-indigo-700' },
		{ label: 'In progress', value: classList.filter((item) => item.status === 'In progress').length, icon: '◷', color: 'bg-emerald-50 text-emerald-700' },
		{ label: 'Upcoming', value: classList.filter((item) => item.status === 'Upcoming').length, icon: '↗', color: 'bg-blue-50 text-blue-700' },
		{ label: 'Enrolled learners', value: classList.reduce((total, item) => total + item.students, 0), icon: '♙', color: 'bg-amber-50 text-amber-700' },
	]

	const addClass = (event) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const newClass = {
			id: `CLS-${Date.now().toString().slice(-6)}`,
			name: formData.get('name').trim(),
			course: formData.get('course').trim(),
			teacher: formData.get('teacher').trim(),
			schedule: formData.get('schedule').trim(),
			room: formData.get('room').trim(),
			students: Number(formData.get('students')),
			status: formData.get('status'),
		}
		setClassList((currentClasses) => [newClass, ...currentClasses])
		setIsAddFormOpen(false)
	}

	const dismissClass = (id) => {
		setClassList((currentClasses) => currentClasses.filter((classItem) => classItem.id !== id))
	}

	return (
		<section className="mx-auto max-w-7xl space-y-7" aria-labelledby="classes-title">
			<header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Admin portal / Classes</p>
					<h1 id="classes-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Class management</h1>
					<p className="mt-2 text-slate-500">View class schedules, instructors, and learner enrollment.</p>
				</div>
				<button type="button" onClick={() => setIsAddFormOpen(true)} className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100">+ Add class</button>
			</header>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p></div>
							<span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.color}`} aria-hidden="true">{stat.icon}</span>
						</div>
					</article>
				))}
			</div>

			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="class-list-title">
				<div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 id="class-list-title" className="text-lg font-bold text-slate-900">All classes</h2>
						<p className="mt-1 text-sm text-slate-500">{classList.length} scheduled {classList.length === 1 ? 'class' : 'classes'}.</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<label className="relative">
							<span className="sr-only">Search classes</span>
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden="true">⌕</span>
							<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search classes..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-56" />
						</label>
						<label>
							<span className="sr-only">Filter by class status</span>
							<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-40">
								<option>All classes</option>
								<option>In progress</option>
								<option>Upcoming</option>
								<option>Completed</option>
							</select>
						</label>
					</div>
				</div>

				<div className="overflow-x-auto">
					  <table className="w-full min-w-225 text-left text-sm">
						<thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
							<tr>
								<th scope="col" className="px-5 py-3.5 font-semibold">Class</th>
								<th scope="col" className="px-5 py-3.5 font-semibold">Instructor</th>
								<th scope="col" className="px-5 py-3.5 font-semibold">Schedule & room</th>
								<th scope="col" className="px-5 py-3.5 font-semibold">Learners</th>
								<th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
								<th scope="col" className="px-5 py-3.5 text-right font-semibold">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filteredClasses.map((classItem) => (
								<tr key={classItem.id} className="transition hover:bg-slate-50/70">
									<td className="px-5 py-4">
										<p className="font-semibold text-slate-900">{classItem.name}</p>
										<p className="mt-1 text-xs text-slate-500">{classItem.id} · {classItem.course}</p>
									</td>
									<td className="px-5 py-4 font-medium text-slate-700">{classItem.teacher}</td>
									<td className="px-5 py-4">
										<p className="font-medium text-slate-700">{classItem.schedule}</p>
										<p className="mt-1 text-xs text-slate-500">{classItem.room}</p>
									</td>
									<td className="px-5 py-4 font-semibold text-slate-700">{classItem.students}</td>
									<td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[classItem.status]}`}>{classItem.status}</span></td>
									<td className="px-5 py-4 text-right"><button type="button" onClick={() => dismissClass(classItem.id)} aria-label={`Dismiss ${classItem.name}`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200">Dismiss</button></td>
								</tr>
							))}
							{filteredClasses.length === 0 && (
								<tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500">No classes match your search.</td></tr>
							)}
						</tbody>
					</table>
				</div>
				<footer className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {filteredClasses.length} of {classList.length} classes</footer>
			</section>

			{isAddFormOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddFormOpen(false) }}>
					<section role="dialog" aria-modal="true" aria-labelledby="add-class-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
						<div className="mb-6 flex items-start justify-between gap-4">
							<div><h2 id="add-class-title" className="text-xl font-bold text-slate-900">Add a class</h2><p className="mt-1 text-sm text-slate-500">Enter the schedule and class details below.</p></div>
							<button type="button" onClick={() => setIsAddFormOpen(false)} aria-label="Close form" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
						</div>
						<form onSubmit={addClass} className="grid gap-4 sm:grid-cols-2">
							<label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Class name</span><input name="name" required maxLength="80" placeholder="e.g. Frontend Development — Cohort C" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Course</span><input name="course" required maxLength="80" placeholder="Course name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Instructor</span><input name="teacher" required maxLength="60" placeholder="Instructor name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Schedule</span><input name="schedule" required maxLength="60" placeholder="e.g. Tue, Thu · 6:30 PM" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Room</span><input name="room" required maxLength="50" placeholder="Room or virtual room" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Learners enrolled</span><input name="students" type="number" min="0" max="500" defaultValue="0" required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
							<label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span><select name="status" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"><option>Upcoming</option><option>In progress</option><option>Completed</option></select></label>
							<div className="mt-2 flex justify-end gap-3 sm:col-span-2">
								<button type="button" onClick={() => setIsAddFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
								<button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save class</button>
							</div>
						</form>
					</section>
				</div>
			)}
		</section>
	)
}

export default Classes
