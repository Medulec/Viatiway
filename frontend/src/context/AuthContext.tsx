import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '../lib/api'

interface User {
  id:          string
  name:        string
  email:       string
  accessLevel: string
}

interface AuthContextValue {
  user:      User | null
  isLoading: boolean
  setUser:   (user: User | null) => void
  logout:    () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    await api.post('/api/v1/auth/logout')
    setUser(null)
  }, [])

  // Sprawdź sesję przy starcie aplikacji
  useEffect(() => {
    api.get('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // Nasłuchuj na wygaśnięcie sesji (rzucane przez api.ts po nieudanym refresh)
  useEffect(() => {
    const handleExpired = () => setUser(null)
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth musi być użyty wewnątrz AuthProvider')
  return ctx
}
