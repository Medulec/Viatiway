import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/delegacje" element={
          <PrivateRoute>
            <div>Delegacje (coming soon)</div>
          </PrivateRoute>
        } />
        <Route path="/pojazdy" element={
          <PrivateRoute>
            <div>Pojazdy (coming soon)</div>
          </PrivateRoute>
        } />
        <Route path="/profil" element={
          <PrivateRoute>
            <div>Profil (coming soon)</div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
