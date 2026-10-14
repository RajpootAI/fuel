import React, { useState } from 'react';
import { 
  Fuel, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { authenticate } from '../services/storage';

export default function Login({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your username or email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = authenticate(identifier, password);
      setLoading(false);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 200);
  };

  return (
    <div className="login-page-container">
      <div className="login-bg-overlay" />

      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header Brand */}
          <div className="login-header">
            <div className="login-logo-badge">
              <Fuel size={32} strokeWidth={2.4} />
            </div>
            <h1 className="login-title">FuelFlow</h1>
            <p className="login-subtitle">
              Company Fleet & Fuel Voucher Management System
            </p>
            <div className="login-pill-badge">
              <ShieldCheck size={14} style={{ color: '#2563EB' }} />
              <span>Production Portal • Secure Access</span>
            </div>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="login-error-banner">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: '#2563EB' }} />
                Username or Email
              </label>
              <input 
                type="text"
                className="form-input"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} style={{ color: '#2563EB' }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          {/* First Time Setup Hint for Master Admin */}
          <div className="credentials-hint-card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1E3A8A', fontSize: '0.8rem', marginBottom: '6px' }}>
              <KeyRound size={15} />
              <span>Initial Master Admin Account</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
              To get started, sign in with Username: <code style={{ fontWeight: 700, color: '#1E3A8A' }}>admin</code> and Password: <code style={{ fontWeight: 700, color: '#1E3A8A' }}>admin123</code>. You can then register your fleet vehicles, drivers, and fuel stations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
