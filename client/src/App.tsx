import './styles/App.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, clearToken } from './store/authSlice'
import { AppDispatch, RootState } from './store'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import AnalysisPage from './pages/AnalysisPage/AnalysisPage'
import VulnerabilitiesPage from './pages/VulnerabilitiesPage/VulnerabilitiesPage'
import PasswordsPage from './pages/PasswordsPage/PasswordsPage'
import ReportsPage from './pages/ReportsPage/ReportsPage'
import AuthorizationPage from './pages/AuthorizationPage/AuthorizationPage'
import AccountPage from './pages/AccountPage/AccountPage'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import AssistantButton from './components/AIAssistant/AssistantButton/AssistantButton'
import AssistantChat from './components/AIAssistant/AssistantChat/AssistantChat'
import Overlay from './components/GeneralComponents/Overlay/Overlay'
import Loading from './components/GeneralComponents/Loading/Loading'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function App() {
  // Инициализация диспетчера Redux и получение состояний
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const overlay = useSelector((state: RootState) => state.general.overlay);
  const isOpenChatAssistant = useSelector((state: RootState) => state.assistant.isOpenChatAssistant);

  // Функция для очистки токена из хранилища и Redux
  const clearStoredToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    dispatch(clearToken());
  };

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      axios
        .get(`${SERVER_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        .then(res => {
          if (res.status >= 200 && res.status < 300) {
            dispatch(setToken(savedToken));
          } else {
            clearStoredToken();
          }
        })
        .catch(err => {
          console.error('Ошибка запроса:', err);
          clearStoredToken();
        });
    } else {
      dispatch(clearToken());
    }
  }, [dispatch]);

  // Отображение загрузки во время проверки токена
  if (isLoading) {
    return <div style={{ marginTop: 200 }}><Loading /></div>;
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
        <Route
          path='*'
          element={<ErrorPage />}
        />
      </Routes>
      {isOpenChatAssistant && <AssistantChat key="chat" />}
      {!isOpenChatAssistant && <AssistantButton key="button" />}
      {overlay && <Overlay key="overlay" />}
    </>
  )
}