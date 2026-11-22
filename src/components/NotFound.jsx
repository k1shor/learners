import { Link } from 'react-router-dom'

const NotFound = () => (
  <section className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 text-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">This page could not be found</h1>
      <p className="mt-4 text-slate-500">The link may be incorrect, or the page may have moved.</p>
      <Link to="/" className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
        Back to homepage
      </Link>
    </div>
  </section>
)

export default NotFound
