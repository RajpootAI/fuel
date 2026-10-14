import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  MapPin, 
  UserCheck, 
  Fuel, 
  X 
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ManagePumps({ 
  pumps, 
  onAddPump, 
  onDeletePump, 
  onShowToast,
  canDelete = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    pumpName: '',
    location: '',
    contactPerson: ''
  });
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredPumps = pumps.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.pumpName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.contactPerson.toLowerCase().includes(q)
    );
  });

  const handleOpenAddModal = () => {
    setFormData({
      pumpName: '',
      location: '',
      contactPerson: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pumpName.trim()) {
      setFormError('Fuel Pump / Station Name is required.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Location or City is required.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setFormError('Contact Person name and details are required.');
      return;
    }

    onAddPump(formData);
    onShowToast(`Fuel station "${formData.pumpName.trim()}" added successfully!`, 'success');
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeletePump(deleteTarget.id);
      onShowToast(`Pump "${deleteTarget.pumpName}" deleted.`, 'danger');
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
              Authorized Fuel Pumps (Stations)
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
              {pumps.length} Stations
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage approved fuel stations, geographic locations, and pump station managers
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by station name, city, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <Plus size={17} />
            <span>Add Fuel Pump</span>
          </button>
        </div>
      </div>

      {/* Fuel Pumps Table Card */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Contracted & Registered Fuel Stations
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredPumps.length}</strong> of {pumps.length} stations
          </div>
        </div>

        <div className="data-table-container">
          {filteredPumps.length === 0 ? (
            <div className="empty-state">
              <Building2 className="empty-icon" />
              <h4 className="empty-title">No fuel pumps found</h4>
              <p className="empty-description">
                {searchQuery
                  ? 'No pump stations matched your search query.'
                  : 'Register fuel pump stations to track where fleet vehicles refuel.'}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pump / Station Name</th>
                  <th>Location / City</th>
                  <th>Contact Person</th>
                  <th>Status</th>
                  <th>Contracted Date</th>
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
                            backgroundColor: '#F5F3FF',
                            color: '#6D28D9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Fuel size={17} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {pump.pumpName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Station ID: {pump.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <MapPin size={15} style={{ color: '#EF4444', flexShrink: 0 }} />
                        <span>{pump.location}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                          {pump.contactPerson}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="status-badge">
                        <span className="dot" />
                        {pump.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {pump.createdAt || '2026-03-01'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {canDelete ? (
                        <button 
                          className="btn-icon-delete"
                          onClick={() => setDeleteTarget(pump)}
                          title="Delete fuel pump"
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Pump Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Fuel size={20} style={{ color: '#2563EB' }} />
                Add Authorized Fuel Pump (Station)
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
                    Fuel Pump / Station Name <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., PSO Main Boulevard Station, Shell Highway Express"
                    value={formData.pumpName}
                    onChange={(e) => setFormData({ ...formData, pumpName: e.target.value })}
                    required
                    autoFocus
                  />
                  <div className="form-helper">Vendor brand and branch designation</div>
                </div>

                {/* Field 2: Location/City */}
                <div className="form-group">
                  <label className="form-label">
                    Location / City <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Gulberg III, Lahore or GT Road, Gujranwala"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <div className="form-helper">Area, road address, and city</div>
                </div>

                {/* Field 3: Contact Person */}
                <div className="form-group">
                  <label className="form-label">
                    Contact Person & Phone <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Asif Raza (0300-8889911), Station Manager"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    required
                  />
                  <div className="form-helper">Primary manager or point of contact at the station</div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Pump Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={Boolean(deleteTarget)}
        title="Delete Fuel Pump Station"
        message={`Are you sure you want to remove this fuel station from the authorized directory?`}
        itemName={deleteTarget ? `${deleteTarget.pumpName} - ${deleteTarget.location}` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
