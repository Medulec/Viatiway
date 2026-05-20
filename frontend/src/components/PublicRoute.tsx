import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (user) return <Navigate to="/" />

  return children
}
