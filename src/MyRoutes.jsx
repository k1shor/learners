import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'

const MyRoutes = () => {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default MyRoutes