import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Fuel Management System caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '36px 20px', maxWidth: '680px', margin: '40px auto', fontFamily: 'sans-serif' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '12px', padding: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#991B1B', margin: '0 0 12px 0', fontSize: '1.25rem' }}>
              Application Render Notice
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
              An error occurred while displaying this view. You can restore the default dataset to resolve this.
            </p>
            <div style={{ padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#B91C1C', fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: '20px', overflowX: 'auto' }}>
              {this.state.error?.toString()}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{ padding: '10px 18px', background: '#1E3A8A', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset Stored Data & Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '10px 18px', background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
