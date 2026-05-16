// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User, Trip } from '../types'
import {TopBar, HeaderSection, DashboardSkeleton, TripsSection} from '../components/dashboard'


export default function DashboardPage() {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.id, name: payload.name, email: payload.email, accessLevel: payload.accessLevel }
})

    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
        navigate('/login')
        return
    }
       fetch('/api/v1/trips', {
            headers: { Authorization: `Bearer ${token}`}
        }).then(res => {
            if (!res.ok) throw new Error('Coś sie zespuło')
            return res.json();
        })
        .then(data => {
            setTrips(data)
            setLoading(false)
        })
        .catch(err => {
            setError(err.message)
            setLoading(false)
        })
    }, [navigate])

    if (loading) return <DashboardSkeleton />
    if (error)   return <div>{error}</div>
    
    return (
        <div>
            <TopBar user={user} />
            <HeaderSection user={user} trips={trips} />
            <TripsSection trips={trips} />
        </div>
    )
}

