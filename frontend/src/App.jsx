import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { isUserLoggedIn } from './services/api';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <Routes>
        {/* Public Website Single Page URL */}
        <Route 
          path="/" 
          element={<HomePage onToast={addToast} />} 
        />

        {/* Dedicated Admin Portal URLs */}
        <Route 
          path="/admin" 
          element={
            isUserLoggedIn() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLoginPage onToast={addToast} onLoginSuccess={setAdminUser} />
            )
          } 
        />

        <Route 
          path="/admin/login" 
          element={<AdminLoginPage onToast={addToast} onLoginSuccess={setAdminUser} />} 
        />

        <Route 
          path="/admin/dashboard" 
          element={<AdminDashboardPage onToast={addToast} />} 
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
