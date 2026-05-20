import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/login/HeroSection'
import LoginForm from '../components/login/LoginForm'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const { setUser }           = useAuth()
  const navigate              = useNavigate()

  const handleLogin = async () => {
    setError('')
    try {
      const response = await api.post('/api/v1/auth/login', { email, password })
      const data     = await response.json()

      if (!response.ok) {
        setError(data.message || 'Błąd logowania')
        return
      }

      setUser(data.user)
      navigate('/')
    } catch {
      setError('Błąd połączenia z serwerem')
    }
  }

  return (
    <div style={{ background: 'var(--moss-400)', height: '100svh', display: 'flex', flexDirection: 'column' }}>
      <HeroSection />
      <LoginForm
        email={email}
        password={password}
        error={error}
        onMailChange={setEmail}
        onPassWordChange={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  )
}
