import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  Pencil,
  MapPin, 
  UserCheck, 
  Fuel, 
  X,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManagePumps({ 
  pumps = [], 
  onAddPump, 
  onUpdatePump,
  onDeletePump, 
  onShowToast,
  canDelete = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPump, setEditingPump] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pumpName: '',
    location: '',
    contactPerson: '',
    username: '',
    password: '',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredPumps = pumps.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      p.pumpName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.contactPerson.toLowerCase().includes(q) ||
      (p.username && p.username.toLowerCase().includes(q))
    );
  });

  const handleOpenAddModal = () => {
    setEditingPump(null);
    setFormData({
      pumpName: '',
      location: '',
      contactPerson: '',
      username: '',
      password: '',
      status: 'Active'
    });
    setFormError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pump) => {
    setEditingPump(pump);
    setFormData({
      pumpName: pump.pumpName || '',
      location: pump.location || '',
      contactPerson: pump.contactPerson || '',
      username: pump.username || '',
      password: pump.password || '',
      status: pump.status || 'Active'
    });
    setFormError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanName = formData.pumpName.trim();
    if (!cleanName) {
      setFormError('Fuel Station / Pump name is required.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Location / City is required.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setFormError('Contact person details are required.');
      return;
    }

    if (editingPump) {
      if (onUpdatePump) {
        onUpdatePump(editingPump.id, formData);
      }
      onShowToast(`Station "${cleanName}" updated successfully!`, 'success');
    } else {
      onAddPump(formData);
      onShowToast(`Station "${cleanName}" registered successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeletePump(deleteTarget.id);
      onShowToast(`Station "${deleteTarget.pumpName}" removed`, 'danger');
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
              Authorized Fuel Pumps (Stations)
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
              {pumps.length} Active Stations
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized fuel stations, vendor contracts, location addresses, and station portal login credentials
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by station name, city, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <Plus size={17} />
            <span>Add Fuel Station</span>
          </button>
        </div>
      </div>

      {/* Pumps Table Card */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Authorized Stations & Attendant Credentials
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredPumps.length}</strong> of {pumps.length} stations
          </div>
        </div>

        <div className="data-table-container">
          {filteredPumps.length === 0 ? (
            <div className="empty-state">
              <Fuel className="empty-icon" />
              <h4 className="empty-title">
                {pumps.length === 0 ? 'No fuel stations registered yet' : 'No matching fuel stations found'}
              </h4>
              <p className="empty-description">
                {pumps.length === 0 
                  ? "Click the 'Add Fuel Station' button above to register your first vendor station and create their portal login credentials."
                  : 'Try adjusting your search criteria.'}
              </p>
              {pumps.length === 0 && (
                <button className="btn-primary" onClick={handleOpenAddModal} style={{ marginTop: '14px' }}>
                  <Plus size={16} />
                  <span>Register First Fuel Station</span>
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fuel Station Name</th>
                  <th>Location / City</th>
                  <th>Contact Person</th>
                  <th>Station Portal Login</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPumps.map((pump) => (
                  <tr key={pump.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{ 
                            width: '34px', 
                            height: '34px', 
                            borderRadius: '8px', 
                            backgroundColor: '#FEF3C7', 
                            color: '#B45309',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}
                        >
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {pump.pumpName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            ID: {pump.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} style={{ color: '#2563EB', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem' }}>{pump.location || '-'}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={14} style={{ color: '#64748B', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>
                          {pump.contactPerson || '-'}
                        </span>
                      </div>
                    </td>

                    <td>
                      {pump.username ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 600, color: '#B45309' }}>
                            @{pump.username}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                            ✓ Station Portal Login Active
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          No login set
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="status-badge">
                        <span className="dot" />
                        {pump.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {pump.createdAt || 'Today'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          onClick={() => handleOpenEditModal(pump)}
                          title="Edit station details"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>

                        {canDelete && (
                          <button 
                            className="btn-icon-delete"
                            onClick={() => setDeleteTarget(pump)}
                            title="Delete fuel pump"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
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

      {/* Add / Edit Pump Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Fuel size={20} style={{ color: '#2563EB' }} />
                {editingPump ? 'Edit Authorized Fuel Station' : 'Add Authorized Fuel Station'}
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

                {/* Field 1: Pump Name */}
                <div className="form-group">
                  <label className="form-label">
                    Fuel Station / Pump Name <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Shell Airport Highway or PSO Main Boulevard"
                    value={formData.pumpName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        pumpName: val,
                        username: !editingPump && !formData.username ? `pump_${val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}` : formData.username
                      });
                    }}
                    required
                  />
                  <div className="form-helper">
                    Registered commercial fuel station name
                  </div>
                </div>

                {/* Field 2: Location */}
                <div className="form-group">
                  <label className="form-label">
                    Location / City <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Main Boulevard, Gulberg III, Lahore"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                {/* Field 3: Contact Person */}
                <div className="form-group">
                  <label className="form-label">
                    Contact Person & Phone <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Asif Javed (0300-1122334)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    required
                  />
                </div>

                {/* Section: Fuel Pump Station Portal Login Credentials */}
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#B45309', marginBottom: '10px' }}>
                    <KeyRound size={16} />
                    <span>Station Portal Login Credentials</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Station Login Username
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g., pump_gulberg"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    />
                    <div className="form-helper">
                      Username the pump operator will use to log in and confirm fuel fills
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Station Login Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Set station login password"
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
                      Provide this password to the station attendant to verify vouchers and mark filled
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
                  {editingPump ? 'Save Station Changes' : 'Register Fuel Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={Boolean(deleteTarget)}
        title="Delete Fuel Station"
        message="Are you sure you want to remove authorized station"
        itemName={deleteTarget?.pumpName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
