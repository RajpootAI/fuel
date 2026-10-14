import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IssueFuel from './components/IssueFuel';
import FuelReports from './components/FuelReports';
import ManageVehicles from './components/ManageVehicles';
import ManageDrivers from './components/ManageDrivers';
import ManagePumps from './components/ManagePumps';
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
  getDashboardMetrics,
  resetToSampleData 
} from './services/storage';
import { CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);

  // Master records & transactions state
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
    const m = getDashboardMetrics();

    setVehicles(v);
    setDrivers(d);
    setPumps(p);
    setTransactions(tx);
    setMetrics(m);
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  // CRUD for Vehicles
  const handleAddVehicle = (newVehicleData) => {
    addVehicle(newVehicleData);
    reloadAllData();
  };

  const handleDeleteVehicle = (id) => {
    deleteVehicle(id);
    reloadAllData();
  };

  // CRUD for Drivers
  const handleAddDriver = (newDriverData) => {
    addDriver(newDriverData);
    reloadAllData();
  };

  const handleDeleteDriver = (id) => {
    deleteDriver(id);
    reloadAllData();
  };

  // CRUD for Pumps
  const handleAddPump = (newPumpData) => {
    addPump(newPumpData);
    reloadAllData();
  };

  const handleDeletePump = (id) => {
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
    deleteFuelIssue(id);
    reloadAllData();
  };

  // Reset to default sample records
  const handleResetData = () => {
    if (window.confirm('Reset all records and slips back to the original sample dataset?')) {
      resetToSampleData();
      reloadAllData();
      showToast('Sample dataset restored successfully!', 'success');
    }
  };

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
          pumps: pumps.length
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main App Content */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab}
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
          />
        )}

        {activeTab === 'vehicles' && (
          <ManageVehicles 
            vehicles={vehicles}
            drivers={drivers}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'drivers' && (
          <ManageDrivers 
            drivers={drivers}
            vehicles={vehicles}
            onAddDriver={handleAddDriver}
            onDeleteDriver={handleDeleteDriver}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'pumps' && (
          <ManagePumps 
            pumps={pumps}
            onAddPump={handleAddPump}
            onDeletePump={handleDeletePump}
            onShowToast={showToast}
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
          <div className={`toast ${toast.type === 'danger' ? 'toast-danger' : 'toast-success'}`}>
            {toast.type === 'danger' ? (
              <AlertCircle size={18} style={{ color: '#EF4444' }} />
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
