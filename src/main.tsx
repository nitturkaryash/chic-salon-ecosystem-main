import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import './index.css'

const basename = process.env.NODE_ENV === 'production' ? '/chic-salon-ecosystem-main' : '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Dashboard />
    </BrowserRouter>
  </React.StrictMode>,
) 