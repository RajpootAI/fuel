import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  FileSpreadsheet, 
  Car, 
  Users, 
  Fuel, 
  ShieldCheck, 
  ChevronRight, 
  X, 
  UserCog,
  KeyRound
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts, 
  currentUser,
  isOpen, 
  setIsOpen 
}) {
  const isAdmin = currentUser?.role === 'Admin';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'issue-fuel',
      label: 'Issue Fuel',
      icon: Receipt,
      badge: counts.slips ? `${counts.slips}` : 'New',
      isPrimaryAction: true
    },
    {
      id: 'reports',
      label: 'Fuel Reports & History',
      icon: FileSpreadsheet,
      badge: counts.slips || null
    },
    {
      id: 'vehicles',
      label: 'Manage Vehicles',
      icon: Car,
      badge: counts.vehicles
    },
    {
      id: 'drivers',
      label: 'Manage Drivers',
      icon: Users,
      badge: counts.drivers
    },
    {
      id: 'pumps',
      label: 'Fuel Pumps (Stations)',
      icon: Fuel,
      badge: counts.pumps
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: ShieldCheck,
      badge: counts.users ? `${counts.users}` : null,
      adminOnly: true
    }
  ];

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge">
            <Fuel size={24} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="brand-title">FuelFlow</h1>
            <p className="brand-subtitle">Company Fleet Ops</p>
          </div>
          <button 
            className="modal-close-btn" 
            style={{ marginLeft: 'auto', display: isOpen ? 'block' : 'none', color: '#94A3B8' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {isAdmin ? 'Full Fleet Admin' : 'Manager Operations'}
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span 
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#2563EB' : 'rgba(255,255,255,0.1)',
                      color: '#FFFFFF'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && item.badge === null && (
                  <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-pill">
            <div className="status-dot-active" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F8FAFC' }}>
                Role: {currentUser?.role || 'Guest'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                {isAdmin ? 'All Permissions Active' : 'Restricted (Read & Issue)'}
              </div>
            </div>
            <ShieldCheck size={16} style={{ color: isAdmin ? '#10B981' : '#38BDF8' }} />
          </div>
        </div>
      </aside>
    </>
  );
}
