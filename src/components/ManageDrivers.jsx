import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Pencil,
  Phone, 
  CreditCard, 
  Award, 
  Car, 
  X,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManageDrivers({ 
  drivers = [], 
  vehicles = [], 
  onAddDriver, 
  onUpdateDriver,
  onDeleteDriver, 
  onShowToast,
  canDelete = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
    licenseNumber: '',
    username: '',
    password: '',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredDrivers = drivers.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      (d.phone && d.phone.toLowerCase().includes(q)) ||
      (d.cnic && d.cnic.toLowerCase().includes(q)) ||
      (d.licenseNumber && d.licenseNumber.toLowerCase().includes(q)) ||
      (d.username && d.username.toLowerCase().includes(q))
    );
  });

  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '',
      cnic: '',
      licenseNumber: '',
      username: '',
      password: '',
      status: 'Active'
    });
    setFormError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name || '',
      phone: driver.phone || '',
      cnic: driver.cnic || '',
      licenseNumber: driver.licenseNumber || '',
      username: driver.username || '',
      password: driver.password || '',
      status: driver.status || 'Active'
    });
    setFormError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanName = formData.name.trim();
    if (!cleanName) {
      setFormError('Driver full name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }
    if (!formData.cnic.trim()) {
      setFormError('ID / CNIC number is required.');
      return;
    }
    if (!formData.licenseNumber.trim()) {
      setFormError('Driving License number is required.');
      return;
    }

    if (editingDriver) {
      if (onUpdateDriver) {
        onUpdateDriver(editingDriver.id, formData);
      }
      onShowToast(`Driver ${cleanName} updated successfully!`, 'success');
    } else {
      onAddDriver(formData);
      onShowToast(`Driver ${cleanName} registered successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteDriver(deleteTarget.id);
      onShowToast(`Driver ${deleteTarget.name} removed`, 'danger');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Company Drivers
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
              {drivers.length} Registered
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Maintain company driver records, licenses, contact info, and driver portal login credentials
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by name, phone, CNIC, or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={17} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Drivers Table Card */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Driver Registry & Login Credentials
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredDrivers.length}</strong> of {drivers.length} drivers
          </div>
        </div>

        <div className="data-table-container">
          {filteredDrivers.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <h4 className="empty-title">
                {drivers.length === 0 ? 'No drivers registered yet' : 'No matching drivers found'}
              </h4>
              <p className="empty-description">
                {drivers.length === 0 
                  ? "Click the 'Add Driver' button above to register your first company driver and create their login credentials."
                  : 'Try adjusting your search criteria.'}
              </p>
              {drivers.length === 0 && (
                <button className="btn-primary" onClick={handleOpenAddModal} style={{ marginTop: '14px' }}>
                  <UserPlus size={16} />
                  <span>Register First Driver</span>
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Phone Number</th>
                  <th>CNIC / ID Number</th>
                  <th>License Number</th>
                  <th>Portal Login</th>
                  <th>Assigned Vehicle</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => {
                  const assignedVehicle = vehicles.find(
                    (v) => (v.assignedDriverName || '').toLowerCase() === driver.name.toLowerCase()
                  );

                  return (
                    <tr key={driver.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div 
                            style={{ 
                              width: '34px', 
                              height: '34px', 
                              borderRadius: '50%', 
                              backgroundColor: '#EFF6FF', 
                              color: '#1D4ED8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {driver.name.charAt(0).toUpperCase()}
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
                          <span style={{ fontWeight: 500 }}>{driver.phone || '-'}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={14} style={{ color: '#64748B' }} />
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                            {driver.cnic || '-'}
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
                              fontSize: '0.78rem',
                              fontWeight: 600 
                            }}
                          >
                            {driver.licenseNumber || '-'}
                          </span>
                        </div>
                      </td>

                      <td>
                        {driver.username ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 600, color: '#1E40AF' }}>
                              @{driver.username}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                              ✓ Portal Login Active
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                            No login set
                          </span>
                        )}
                      </td>

                      <td>
                        {assignedVehicle ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Car size={14} style={{ color: '#2563EB' }} />
                            <span className="license-plate-badge" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                              {assignedVehicle.vehicleNumber}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button 
                            className="btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                            onClick={() => handleOpenEditModal(driver)}
                            title="Edit driver details"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>

                          {canDelete && (
                            <button 
                              className="btn-icon-delete"
                              onClick={() => setDeleteTarget(driver)}
                              title="Delete driver"
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

      {/* Add / Edit Driver Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <UserPlus size={20} style={{ color: '#2563EB' }} />
                {editingDriver ? 'Edit Company Driver' : 'Register New Driver'}
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
                    placeholder="e.g., Muhammad Ali or Tariq Mehmood"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name: val,
                        // Auto suggest username on Add mode if not edited yet
                        username: !editingDriver && !formData.username ? `driver_${val.toLowerCase().replace(/[^a-z0-9]/g, '')}` : formData.username
                      });
                    }}
                    required
                  />
                </div>

                {/* Field 2: Phone Number */}
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., 0300-1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Field 3: CNIC / National ID */}
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
                  />
                </div>

                {/* Field 4: License Number */}
                <div className="form-group">
                  <label className="form-label">
                    Driving License Number <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., LHR-98213-C"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Section: Driver Portal Login Credentials */}
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '10px' }}>
                    <KeyRound size={16} />
                    <span>Driver Portal Login Credentials</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Login Username
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g., driver_ali"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    />
                    <div className="form-helper">
                      Username the driver will use to log into the mobile Driver Portal
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Login Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Set driver login password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ paddingRight: '42px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <div className="form-helper">
                      Provide this password to the driver so they can view vouchers on their phone
                    </div>
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
                  {editingDriver ? 'Save Driver Changes' : 'Register Driver'}
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
        message="Are you sure you want to remove driver"
        itemName={deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
