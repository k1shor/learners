const AdminUpcomingPage = ({ title }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10" aria-labelledby="upcoming-title">
    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">Admin dashboard</p>
    <h1 id="upcoming-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
    <p className="mt-3 text-slate-500">This page is coming soon.</p>
  </section>
)

export default AdminUpcomingPage
