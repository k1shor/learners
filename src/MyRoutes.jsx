import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/student/Homepage'
import AdminPage from './pages/admin/AdminPage'
import Layout from './components/layout/public/Layout'

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/admin' element={<AdminPage />} />
                <Route path='/' element={<Layout />} >
                    <Route index element={<Homepage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes