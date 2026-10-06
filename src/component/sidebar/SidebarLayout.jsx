import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from '../layout/public/Header'
import Footer from '../layout/public/Footer'

const SidebarLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
    <Header studentMode />
    <div className="flex flex-1 flex-col pt-28 md:flex-row md:pt-16">
      <Sidebar />
      <main className="min-w-0 flex-1 p-5 sm:p-8 md:p-10">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
)

export default SidebarLayout
