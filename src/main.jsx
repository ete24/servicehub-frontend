// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Assuming you have a global CSS file
import { BrowserRouter } from 'react-router-dom'; // Assuming you are using React Router
// FIX: Change AuthContext to AuthContext.jsx
import { AuthProvider } from './context/AuthContext.jsx'; // Import your AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap your entire application with AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);