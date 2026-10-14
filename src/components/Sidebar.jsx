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
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts, 
  isOpen, 
  setIsOpen 
}) {
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
    }
  ];

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
          <div className="nav-section-title">Master Records & Ops</div>
          {navItems.map((item) => {
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
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#F8FAFC' }}>
                Phase 1 & 2 Active
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                Slips & Records Synced
              </div>
            </div>
            <ShieldCheck size={16} style={{ color: '#10B981' }} />
          </div>
        </div>
      </aside>
    </>
  );
}
