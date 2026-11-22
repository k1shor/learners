import { AuthProvider } from './context/AuthContext'
import MyRoutes from './MyRoutes'
import { ToastProvider } from './components/Toast'

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <MyRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App