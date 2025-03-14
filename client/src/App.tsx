import './styles/App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import AnalysisPage from './pages/AnalysisPage/AnalysisPage'
import VulnerabilitiesPage from './pages/VulnerabilitiesPage/VulnerabilitiesPage'
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
          element={<AnalysisPage />}
        />
        <Route
          path='/leaks'
          element={<VulnerabilitiesPage />}
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