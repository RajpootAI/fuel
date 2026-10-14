import React from 'react';
import { 
  Menu, 
  RotateCcw, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Briefcase, 
  Car, 
  Fuel,
  Users
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  currentUser,
  onLogout,
  onResetData, 
  onToggleSidebar 
}) {
  const titles = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time fleet fuel summary, statistics, and master registry status'
    },
    'issue-fuel': {
      title: 'Issue Fuel (Add Fuel Voucher)',
      subtitle: 'Generate official fuel slips with automated costing, linked registries, and dual printable vouchers'
    },
    reports: {
      title: 'Fuel Reports & History',
      subtitle: 'Audit fleet fuel consumption, filter by vehicle, driver, or station, and export to CSV/Excel'
    },
    vehicles: {
      title: 'Manage Vehicles',
      subtitle: 'Register, assign drivers, and monitor company fleet vehicles'
    },
    drivers: {
      title: 'Manage Drivers',
      subtitle: 'Maintain company driver records, contact details, and CNIC/license info'
    },
    pumps: {
      title: 'Manage Fuel Pumps (Stations)',
      subtitle: 'Authorized fuel stations, vendor locations, and pump contact personnel'
    },
    users: {
      title: 'User Accounts & Access Control',
      subtitle: 'Create and manage login usernames and passwords for Managers, Drivers, and Fuel Pumps (Admin Only)'
    }
  };

  const current = titles[activeTab] || titles.dashboard;
  const role = currentUser?.role || 'Admin';

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case 'Admin':
        return {
          bg: '#1E3A8A',
          color: '#FFFFFF',
          border: '#172554',
          icon: ShieldCheck,
          label: 'Admin (Full Access)'
        };
      case 'Manager':
        return {
          bg: '#0284C7',
          color: '#FFFFFF',
          border: '#0369A1',
          icon: Briefcase,
          label: 'Manager (Restricted Delete)'
        };
      case 'Driver':
        return {
          bg: '#059669',
          color: '#FFFFFF',
          border: '#047857',
          icon: Car,
          label: 'Driver Account'
        };
      case 'Fuel Pump':
        return {
          bg: '#D97706',
          color: '#FFFFFF',
          border: '#B45309',
          icon: Fuel,
          label: 'Fuel Pump Operator'
        };
      default:
        return {
          bg: '#475569',
          color: '#FFFFFF',
          border: '#334155',
          icon: UserCheck,
          label: r
        };
    }
  };

  const roleInfo = getRoleBadgeStyle(role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="page-title">{current.title}</h2>
          <p className="page-subtitle">{current.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Reset button only for admin or when needed */}
        {role === 'Admin' && (
          <button 
            className="btn-secondary header-reset-btn"
            onClick={onResetData}
            title="Restore original sample records for Vehicles, Drivers, Pumps, and Users"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        )}

        {/* Current Role Badge */}
        <div 
          className="header-role-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: roleInfo.bg,
            color: roleInfo.color,
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}
          title={`Currently logged in with role: ${role}`}
        >
          <RoleIcon size={14} />
          <span>Role: {role}</span>
        </div>

        {/* User Profile Info */}
        <div className="user-profile-badge">
          <div className="avatar-circle" style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>
              {(currentUser?.fullName || currentUser?.username || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="user-profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currentUser?.fullName || currentUser?.username || 'Fleet Admin'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              @{currentUser?.username || 'admin'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          className="btn-logout"
          onClick={onLogout}
          title="Sign out of system"
        >
          <LogOut size={16} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
}
