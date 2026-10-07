import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Key, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { adminLogin } from '../services/api';

export default function AdminLoginPage({ onToast, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin({ username, password });
      if (res.success) {
        if (onToast) onToast(`Welcome back, ${res.user?.name || 'Administrator'}!`, 'success');
        if (onLoginSuccess) onLoginSuccess(res.user);
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
      if (onToast) onToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo/sde-logo.svg" alt="SDE logo" className="admin-login-logo" />
          <h2 style={{ fontSize: '24px', color: 'var(--navy-deep)', marginBottom: '6px' }}>
            Admin Portal Login
          </h2>
          <p style={{ color: 'var(--steel)', fontSize: '13.5px' }}>
            Shree Dipeshwari Engineering CMS &amp; RFQ Management
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username or Admin Email</label>
            <div className="admin-input-group">
              <User size={16} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="admin-input-group">
              <Key size={16} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-orange" 
            style={{ width: '100%', marginTop: '8px', padding: '13px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="admin-credentials-hint">
            <strong>Default Access Credentials:</strong><br />
            Username: <code className="mono">admin</code> &nbsp;|&nbsp; Password: <code className="mono">admin123</code>
          </div>

          <Link to="/" className="admin-back-link">
            <ArrowLeft size={14} /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
