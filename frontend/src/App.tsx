import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/delegacje" element={<div>Delegacje (coming soon)</div>} />
          <Route path="/pojazdy" element={<div>Pojazdy (coming soon)</div>} />
          <Route path="/profil" element={<div>Profil (coming soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
