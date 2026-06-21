import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewTripPage from './pages/NewTripPage'
import './App.css'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/delegacje/nowa" element={< NewTripPage />} />
            <Route path="/delegacje" element={<div>Delegacje (coming soon)</div>} />
            <Route path="/pojazdy" element={<div>Pojazdy (coming soon)</div>} />
            <Route path="/profil" element={<div>Profil (coming soon)</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
