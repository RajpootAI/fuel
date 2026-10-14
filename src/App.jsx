import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IssueFuel from './components/IssueFuel';
import FuelReports from './components/FuelReports';
import ManageVehicles from './components/ManageVehicles';
import ManageDrivers from './components/ManageDrivers';
import ManagePumps from './components/ManagePumps';
import ManageUsers from './components/ManageUsers';
import Login from './components/Login';
import DriverPortal from './components/DriverPortal';
import PumpPortal from './components/PumpPortal';
import DualSlipPreview from './components/DualSlipPreview';
import TestDropdownModal from './components/TestDropdownModal';
import { 
  getVehicles, 
  addVehicle, 
  deleteVehicle,
  getDrivers, 
  addDriver, 
  deleteDriver,
  getPumps, 
  addPump, 
  deletePump,
  getTransactions,
  addFuelIssue,
  deleteFuelIssue,
  updateTransactionStatus,
  getDashboardMetrics,
  resetToSampleData,
  getCurrentUser,
  setCurrentUser,
  logout,
  getUsers
} from './services/storage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);

  // Master records & transactions state
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({});

  // Dual Printable Slip Preview state
  const [selectedSlipForPreview, setSelectedSlipForPreview] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load records from storage
  const reloadAllData = () => {
    const v = getVehicles();
    const d = getDrivers();
    const p = getPumps();
    const tx = getTransactions();
    const u = getUsers();
    const m = getDashboardMetrics();

    setVehicles(v);
    setDrivers(d);
    setPumps(p);
    setTransactions(tx);
    setUsers(u);
    setMetrics(m);
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  // Ensure non-admin users cannot access the users tab
  useEffect(() => {
    if (activeTab === 'users' && currentUser?.role !== 'Admin') {
      setActiveTab('dashboard');
    }
  }, [activeTab, currentUser]);

  // Handle Authentication
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setActiveTab('dashboard');
    showToast(`Welcome ${user.fullName || user.username}! Logged in as ${user.role}.`, 'success');
  };

  const handleLogout = () => {
    logout();
    setCurrentUserState(null);
    setActiveTab('dashboard');
    showToast('Signed out of system successfully.', 'info');
  };

  // Status updates from Fuel Pump station or admin
  const handleUpdateSlipStatus = (slipId, newStatus) => {
    updateTransactionStatus(slipId, newStatus);
    reloadAllData();
  };

  // Role permissions
  const isAdmin = currentUser?.role === 'Admin';
  // Manager and others cannot delete vehicles, drivers, pumps, or fuel records
  const canDelete = isAdmin;

  // CRUD for Vehicles
  const handleAddVehicle = (newVehicleData) => {
    addVehicle(newVehicleData);
    reloadAllData();
  };

  const handleDeleteVehicle = (id) => {
    if (!canDelete) {
      showToast('Action not permitted: Managers cannot delete vehicle records.', 'danger');
      return;
    }
    deleteVehicle(id);
    reloadAllData();
  };

  // CRUD for Drivers
  const handleAddDriver = (newDriverData) => {
    addDriver(newDriverData);
    reloadAllData();
  };

  const handleDeleteDriver = (id) => {
    if (!canDelete) {
      showToast('Action not permitted: Managers cannot delete driver records.', 'danger');
      return;
    }
    deleteDriver(id);
    reloadAllData();
  };

  // CRUD for Pumps
  const handleAddPump = (newPumpData) => {
    addPump(newPumpData);
    reloadAllData();
  };

  const handleDeletePump = (id) => {
    if (!canDelete) {
      showToast('Action not permitted: Managers cannot delete fuel stations.', 'danger');
      return;
    }
    deletePump(id);
    reloadAllData();
  };

  // CRUD for Fuel Issues (Phase 2)
  const handleSaveFuelSlip = (newSlipData) => {
    const saved = addFuelIssue(newSlipData);
    reloadAllData();
    return saved;
  };

  const handleDeleteFuelSlip = (id) => {
    if (!canDelete) {
      showToast('Action not permitted: Managers cannot delete fuel records.', 'danger');
      return;
    }
    deleteFuelIssue(id);
    reloadAllData();
  };

  // Reset to default sample records
  const handleResetData = () => {
    if (window.confirm('Reset all records, users, and slips back to the original sample dataset?')) {
      resetToSampleData();
      reloadAllData();
      showToast('Sample dataset and user accounts restored successfully!', 'success');
    }
  };

  // 1. If no user is logged in, show the Login Screen
  if (!currentUser) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type === 'danger' ? 'toast-danger' : toast.type === 'info' ? 'toast-info' : 'toast-success'}`}>
              {toast.type === 'danger' ? (
                <AlertCircle size={18} style={{ color: '#EF4444' }} />
              ) : toast.type === 'info' ? (
                <Info size={18} style={{ color: '#0284C7' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. PHASE 6: DEDICATED DRIVER PORTAL VIEW (Main Admin Sidebar Hidden)
  if (currentUser.role === 'Driver') {
    return (
      <div className="portal-app-shell">
        <DriverPortal 
          currentUser={currentUser}
          vehicles={vehicles}
          transactions={transactions}
          onLogout={handleLogout}
          onOpenSlipPreview={(slip) => setSelectedSlipForPreview(slip)}
        />

        {/* Dual Printable Slip Preview */}
        {selectedSlipForPreview && (
          <DualSlipPreview 
            slip={selectedSlipForPreview}
            vehicles={vehicles}
            drivers={drivers}
            pumps={pumps}
            onClose={() => setSelectedSlipForPreview(null)}
          />
        )}

        {/* Toast Notification Container */}
        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type === 'danger' ? 'toast-danger' : toast.type === 'info' ? 'toast-info' : 'toast-success'}`}>
              {toast.type === 'danger' ? (
                <AlertCircle size={18} style={{ color: '#EF4444' }} />
              ) : toast.type === 'info' ? (
                <Info size={18} style={{ color: '#0284C7' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. PHASE 6: DEDICATED FUEL PUMP STATION PORTAL VIEW (Main Admin Sidebar Hidden)
  if (currentUser.role === 'Fuel Pump') {
    return (
      <div className="portal-app-shell">
        <PumpPortal 
          currentUser={currentUser}
          transactions={transactions}
          onUpdateStatus={handleUpdateSlipStatus}
          onLogout={handleLogout}
          onOpenSlipPreview={(slip) => setSelectedSlipForPreview(slip)}
          onShowToast={showToast}
        />

        {/* Dual Printable Slip Preview */}
        {selectedSlipForPreview && (
          <DualSlipPreview 
            slip={selectedSlipForPreview}
            vehicles={vehicles}
            drivers={drivers}
            pumps={pumps}
            onClose={() => setSelectedSlipForPreview(null)}
          />
        )}

        {/* Toast Notification Container */}
        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type === 'danger' ? 'toast-danger' : toast.type === 'info' ? 'toast-info' : 'toast-success'}`}>
              {toast.type === 'danger' ? (
                <AlertCircle size={18} style={{ color: '#EF4444' }} />
              ) : toast.type === 'info' ? (
                <Info size={18} style={{ color: '#0284C7' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. ADMIN & MANAGER ROLE VIEW (With Sidebar Navigation)
  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={{
          slips: transactions.length,
          vehicles: vehicles.length,
          drivers: drivers.length,
          pumps: pumps.length,
          users: users.length
        }}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main App Content */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab}
          currentUser={currentUser}
          onLogout={handleLogout}
          onResetData={handleResetData}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* View Switcher */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            metrics={metrics} 
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSlipPreview={(slip) => setSelectedSlipForPreview(slip)}
          />
        )}

        {activeTab === 'issue-fuel' && (
          <IssueFuel 
            vehicles={vehicles}
            drivers={drivers}
            pumps={pumps}
            transactions={transactions}
            onSaveSlip={handleSaveFuelSlip}
            onDeleteSlip={handleDeleteFuelSlip}
            onOpenSlipPreview={(slip) => setSelectedSlipForPreview(slip)}
            onShowToast={showToast}
            canDelete={canDelete}
          />
        )}

        {activeTab === 'reports' && (
          <FuelReports 
            transactions={transactions}
            vehicles={vehicles}
            drivers={drivers}
            pumps={pumps}
            onDeleteSlip={handleDeleteFuelSlip}
            onOpenSlipPreview={(slip) => setSelectedSlipForPreview(slip)}
            onShowToast={showToast}
            canDelete={canDelete}
          />
        )}

        {activeTab === 'vehicles' && (
          <ManageVehicles 
            vehicles={vehicles}
            drivers={drivers}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onShowToast={showToast}
            canDelete={canDelete}
          />
        )}

        {activeTab === 'drivers' && (
          <ManageDrivers 
            drivers={drivers}
            vehicles={vehicles}
            onAddDriver={handleAddDriver}
            onDeleteDriver={handleDeleteDriver}
            onShowToast={showToast}
            canDelete={canDelete}
          />
        )}

        {activeTab === 'pumps' && (
          <ManagePumps 
            pumps={pumps}
            onAddPump={handleAddPump}
            onDeletePump={handleDeletePump}
            onShowToast={showToast}
            canDelete={canDelete}
          />
        )}

        {/* Phase 5: Admin User Accounts Management */}
        {activeTab === 'users' && isAdmin && (
          <ManageUsers 
            onShowToast={showToast}
            drivers={drivers}
            pumps={pumps}
          />
        )}
      </div>

      {/* Dual Printable Slip Preview Screen */}
      {selectedSlipForPreview && (
        <DualSlipPreview 
          slip={selectedSlipForPreview}
          vehicles={vehicles}
          drivers={drivers}
          pumps={pumps}
          onClose={() => setSelectedSlipForPreview(null)}
          onIssueAnother={() => {
            setSelectedSlipForPreview(null);
            setActiveTab('issue-fuel');
          }}
        />
      )}

      {/* Interactive Dropdown Test Modal */}
      <TestDropdownModal 
        isOpen={isTestDropdownOpen}
        onClose={() => setIsTestDropdownOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        pumps={pumps}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'danger' ? 'toast-danger' : toast.type === 'info' ? 'toast-info' : 'toast-success'}`}>
            {toast.type === 'danger' ? (
              <AlertCircle size={18} style={{ color: '#EF4444' }} />
            ) : toast.type === 'info' ? (
              <Info size={18} style={{ color: '#0284C7' }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: '#10B981' }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
