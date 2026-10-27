import { Link, Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

const AdminSidebarLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-800">
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <Link to="/admin-dashboard" className="text-lg font-extrabold tracking-tight text-slate-900">Learners<span className="text-indigo-600">Hub</span></Link>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">Admin workspace</span>
        <Link to="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Exit</Link>
      </div>
    </header>
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-9">
        <Outlet />
      </main>
    </div>
  </div>
)

export default AdminSidebarLayout
