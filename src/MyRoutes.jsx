import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/student_dashboard/Homepage'
import StudentDashboard from './pages/student_dashboard/StudentDashboard'
import Courses from './pages/student_dashboard/course/Courses'
import CourseDetails from './pages/student_dashboard/course/CourseDetails'
import Tasks from './pages/student_dashboard/Tasks'
import Certification from './pages/student_dashboard/Certification'
import Referral from './pages/student_dashboard/Referral'
import Payment from './pages/student_dashboard/Payment'
import Login from './pages/student_dashboard/login/Login'
import SignIn from './pages/student_dashboard/login/SignIn'
import TeacherDashboard from './pages/teacher_dashboard/TeacherDashboard'
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
                <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
                <Route path='/student-dashboard' element={<SidebarLayout />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path='courses' element={<Courses />} />
                    <Route path='courses/:courseCode' element={<CourseDetails />} />
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