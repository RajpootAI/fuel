import React, { useState } from 'react';
import { 
  Fuel, 
  Car, 
  Gauge, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Clock3, 
  Printer, 
  Smartphone, 
  LogOut, 
  Search, 
  X, 
  FileText,
  ShieldCheck,
  Building2,
  Coins,
  ChevronRight,
  QrCode
} from 'lucide-react';

export default function DriverPortal({ 
  currentUser, 
  vehicles = [], 
  transactions = [], 
  onLogout,
  onOpenSlipPreview 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [digitalSlipModal, setDigitalSlipModal] = useState(null);

  // Identify driver name from current user account
  const driverName = (currentUser?.driverName || currentUser?.fullName || 'Muhammad Ali').trim();

  // Find driver's assigned vehicle from master vehicles
  const assignedVehicle = vehicles.find(
    (v) => (v.assignedDriverName || '').toLowerCase() === driverName.toLowerCase()
  );

  // Filter transactions belonging ONLY to this driver
  const mySlips = transactions.filter((tx) => {
    return (tx.driverName || '').toLowerCase() === driverName.toLowerCase();
  });

  // Calculate Metrics
  // 1. Total Liters Taken this month
  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g. "2026-03"
  const monthlyLiters = mySlips
    .filter((tx) => (tx.dateTime || tx.date || '').startsWith(currentMonthPrefix))
    .reduce((sum, tx) => sum + (Number(tx.liters) || 0), 0);

  // 2. Last Meter Reading (max odometer from their slips or latest transaction)
  let lastMeterReading = 0;
  mySlips.forEach((tx) => {
    const odo = Number(tx.odometerReading) || 0;
    if (odo > lastMeterReading) lastMeterReading = odo;
  });

  // Filtered slips for the list
  const filteredSlips = mySlips.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      (tx.slipNumber || '').toLowerCase().includes(q) ||
      (tx.pumpName || '').toLowerCase().includes(q) ||
      (tx.vehicleNumber || '').toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'Pending' && tx.status !== 'Filled') ||
      (statusFilter === 'Filled' && tx.status === 'Filled');

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(val || 0).replace('PKR', 'Rs.');
  };

  return (
    <div className="driver-portal-wrapper">
      {/* Top Mobile-Friendly Navigation Header */}
      <header className="portal-header">
        <div className="portal-header-left">
          <div className="portal-logo-icon">
            <Fuel size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="portal-brand-title">FuelFlow</h1>
              <span className="portal-role-pill driver-pill">
                Driver Portal
              </span>
            </div>
            <p className="portal-driver-greeting">
              Welcome, <strong>{driverName}</strong>
            </p>
          </div>
        </div>

        <div className="portal-header-right">
          <div className="portal-user-badge">
            <div className="portal-user-avatar">
              {driverName.charAt(0).toUpperCase()}
            </div>
            <div className="portal-user-info">
              <span className="portal-user-name">{driverName}</span>
              <span className="portal-user-plate">
                {assignedVehicle ? assignedVehicle.vehicleNumber : 'Vehicle Assigned'}
              </span>
            </div>
          </div>

          <button 
            className="btn-logout"
            onClick={onLogout}
            title="Sign out of Driver Portal"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Driver Dashboard Area */}
      <main className="portal-content-container">
        {/* Top 3 Summary Cards */}
        <section className="driver-metrics-grid">
          {/* Card 1: My Assigned Vehicle */}
          <div className="driver-metric-card vehicle-card">
            <div className="driver-card-header">
              <span className="driver-card-label">My Assigned Vehicle</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                <Car size={20} />
              </div>
            </div>
            <div className="driver-card-value">
              {assignedVehicle ? assignedVehicle.vehicleNumber : (mySlips[0]?.vehicleNumber || 'Unassigned')}
            </div>
            <div className="driver-card-footer">
              {assignedVehicle ? (
                <span>{assignedVehicle.vehicleType} • Active in Fleet</span>
              ) : (
                <span>Fleet Vehicle linked via vouchers</span>
              )}
            </div>
          </div>

          {/* Card 2: Total Fuel Taken This Month */}
          <div className="driver-metric-card fuel-card">
            <div className="driver-card-header">
              <span className="driver-card-label">Fuel Taken This Month</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#ECFDF5', color: '#047857' }}>
                <Fuel size={20} />
              </div>
            </div>
            <div className="driver-card-value" style={{ color: '#047857' }}>
              {monthlyLiters.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Liters</span>
            </div>
            <div className="driver-card-footer">
              <span>{mySlips.length} total slips issued to you</span>
            </div>
          </div>

          {/* Card 3: Last Meter Reading */}
          <div className="driver-metric-card meter-card">
            <div className="driver-card-header">
              <span className="driver-card-label">Last Meter Reading</span>
              <div className="driver-card-icon" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
                <Gauge size={20} />
              </div>
            </div>
            <div className="driver-card-value" style={{ color: '#B45309' }}>
              {lastMeterReading > 0 ? lastMeterReading.toLocaleString() : '---'}{' '}
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>KM</span>
            </div>
            <div className="driver-card-footer">
              <span>Recorded from your last fuel issuance</span>
            </div>
          </div>
        </section>

        {/* Section Header & Filters */}
        <section className="portal-section-card">
          <div className="portal-section-header">
            <div>
              <h2 className="portal-section-title">
                My Fuel Slips & Vouchers
              </h2>
              <p className="portal-section-subtitle">
                Show these digital vouchers at the authorized pump station or reprint your slips
              </p>
            </div>

            <div className="portal-filter-bar">
              {/* Status Pills */}
              <div className="portal-pills">
                <button 
                  className={`portal-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All ({mySlips.length})
                </button>
                <button 
                  className={`portal-pill-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Pending')}
                >
                  Pending ({mySlips.filter(s => s.status !== 'Filled').length})
                </button>
                <button 
                  className={`portal-pill-btn ${statusFilter === 'Filled' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Filled')}
                >
                  Filled ({mySlips.filter(s => s.status === 'Filled').length})
                </button>
              </div>

              {/* Search Box */}
              <div className="search-input-wrapper portal-search">
                <Search size={15} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Search slip # or station..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Slips List */}
          {filteredSlips.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 16px' }}>
              <Fuel className="empty-icon" />
              <h4 className="empty-title">No fuel slips found</h4>
              <p className="empty-description">
                {mySlips.length === 0 
                  ? 'No vouchers have been issued to your driver profile yet.'
                  : 'No vouchers match your current search or status filter.'}
              </p>
            </div>
          ) : (
            <div className="driver-slips-list">
              {filteredSlips.map((slip) => {
                const isFilled = slip.status === 'Filled';
                return (
                  <div key={slip.id} className={`driver-slip-card ${isFilled ? 'slip-filled' : 'slip-pending'}`}>
                    <div className="slip-card-top">
                      <div className="slip-id-group">
                        <span className="driver-voucher-pill">
                          {slip.slipNumber || slip.id}
                        </span>
                        <span className="driver-plate-pill">
                          {slip.vehicleNumber}
                        </span>
                      </div>

                      <div className="slip-status-indicator">
                        {isFilled ? (
                          <span className="status-badge-filled">
                            <CheckCircle2 size={13} />
                            Filled / Completed
                          </span>
                        ) : (
                          <span className="status-badge-pending">
                            <Clock3 size={13} />
                            Pending at Station
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="slip-card-station">
                      <div className="station-icon-pin">
                        <MapPin size={16} />
                      </div>
                      <div className="station-details">
                        <div className="station-name">{slip.pumpName}</div>
                        <div className="slip-date">
                          <Calendar size={12} />
                          <span>{slip.dateTime ? slip.dateTime.replace('T', ' ') : slip.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="slip-card-fuel-strip">
                      <div className="fuel-strip-item">
                        <span className="strip-label">Fuel Type</span>
                        <span className="strip-val">{slip.fuelType || 'Petrol'}</span>
                      </div>
                      <div className="fuel-strip-item">
                        <span className="strip-label">Quantity</span>
                        <span className="strip-val font-bold" style={{ color: '#1E3A8A' }}>
                          {Number(slip.liters).toFixed(1)} Liters
                        </span>
                      </div>
                      <div className="fuel-strip-item">
                        <span className="strip-label">Rate / L</span>
                        <span className="strip-val">Rs. {Number(slip.ratePerLiter).toFixed(2)}</span>
                      </div>
                      <div className="fuel-strip-item">
                        <span className="strip-label">Total Amount</span>
                        <span className="strip-val font-bold" style={{ color: '#047857' }}>
                          {formatCurrency(slip.totalCost)}
                        </span>
                      </div>
                    </div>

                    {slip.odometerReading && (
                      <div className="slip-card-odometer">
                        <Gauge size={13} style={{ color: '#64748B' }} />
                        <span>Authorized Odometer Reading: <strong>{Number(slip.odometerReading).toLocaleString()} KM</strong></span>
                      </div>
                    )}

                    {slip.remarks && (
                      <div className="slip-card-remarks">
                        <span>Purpose: {slip.remarks}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="slip-card-actions">
                      <button 
                        className="btn-digital-slip"
                        onClick={() => setDigitalSlipModal(slip)}
                        title="Display full-screen digital voucher for the fuel pump attendant"
                      >
                        <Smartphone size={16} />
                        <span>Show at Pump (Digital Voucher)</span>
                      </button>

                      <button 
                        className="btn-print-voucher"
                        onClick={() => onOpenSlipPreview(slip)}
                        title="Open Dual Printable Slip (Single A4 Page)"
                      >
                        <Printer size={15} />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Driver Mobile Digital Voucher Modal */}
      {digitalSlipModal && (
        <div className="modal-overlay" onClick={() => setDigitalSlipModal(null)}>
          <div 
            className="modal-content digital-voucher-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <div className="digital-voucher-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Fuel size={22} style={{ color: '#2563EB' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0B192C' }}>
                    Company Fuel Authorization
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    Present this voucher to the station cashier
                  </div>
                </div>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setDigitalSlipModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="digital-voucher-body">
              {/* Voucher Stamp */}
              <div className="voucher-stamp-box">
                <div className="voucher-qr-icon">
                  <QrCode size={48} style={{ color: '#1E3A8A' }} />
                </div>
                <div className="voucher-hero-slip-num">
                  {digitalSlipModal.slipNumber || digitalSlipModal.id}
                </div>
                <div className="voucher-hero-badge">
                  {digitalSlipModal.status === 'Filled' ? (
                    <span style={{ color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={15} /> Dispensed & Filled
                    </span>
                  ) : (
                    <span style={{ color: '#B45309', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock3 size={15} /> Authorized for Dispensing
                    </span>
                  )}
                </div>
              </div>

              {/* Station Highlight */}
              <div className="voucher-station-highlight">
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF', marginBottom: '2px' }}>
                  Authorized Station
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0B192C' }}>
                  {digitalSlipModal.pumpName}
                </div>
              </div>

              {/* Key Specs */}
              <div className="voucher-specs-grid">
                <div className="voucher-spec">
                  <span className="v-label">Vehicle #</span>
                  <span className="v-val font-mono">{digitalSlipModal.vehicleNumber}</span>
                </div>
                <div className="voucher-spec">
                  <span className="v-label">Driver Name</span>
                  <span className="v-val">{digitalSlipModal.driverName}</span>
                </div>
                <div className="voucher-spec">
                  <span className="v-label">Fuel Type</span>
                  <span className="v-val">{digitalSlipModal.fuelType || 'Petrol'}</span>
                </div>
                <div className="voucher-spec highlight-fuel">
                  <span className="v-label">Quantity to Fill</span>
                  <span className="v-val highlight-liters">{Number(digitalSlipModal.liters).toFixed(1)} L</span>
                </div>
              </div>

              <div className="voucher-fin-row">
                <div>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Rate per Liter: </span>
                  <strong style={{ fontSize: '0.85rem' }}>Rs. {Number(digitalSlipModal.ratePerLiter).toFixed(2)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Total Amount: </span>
                  <strong style={{ fontSize: '1.05rem', color: '#047857' }}>{formatCurrency(digitalSlipModal.totalCost)}</strong>
                </div>
              </div>

              <div className="voucher-notice">
                <ShieldCheck size={14} style={{ color: '#047857', flexShrink: 0 }} />
                <span>Digitally signed by Fleet Operations HQ. Valid for one refueling session only.</span>
              </div>
            </div>

            <div className="digital-voucher-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setDigitalSlipModal(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onOpenSlipPreview(digitalSlipModal);
                  setDigitalSlipModal(null);
                }}
                style={{ flex: 1 }}
              >
                <Printer size={16} />
                <span>Reprint A4 Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
