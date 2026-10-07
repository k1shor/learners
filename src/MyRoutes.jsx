import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import StudentDashboard from './pages/StudentDashboard'
import Courses from './pages/Courses'
import Tasks from './pages/Tasks'
import Certification from './pages/Certification'
import Referral from './pages/Referral'
import Payment from './pages/Payment'
import Login from './pages/login/Login'
import SignIn from './pages/login/SignIn'
import Layout from './component/layout/public/Layout'
import SidebarLayout from './component/sidebar/SidebarLayout'

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path='login' element={<Login />} />
                    <Route path='signin' element={<SignIn />} />
                </Route>
                <Route path='/student-dashboard' element={<SidebarLayout />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path='courses' element={<Courses />} />
                    <Route path='tasks' element={<Tasks />} />
                    <Route path='certification' element={<Certification />} />
                    <Route path='referral' element={<Referral />} />
                    <Route path='payment' element={<Payment />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes