import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Trash2, 
  Pencil,
  User, 
  X, 
  Filter
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManageVehicles({ 
  vehicles = [], 
  drivers = [], 
  onAddVehicle, 
  onUpdateVehicle,
  onDeleteVehicle, 
  onShowToast,
  canDelete = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
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
    setEditingVehicle(null);
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

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    const isDriverInList = drivers.some(d => d.name === vehicle.assignedDriverName);
    const isUnassigned = vehicle.assignedDriverName === 'Unassigned' || !vehicle.assignedDriverName;

    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType || 'Car',
      assignedDriverName: (isDriverInList || isUnassigned) ? (vehicle.assignedDriverName || 'Unassigned') : 'CUSTOM',
      customDriverName: (!isDriverInList && !isUnassigned) ? vehicle.assignedDriverName : ''
    });
    setUseCustomDriver(!isDriverInList && !isUnassigned);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanNumber = formData.vehicleNumber.trim().toUpperCase();
    if (!cleanNumber) {
      setFormError('Vehicle Number is required (e.g., LEA-1234).');
      return;
    }

    // Check duplicate plate
    const isDuplicate = vehicles.some((v) => {
      if (editingVehicle && v.id === editingVehicle.id) return false;
      return v.vehicleNumber.toUpperCase() === cleanNumber;
    });

    if (isDuplicate) {
      setFormError(`Vehicle with license plate "${cleanNumber}" already exists.`);
      return;
    }

    let finalDriver = formData.assignedDriverName;
    if (useCustomDriver) {
      finalDriver = formData.customDriverName.trim() || 'Unassigned';
    }

    if (editingVehicle) {
      if (onUpdateVehicle) {
        onUpdateVehicle(editingVehicle.id, {
          vehicleNumber: cleanNumber,
          vehicleType: formData.vehicleType,
          assignedDriverName: finalDriver
        });
      }
      onShowToast(`Vehicle ${cleanNumber} updated successfully!`, 'success');
    } else {
      onAddVehicle({
        vehicleNumber: cleanNumber,
        vehicleType: formData.vehicleType,
        assignedDriverName: finalDriver
      });
      onShowToast(`Vehicle ${cleanNumber} registered successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteVehicle(deleteTarget.id);
      onShowToast(`Vehicle ${deleteTarget.vehicleNumber} removed`, 'danger');
      setDeleteTarget(null);
    }
  };

  const getVehicleBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'car':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'truck':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'van':
        return { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' };
      case 'bike':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Company Vehicles
            </h3>
            <span 
              style={{ 
                fontSize: '0.78rem', 
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
              <h4 className="empty-title">
                {vehicles.length === 0 ? 'No fleet vehicles registered yet' : 'No matching vehicles found'}
              </h4>
              <p className="empty-description">
                {vehicles.length === 0 
                  ? "Click the 'Add Vehicle' button above to register your first company vehicle."
                  : 'Try adjusting your search query or vehicle type filter.'}
              </p>
              {vehicles.length === 0 && (
                <button className="btn-primary" onClick={handleOpenAddModal} style={{ marginTop: '14px' }}>
                  <Plus size={16} />
                  <span>Register First Vehicle</span>
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Vehicle Type</th>
                  <th>Assigned Driver</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => {
                  const badge = getVehicleBadgeColor(vehicle.vehicleType);
                  return (
                    <tr key={vehicle.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="license-plate-badge">
                            {vehicle.vehicleNumber}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span 
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`
                          }}
                        >
                          {vehicle.vehicleType}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} style={{ color: '#2563EB' }} />
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
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
                        {vehicle.createdAt || 'Today'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Edit Button (Admin & Manager) */}
                          <button 
                            className="btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                            onClick={() => handleOpenEditModal(vehicle)}
                            title="Edit vehicle details"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button (Admin Only) */}
                          {canDelete && (
                            <button 
                              className="btn-icon-delete"
                              onClick={() => setDeleteTarget(vehicle)}
                              title="Delete vehicle record"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Car size={20} style={{ color: '#2563EB' }} />
                {editingVehicle ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
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
                    Vehicle Number (License Plate) <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., LEA-1234 or KHI-9876"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    required
                  />
                  <div className="form-helper">
                    Official registration plate format
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
                    <option value="Car">Car</option>
                    <option value="Bike">Bike (Motorcycle)</option>
                    <option value="Truck">Truck (Heavy Freight)</option>
                    <option value="Van">Van (Passenger / Cargo)</option>
                  </select>
                </div>

                {/* Field 3: Assigned Driver Name */}
                <div className="form-group">
                  <label className="form-label">
                    Assigned Driver
                  </label>
                  {!useCustomDriver ? (
                    <select 
                      className="form-select"
                      value={formData.assignedDriverName}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM') {
                          setUseCustomDriver(true);
                          setFormData({ ...formData, assignedDriverName: 'CUSTOM', customDriverName: '' });
                        } else {
                          setFormData({ ...formData, assignedDriverName: e.target.value });
                        }
                      }}
                    >
                      <option value="Unassigned">-- Unassigned --</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.phone ? `(${d.phone})` : ''}
                        </option>
                      ))}
                      <option value="CUSTOM">+ Type new driver name...</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Enter driver name"
                        value={formData.customDriverName}
                        onChange={(e) => setFormData({ ...formData, customDriverName: e.target.value })}
                        autoFocus
                      />
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => {
                          setUseCustomDriver(false);
                          setFormData({ ...formData, assignedDriverName: 'Unassigned', customDriverName: '' });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <div className="form-helper">
                    Driver assigned to operate this vehicle
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
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
        message="Are you sure you want to delete vehicle"
        itemName={deleteTarget?.vehicleNumber}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
