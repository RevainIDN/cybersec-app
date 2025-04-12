import './styles/App.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, clearToken } from './store/authSlice'
import { AppDispatch, RootState } from './store'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import AnalysisPage from './pages/AnalysisPage/AnalysisPage'
import VulnerabilitiesPage from './pages/VulnerabilitiesPage/VulnerabilitiesPage'
import PasswordsPage from './pages/PasswordsPage/PasswordsPage'
import ReportsPage from './pages/ReportsPage/ReportsPage'
import AuthorizationPage from './pages/AuthorizationPage/AuthorizationPage'
import AccountPage from './pages/AccountPage/AccountPage'

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      fetch('http://localhost:5000/auth/users', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(res => {
          if (res.ok) {
            dispatch(setToken(savedToken));
          } else {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            dispatch(clearToken())
          }
        })
        .catch(err => {
          console.error('Ошибка запроса:', err);
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          dispatch(clearToken());
        });
    } else {
      dispatch(clearToken());
    }
  }, [dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/analysis'
          element={<AnalysisPage />}
        />
        <Route
          path='/vulnerabilities'
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
        <Route
          path='/auth'
          element={token
            ? <AccountPage />
            : <AuthorizationPage />}
        />
        <Route
          path='/account'
          element={token
            ? <AccountPage />
            : <AuthorizationPage />}
        />
      </Routes>
    </>
  )
}