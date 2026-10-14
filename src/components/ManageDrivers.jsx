import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Phone, 
  CreditCard, 
  Award, 
  Car,
  X 
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManageDrivers({ 
  drivers, 
  vehicles, 
  onAddDriver, 
  onDeleteDriver, 
  onShowToast,
  canDelete = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
    licenseNumber: ''
  });
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      d.cnic.toLowerCase().includes(q) ||
      d.licenseNumber.toLowerCase().includes(q)
    );
  });

  // Find assigned vehicle for each driver
  const getAssignedVehicle = (driverName) => {
    const v = vehicles.find((veh) => veh.assignedDriverName === driverName);
    return v ? v.vehicleNumber : null;
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      phone: '',
      cnic: '',
      licenseNumber: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Driver Name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Phone Number is required.');
      return;
    }
    if (!formData.cnic.trim()) {
      setFormError('CNIC / ID Number is required.');
      return;
    }
    if (!formData.licenseNumber.trim()) {
      setFormError('Driver License Number is required.');
      return;
    }

    onAddDriver(formData);
    onShowToast(`Driver ${formData.name.trim()} added successfully!`, 'success');
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteDriver(deleteTarget.id);
      onShowToast(`Driver ${deleteTarget.name} removed from registry.`, 'danger');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page-content">
      {/* Header and Controls */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Driver Directory
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
              {drivers.length} Drivers
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Maintain company driver profiles, contact phones, CNIC credentials, and licenses
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by name, phone, CNIC, license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <Plus size={17} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Drivers Table Card */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
            All Registered Authorized Drivers
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredDrivers.length}</strong> of {drivers.length} drivers
          </div>
        </div>

        <div className="data-table-container">
          {filteredDrivers.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <h4 className="empty-title">No drivers found</h4>
              <p className="empty-description">
                {searchQuery
                  ? 'No driver matched your search criteria.'
                  : 'Click "+ Add Driver" to register company drivers.'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>CNIC / ID Number</th>
                  <th>License Number</th>
                  <th>Assigned Vehicle</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => {
                  const assignedVehicle = getAssignedVehicle(driver.name);
                  return (
                    <tr key={driver.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div 
                            style={{ 
                              width: '34px', 
                              height: '34px', 
                              borderRadius: '50%', 
                              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.82rem'
                            }}
                          >
                            {driver.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {driver.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              ID: {driver.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Phone size={14} style={{ color: '#2563EB' }} />
                          <span style={{ fontWeight: 500 }}>{driver.phone}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={14} style={{ color: '#64748B' }} />
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                            {driver.cnic}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Award size={14} style={{ color: '#D97706' }} />
                          <span 
                            style={{ 
                              padding: '2px 8px', 
                              backgroundColor: '#FEF3C7', 
                              color: '#92400E', 
                              borderRadius: '4px',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.8rem',
                              fontWeight: 600 
                            }}
                          >
                            {driver.licenseNumber}
                          </span>
                        </div>
                      </td>

                      <td>
                        {assignedVehicle ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Car size={14} style={{ color: '#2563EB' }} />
                            <span className="license-plate-badge" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                              {assignedVehicle}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="status-badge">
                          <span className="dot" />
                          {driver.status || 'Active'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {canDelete ? (
                          <button 
                            className="btn-icon-delete"
                            onClick={() => setDeleteTarget(driver)}
                            title="Delete driver"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            View Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Users size={20} style={{ color: '#2563EB' }} />
                Register New Driver
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

                {/* Field 1: Driver Name */}
                <div className="form-group">
                  <label className="form-label">
                    Driver Full Name <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Muhammad Ali, Tariq Mahmood"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                {/* Field 2: Phone Number */}
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="req">*</span>
                  </label>
                  <input 
                    type="tel"
                    className="form-input"
                    placeholder="e.g., 0300-1234567, +92 321 7654321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <div className="form-helper">Official contact number for fuel authorizations & alerts</div>
                </div>

                {/* Field 3: CNIC/ID Number */}
                <div className="form-group">
                  <label className="form-label">
                    CNIC / National ID Number <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., 35201-1234567-1"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    required
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <div className="form-helper">Format: 5 digits - 7 digits - 1 digit</div>
                </div>

                {/* Field 4: License Number */}
                <div className="form-group">
                  <label className="form-label">
                    Driving License Number <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., LHR-98213-C, ISB-33109-M"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                    style={{ textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <div className="form-helper">Valid government issued driving license number</div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Driver Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={Boolean(deleteTarget)}
        title="Delete Driver"
        message={`Are you sure you want to remove this driver from the system registry? Any vehicle currently assigned to them will be set to Unassigned.`}
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.phone})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
