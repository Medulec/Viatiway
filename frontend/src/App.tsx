import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
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
        <Route path="/" element={<PrivateRoute><div>Dashboard</div></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
