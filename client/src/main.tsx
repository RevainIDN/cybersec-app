import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/index.ts';
import './translations/i18n';
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter basename='/cybersec-app/'>
      <App />
    </BrowserRouter>
  </Provider>
)
