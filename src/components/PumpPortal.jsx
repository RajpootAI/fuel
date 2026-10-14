import React, { useState } from 'react';
import { 
  Fuel, 
  Search, 
  CheckCircle2, 
  Clock3, 
  Coins, 
  Building2, 
  Printer, 
  LogOut, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Car, 
  User, 
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PumpPortal({ 
  currentUser, 
  transactions = [], 
  onUpdateStatus, 
  onLogout,
  onOpenSlipPreview,
  onShowToast 
}) {
  const [verifyInput, setVerifyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Station identity from currentUser
  const stationName = (currentUser?.pumpName || currentUser?.fullName || 'PSO Main Boulevard Station').trim();

  // All transactions issued to this specific fuel pump station
  const stationSlips = transactions.filter((tx) => {
    return (tx.pumpName || '').toLowerCase() === stationName.toLowerCase();
  });

  // Calculate Summary Metrics
  const todayStr = new Date().toISOString().slice(0, 10); // e.g. "2026-03-28"

  // Liters dispensed: sum of filled slips today (or total filled if no records for today)
  const todayFilledSlips = stationSlips.filter((tx) => {
    const isFilled = tx.status === 'Filled';
    const txDate = (tx.filledAt || tx.dateTime || tx.date || '').slice(0, 10);
    return isFilled && txDate === todayStr;
  });

  const totalFilledLitersToday = todayFilledSlips.reduce((sum, tx) => sum + (Number(tx.liters) || 0), 0);
  const allTimeFilledLiters = stationSlips
    .filter(tx => tx.status === 'Filled')
    .reduce((sum, tx) => sum + (Number(tx.liters) || 0), 0);

  // Total Bill Receivable from Company (sum of all issued slips or filled slips)
  const totalReceivable = stationSlips.reduce((sum, tx) => sum + (Number(tx.totalCost) || 0), 0);

  // Counts
  const pendingCount = stationSlips.filter(tx => tx.status !== 'Filled').length;
  const completedCount = stationSlips.filter(tx => tx.status === 'Filled').length;

  // Slip Verification Handler
  const handleVerifySlip = (e) => {
    if (e) e.preventDefault();
    const query = verifyInput.trim().toUpperCase();

    if (!query) {
      setVerificationResult(null);
      return;
    }

    // Look for matching slip in this station first
    const matchThisStation = stationSlips.find((tx) => {
      const sNum = (tx.slipNumber || tx.id || '').toUpperCase();
      const vNum = (tx.vehicleNumber || '').toUpperCase();
      return sNum === query || vNum === query;
    });

    if (matchThisStation) {
      setVerificationResult({
        type: 'STATION_MATCH',
        slip: matchThisStation,
        message: `Company Voucher ${matchThisStation.slipNumber || matchThisStation.id} verified successfully for ${stationName}.`
      });
      return;
    }

    // Check if slip belongs to ANY other company station
    const matchOtherStation = transactions.find((tx) => {
      const sNum = (tx.slipNumber || tx.id || '').toUpperCase();
      const vNum = (tx.vehicleNumber || '').toUpperCase();
      return sNum === query || vNum === query;
    });

    if (matchOtherStation) {
      setVerificationResult({
        type: 'OTHER_STATION_MISMATCH',
        slip: matchOtherStation,
        message: `Slip ${matchOtherStation.slipNumber || matchOtherStation.id} is genuine, but authorized for "${matchOtherStation.pumpName}", NOT ${stationName}.`
      });
      return;
    }

    // Not found in entire system
    setVerificationResult({
      type: 'NOT_FOUND',
      query: query,
      message: `No authorization found for "${query}". Voucher may be invalid, expired, or fraudulent.`
    });
  };

  // Mark as Filled Action
  const handleMarkAsFilled = (slipId, slipNumber) => {
    if (onUpdateStatus) {
      onUpdateStatus(slipId, 'Filled');
      onShowToast(`Voucher ${slipNumber || slipId} marked as Filled & Completed!`, 'success');
      
      // Update verification card if currently displaying this slip
      if (verificationResult?.slip && (verificationResult.slip.id === slipId || verificationResult.slip.slipNumber === slipId)) {
        setVerificationResult({
          ...verificationResult,
          slip: {
            ...verificationResult.slip,
            status: 'Filled',
            filledAt: new Date().toISOString()
          }
        });
      }
    }
  };

  // Filtered Table Slips
  const filteredTableSlips = stationSlips.filter((tx) => {
    const q = tableSearchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      (tx.slipNumber || '').toLowerCase().includes(q) ||
      (tx.vehicleNumber || '').toLowerCase().includes(q) ||
      (tx.driverName || '').toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'Pending' && tx.status !== 'Filled') ||
      (statusFilter === 'Filled' && tx.status === 'Filled');

    return matchesQuery && matchesStatus;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(val || 0).replace('PKR', 'Rs.');
  };

  return (
    <div className="pump-portal-wrapper">
      {/* Top Header */}
      <header className="portal-header">
        <div className="portal-header-left">
          <div className="portal-logo-icon" style={{ background: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' }}>
            <Fuel size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="portal-brand-title">FuelFlow</h1>
              <span className="portal-role-pill pump-pill">
                Fuel Station Portal
              </span>
            </div>
            <p className="portal-driver-greeting">
              Station: <strong>{stationName}</strong>
            </p>
          </div>
        </div>

        <div className="portal-header-right">
          <div className="portal-user-badge">
            <div className="portal-user-avatar" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
              <Building2 size={16} />
            </div>
            <div className="portal-user-info">
              <span className="portal-user-name">{stationName}</span>
              <span className="portal-user-plate">Authorized Fuel Station</span>
            </div>
          </div>

          <button 
            className="btn-logout"
            onClick={onLogout}
            title="Sign out of Pump Portal"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="portal-content-container">
        {/* Top 3 Summary Cards */}
        <section className="pump-metrics-grid">
          {/* Card 1: Today's Total Liters Dispensed */}
          <div className="driver-metric-card fuel-card">
            <div className="driver-card-header">
              <span className="driver-card-label">Today's Liters Dispensed</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#ECFDF5', color: '#047857' }}>
                <Fuel size={20} />
              </div>
            </div>
            <div className="driver-card-value" style={{ color: '#047857' }}>
              {(totalFilledLitersToday > 0 ? totalFilledLitersToday : allTimeFilledLiters).toFixed(1)}{' '}
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Liters</span>
            </div>
            <div className="driver-card-footer">
              <span>{completedCount} refuelings completed at this station</span>
            </div>
          </div>

          {/* Card 2: Total Bill Receivable from Company */}
          <div className="driver-metric-card vehicle-card">
            <div className="driver-card-header">
              <span className="driver-card-label">Total Bill Receivable</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                <Coins size={20} />
              </div>
            </div>
            <div className="driver-card-value" style={{ color: '#1E3A8A' }}>
              {formatCurrency(totalReceivable)}
            </div>
            <div className="driver-card-footer">
              <span>Payable by Fleet HQ against official slips</span>
            </div>
          </div>

          {/* Card 3: Pending Authorization Slips */}
          <div className="driver-metric-card meter-card">
            <div className="driver-card-header">
              <span className="driver-card-label">Pending Authorizations</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
                <Clock3 size={20} />
              </div>
            </div>
            <div className="driver-card-value" style={{ color: '#B45309' }}>
              {pendingCount}{' '}
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Slips</span>
            </div>
            <div className="driver-card-footer">
              <span>Waiting for vehicle arrival & dispensing</span>
            </div>
          </div>
        </section>

        {/* Feature: Verify Slip Number Search Box */}
        <section className="pump-verify-section">
          <div className="verify-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} style={{ color: '#2563EB' }} />
              <div>
                <h3 className="verify-title">Verify Slip Number / Authorization Check</h3>
                <p className="verify-subtitle">
                  Type a Slip Number (e.g., FL-1004) or Vehicle Number to verify company authorization before dispensing
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerifySlip} className="verify-form">
            <div className="verify-input-group">
              <Search size={18} className="verify-search-icon" />
              <input 
                type="text"
                className="verify-input"
                placeholder="Enter Slip Number (e.g. FL-1004) or Vehicle Plate (e.g. LEA-1234)..."
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
              />
              {verifyInput && (
                <button 
                  type="button" 
                  className="verify-clear-btn" 
                  onClick={() => {
                    setVerifyInput('');
                    setVerificationResult(null);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary verify-submit-btn">
              <span>Verify Slip</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Verification Results Card */}
          {verificationResult && (
            <div className={`verification-banner result-${verificationResult.type.toLowerCase()}`}>
              {verificationResult.type === 'STATION_MATCH' && (
                <div>
                  <div className="v-banner-top valid">
                    <CheckCircle2 size={20} />
                    <div style={{ flex: 1 }}>
                      <strong>Valid Company Authorization Confirmed</strong>
                      <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>{verificationResult.message}</div>
                    </div>
                    <span className={`status-pill ${verificationResult.slip.status === 'Filled' ? 'status-filled' : 'status-pending'}`}>
                      {verificationResult.slip.status === 'Filled' ? 'Filled / Completed' : 'Pending Dispensing'}
                    </span>
                  </div>

                  <div className="v-banner-details-grid">
                    <div>
                      <span className="vd-label">Slip Number:</span>
                      <strong className="vd-val font-mono">{verificationResult.slip.slipNumber || verificationResult.slip.id}</strong>
                    </div>
                    <div>
                      <span className="vd-label">Vehicle Plate:</span>
                      <strong className="vd-val">{verificationResult.slip.vehicleNumber}</strong>
                    </div>
                    <div>
                      <span className="vd-label">Driver Name:</span>
                      <strong className="vd-val">{verificationResult.slip.driverName}</strong>
                    </div>
                    <div>
                      <span className="vd-label">Fuel Type:</span>
                      <strong className="vd-val">{verificationResult.slip.fuelType || 'Petrol'}</strong>
                    </div>
                    <div>
                      <span className="vd-label">Authorized Liters:</span>
                      <strong className="vd-val" style={{ color: '#1E3A8A', fontSize: '1rem' }}>
                        {Number(verificationResult.slip.liters).toFixed(1)} L
                      </strong>
                    </div>
                    <div>
                      <span className="vd-label">Total Cost:</span>
                      <strong className="vd-val" style={{ color: '#047857', fontSize: '1rem' }}>
                        {formatCurrency(verificationResult.slip.totalCost)}
                      </strong>
                    </div>
                  </div>

                  <div className="v-banner-actions">
                    {verificationResult.slip.status !== 'Filled' ? (
                      <button 
                        className="btn-mark-filled"
                        onClick={() => handleMarkAsFilled(verificationResult.slip.id, verificationResult.slip.slipNumber)}
                      >
                        <Check size={18} />
                        <span>Confirm Dispensing & Mark as Filled</span>
                      </button>
                    ) : (
                      <div className="dispensed-indicator">
                        <CheckCircle2 size={16} />
                        <span>This voucher has already been filled & logged.</span>
                      </div>
                    )}
                    <button 
                      className="btn-secondary"
                      onClick={() => onOpenSlipPreview(verificationResult.slip)}
                    >
                      <Printer size={15} />
                      <span>View / Reprint Slip</span>
                    </button>
                  </div>
                </div>
              )}

              {verificationResult.type === 'OTHER_STATION_MISMATCH' && (
                <div className="v-banner-top mismatch">
                  <AlertTriangle size={22} style={{ color: '#D97706', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#B45309', fontSize: '0.94rem' }}>
                      Authorization Station Mismatch
                    </strong>
                    <div style={{ fontSize: '0.84rem', color: '#78350F', marginTop: '4px' }}>
                      {verificationResult.message}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '4px' }}>
                      Please inform driver to proceed to <strong>{verificationResult.slip.pumpName}</strong> or contact fleet dispatcher.
                    </div>
                  </div>
                </div>
              )}

              {verificationResult.type === 'NOT_FOUND' && (
                <div className="v-banner-top invalid">
                  <AlertCircle size={22} style={{ color: '#DC2626', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#B91C1C', fontSize: '0.94rem' }}>
                      Unrecognized Voucher / Slip Number
                    </strong>
                    <div style={{ fontSize: '0.84rem', color: '#991B1B', marginTop: '4px' }}>
                      {verificationResult.message}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section: Fuel Slips Table with "Mark as Filled" */}
        <section className="portal-section-card">
          <div className="portal-section-header">
            <div>
              <h2 className="portal-section-title">
                Authorized Fuel Vouchers for {stationName}
              </h2>
              <p className="portal-section-subtitle">
                View all slips issued to this station, verify authorizations, and confirm dispensing
              </p>
            </div>

            <div className="portal-filter-bar">
              <div className="portal-pills">
                <button 
                  className={`portal-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All ({stationSlips.length})
                </button>
                <button 
                  className={`portal-pill-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Pending')}
                >
                  Pending ({pendingCount})
                </button>
                <button 
                  className={`portal-pill-btn ${statusFilter === 'Filled' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Filled')}
                >
                  Filled ({completedCount})
                </button>
              </div>

              <div className="search-input-wrapper portal-search">
                <Search size={15} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Filter by slip #, plate, or driver..."
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="data-table-container">
            {filteredTableSlips.length === 0 ? (
              <div className="empty-state" style={{ padding: '36px 16px' }}>
                <Fuel className="empty-icon" />
                <h4 className="empty-title">No fuel slips found</h4>
                <p className="empty-description">
                  {stationSlips.length === 0
                    ? `No fuel vouchers have been issued to ${stationName} yet.`
                    : 'No vouchers match your current search or status filter.'}
                </p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slip #</th>
                    <th>Date & Time</th>
                    <th>Vehicle #</th>
                    <th>Driver Name</th>
                    <th>Fuel Type</th>
                    <th>Quantity (L)</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableSlips.map((slip) => {
                    const isFilled = slip.status === 'Filled';
                    return (
                      <tr key={slip.id}>
                        <td>
                          <span 
                            style={{ 
                              fontFamily: 'JetBrains Mono, monospace', 
                              fontWeight: 700, 
                              color: '#1D4ED8',
                              backgroundColor: '#EFF6FF',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.82rem'
                            }}
                          >
                            {slip.slipNumber || slip.id}
                          </span>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {slip.dateTime ? slip.dateTime.replace('T', ' ') : slip.date}
                        </td>

                        <td>
                          <span className="license-plate-badge" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                            {slip.vehicleNumber}
                          </span>
                        </td>

                        <td style={{ fontWeight: 600 }}>
                          {slip.driverName}
                        </td>

                        <td>
                          <span 
                            style={{ 
                              fontSize: '0.76rem', 
                              fontWeight: 600, 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              backgroundColor: slip.fuelType === 'Diesel' ? '#FEF3C7' : '#EFF6FF',
                              color: slip.fuelType === 'Diesel' ? '#B45309' : '#1D4ED8'
                            }}
                          >
                            {slip.fuelType || 'Petrol'}
                          </span>
                        </td>

                        <td style={{ fontWeight: 700 }}>
                          {Number(slip.liters).toFixed(1)} L
                        </td>

                        <td style={{ fontWeight: 800, color: '#047857' }}>
                          {formatCurrency(slip.totalCost)}
                        </td>

                        {/* Status Column */}
                        <td>
                          {isFilled ? (
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 9px',
                                borderRadius: '12px',
                                backgroundColor: '#ECFDF5',
                                color: '#047857',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                border: '1px solid #A7F3D0'
                              }}
                            >
                              <CheckCircle2 size={13} />
                              Filled / Completed
                            </span>
                          ) : (
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 9px',
                                borderRadius: '12px',
                                backgroundColor: '#FFFBEB',
                                color: '#B45309',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                border: '1px solid #FDE68A'
                              }}
                            >
                              <Clock3 size={13} />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {!isFilled ? (
                              <button 
                                className="btn-mark-filled-sm"
                                onClick={() => handleMarkAsFilled(slip.id, slip.slipNumber)}
                                title="Click when fuel is dispensed to driver"
                              >
                                <Check size={14} />
                                <span>Mark as Filled</span>
                              </button>
                            ) : (
                              <span 
                                style={{ 
                                  fontSize: '0.75rem', 
                                  color: '#059669', 
                                  fontWeight: 600,
                                  backgroundColor: '#F0FDF4',
                                  padding: '4px 8px',
                                  borderRadius: '4px'
                                }}
                              >
                                ✓ Confirmed
                              </span>
                            )}

                            <button 
                              className="btn-secondary"
                              style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                              onClick={() => onOpenSlipPreview(slip)}
                              title="View / Print Slip"
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
