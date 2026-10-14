import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Car, 
  User, 
  Building2, 
  Gauge, 
  Fuel, 
  Coins, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock3,
  RefreshCw, 
  Printer, 
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { getNextSlipNumber } from '../services/storage';

export default function IssueFuel({ 
  vehicles, 
  drivers, 
  pumps, 
  transactions, 
  onSaveSlip, 
  onDeleteSlip, 
  onOpenSlipPreview,
  onShowToast,
  canDelete = true
}) {
  // Helper to get formatted local datetime string for input: YYYY-MM-DDTHH:mm
  const getCurrentLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Form State for 11 Fields
  const [formData, setFormData] = useState({
    slipNumber: '',
    dateTime: getCurrentLocalDateTime(),
    vehicleNumber: '',
    driverName: '',
    pumpName: '',
    fuelType: 'Petrol',
    odometerReading: '',
    liters: '',
    ratePerLiter: '275.50',
    remarks: ''
  });

  const [formError, setFormError] = useState('');

  // Initialize defaults on component mount or master data load
  useEffect(() => {
    const nextSlip = getNextSlipNumber();
    const defaultVehicle = vehicles.length > 0 ? vehicles[0].vehicleNumber : '';
    const assignedDriver = vehicles.find((v) => v.vehicleNumber === defaultVehicle)?.assignedDriverName;
    const defaultDriver = (assignedDriver && assignedDriver !== 'Unassigned') 
      ? assignedDriver 
      : (drivers.length > 0 ? drivers[0].name : '');
    const defaultPump = pumps.length > 0 ? pumps[0].pumpName : '';

    setFormData((prev) => ({
      ...prev,
      slipNumber: nextSlip,
      dateTime: getCurrentLocalDateTime(),
      vehicleNumber: prev.vehicleNumber || defaultVehicle,
      driverName: prev.driverName || defaultDriver,
      pumpName: prev.pumpName || defaultPump,
      fuelType: prev.fuelType || 'Petrol'
    }));
  }, [vehicles, drivers, pumps]);

  // Handle vehicle change with smart driver auto-select
  const handleVehicleChange = (vehicleNum) => {
    const veh = vehicles.find((v) => v.vehicleNumber === vehicleNum);
    let autoDriver = formData.driverName;

    // If selected vehicle has an assigned driver, automatically select them!
    if (veh && veh.assignedDriverName && veh.assignedDriverName !== 'Unassigned') {
      const driverExists = drivers.some((d) => d.name === veh.assignedDriverName);
      if (driverExists) {
        autoDriver = veh.assignedDriverName;
      }
    }

    // Smart default fuel type based on vehicle type
    let autoFuel = formData.fuelType;
    if (veh?.vehicleType === 'Truck') {
      autoFuel = 'Diesel';
    } else if (veh?.vehicleType === 'Car' || veh?.vehicleType === 'Bike') {
      autoFuel = 'Petrol';
    }

    // Smart default rate based on fuel type
    let autoRate = formData.ratePerLiter;
    if (autoFuel === 'Diesel') autoRate = '284.00';
    if (autoFuel === 'Petrol') autoRate = '275.50';
    if (autoFuel === 'Hi-Octane') autoRate = '305.00';
    if (autoFuel === 'CNG') autoRate = '210.00';

    setFormData((prev) => ({
      ...prev,
      vehicleNumber: vehicleNum,
      driverName: autoDriver,
      fuelType: autoFuel,
      ratePerLiter: autoRate
    }));
  };

  // Handle Fuel Type change with market standard rates
  const handleFuelTypeChange = (fuelType) => {
    let rate = formData.ratePerLiter;
    if (fuelType === 'Petrol') rate = '275.50';
    if (fuelType === 'Diesel') rate = '284.00';
    if (fuelType === 'Hi-Octane') rate = '305.00';
    if (fuelType === 'CNG') rate = '210.00';

    setFormData((prev) => ({
      ...prev,
      fuelType,
      ratePerLiter: rate
    }));
  };

  // Auto-calculated Total Cost: Quantity x Rate
  const quantityNum = parseFloat(formData.liters) || 0;
  const rateNum = parseFloat(formData.ratePerLiter) || 0;
  const calculatedTotalCost = Math.round((quantityNum * rateNum) * 100) / 100;

  const handleRefreshSlipNumber = () => {
    setFormData((prev) => ({
      ...prev,
      slipNumber: getNextSlipNumber()
    }));
    onShowToast('Generated new Slip Number', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validation checks
    if (!formData.slipNumber.trim()) {
      setFormError('Slip / Voucher number is required.');
      return;
    }
    if (!formData.vehicleNumber) {
      setFormError('Please select a registered vehicle.');
      return;
    }
    if (!formData.driverName) {
      setFormError('Please select an authorized driver.');
      return;
    }
    if (!formData.pumpName) {
      setFormError('Please select a contracted fuel pump station.');
      return;
    }
    if (quantityNum <= 0) {
      setFormError('Please enter a valid fuel quantity in liters (greater than 0).');
      return;
    }
    if (rateNum <= 0) {
      setFormError('Please enter a valid rate per liter (greater than 0).');
      return;
    }

    const newRecord = {
      slipNumber: formData.slipNumber.trim().toUpperCase(),
      dateTime: formData.dateTime,
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      pumpName: formData.pumpName,
      fuelType: formData.fuelType,
      odometerReading: parseFloat(formData.odometerReading) || 0,
      liters: quantityNum,
      ratePerLiter: rateNum,
      totalCost: calculatedTotalCost,
      remarks: formData.remarks.trim()
    };

    // Save to database
    const savedSlip = onSaveSlip(newRecord);
    onShowToast(`Fuel Slip ${savedSlip.slipNumber} created and saved successfully!`, 'success');

    // Immediately open Dual Printable Slip Preview screen!
    onOpenSlipPreview(savedSlip);

    // Prepare form for next entry with updated slip number
    setFormData({
      slipNumber: getNextSlipNumber(),
      dateTime: getCurrentLocalDateTime(),
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      pumpName: formData.pumpName,
      fuelType: formData.fuelType,
      odometerReading: '',
      liters: '',
      ratePerLiter: formData.ratePerLiter,
      remarks: ''
    });
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
      {/* View Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Issue Fuel (Add Fuel Voucher)
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
              Official Slip Generator
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Generate official fuel authorization slips linked to fleet vehicles, drivers, and pump stations
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="table-card" style={{ marginBottom: '32px' }}>
        <div className="table-toolbar" style={{ backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            <Receipt size={18} style={{ color: '#2563EB' }} />
            <span>Fuel Issuance Voucher Form</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Fields marked with <span style={{ color: '#EF4444' }}>*</span> are required
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {formError && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                backgroundColor: 'var(--danger-bg)', 
                color: 'var(--danger-text)', 
                border: '1px solid var(--danger-border)', 
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '24px'
              }}
            >
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Grid: Row 1 - Voucher & DateTime */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Field 1: Slip/Voucher Number */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Slip / Voucher Number <span className="req">*</span>
                </label>
                <button 
                  type="button" 
                  onClick={handleRefreshSlipNumber}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#2563EB', 
                    cursor: 'pointer', 
                    fontSize: '0.76rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontWeight: 600
                  }}
                  title="Generate next sequential voucher number"
                >
                  <RefreshCw size={12} /> Regenerate
                </button>
              </div>
              <input 
                type="text"
                className="form-input"
                value={formData.slipNumber}
                onChange={(e) => setFormData({ ...formData, slipNumber: e.target.value })}
                required
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace', 
                  fontWeight: 700, 
                  letterSpacing: '0.05em',
                  backgroundColor: '#F8FAFC' 
                }}
              />
              <div className="form-helper">Unique sequential identifier for audit & billing</div>
            </div>

            {/* Field 2: Date & Time */}
            <div className="form-group">
              <label className="form-label">
                Date & Time of Issue <span className="req">*</span>
              </label>
              <input 
                type="datetime-local"
                className="form-input"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                required
              />
              <div className="form-helper">Auto-filled with current timestamp, fully editable</div>
            </div>
          </div>

          {/* Form Grid: Row 2 - Dropdowns: Vehicle, Driver, Pump */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Field 3: Select Vehicle Number */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Car size={15} style={{ color: '#2563EB' }} />
                Select Vehicle Number <span className="req">*</span>
              </label>
              <select 
                className="form-select"
                value={formData.vehicleNumber}
                onChange={(e) => handleVehicleChange(e.target.value)}
                required
              >
                <option value="">-- Choose Registered Fleet Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.vehicleNumber}>
                    {v.vehicleNumber} ({v.vehicleType}) {v.assignedDriverName !== 'Unassigned' ? `• ${v.assignedDriverName}` : ''}
                  </option>
                ))}
              </select>
              <div className="form-helper">Linked to your registered master fleet vehicles</div>
            </div>

            {/* Field 4: Select Driver */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: '#2563EB' }} />
                Select Driver <span className="req">*</span>
              </label>
              <select 
                className="form-select"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                required
              >
                <option value="">-- Choose Authorized Driver --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.phone})
                  </option>
                ))}
              </select>
              <div className="form-helper">Auto-syncs with assigned vehicle driver</div>
            </div>

            {/* Field 5: Select Fuel Pump */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={15} style={{ color: '#2563EB' }} />
                Select Fuel Pump (Station) <span className="req">*</span>
              </label>
              <select 
                className="form-select"
                value={formData.pumpName}
                onChange={(e) => setFormData({ ...formData, pumpName: e.target.value })}
                required
              >
                <option value="">-- Choose Authorized Fuel Station --</option>
                {pumps.map((p) => (
                  <option key={p.id} value={p.pumpName}>
                    {p.pumpName} ({p.location})
                  </option>
                ))}
              </select>
              <div className="form-helper">Contracted fuel station vendor</div>
            </div>
          </div>

          {/* Form Grid: Row 3 - Fuel Type, Odometer, Liters, Rate, Total Cost */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Field 6: Fuel Type */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Fuel size={15} style={{ color: '#2563EB' }} />
                Fuel Type <span className="req">*</span>
              </label>
              <select 
                className="form-select"
                value={formData.fuelType}
                onChange={(e) => handleFuelTypeChange(e.target.value)}
                required
              >
                <option value="Petrol">Petrol (Super)</option>
                <option value="Diesel">Diesel (HSD)</option>
                <option value="Hi-Octane">Hi-Octane (RON 97)</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            {/* Field 7: Current Odometer Reading (KM) */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={15} style={{ color: '#2563EB' }} />
                Odometer Reading (KM)
              </label>
              <input 
                type="number"
                min="0"
                step="1"
                className="form-input"
                placeholder="e.g., 45850"
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
              />
              <div className="form-helper">Current vehicle mileage</div>
            </div>

            {/* Field 8: Fuel Quantity in Liters */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Fuel size={15} style={{ color: '#2563EB' }} />
                Quantity (Liters) <span className="req">*</span>
              </label>
              <input 
                type="number"
                min="0.1"
                step="0.01"
                className="form-input"
                placeholder="e.g., 45.00"
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                required
                style={{ fontWeight: 700 }}
              />
              <div className="form-helper">Fuel volume dispensed</div>
            </div>

            {/* Field 9: Rate per Liter */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coins size={15} style={{ color: '#2563EB' }} />
                Rate per Liter (Rs.) <span className="req">*</span>
              </label>
              <input 
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                placeholder="e.g., 275.50"
                value={formData.ratePerLiter}
                onChange={(e) => setFormData({ ...formData, ratePerLiter: e.target.value })}
                required
              />
              <div className="form-helper">Current fuel station price</div>
            </div>

            {/* Field 10: Total Cost (Auto-calculated) */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coins size={15} style={{ color: '#047857' }} />
                Total Cost (Auto-calc)
              </label>
              <div 
                style={{ 
                  height: '42px',
                  backgroundColor: '#ECFDF5', 
                  border: '2px solid #A7F3D0',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#065F46'
                }}
              >
                {formatCurrency(calculatedTotalCost)}
              </div>
              <div className="form-helper" style={{ color: '#059669' }}>
                = {quantityNum || 0} L × Rs. {rateNum || 0}
              </div>
            </div>
          </div>

          {/* Field 11: Remarks / Purpose of Trip */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} style={{ color: '#2563EB' }} />
              Remarks / Purpose of Trip <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g., Site delivery Lahore to Islamabad, client executive transit, monthly field inspection..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
            <div className="form-helper">Audit note for internal finance and fleet reconciliation</div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setFormData({
                  slipNumber: getNextSlipNumber(),
                  dateTime: getCurrentLocalDateTime(),
                  vehicleNumber: vehicles[0]?.vehicleNumber || '',
                  driverName: drivers[0]?.name || '',
                  pumpName: pumps[0]?.pumpName || '',
                  fuelType: 'Petrol',
                  odometerReading: '',
                  liters: '',
                  ratePerLiter: '275.50',
                  remarks: ''
                });
                setFormError('');
              }}
            >
              Reset Form
            </button>

            <button 
              type="submit" 
              className="btn-primary"
              style={{ 
                padding: '12px 24px', 
                fontSize: '0.98rem',
                gap: '10px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Printer size={18} />
              <span>Save & Generate Slips</span>
            </button>
          </div>
        </form>
      </div>

      {/* Issued Fuel Slips History Table */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Issued Fuel Slips Archive
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
              {transactions.length} Total
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Click "Print Slip" on any voucher to re-open the Dual Printable Preview
          </div>
        </div>

        <div className="data-table-container">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <Receipt className="empty-icon" />
              <h4 className="empty-title">No fuel slips issued yet</h4>
              <p className="empty-description">
                Fill the form above and click "Save & Generate Slips" to issue your first voucher.
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Date & Time</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Fuel Pump</th>
                  <th>Type</th>
                  <th>Liters</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
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
                        {tx.slipNumber || tx.id}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {tx.dateTime ? tx.dateTime.replace('T', ' ') : tx.date}
                    </td>
                    <td>
                      <span className="license-plate-badge" style={{ fontSize: '0.78rem', padding: '2px 8px' }}>
                        {tx.vehicleNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {tx.driverName}
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {tx.pumpName}
                    </td>
                    <td>
                      <span 
                        style={{ 
                          fontSize: '0.76rem', 
                          fontWeight: 600, 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          backgroundColor: tx.fuelType === 'Diesel' ? '#FEF3C7' : '#EFF6FF',
                          color: tx.fuelType === 'Diesel' ? '#B45309' : '#1D4ED8'
                        }}
                      >
                        {tx.fuelType || 'Petrol'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {Number(tx.liters).toFixed(1)} L
                    </td>
                    <td style={{ fontWeight: 800, color: '#047857' }}>
                      {formatCurrency(tx.totalCost)}
                    </td>
                    <td>
                      {tx.status === 'Filled' ? (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#ECFDF5',
                            color: '#047857',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            border: '1px solid #A7F3D0'
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Filled
                        </span>
                      ) : (
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#FFFBEB',
                            color: '#B45309',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            border: '1px solid #FDE68A'
                          }}
                        >
                          <Clock3 size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: 600 }}
                          onClick={() => onOpenSlipPreview(tx)}
                          title="Open Dual Printable Slip (Single A4 Page)"
                        >
                          <Printer size={13} />
                          <span>Print Slip</span>
                        </button>
                        {canDelete && (
                          <button 
                            className="btn-icon-delete"
                            style={{ padding: '5px 8px' }}
                            onClick={() => {
                              if (window.confirm(`Delete voucher ${tx.slipNumber || tx.id}?`)) {
                                onDeleteSlip(tx.id);
                                onShowToast(`Voucher ${tx.slipNumber || tx.id} deleted`, 'danger');
                              }
                            }}
                            title="Delete slip"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
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
