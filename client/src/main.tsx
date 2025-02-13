import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './translations/i18n';
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/cybersec-app'>
    <App />
  </BrowserRouter>,
)
