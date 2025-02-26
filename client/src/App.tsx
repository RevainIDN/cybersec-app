import './styles/App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import IpPage from './pages/AnalysisPage/AnalysisPage'
import LeaksPage from './pages/LeaksPage/LeaksPage'
import PasswordsPage from './pages/PasswordsPage/PasswordsPage'
import ReportsPage from './pages/ReportsPage/ReportsPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/ip'
          element={<IpPage />}
        />
        <Route
          path='/leaks'
          element={<LeaksPage />}
        />
        <Route
          path='/passwords'
          element={<PasswordsPage />}
        />
        <Route
          path='/reports'
          element={<ReportsPage />}
        />
      </Routes>
    </>
  )
}