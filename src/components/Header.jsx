import React from 'react';
import { Menu, RotateCcw, UserCheck } from 'lucide-react';

export default function Header({ 
  activeTab, 
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
    }
  };

  const current = titles[activeTab] || titles.dashboard;

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
        <button 
          className="btn-secondary"
          onClick={onResetData}
          title="Restore original 3 sample records for Vehicles, Drivers, and Pumps"
        >
          <RotateCcw size={15} />
          <span>Reload Sample Data</span>
        </button>

        <div className="user-profile-badge">
          <div className="avatar-circle">
            <UserCheck size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Fleet Admin
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              HQ Logistics
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
