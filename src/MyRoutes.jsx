import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import StudentDashboard from './pages/StudentDashboard'
import Layout from './component/layout/public/Layout'
import SidebarLayout from './component/sidebar/SidebarLayout'

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Homepage />} />
                </Route>
                <Route path='/student-dashboard' element={<SidebarLayout />}>
                    <Route index element={<StudentDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes