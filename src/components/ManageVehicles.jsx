import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Trash2, 
  User, 
  X, 
  Sparkles,
  Filter
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManageVehicles({ 
  vehicles, 
  drivers, 
  onAddVehicle, 
  onDeleteVehicle, 
  onShowToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    assignedDriverName: 'Unassigned',
    customDriverName: ''
  });
  const [useCustomDriver, setUseCustomDriver] = useState(false);
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = 
      selectedTypeFilter === 'ALL' || v.vehicleType.toUpperCase() === selectedTypeFilter.toUpperCase();

    return matchesSearch && matchesType;
  });

  const handleOpenAddModal = () => {
    setFormData({
      vehicleNumber: '',
      vehicleType: 'Car',
      assignedDriverName: drivers.length > 0 ? drivers[0].name : 'Unassigned',
      customDriverName: ''
    });
    setUseCustomDriver(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNumber = formData.vehicleNumber.trim().toUpperCase();

    if (!cleanNumber) {
      setFormError('Please enter a vehicle registration number (e.g., LEA-1234).');
      return;
    }

    // Check duplicate
    const exists = vehicles.some((v) => v.vehicleNumber.toUpperCase() === cleanNumber);
    if (exists) {
      setFormError(`Vehicle "${cleanNumber}" is already registered in the system.`);
      return;
    }

    const assignedDriver = useCustomDriver 
      ? (formData.customDriverName.trim() || 'Unassigned')
      : formData.assignedDriverName;

    onAddVehicle({
      vehicleNumber: cleanNumber,
      vehicleType: formData.vehicleType,
      assignedDriverName: assignedDriver
    });

    onShowToast(`Vehicle ${cleanNumber} registered successfully!`, 'success');
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteVehicle(deleteTarget.id);
      onShowToast(`Vehicle ${deleteTarget.vehicleNumber} was removed.`, 'danger');
      setDeleteTarget(null);
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'car': return 'car';
      case 'truck': return 'truck';
      case 'bike': return 'bike';
      case 'van': return 'van';
      default: return 'car';
    }
  };

  return (
    <div className="page-content">
      {/* Header and Controls */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Registered Vehicles
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
              {vehicles.length} Total
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Register fleet assets, assign drivers, and manage vehicle types
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by plate or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <Plus size={17} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="table-card">
        <div className="table-toolbar">
          <div className="filter-pills">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
              <Filter size={14} /> Filter:
            </span>
            {['ALL', 'Car', 'Bike', 'Truck', 'Van'].map((type) => (
              <button
                key={type}
                className={`filter-pill ${selectedTypeFilter === type ? 'active' : ''}`}
                onClick={() => setSelectedTypeFilter(type)}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} vehicles
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="data-table-container">
          {filteredVehicles.length === 0 ? (
            <div className="empty-state">
              <Car className="empty-icon" />
              <h4 className="empty-title">No vehicles found</h4>
              <p className="empty-description">
                {searchQuery || selectedTypeFilter !== 'ALL'
                  ? 'Try changing your search term or filter options.'
                  : 'Get started by clicking "+ Add Vehicle" to register your first vehicle.'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Vehicle Type</th>
                  <th>Assigned Driver</th>
                  <th>Status</th>
                  <th>Registered On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <span className="license-plate-badge">
                        {vehicle.vehicleNumber}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${getTypeBadgeClass(vehicle.vehicleType)}`}>
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          style={{ 
                            width: '26px', 
                            height: '26px', 
                            borderRadius: '50%', 
                            backgroundColor: vehicle.assignedDriverName === 'Unassigned' ? '#F1F5F9' : '#EFF6FF',
                            color: vehicle.assignedDriverName === 'Unassigned' ? '#94A3B8' : '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <User size={14} />
                        </div>
                        <span 
                          style={{ 
                            fontWeight: vehicle.assignedDriverName === 'Unassigned' ? 400 : 600,
                            color: vehicle.assignedDriverName === 'Unassigned' ? 'var(--text-muted)' : 'var(--text-main)',
                            fontStyle: vehicle.assignedDriverName === 'Unassigned' ? 'italic' : 'normal'
                          }}
                        >
                          {vehicle.assignedDriverName || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge">
                        <span className="dot" />
                        {vehicle.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {vehicle.createdAt || '2026-03-10'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-icon-delete"
                        onClick={() => setDeleteTarget(vehicle)}
                        title="Delete vehicle record"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Car size={20} style={{ color: '#2563EB' }} />
                Add New Fleet Vehicle
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div 
                    style={{ 
                      padding: '10px 14px', 
                      backgroundColor: 'var(--danger-bg)', 
                      color: 'var(--danger-text)', 
                      border: '1px solid var(--danger-border)',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      marginBottom: '16px'
                    }}
                  >
                    {formError}
                  </div>
                )}

                {/* Field 1: Vehicle Number */}
                <div className="form-group">
                  <label className="form-label">
                    Vehicle Number (Registration / Plate) <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., LEA-1234, KHI-9876, ISB-5544"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    required
                    autoFocus
                    style={{ textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                  />
                  <div className="form-helper">
                    Format: City code followed by registration number (e.g., LEA-1234)
                  </div>
                </div>

                {/* Field 2: Vehicle Type */}
                <div className="form-group">
                  <label className="form-label">
                    Vehicle Type <span className="req">*</span>
                  </label>
                  <select 
                    className="form-select"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="Car">Car (Sedan / Hatchback)</option>
                    <option value="Bike">Bike (Motorcycle / Delivery)</option>
                    <option value="Truck">Truck (Heavy Transport / Logistics)</option>
                    <option value="Van">Van (Passenger / Cargo Van)</option>
                  </select>
                </div>

                {/* Field 3: Assigned Driver Name */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Assigned Driver Name
                    </label>
                    <button 
                      type="button"
                      onClick={() => setUseCustomDriver(!useCustomDriver)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#2563EB', 
                        fontSize: '0.78rem', 
                        cursor: 'pointer',
                        fontWeight: 600 
                      }}
                    >
                      {useCustomDriver ? '← Select from registered drivers' : '+ Enter custom driver name'}
                    </button>
                  </div>

                  {!useCustomDriver ? (
                    <select 
                      className="form-select"
                      value={formData.assignedDriverName}
                      onChange={(e) => setFormData({ ...formData, assignedDriverName: e.target.value })}
                    >
                      <option value="Unassigned">-- Unassigned (No Driver Assigned) --</option>
                      {drivers.map((drv) => (
                        <option key={drv.id} value={drv.name}>
                          {drv.name} ({drv.phone})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Type driver full name..."
                      value={formData.customDriverName}
                      onChange={(e) => setFormData({ ...formData, customDriverName: e.target.value })}
                    />
                  )}
                  <div className="form-helper">
                    Pre-populated from your Master Drivers directory for easy 1-click assignment.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vehicle Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={Boolean(deleteTarget)}
        title="Delete Vehicle"
        message={`Are you sure you want to permanently remove this vehicle from the fleet registry?`}
        itemName={deleteTarget ? `${deleteTarget.vehicleNumber} (${deleteTarget.vehicleType})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
