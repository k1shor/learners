import { useMemo, useState } from 'react'
import useAdminData from './useAdminData'

const EMPTY_COURSES = []

const Courses = () => {
	const [data, updateData] = useAdminData()
	const courses = data.courses || EMPTY_COURSES
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('All courses')
	const [isAddFormOpen, setIsAddFormOpen] = useState(false)

	const filteredCourses = useMemo(() => courses.filter((course) => {
		const matchesQuery = `${course.title} ${course.id}`.toLowerCase().includes(query.toLowerCase())
		return matchesQuery && (statusFilter === 'All courses' || course.status === statusFilter)
	}), [courses, query, statusFilter])

	const changeStatus = (course) => {
		const nextStatus = course.status === 'Published' ? 'Draft' : 'Published'
		updateData((currentData) => ({
			...currentData,
			courses: currentData.courses.map((item) => item.id === course.id ? { ...item, status: nextStatus } : item),
		}))
	}

	const addCourse = (event) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const title = formData.get('title').trim()
		const course = {
			id: `CR-${Date.now().toString().slice(-6)}`,
			title,
			status: 'Draft',
		}
		updateData((currentData) => ({ ...currentData, courses: [course, ...(currentData.courses || [])] }))
		event.currentTarget.reset()
		setIsAddFormOpen(false)
	}

	const publishedCount = courses.filter((course) => course.status === 'Published').length

	return (
		<section className="mx-auto max-w-7xl space-y-7" aria-labelledby="courses-title">
			<header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Admin portal / Courses</p>
					<h1 id="courses-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Course management</h1>
					<p className="mt-2 text-slate-500">Keep your course catalog organized and publish courses when they are ready.</p>
				</div>
				<button type="button" onClick={() => setIsAddFormOpen((isOpen) => !isOpen)} className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100">{isAddFormOpen ? 'Cancel' : '+ Add course'}</button>
			</header>

			<div className="grid gap-4 sm:grid-cols-3">
				{[
					{ label: 'Total courses', value: courses.length, color: 'bg-indigo-50 text-indigo-700' },
					{ label: 'Published', value: publishedCount, color: 'bg-emerald-50 text-emerald-700' },
					{ label: 'Drafts', value: courses.length - publishedCount, color: 'bg-amber-50 text-amber-700' },
				].map((stat) => (
					<article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-sm font-medium text-slate-500">{stat.label}</p>
						<p className={`mt-3 text-3xl font-bold tracking-tight ${stat.color.split(' ')[1]}`}>{stat.value}</p>
					</article>
				))}
			</div>

			{isAddFormOpen && (
				<form onSubmit={addCourse} className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
					<label className="flex-1">
						<span className="mb-1.5 block text-sm font-semibold text-slate-700">Course name</span>
						<input name="title" required maxLength="100" placeholder="e.g. Introduction to Graphic Design" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
					</label>
					<button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save as draft</button>
				</form>
			)}

			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="course-list-title">
				<div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div><h2 id="course-list-title" className="text-lg font-bold text-slate-900">Course catalog</h2><p className="mt-1 text-sm text-slate-500">Select Draft or Published to control course visibility.</p></div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<label><span className="sr-only">Search courses</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-56" /></label>
						<label><span className="sr-only">Filter course status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-40"><option>All courses</option><option>Published</option><option>Draft</option></select></label>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-120 text-left text-sm">
						<thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th scope="col" className="px-5 py-3.5 font-semibold">Course</th><th scope="col" className="px-5 py-3.5 font-semibold">Status</th><th scope="col" className="px-5 py-3.5 text-right font-semibold">Action</th></tr></thead>
						<tbody className="divide-y divide-slate-100">
							{filteredCourses.map((course) => (
								<tr key={course.id} className="hover:bg-slate-50/70">
									<td className="px-5 py-4"><p className="font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.id}</p></td>
									<td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{course.status}</span></td>
									<td className="px-5 py-4 text-right"><button type="button" onClick={() => changeStatus(course)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">{course.status === 'Published' ? 'Move to draft' : 'Publish'}</button></td>
								</tr>
							))}
							{filteredCourses.length === 0 && <tr><td colSpan="3" className="px-5 py-12 text-center text-sm text-slate-500">No courses match your search.</td></tr>}
						</tbody>
					</table>
				</div>
				<footer className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {filteredCourses.length} of {courses.length} courses</footer>
			</section>
		</section>
	)
}

export default Courses
