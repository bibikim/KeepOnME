import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../api/authApi'
import { TOKEN_STORAGE_KEY, UNAUTHORIZED_EVENT } from '../api/client'
import type { LoginPayload, SignupPayload, User } from '../types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const login = async (payload: LoginPayload) => {
    const { accessToken, user: loggedInUser } = await authApi.login(payload)
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
    setUser(loggedInUser)
  }

  const signup = async (payload: SignupPayload) => {
    const { accessToken, user: signedUpUser } = await authApi.signup(payload)
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
    setUser(signedUpUser)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
