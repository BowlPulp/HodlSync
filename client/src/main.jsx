import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop.jsx';
import { inject } from '@vercel/analytics'

inject()

createRoot(document.getElementById('root')).render(
    <BrowserRouter>   {/* Wrap your App component with BrowserRouter */}
      <App />
      <ToastContainer/>
     <ScrollToTop />
    </BrowserRouter>,
);
