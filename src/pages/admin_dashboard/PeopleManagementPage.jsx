import { useMemo, useState } from 'react'
import useAdminData from './useAdminData'

const EMPTY_PEOPLE = []

const PeopleManagementPage = ({ type }) => {
  const isTeacher = type === 'teachers'
  const title = isTeacher ? 'Teachers & instructors' : 'Students'
  const singular = isTeacher ? 'instructor' : 'student'
  const [data, updateData] = useAdminData()
  const people = data[type] || EMPTY_PEOPLE
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All accounts')
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)

  const filteredPeople = useMemo(() => people.filter((person) => {
    const matchesQuery = `${person.name} ${person.email || ''} ${person.id} ${person.subject || person.program || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
    return matchesQuery && (statusFilter === 'All accounts' || person.status === statusFilter)
  }), [people, query, statusFilter])

  const activeCount = people.filter((person) => person.status === 'Active').length
  const disabledCount = people.length - activeCount

  const addPerson = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const person = {
      id: `${isTeacher ? 'TC' : 'ST'}-${Date.now().toString().slice(-6)}`,
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      status: 'Active',
      joined: new Date().toISOString().slice(0, 10),
      ...(isTeacher
        ? { subject: formData.get('subject').trim(), experience: formData.get('experience').trim() }
        : { program: formData.get('program').trim(), progress: 'New learner' }),
    }
    updateData((currentData) => ({ ...currentData, [type]: [person, ...(currentData[type] || [])] }))
    setIsAddFormOpen(false)
    event.currentTarget.reset()
  }

  const toggleStatus = (person) => {
    const nextStatus = person.status === 'Active' ? 'Disabled' : 'Active'
    updateData((currentData) => ({
      ...currentData,
      [type]: currentData[type].map((item) => item.id === person.id ? { ...item, status: nextStatus } : item),
    }))
    if (selectedPerson?.id === person.id) setSelectedPerson({ ...person, status: nextStatus })
  }

  const detailItems = selectedPerson && [
    ['Account ID', selectedPerson.id],
    ['Email', selectedPerson.email || 'Not provided'],
    ['Phone', selectedPerson.phone || 'Not provided'],
    [isTeacher ? 'Subject / expertise' : 'Program', selectedPerson.subject || selectedPerson.program || 'Not assigned'],
    ...(isTeacher ? [['Experience', selectedPerson.experience || 'Not provided']] : [['Learning progress', selectedPerson.progress || 'Not started']]),
    ['Joined', selectedPerson.joined || 'Not recorded'],
    ['Account status', selectedPerson.status],
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-7" aria-labelledby="people-title">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Admin portal / {isTeacher ? 'Teachers' : 'Students'}</p>
          <h1 id="people-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{isTeacher ? 'Instructor management' : 'Student management'}</h1>
          <p className="mt-2 text-slate-500">View account details, add {isTeacher ? 'instructors' : 'students'}, and manage access.</p>
        </div>
        <button type="button" onClick={() => setIsAddFormOpen(true)} className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100">+ Add {singular}</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: `Total ${isTeacher ? 'instructors' : 'students'}`, value: people.length, icon: isTeacher ? '♧' : '♙', color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Active accounts', value: activeCount, icon: '✓', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Disabled accounts', value: disabledCount, icon: '⊘', color: 'bg-amber-50 text-amber-700' },
        ].map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.color}`} aria-hidden="true">{stat.icon}</span></div>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="people-list-title">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 id="people-list-title" className="text-lg font-bold text-slate-900">All {isTeacher ? 'instructors' : 'students'}</h2><p className="mt-1 text-sm text-slate-500">Select a person to view their account details.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative"><span className="sr-only">Search {title.toLowerCase()}</span><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${isTeacher ? 'instructors' : 'students'}...`} className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-56" /></label>
            <label><span className="sr-only">Filter by account status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-40"><option>All accounts</option><option>Active</option><option>Disabled</option></select></label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th scope="col" className="px-5 py-3.5 font-semibold">Name</th><th scope="col" className="px-5 py-3.5 font-semibold">{isTeacher ? 'Subject / expertise' : 'Program'}</th><th scope="col" className="px-5 py-3.5 font-semibold">Contact</th><th scope="col" className="px-5 py-3.5 font-semibold">Status</th><th scope="col" className="px-5 py-3.5 text-right font-semibold">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPeople.map((person) => (
                <tr key={person.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4"><button type="button" onClick={() => setSelectedPerson(person)} className="text-left font-semibold text-slate-900 hover:text-indigo-700 focus:outline-none focus:underline">{person.name}</button><p className="mt-1 text-xs text-slate-500">{person.id}</p></td>
                  <td className="px-5 py-4 text-slate-600">{person.subject || person.program || 'Not assigned'}</td>
                  <td className="px-5 py-4"><p className="font-medium text-slate-700">{person.email || 'No email'}</p><p className="mt-1 text-xs text-slate-500">{person.phone || 'No phone'}</p></td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${person.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{person.status}</span></td>
                  <td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button type="button" onClick={() => setSelectedPerson(person)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50">Details</button><button type="button" onClick={() => toggleStatus(person)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-50">{person.status === 'Active' ? 'Disable' : 'Activate'}</button></div></td>
                </tr>
              ))}
              {filteredPeople.length === 0 && <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">No {isTeacher ? 'instructors' : 'students'} match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {filteredPeople.length} of {people.length} accounts</footer>
      </section>

      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddFormOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-person-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="add-person-title" className="text-xl font-bold text-slate-900">Add {singular}</h2><p className="mt-1 text-sm text-slate-500">Create an active account in the admin directory.</p></div><button type="button" onClick={() => setIsAddFormOpen(false)} aria-label="Close form" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button></div>
            <form onSubmit={addPerson} className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Full name</span><input name="name" required maxLength="80" autoComplete="name" placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Email address</span><input name="email" type="email" required maxLength="120" autoComplete="email" placeholder="name@example.com" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span><input name="phone" type="tel" maxLength="30" autoComplete="tel" placeholder="Phone number" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
              {isTeacher ? <><label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Subject / expertise</span><input name="subject" required maxLength="80" placeholder="e.g. Web development" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label><label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Experience</span><input name="experience" maxLength="50" placeholder="e.g. 5 years" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label></> : <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Program / course</span><input name="program" required maxLength="80" placeholder="e.g. Web development" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>}
              <div className="mt-2 flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={() => setIsAddFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save {singular}</button></div>
            </form>
          </section>
        </div>
      )}

      {selectedPerson && detailItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPerson(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="person-details-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{isTeacher ? 'Instructor profile' : 'Student profile'}</p><h2 id="person-details-title" className="mt-2 text-2xl font-bold text-slate-900">{selectedPerson.name}</h2></div><button type="button" onClick={() => setSelectedPerson(null)} aria-label="Close details" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button></div>
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100 px-4">{detailItems.map(([label, value]) => <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"><dt className="text-sm text-slate-500">{label}</dt><dd className="text-sm font-semibold text-slate-800 sm:text-right">{value}</dd></div>)}</dl>
            <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={() => toggleStatus(selectedPerson)} className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50">{selectedPerson.status === 'Active' ? 'Disable account' : 'Activate account'}</button><button type="button" onClick={() => setSelectedPerson(null)} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Done</button></div>
          </section>
        </div>
      )}
    </section>
  )
}

export default PeopleManagementPage
