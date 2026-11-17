import { AuthProvider } from './context/AuthContext'
import MyRoutes from './MyRoutes'

const App = () => {
  return (
    <AuthProvider>
      <MyRoutes />
    </AuthProvider>
  )
}

export default App