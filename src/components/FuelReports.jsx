import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  RotateCcw, 
  Download, 
  Printer, 
  Trash2, 
  Car, 
  User, 
  Building2, 
  Calendar, 
  Fuel, 
  Coins, 
  Filter, 
  TrendingUp, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function FuelReports({ 
  transactions = [], 
  vehicles = [], 
  drivers = [], 
  pumps = [], 
  onDeleteSlip, 
  onOpenSlipPreview, 
  onShowToast 
}) {
  // Filter States
  const [selectedVehicle, setSelectedVehicle] = useState('ALL');
  const [selectedDriver, setSelectedDriver] = useState('ALL');
  const [selectedPump, setSelectedPump] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedVehicle('ALL');
    setSelectedDriver('ALL');
    setSelectedPump('ALL');
    setFromDate('');
    setToDate('');
    setSearchQuery('');
    onShowToast('Filters reset to default view', 'success');
  };

  // Filter Transactions Logic
  const filteredRecords = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Vehicle filter
      if (selectedVehicle !== 'ALL' && tx.vehicleNumber?.toUpperCase() !== selectedVehicle.toUpperCase()) {
        return false;
      }

      // 2. Driver filter
      if (selectedDriver !== 'ALL' && tx.driverName?.toLowerCase() !== selectedDriver.toLowerCase()) {
        return false;
      }

      // 3. Fuel Pump filter
      if (selectedPump !== 'ALL' && tx.pumpName?.toLowerCase() !== selectedPump.toLowerCase()) {
        return false;
      }

      // 4. Date Range filter
      const txDateStr = tx.dateTime ? tx.dateTime.slice(0, 10) : (tx.date || '');
      if (fromDate && txDateStr < fromDate) {
        return false;
      }
      if (toDate && txDateStr > toDate) {
        return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const slip = (tx.slipNumber || tx.id || '').toLowerCase();
        const veh = (tx.vehicleNumber || '').toLowerCase();
        const drv = (tx.driverName || '').toLowerCase();
        const pmp = (tx.pumpName || '').toLowerCase();
        const rem = (tx.remarks || '').toLowerCase();
        if (!slip.includes(q) && !veh.includes(q) && !drv.includes(q) && !pmp.includes(q) && !rem.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedVehicle, selectedDriver, selectedPump, fromDate, toDate, searchQuery]);

  // Dynamic Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalLiters = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.liters) || 0), 0);
    const totalCost = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);
    const avgRate = totalLiters > 0 ? (totalCost / totalLiters) : 0;

    return {
      count: filteredRecords.length,
      totalLiters: Math.round(totalLiters * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      avgRate: Math.round(avgRate * 100) / 100
    };
  }, [filteredRecords]);

  // Export to CSV / Excel Function
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      onShowToast('No records to export with current filters', 'danger');
      return;
    }

    const headers = [
      'Slip / Voucher Number',
      'Date & Time',
      'Vehicle Number',
      'Driver Name',
      'Fuel Pump / Station',
      'Fuel Type',
      'Odometer Reading (KM)',
      'Quantity (Liters)',
      'Rate per Liter (PKR)',
      'Total Amount (PKR)',
      'Trip Remarks'
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.slipNumber || r.id || ''}"`,
      `"${r.dateTime ? r.dateTime.replace('T', ' ') : (r.date || '')}"`,
      `"${r.vehicleNumber || ''}"`,
      `"${r.driverName || ''}"`,
      `"${r.pumpName || ''}"`,
      `"${r.fuelType || 'Petrol'}"`,
      `"${r.odometerReading || 0}"`,
      `"${Number(r.liters || 0).toFixed(2)}"`,
      `"${Number(r.ratePerLiter || 0).toFixed(2)}"`,
      `"${Number(r.totalCost || 0).toFixed(2)}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `Fuel_Report_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Exported ${filteredRecords.length} records to CSV/Excel!`, 'success');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 2
    }).format(val || 0).replace('PKR', 'Rs.');
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Fuel Reports & History
            </h3>
            <span 
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                backgroundColor: '#EFF6FF', 
                color: '#1D4ED8', 
                padding: '2px 10px', 
                borderRadius: '12px' 
              }}
            >
              Audit & Analytics
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Filter, search, audit consumption, and export company fuel records
          </p>
        </div>

        <div className="view-actions">
          {/* Export to CSV / Excel Button */}
          <button 
            className="btn-primary" 
            onClick={handleExportCSV}
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
            }}
            title="Download current filtered data as a CSV / Excel spreadsheet"
          >
            <Download size={16} />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Top Search & Filter Bar Card */}
      <div className="table-card" style={{ marginBottom: '24px' }}>
        <div className="table-toolbar" style={{ backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
            <Filter size={16} style={{ color: '#2563EB' }} />
            <span>Search & Audit Filter Criteria</span>
          </div>

          <button 
            className="btn-secondary" 
            onClick={handleResetFilters}
            style={{ fontSize: '0.8rem', padding: '5px 12px' }}
            title="Clear all filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            {/* Filter 1: Vehicle Number */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Car size={14} style={{ color: '#2563EB' }} />
                Filter by Vehicle
              </label>
              <select 
                className="form-select"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="ALL">All Vehicles ({vehicles.length})</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.vehicleNumber}>
                    {v.vehicleNumber} ({v.vehicleType})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Driver Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} style={{ color: '#2563EB' }} />
                Filter by Driver
              </label>
              <select 
                className="form-select"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="ALL">All Drivers ({drivers.length})</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Fuel Pump */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={14} style={{ color: '#2563EB' }} />
                Filter by Fuel Pump
              </label>
              <select 
                className="form-select"
                value={selectedPump}
                onChange={(e) => setSelectedPump(e.target.value)}
              >
                <option value="ALL">All Fuel Stations ({pumps.length})</option>
                {pumps.map((p) => (
                  <option key={p.id} value={p.pumpName}>
                    {p.pumpName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 4A: From Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} style={{ color: '#2563EB' }} />
                From Date
              </label>
              <input 
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* Filter 4B: To Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} style={{ color: '#2563EB' }} />
                To Date
              </label>
              <input 
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Quick text search bar */}
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '12px' }}>
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <Search size={16} className="search-icon" />
              <input 
                type="text"
                className="search-input"
                placeholder="Search by Slip # (e.g. FL-1001), keywords, or trip remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Bar (Updates based on selected filters) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}
      >
        {/* Dynamic Card 1: Total Liters Consumed */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-color)', 
            borderLeft: '4px solid #2563EB',
            borderRadius: '10px', 
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Total Liters Consumed
            </span>
            <Fuel size={18} style={{ color: '#2563EB' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {summaryMetrics.totalLiters.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Liters
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            For selected vehicle / driver / pump filter
          </div>
        </div>

        {/* Dynamic Card 2: Total Amount Spent */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-color)', 
            borderLeft: '4px solid #059669',
            borderRadius: '10px', 
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Total Amount Spent
            </span>
            <Coins size={18} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#065F46', letterSpacing: '-0.02em' }}>
            {formatCurrency(summaryMetrics.totalCost)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Calculated total fuel expenditure
          </div>
        </div>

        {/* Dynamic Card 3: Matching Records Count */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-color)', 
            borderLeft: '4px solid #D97706',
            borderRadius: '10px', 
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Matching Records
            </span>
            <FileSpreadsheet size={18} style={{ color: '#D97706' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {summaryMetrics.count}
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '6px' }}>
              Vouchers
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Out of {transactions.length} total logged slips
          </div>
        </div>

        {/* Dynamic Card 4: Avg Rate / Liter */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-color)', 
            borderLeft: '4px solid #7C3AED',
            borderRadius: '10px', 
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Avg. Rate per Liter
            </span>
            <TrendingUp size={18} style={{ color: '#7C3AED' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Rs. {summaryMetrics.avgRate.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Weighted average across selection
          </div>
        </div>
      </div>

      {/* Clean Data Table of Matching Records */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Filtered Audit Ledger
            </span>
            <span 
              style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                backgroundColor: '#EFF6FF', 
                color: '#1D4ED8', 
                padding: '2px 8px', 
                borderRadius: '10px' 
              }}
            >
              {filteredRecords.length} records
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {(selectedVehicle !== 'ALL' || selectedDriver !== 'ALL' || selectedPump !== 'ALL' || fromDate || toDate) ? (
              <span style={{ color: '#1D4ED8', fontWeight: 600 }}>
                Active Filter Applied
              </span>
            ) : (
              <span>Showing All Fleet Records</span>
            )}
          </div>
        </div>

        <div className="data-table-container">
          {filteredRecords.length === 0 ? (
            <div className="empty-state">
              <FileSpreadsheet className="empty-icon" />
              <h4 className="empty-title">No matching fuel records found</h4>
              <p className="empty-description">
                Try adjusting your vehicle, driver, fuel station, or date range filters.
              </p>
              <button 
                className="btn-secondary" 
                onClick={handleResetFilters}
                style={{ marginTop: '14px' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Slip #</th>
                  <th>Date & Time</th>
                  <th>Vehicle #</th>
                  <th>Driver</th>
                  <th>Fuel Pump</th>
                  <th>Quantity (L)</th>
                  <th>Rate (Rs.)</th>
                  <th>Total Cost</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r.id}>
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
                        {r.slipNumber || r.id}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {r.dateTime ? r.dateTime.replace('T', ' ') : r.date}
                    </td>

                    <td>
                      <span className="license-plate-badge" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                        {r.vehicleNumber}
                      </span>
                    </td>

                    <td style={{ fontWeight: 600 }}>
                      {r.driverName}
                    </td>

                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {r.pumpName}
                    </td>

                    <td style={{ fontWeight: 700 }}>
                      {Number(r.liters).toFixed(2)} L
                    </td>

                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Rs. {Number(r.ratePerLiter).toFixed(2)}
                    </td>

                    <td style={{ fontWeight: 800, color: '#047857', fontSize: '0.94rem' }}>
                      {formatCurrency(r.totalCost)}
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {/* View / Reprint Slip Button */}
                        <button 
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: 600 }}
                          onClick={() => onOpenSlipPreview(r)}
                          title="Open Dual Printable Slip in Single A4 Page view"
                        >
                          <Printer size={13} />
                          <span>View / Reprint Slip</span>
                        </button>

                        {/* Delete Button */}
                        <button 
                          className="btn-icon-delete"
                          style={{ padding: '5px 8px' }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete Slip ${r.slipNumber || r.id}?`)) {
                              onDeleteSlip(r.id);
                              onShowToast(`Slip ${r.slipNumber || r.id} deleted`, 'danger');
                            }
                          }}
                          title="Delete transaction record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
