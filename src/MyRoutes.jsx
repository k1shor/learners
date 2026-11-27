import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Admin from './pages/Admin'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import Demo from './pages/Demo'
import Homepage from './pages/Homepage'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

const RequireAuth = ({ isAuthenticated, children }) => {
  const location = useLocation()

  return isAuthenticated
    ? children
    : <Navigate to="/" replace state={{ from: location }} />
}

const MyRoutes = ({ isAuthenticated, onLogin, onSignup, profile, onUpdateProfile }) => {
  return (
    <Routes>
      <Route index element={<Homepage isAuthenticated={isAuthenticated} />} />
      <Route path="/demo" element={<Demo onLogin={onLogin} />} />
      <Route path="/signup" element={<Signup onSignup={onSignup} />} />
      <Route path="/profile" element={(
        <RequireAuth isAuthenticated={isAuthenticated}>
          <Profile profile={profile} onUpdateProfile={onUpdateProfile} />
        </RequireAuth>
      )} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        }
      />
      <Route path="/dashboard" element={(
        <RequireAuth isAuthenticated={isAuthenticated}>
          <Dashboard profile={profile} />
        </RequireAuth>
      )} />
      <Route path="/admin" element={(
        <RequireAuth isAuthenticated={isAuthenticated}>
          <Admin />
        </RequireAuth>
      )} />
      <Route path="/courses/:courseCode" element={(
        <RequireAuth isAuthenticated={isAuthenticated}>
          <CourseDetail />
        </RequireAuth>
      )} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default MyRoutes