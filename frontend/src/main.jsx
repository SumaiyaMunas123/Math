import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Configure axios base URL from environment variable
// In Vite use VITE_API_BASE (e.g. https://your-backend.example.com)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
