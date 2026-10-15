
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import Matches from './pages/Matches'
import Predictions from './pages/Predictions'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import AdminMatches from './pages/AdminMatches'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
