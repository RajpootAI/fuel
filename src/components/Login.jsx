import React, { useState } from 'react';
import { 
  Fuel, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Briefcase, 
  Car, 
  LogIn, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { authenticate, quickLoginAsRole } from '../services/storage';

export default function Login({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
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
      const result = authenticate(identifier, password, role);
      setLoading(false);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 250);
  };

  const handleQuickLogin = (targetRole) => {
    setError('');
    const user = quickLoginAsRole(targetRole);
    if (user) {
      onLoginSuccess(user);
    }
  };

  const demoRoles = [
    {
      role: 'Admin',
      label: 'Login as Admin',
      sublabel: 'Full System & User Control',
      icon: ShieldCheck,
      color: '#1E3A8A',
      badgeColor: '#DBEAFE',
      badgeText: '#1E40AF',
      credentials: 'admin / admin123'
    },
    {
      role: 'Manager',
      label: 'Login as Manager',
      sublabel: 'Issue Fuel & View Reports (No Delete)',
      icon: Briefcase,
      color: '#0284C7',
      badgeColor: '#E0F2FE',
      badgeText: '#0369A1',
      credentials: 'manager / manager123'
    },
    {
      role: 'Driver',
      label: 'Login as Driver',
      sublabel: 'Vehicle Driver View',
      icon: Car,
      color: '#059669',
      badgeColor: '#D1FAE5',
      badgeText: '#047857',
      credentials: 'driver1 / driver123'
    },
    {
      role: 'Fuel Pump',
      label: 'Login as Fuel Pump',
      sublabel: 'Station Attendant Copy',
      icon: Fuel,
      color: '#D97706',
      badgeColor: '#FEF3C7',
      badgeText: '#B45309',
      credentials: 'pump1 / pump123'
    }
  ];

  return (
    <div className="login-page-container">
      {/* Background Decor */}
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
              <Sparkles size={13} style={{ color: '#2563EB' }} />
              <span>Phase 5: Role-Based Access Control</span>
            </div>
          </div>

          {/* Error Alert */}
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
              <div className="input-with-icon">
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g., admin, manager, or driver1"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
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

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} style={{ color: '#2563EB' }} />
                Select Role
              </label>
              <select 
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin (Full Access & User Accounts)</option>
                <option value="Manager">Manager (Issue Fuel & Reports, No Delete)</option>
                <option value="Driver">Driver (Fleet Driver View)</option>
                <option value="Fuel Pump">Fuel Pump (Station Operator)</option>
              </select>
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
                  <span>Sign In to System</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Bar */}
          <div className="quick-demo-section">
            <div className="quick-demo-divider">
              <span>⚡ Quick Demo Login (One-Click Access)</span>
            </div>
            <p className="quick-demo-desc">
              Test all 4 roles instantly with single-click authentication:
            </p>

            <div className="quick-demo-grid">
              {demoRoles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    className="quick-demo-btn"
                    onClick={() => handleQuickLogin(item.role)}
                    title={`Click to instantly log in as ${item.role}`}
                  >
                    <div className="quick-demo-icon-wrapper" style={{ backgroundColor: item.badgeColor, color: item.badgeText }}>
                      <Icon size={18} />
                    </div>
                    <div className="quick-demo-text">
                      <div className="quick-demo-title">{item.label}</div>
                      <div className="quick-demo-hint">{item.sublabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pre-seeded credentials reference */}
          <div className="credentials-hint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#1E3A8A', fontSize: '0.8rem', marginBottom: '6px' }}>
              <Info size={14} />
              <span>Default System Accounts</span>
            </div>
            <div className="credentials-hint-grid">
              <div>
                <strong>Admin:</strong> <code>admin</code> / <code>admin123</code>
              </div>
              <div>
                <strong>Manager:</strong> <code>manager</code> / <code>manager123</code>
              </div>
              <div>
                <strong>Driver:</strong> <code>driver1</code> / <code>driver123</code>
              </div>
              <div>
                <strong>Pump:</strong> <code>pump1</code> / <code>pump123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
