import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  PlusCircle, 
  Fuel, 
  Building2, 
  Car, 
  User, 
  Phone, 
  Gauge, 
  Coins, 
  CheckCircle2, 
  Scissors
} from 'lucide-react';

export default function DualSlipPreview({ 
  slip, 
  vehicles = [], 
  drivers = [], 
  pumps = [], 
  onClose, 
  onIssueAnother 
}) {
  if (!slip) return null;

  const handlePrint = () => {
    window.print();
  };

  // Cross-reference data from master registries if not directly in the slip record
  const matchedVehicle = vehicles.find(
    (v) => v.vehicleNumber?.toUpperCase() === slip.vehicleNumber?.toUpperCase()
  );
  const matchedDriver = drivers.find(
    (d) => d.name?.toLowerCase() === slip.driverName?.toLowerCase()
  );
  const matchedPump = pumps.find(
    (p) => p.pumpName?.toLowerCase() === slip.pumpName?.toLowerCase()
  );

  const vehicleType = slip.vehicleType || matchedVehicle?.vehicleType || 'Fleet Vehicle';
  const driverPhone = slip.driverPhone || matchedDriver?.phone || 'Official Fleet Contact';
  const pumpLocation = slip.pumpLocation || matchedPump?.location || 'Authorized Station Branch';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 2
    }).format(val || 0).replace('PKR', 'Rs.');
  };

  const formatDateTime = (dtStr) => {
    if (!dtStr) return 'N/A';
    try {
      const d = new Date(dtStr);
      if (isNaN(d.getTime())) return dtStr;
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dtStr;
    }
  };

  // Reusable Single Slip Component (A4 half-page fit)
  const renderSingleSlip = (badgeText, badgeType) => {
    const isOfficeCopy = badgeType === 'office';

    return (
      <div className={`a4-slip-card ${isOfficeCopy ? 'slip-office' : 'slip-pump'}`}>
        {/* Header Row: Company Name & Top Right Badge */}
        <div className="slip-top-row">
          <div className="slip-brand">
            <div className="slip-brand-icon">
              <Fuel size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="slip-company-title">Company Fuel Management System</h2>
              <p className="slip-company-subtitle">Official Fleet Logistics & Fuel Authorization Voucher</p>
            </div>
          </div>

          {/* Top-Right Badge: OFFICE RECORD COPY or FUEL PUMP COPY */}
          <div className={`slip-badge ${isOfficeCopy ? 'badge-office' : 'badge-pump'}`}>
            {badgeText}
          </div>
        </div>

        {/* Voucher Meta Strip: Slip # and Date/Time */}
        <div className="slip-meta-bar">
          <div className="meta-item">
            <span className="meta-label">SLIP NO:</span>
            <span className="meta-value-mono">{slip.slipNumber}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">DATE & TIME:</span>
            <span className="meta-value">{formatDateTime(slip.dateTime)}</span>
          </div>
          <div className="meta-item" style={{ marginLeft: 'auto' }}>
            <span className="meta-label">STATUS:</span>
            <span className="meta-status-authorized">AUTHORIZED</span>
          </div>
        </div>

        {/* Highlighted Fuel Pump Section */}
        <div className="slip-pump-highlight-box">
          <div className="pump-highlight-left">
            <Building2 size={18} className="pump-icon-accent" />
            <div>
              <span className="pump-section-tag">AUTHORIZED FUEL STATION</span>
              <div className="pump-title-bold">{slip.pumpName}</div>
            </div>
          </div>
          <div className="pump-highlight-right">
            <span className="pump-section-tag">STATION LOCATION / CITY</span>
            <div className="pump-location-text">{pumpLocation}</div>
          </div>
        </div>

        {/* Vehicle & Driver Information Grid */}
        <div className="slip-party-grid">
          {/* Vehicle Info */}
          <div className="party-box">
            <div className="party-box-header">
              <Car size={14} />
              <span>VEHICLE DETAILS</span>
            </div>
            <div className="party-box-body">
              <div className="party-row">
                <span className="lbl">Vehicle Number:</span>
                <span className="val plate-tag">{slip.vehicleNumber}</span>
              </div>
              <div className="party-row">
                <span className="lbl">Vehicle Type:</span>
                <span className="val type-pill">{vehicleType}</span>
              </div>
              <div className="party-row">
                <span className="lbl">Meter Reading (KM):</span>
                <span className="val km-text">
                  {slip.odometerReading ? `${Number(slip.odometerReading).toLocaleString()} KM` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="party-box">
            <div className="party-box-header">
              <User size={14} />
              <span>AUTHORIZED DRIVER</span>
            </div>
            <div className="party-box-body">
              <div className="party-row">
                <span className="lbl">Driver Name:</span>
                <span className="val driver-name-bold">{slip.driverName}</span>
              </div>
              <div className="party-row">
                <span className="lbl">Phone Number:</span>
                <span className="val font-mono">{driverPhone}</span>
              </div>
              <div className="party-row">
                <span className="lbl">Trip Purpose:</span>
                <span className="val remarks-truncate" title={slip.remarks}>
                  {slip.remarks || 'Official Fleet Operation Transit'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel & Billing Table / Strip */}
        <div className="slip-financial-strip">
          <div className="fin-col">
            <span className="fin-lbl">FUEL PRODUCT</span>
            <span className="fin-val fuel-type-tag">{slip.fuelType || 'Petrol'}</span>
          </div>

          <div className="fin-col">
            <span className="fin-lbl">QUANTITY (LITERS)</span>
            <span className="fin-val font-bold-dark">{Number(slip.liters).toFixed(2)} L</span>
          </div>

          <div className="fin-col">
            <span className="fin-lbl">RATE PER LITER</span>
            <span className="fin-val font-mono">Rs. {Number(slip.ratePerLiter).toFixed(2)}</span>
          </div>

          <div className="fin-col fin-total-box">
            <span className="fin-lbl-total">NET TOTAL AMOUNT</span>
            <span className="fin-total-amount">{formatCurrency(slip.totalCost)}</span>
          </div>
        </div>

        {/* Three Required Signature Lines */}
        <div className="slip-signatures-container">
          <div className="sig-column">
            <div className="sig-space" />
            <div className="sig-title">Admin / Issuer Signature</div>
          </div>

          <div className="sig-column">
            <div className="sig-space" />
            <div className="sig-title">Driver Signature</div>
          </div>

          <div className="sig-column">
            <div className="sig-space" />
            <div className="sig-title">Pump Manager Stamp & Sign</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="preview-screen-overlay">
      {/* Top Floating Control Bar (Hidden during printing) */}
      <div className="preview-action-bar no-print">
        <div className="preview-bar-left">
          <button className="btn-secondary" onClick={onClose}>
            <ArrowLeft size={16} />
            <span>Close Preview</span>
          </button>

          <div className="slip-saved-badge">
            <CheckCircle2 size={16} style={{ color: '#10B981' }} />
            <span>Voucher <strong>{slip.slipNumber}</strong> • Dual A4 Printable Sheet</span>
          </div>
        </div>

        <div className="preview-bar-right">
          <button 
            className="btn-secondary" 
            onClick={onIssueAnother}
            title="Create another fuel issue voucher"
          >
            <PlusCircle size={16} />
            <span>Issue Another Slip</span>
          </button>

          {/* Blue "Print Slips" button requested by user */}
          <button 
            className="btn-primary btn-blue-print" 
            onClick={handlePrint}
            title="Trigger browser print dialog (Ctrl+P)"
          >
            <Printer size={18} />
            <span>Print Slips</span>
          </button>
        </div>
      </div>

      {/* A4 Printable Sheet (Exactly 2 Slips Stacked Vertically with Cut Line) */}
      <div className="a4-print-canvas">
        <div className="a4-paper-sheet">
          {/* Top Half: Top Slip with "OFFICE RECORD COPY" Badge */}
          {renderSingleSlip('OFFICE RECORD COPY', 'office')}

          {/* Dashed Horizontal Cut-Line with Scissor Icon: --- ✂️ Cut Here --- */}
          <div className="a4-cut-line">
            <div className="cut-line-left" />
            <div className="cut-line-badge">
              <span className="cut-symbol">--- ✂️ Cut Here ---</span>
            </div>
            <div className="cut-line-right" />
          </div>

          {/* Bottom Half: Bottom Slip with "FUEL PUMP COPY" Badge */}
          {renderSingleSlip('FUEL PUMP COPY', 'pump')}
        </div>
      </div>
    </div>
  );
}
