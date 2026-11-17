import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const ProtectedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard',
    }

    return <Navigate to={redirectMap[user.role] ?? '/'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
