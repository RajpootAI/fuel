import React, { useState } from 'react';
import { Layers, X, CheckCircle, Car, Users, Fuel, ArrowRight } from 'lucide-react';

export default function TestDropdownModal({ 
  isOpen, 
  onClose, 
  vehicles, 
  drivers, 
  pumps 
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.vehicleNumber || '');
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]?.name || '');
  const [selectedPump, setSelectedPump] = useState(pumps[0]?.pumpName || '');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={20} style={{ color: '#2563EB' }} />
            Phase 2 Ready: Dropdown Integration Test
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div 
            style={{ 
              padding: '12px 16px', 
              backgroundColor: '#EFF6FF', 
              border: '1px solid #BFDBFE', 
              borderRadius: '8px',
              fontSize: '0.86rem',
              color: '#1E40AF',
              marginBottom: '20px',
              lineHeight: 1.45
            }}
          >
            <strong>Master Records Synced!</strong> The dropdown menus below pull live records directly from your saved Vehicles, Drivers, and Fuel Pumps.
          </div>

          {/* Vehicle Dropdown */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Car size={16} style={{ color: '#2563EB' }} />
              Select Vehicle ({vehicles.length} available)
            </label>
            <select 
              className="form-select"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber} — {v.vehicleType} (Assigned: {v.assignedDriverName})
                </option>
              ))}
            </select>
          </div>

          {/* Driver Dropdown */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: '#2563EB' }} />
              Select Driver ({drivers.length} available)
            </label>
            <select 
              className="form-select"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} — Ph: {d.phone} (License: {d.licenseNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Pump Dropdown */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Fuel size={16} style={{ color: '#2563EB' }} />
              Select Fuel Pump / Station ({pumps.length} available)
            </label>
            <select 
              className="form-select"
              value={selectedPump}
              onChange={(e) => setSelectedPump(e.target.value)}
            >
              {pumps.map((p) => (
                <option key={p.id} value={p.pumpName}>
                  {p.pumpName} — {p.location}
                </option>
              ))}
            </select>
          </div>

          {/* Live Selected Summary */}
          <div 
            style={{ 
              marginTop: '20px', 
              padding: '14px', 
              backgroundColor: '#F8FAFC', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px',
              fontSize: '0.82rem'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Current Dropdown Selection State:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', color: 'var(--text-secondary)' }}>
              <div>• Vehicle: <strong style={{ color: 'var(--text-main)' }}>{selectedVehicle || 'None'}</strong></div>
              <div>• Driver: <strong style={{ color: 'var(--text-main)' }}>{selectedDriver || 'None'}</strong></div>
              <div>• Fuel Pump: <strong style={{ color: 'var(--text-main)' }}>{selectedPump || 'None'}</strong></div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            <CheckCircle size={16} />
            <span>Looks Great!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
