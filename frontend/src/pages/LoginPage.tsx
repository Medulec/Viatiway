import { useState } from 'react'
import HeroSection from '../components/login/HeroSection'
import LoginForm from '../components/login/LoginForm'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Błąd logowania')
        return
      }

      localStorage.setItem('token', data.token)
      window.location.href = '/'
    } catch {
      setError('Błąd połączenia z serwerem')
    }
  }

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100svh' }}>
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