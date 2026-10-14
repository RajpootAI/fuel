import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Briefcase, 
  Car, 
  Fuel, 
  Trash2, 
  Search, 
  X, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getUsers, addUser, deleteUser } from '../services/storage';

export default function ManageUsers({ onShowToast }) {
  const [users, setUsers] = useState(() => getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'Manager',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleOpenAddModal = () => {
    setFormData({
      username: '',
      fullName: '',
      email: '',
      password: 'password123',
      role: 'Manager',
      status: 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username.trim()) {
      setFormError('Username is required.');
      return;
    }
    if (!formData.fullName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!formData.password) {
      setFormError('Password is required.');
      return;
    }

    try {
      const created = addUser(formData);
      refreshUsers();
      setIsModalOpen(false);
      onShowToast(`User account "${created.username}" (${created.role}) created successfully!`, 'success');
    } catch (err) {
      setFormError(err.message || 'Failed to create user account.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    try {
      deleteUser(deleteTarget.id);
      refreshUsers();
      onShowToast(`User account "${deleteTarget.username}" deleted`, 'danger');
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
      setDeleteTarget(null);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      u.username.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'ALL' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin':
        return { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE', icon: ShieldCheck };
      case 'Manager':
        return { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD', icon: Briefcase };
      case 'Driver':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: Car };
      case 'Fuel Pump':
        return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', icon: Fuel };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', icon: User };
    }
  };

  const roleCounts = {
    total: users.length,
    admin: users.filter(u => u.role === 'Admin').length,
    manager: users.filter(u => u.role === 'Manager').length,
    driver: users.filter(u => u.role === 'Driver').length,
    pump: users.filter(u => u.role === 'Fuel Pump').length
  };

  return (
    <div className="view-container">
      {/* Top Header & Action */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              User Accounts & Credentials
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
              Admin Only
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Create and manage login usernames and passwords for Managers, Drivers, and Fuel Pumps
          </p>
        </div>

        <div className="view-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search by username, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={17} />
            <span>Add User Account</span>
          </button>
        </div>
      </div>

      {/* Role Counts Summary Strip */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '12px', 
          marginBottom: '20px' 
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Accounts</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{roleCounts.total}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#F0F9FF', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Managers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369A1' }}>{roleCounts.manager}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Drivers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{roleCounts.driver}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FFFBEB', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fuel size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Fuel Stations</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309' }}>{roleCounts.pump}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="table-card">
        <div className="table-toolbar">
          <div className="filter-pills">
            {['ALL', 'Admin', 'Manager', 'Driver', 'Fuel Pump'].map((role) => (
              <button
                key={role}
                className={`filter-pill ${roleFilter === role ? 'active' : ''}`}
                onClick={() => setRoleFilter(role)}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts
          </div>
        </div>

        {/* Users Table */}
        <div className="data-table-container">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <h4 className="empty-title">No user accounts found</h4>
              <p className="empty-description">Try adjusting your search query or role filter.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const badge = getRoleBadgeStyle(u.role);
                  const Icon = badge.icon;
                  const isPassRevealed = revealedPasswords[u.id];
                  const isPrimaryAdmin = u.username === 'admin';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div 
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '50%', 
                              backgroundColor: badge.bg, 
                              color: badge.text,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              border: `1px solid ${badge.border}`
                            }}
                          >
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {u.fullName || u.username}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              ID: {u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span 
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`
                          }}
                        >
                          <Icon size={13} />
                          {u.role}
                        </span>
                      </td>

                      <td>
                        <span 
                          style={{ 
                            fontFamily: 'JetBrains Mono, monospace', 
                            fontWeight: 600, 
                            fontSize: '0.82rem',
                            color: '#1E293B',
                            backgroundColor: '#F8FAFC',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          {u.username}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span 
                            style={{ 
                              fontFamily: 'JetBrains Mono, monospace', 
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: isPassRevealed ? '#1E293B' : '#94A3B8',
                              letterSpacing: isPassRevealed ? 'normal' : '2px'
                            }}
                          >
                            {isPassRevealed ? u.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title={isPassRevealed ? 'Hide password' : 'View password'}
                          >
                            {isPassRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {u.email || '-'}
                      </td>

                      <td>
                        <span className="status-badge">
                          <span className="dot" />
                          {u.status || 'Active'}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {u.createdAt || '2026-03-01'}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {isPrimaryAdmin ? (
                          <span 
                            style={{ 
                              fontSize: '0.72rem', 
                              color: 'var(--text-muted)', 
                              fontStyle: 'italic',
                              padding: '4px 8px'
                            }}
                            title="Primary system admin cannot be deleted"
                          >
                            Protected
                          </span>
                        ) : (
                          <button 
                            className="btn-icon-delete"
                            onClick={() => setDeleteTarget(u)}
                            title="Delete user account"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
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

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <UserPlus size={20} style={{ color: '#2563EB' }} />
                Create New User Account
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

                {/* Role Selection First */}
                <div className="form-group">
                  <label className="form-label">
                    Account Role <span className="req">*</span>
                  </label>
                  <select 
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Manager">Manager (Issue Fuel & Reports, No Delete)</option>
                    <option value="Driver">Driver (Fleet Vehicle Driver)</option>
                    <option value="Fuel Pump">Fuel Pump (Station Operator)</option>
                    <option value="Admin">Admin (Full System Access)</option>
                  </select>
                  <div className="form-helper">
                    Managers cannot delete records; Admins have 100% control.
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name / Designation <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., Tariq Mehmood or City Station Attendant"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label">
                    Login Username <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="e.g., manager_lahore or driver_tariq"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    required
                  />
                  <div className="form-helper">
                    Lowercase username for login (auto-formatted with underscores)
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">
                    Password <span className="req">*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Enter login password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <div className="form-helper">
                    Share this password with the user so they can log in.
                  </div>
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email"
                    className="form-input"
                    placeholder="e.g., user@fuelflow.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active (Permitted to log in)</option>
                    <option value="Inactive">Inactive (Access suspended)</option>
                  </select>
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
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottomColor: '#FEE2E2' }}>
              <div className="modal-title" style={{ color: '#DC2626' }}>
                <AlertTriangle size={20} />
                Delete User Account
              </div>
              <button className="modal-close-btn" onClick={() => setDeleteTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Are you sure you want to permanently delete account <strong>"{deleteTarget.username}"</strong> ({deleteTarget.role})?
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                This user will no longer be able to log in to the Fuel Management portal.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-danger" 
                onClick={handleDeleteConfirm}
              >
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
