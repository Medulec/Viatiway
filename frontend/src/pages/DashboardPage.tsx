import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { Trip } from '../types'
import { TopBar, HeaderSection, DashboardSkeleton, TripsSection } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function DashboardPage() {
  const { onProfileClick }  = useOutletContext<{ onProfileClick: () => void }>()
  const { user }            = useAuth()
  const navigate            = useNavigate()

  const [trips, setTrips]   = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    api.get('/api/v1/trips')
      .then(res => {
        if (!res.ok) throw new Error('Coś się zespuło')
        return res.json()
      })
      .then(data => {
        setTrips(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <DashboardSkeleton />
  if (error)   return <div>{error}</div>

  return (
    <div>
      <TopBar user={user} onProfileClick={onProfileClick} />
      <HeaderSection user={user} trips={trips} onNewTrip={() => navigate('/delegacje/nowa')} />
      <TripsSection trips={trips} />
    </div>
  )
}
