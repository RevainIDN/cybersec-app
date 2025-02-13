import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import IpPage from './pages/IpPage/IpPage'
import LeaksPage from './pages/LeaksPage/LeaksPage'
import PasswordsPage from './pages/PasswordsPage/PasswordsPage'
import ReportsPage from './pages/ReportsPage/ReportsPage'

export default function App() {
  const [count, setCount] = useState(0)

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