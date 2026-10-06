import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
      <Header />
      <main className="flex-1 pt-24 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default layout