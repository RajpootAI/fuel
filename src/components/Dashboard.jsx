import React from 'react';
import { 
  Fuel, 
  Coins, 
  Car, 
  Building2, 
  ArrowUpRight, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Receipt,
  Eye,
  Printer,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard({ 
  metrics, 
  onNavigate,
  onOpenSlipPreview 
}) {
  const {
    totalFuelIssued = 0,
    totalFuelCost = 0,
    activeVehicles = 0,
    totalVehicles = 0,
    totalPumps = 0,
    totalDrivers = 0,
    recentTransactions = [],
    vehiclesList = []
  } = metrics;

  // Breakdown of vehicle types
  const typeCounts = vehiclesList.reduce((acc, v) => {
    acc[v.vehicleType] = (acc[v.vehicleType] || 0) + 1;
    return acc;
  }, {});

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(val || 0).replace('PKR', 'Rs.');
  };

  return (
    <div className="page-content">
      {/* 4 Summary Cards */}
      <div className="metrics-grid">
        {/* Card 1: Total Fuel Issued */}
        <div className="metric-card card-fuel">
          <div className="metric-top">
            <span className="metric-label">Total Fuel Issued</span>
            <div className="metric-icon-wrap icon-fuel">
              <Fuel size={22} />
            </div>
          </div>
          <div className="metric-value">
            {totalFuelIssued.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Liters
            </span>
          </div>
          <div className="metric-hint">
            <TrendingUp size={14} style={{ color: '#2563EB' }} />
            <span>Across all authorized fleet logs</span>
          </div>
        </div>

        {/* Card 2: Total Fuel Cost */}
        <div className="metric-card card-cost">
          <div className="metric-top">
            <span className="metric-label">Total Fuel Cost</span>
            <div className="metric-icon-wrap icon-cost">
              <Coins size={22} />
            </div>
          </div>
          <div className="metric-value">
            {formatCurrency(totalFuelCost)}
          </div>
          <div className="metric-hint">
            <CheckCircle2 size={14} style={{ color: '#059669' }} />
            <span>Calculated from pump rates</span>
          </div>
        </div>

        {/* Card 3: Active Vehicles */}
        <div className="metric-card card-vehicles">
          <div className="metric-top">
            <span className="metric-label">Active Vehicles</span>
            <div className="metric-icon-wrap icon-vehicles">
              <Car size={22} />
            </div>
          </div>
          <div className="metric-value">
            {activeVehicles}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px' }}>
              / {totalVehicles} Total
            </span>
          </div>
          <div className="metric-hint">
            <span>Fleet readiness: 100% operational</span>
          </div>
        </div>

        {/* Card 4: Total Registered Pumps */}
        <div className="metric-card card-pumps">
          <div className="metric-top">
            <span className="metric-label">Total Registered Pumps</span>
            <div className="metric-icon-wrap icon-pumps">
              <Building2 size={22} />
            </div>
          </div>
          <div className="metric-value">
            {totalPumps}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Stations
            </span>
          </div>
          <div className="metric-hint">
            <span>Contracted fuel stations</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Fleet Overview & Recent Fuel Activity */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Fuel Issuance & Master Records Integration */}
        <div className="dash-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                <Receipt size={18} style={{ color: '#2563EB' }} />
                Recent Fuel Issuance Log
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Official vouchers generated with live costing and printable slips
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => onNavigate('reports')}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                title="Open comprehensive search and audit reports"
              >
                <FileSpreadsheet size={14} />
                <span>View Full Reports</span>
              </button>

              <button 
                onClick={() => onNavigate('issue-fuel')}
                className="btn-primary"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <PlusCircle size={15} />
                <span>Issue Fuel</span>
              </button>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Fuel Station</th>
                  <th>Liters</th>
                  <th>Total Cost</th>
                  <th style={{ textAlign: 'right' }}>Slip</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
                      <Receipt size={32} style={{ color: '#94A3B8', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>No fuel vouchers issued yet</p>
                      <span style={{ fontSize: '0.82rem' }}>Click &quot;Issue Fuel&quot; above to create your first official fuel slip.</span>
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span 
                          style={{ 
                            fontFamily: 'JetBrains Mono, monospace', 
                            fontWeight: 700, 
                            color: '#1D4ED8',
                            backgroundColor: '#EFF6FF',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}
                        >
                          {tx.slipNumber || tx.id}
                        </span>
                      </td>
                      <td>
                        <span className="license-plate-badge" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                          {tx.vehicleNumber}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {tx.driverName}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {tx.pumpName}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {Number(tx.liters).toFixed(1)} L
                      </td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(tx.totalCost)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: 600 }}
                          onClick={() => onOpenSlipPreview && onOpenSlipPreview(tx)}
                          title="Open Dual Printable Slip (Single A4 Page)"
                        >
                          <Printer size={13} />
                          <span>Print Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fleet Breakdown & Quick Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fleet Composition */}
          <div className="dash-panel">
            <div className="panel-header" style={{ marginBottom: '16px' }}>
              <h3 className="panel-title">
                <Car size={18} style={{ color: '#2563EB' }} />
                Fleet Breakdown
              </h3>
              <button 
                onClick={() => onNavigate('vehicles')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2563EB', 
                  cursor: 'pointer', 
                  fontSize: '0.82rem', 
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View all <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: 'Car', label: 'Cars / Sedans', color: '#1D4ED8', bg: '#EFF6FF' },
                { type: 'Truck', label: 'Heavy Trucks', color: '#B45309', bg: '#FEF3C7' },
                { type: 'Van', label: 'Cargo Vans', color: '#6D28D9', bg: '#F5F3FF' },
                { type: 'Bike', label: 'Motorcycles', color: '#047857', bg: '#ECFDF5' }
              ].map((item) => {
                const count = typeCounts[item.type] || 0;
                const percentage = totalVehicles > 0 ? Math.round((count / totalVehicles) * 100) : 0;
                return (
                  <div key={item.type} style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{count} vehicles ({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          backgroundColor: item.color,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Operations Hub */}
          <div className="dash-panel" style={{ backgroundColor: '#0B192C', color: '#FFFFFF', border: 'none' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '6px', color: '#FFFFFF' }}>
              Fleet Operations & Records Hub
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '16px' }}>
              Generate fuel slips or update master records for instant synchronization.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => onNavigate('issue-fuel')}
                className="nav-item"
                style={{ 
                  backgroundColor: 'rgba(37, 99, 235, 0.35)', 
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#FFFFFF'
                }}
              >
                <Receipt size={17} style={{ color: '#93C5FD' }} />
                <span>+ Issue Fuel (Add Slip)</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.76rem', backgroundColor: '#2563EB', padding: '2px 8px', borderRadius: '10px' }}>Voucher Entry</span>
              </button>

              <button 
                onClick={() => onNavigate('reports')}
                className="nav-item"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.86rem' 
                }}
              >
                <FileSpreadsheet size={16} style={{ color: '#60A5FA' }} />
                <span>Fuel Reports & History</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#93C5FD' }}>Audit & Ledger</span>
              </button>

              <button 
                onClick={() => onNavigate('vehicles')}
                className="nav-item"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.86rem' 
                }}
              >
                <Car size={16} style={{ color: '#60A5FA' }} />
                <span>Manage Vehicles</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#93C5FD' }}>{totalVehicles} registered</span>
              </button>

              <button 
                onClick={() => onNavigate('drivers')}
                className="nav-item"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.86rem' 
                }}
              >
                <PlusCircle size={16} style={{ color: '#60A5FA' }} />
                <span>Manage Drivers</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#93C5FD' }}>{totalDrivers} drivers</span>
              </button>

              <button 
                onClick={() => onNavigate('pumps')}
                className="nav-item"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.86rem' 
                }}
              >
                <Building2 size={16} style={{ color: '#60A5FA' }} />
                <span>Manage Fuel Pumps</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#93C5FD' }}>{totalPumps} stations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
