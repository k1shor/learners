import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContextValue'
import { demoUsers } from './demoUsers'

const STORAGE_KEY = 'learnershub-auth-user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = window.localStorage.getItem(STORAGE_KEY)
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const login = ({ email, password }) => {
    const normalizedEmail = String(email ?? '').trim().toLowerCase()
    const matchedUser = Object.values(demoUsers).find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === String(password ?? ''),
    )

    if (!matchedUser) {
      return {
        success: false,
        message: 'Invalid email or password. Use one of the demo accounts below.',
      }
    }

    const authUser = {
      id: matchedUser.email,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    }

    setUser(authUser)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))

    return { success: true, user: authUser }
  }

  const registerNewUser = ({ name, email, password, role }) => {
    const normalizedEmail = String(email ?? '').trim().toLowerCase()

    if (!normalizedEmail || !password || !role) {
      return {
        success: false,
        message: 'Please complete the required information to create an account.',
      }
    }

    const authUser = {
      id: normalizedEmail,
      name: name || 'New User',
      email: normalizedEmail,
      role,
    }

    setUser(authUser)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))

    return { success: true, user: authUser }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      registerNewUser,
      logout,
      hasRole: (role) => user?.role === role,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
