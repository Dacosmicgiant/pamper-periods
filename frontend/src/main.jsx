import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)
