import { AuthAttributesProvider } from '@/context/AuthAttributsContext';
import './index.css'
import App from './App.jsx'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthAttributesProvider>
      <App />
    </AuthAttributesProvider>
  </StrictMode>,
)
