import {
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_PUMPS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS
} from '../data/initialData.js';

const STORAGE_KEYS = {
  DRIVERS: 'fuel_mgmt_drivers_v1',
  VEHICLES: 'fuel_mgmt_vehicles_v1',
  PUMPS: 'fuel_mgmt_pumps_v1',
  TRANSACTIONS: 'fuel_mgmt_transactions_v1',
  USERS: 'fuel_mgmt_users_v1',
  CURRENT_USER: 'fuel_mgmt_current_user_v1'
};

// Safe JSON parser with fallback
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to storage:`, err);
  }
}

// Ensure initial seed data exists
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
    safeSet(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    safeSet(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PUMPS)) {
    safeSet(STORAGE_KEYS.PUMPS, INITIAL_PUMPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    safeSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
}

// Reset all data to factory sample records
export function resetToSampleData() {
  safeSet(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  safeSet(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  safeSet(STORAGE_KEYS.PUMPS, INITIAL_PUMPS);
  safeSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// DRIVERS API
export function getDrivers() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
}

export function addDriver(driverData) {
  const drivers = getDrivers();
  const newDriver = {
    id: `DRV-${Date.now().toString().slice(-4)}`,
    name: driverData.name.trim(),
    phone: driverData.phone.trim(),
    cnic: driverData.cnic.trim(),
    licenseNumber: driverData.licenseNumber.trim(),
    status: driverData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newDriver, ...drivers];
  safeSet(STORAGE_KEYS.DRIVERS, updated);
  return newDriver;
}

export function updateDriver(id, driverData) {
  const drivers = getDrivers();
  const updated = drivers.map((d) => (d.id === id ? { ...d, ...driverData } : d));
  safeSet(STORAGE_KEYS.DRIVERS, updated);
  return updated;
}

export function deleteDriver(id) {
  const drivers = getDrivers();
  const target = drivers.find(d => d.id === id);
  const updated = drivers.filter((d) => d.id !== id);
  safeSet(STORAGE_KEYS.DRIVERS, updated);

  // If this driver was assigned to any vehicle, unassign them gracefully
  if (target) {
    const vehicles = getVehicles();
    const updatedVehicles = vehicles.map(v => {
      if (v.assignedDriverName === target.name) {
        return { ...v, assignedDriverName: 'Unassigned' };
      }
      return v;
    });
    safeSet(STORAGE_KEYS.VEHICLES, updatedVehicles);
  }

  return updated;
}

// VEHICLES API
export function getVehicles() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
}

export function addVehicle(vehicleData) {
  const vehicles = getVehicles();
  const newVehicle = {
    id: `VEH-${Date.now().toString().slice(-4)}`,
    vehicleNumber: vehicleData.vehicleNumber.trim().toUpperCase(),
    vehicleType: vehicleData.vehicleType || 'Car',
    assignedDriverName: vehicleData.assignedDriverName?.trim() || 'Unassigned',
    status: vehicleData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newVehicle, ...vehicles];
  safeSet(STORAGE_KEYS.VEHICLES, updated);
  return newVehicle;
}

export function updateVehicle(id, vehicleData) {
  const vehicles = getVehicles();
  const updated = vehicles.map((v) => (v.id === id ? {
    ...v,
    ...vehicleData,
    vehicleNumber: vehicleData.vehicleNumber ? vehicleData.vehicleNumber.trim().toUpperCase() : v.vehicleNumber
  } : v));
  safeSet(STORAGE_KEYS.VEHICLES, updated);
  return updated;
}

export function deleteVehicle(id) {
  const vehicles = getVehicles();
  const updated = vehicles.filter((v) => v.id !== id);
  safeSet(STORAGE_KEYS.VEHICLES, updated);
  return updated;
}

// FUEL PUMPS API
export function getPumps() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.PUMPS, INITIAL_PUMPS);
}

export function addPump(pumpData) {
  const pumps = getPumps();
  const newPump = {
    id: `PMP-${Date.now().toString().slice(-4)}`,
    pumpName: pumpData.pumpName.trim(),
    location: pumpData.location.trim(),
    contactPerson: pumpData.contactPerson.trim(),
    status: pumpData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newPump, ...pumps];
  safeSet(STORAGE_KEYS.PUMPS, updated);
  return newPump;
}

export function updatePump(id, pumpData) {
  const pumps = getPumps();
  const updated = pumps.map((p) => (p.id === id ? { ...p, ...pumpData } : p));
  safeSet(STORAGE_KEYS.PUMPS, updated);
  return updated;
}

export function deletePump(id) {
  const pumps = getPumps();
  const updated = pumps.filter((p) => p.id !== id);
  safeSet(STORAGE_KEYS.PUMPS, updated);
  return updated;
}

export function getTransactions() {
  initializeStorage();
  const txns = safeGet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  let needsSync = false;
  const normalized = txns.map((t, idx) => {
    if (!t.slipNumber) {
      needsSync = true;
      return {
        ...t,
        slipNumber: `FL-${1001 + idx}`,
        dateTime: t.dateTime || (t.date ? `${t.date}T10:00` : new Date().toISOString().slice(0, 16)),
        fuelType: t.fuelType?.includes('Diesel') ? 'Diesel' : (t.fuelType || 'Petrol'),
        odometerReading: t.odometerReading || (45000 + idx * 4500),
        remarks: t.remarks || 'Official fleet operation travel'
      };
    }
    return t;
  });
  if (needsSync) {
    safeSet(STORAGE_KEYS.TRANSACTIONS, normalized);
  }
  return normalized;
}

// Generate sequential slip/voucher number (e.g., FL-1001, FL-1002...)
export function getNextSlipNumber() {
  const txns = getTransactions();
  if (!txns || txns.length === 0) return 'FL-1001';

  let highestNum = 1000;
  txns.forEach((t) => {
    const slip = t.slipNumber || t.id || '';
    const match = slip.match(/FL-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > highestNum) highestNum = num;
    }
  });

  return `FL-${highestNum + 1}`;
}

export function addFuelIssue(issueData) {
  const txns = getTransactions();
  const liters = parseFloat(issueData.liters) || 0;
  const ratePerLiter = parseFloat(issueData.ratePerLiter) || 0;
  const totalCost = Math.round((liters * ratePerLiter) * 100) / 100;

  const newSlip = {
    id: `TXN-${Date.now()}`,
    slipNumber: issueData.slipNumber?.trim() || getNextSlipNumber(),
    dateTime: issueData.dateTime || new Date().toISOString().slice(0, 16),
    vehicleNumber: issueData.vehicleNumber?.trim(),
    driverName: issueData.driverName?.trim(),
    pumpName: issueData.pumpName?.trim(),
    fuelType: issueData.fuelType || 'Petrol',
    odometerReading: parseFloat(issueData.odometerReading) || 0,
    liters: liters,
    ratePerLiter: ratePerLiter,
    totalCost: totalCost,
    remarks: issueData.remarks?.trim() || '',
    createdAt: new Date().toISOString()
  };

  const updated = [newSlip, ...txns];
  safeSet(STORAGE_KEYS.TRANSACTIONS, updated);
  return newSlip;
}

export function deleteFuelIssue(id) {
  const txns = getTransactions();
  const updated = txns.filter((t) => t.id !== id);
  safeSet(STORAGE_KEYS.TRANSACTIONS, updated);
  return updated;
}

// DASHBOARD SUMMARY METRICS
export function getDashboardMetrics() {
  const vehicles = getVehicles();
  const pumps = getPumps();
  const drivers = getDrivers();
  const transactions = getTransactions();

  const totalFuelIssued = transactions.reduce((sum, item) => sum + (Number(item.liters) || 0), 0);
  const totalFuelCost = transactions.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0);
  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
  const totalPumps = pumps.length;
  const totalDrivers = drivers.length;

  return {
    totalFuelIssued: Math.round(totalFuelIssued * 100) / 100,
    totalFuelCost: Math.round(totalFuelCost * 100) / 100,
    activeVehicles,
    totalVehicles: vehicles.length,
    totalPumps,
    totalDrivers,
    recentTransactions: transactions.slice(0, 6),
    vehiclesList: vehicles,
    driversList: drivers,
    pumpsList: pumps
  };
}

// ==========================================
// PHASE 5: USERS & AUTHENTICATION API
// ==========================================

export function getUsers() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function addUser(userData) {
  const users = getUsers();
  const cleanUsername = userData.username.trim().toLowerCase();

  // Validate duplicate
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    throw new Error(`Username "${cleanUsername}" already exists.`);
  }

  const newUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    username: cleanUsername,
    email: userData.email?.trim() || `${cleanUsername}@fuelflow.com`,
    password: userData.password || 'password123',
    fullName: userData.fullName?.trim() || cleanUsername,
    role: userData.role || 'Manager',
    status: userData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [...users, newUser];
  safeSet(STORAGE_KEYS.USERS, updated);
  return newUser;
}

export function deleteUser(id) {
  const users = getUsers();
  // Prevent deleting primary admin
  const target = users.find(u => u.id === id);
  if (target?.username === 'admin') {
    throw new Error('Default Administrator account cannot be deleted.');
  }
  const updated = users.filter((u) => u.id !== id);
  safeSet(STORAGE_KEYS.USERS, updated);
  return updated;
}

// Session Management
export function getCurrentUser() {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function authenticate(identifier, password, selectedRole) {
  const users = getUsers();
  const cleanId = (identifier || '').trim().toLowerCase();

  const found = users.find((u) => {
    const matchesId = u.username.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId;
    const matchesRole = !selectedRole || u.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesId && matchesRole;
  });

  if (!found) {
    return { 
      success: false, 
      error: `No ${selectedRole || 'user'} account found matching "${identifier}". Try Quick Demo Login below.` 
    };
  }

  if (found.password !== password) {
    return { 
      success: false, 
      error: 'Invalid password. Please check your credentials or use Quick Demo Login.' 
    };
  }

  setCurrentUser(found);
  return { success: true, user: found };
}

export function quickLoginAsRole(role) {
  const users = getUsers();
  const match = users.find((u) => u.role.toLowerCase() === role.toLowerCase());
  if (match) {
    setCurrentUser(match);
    return match;
  }

  // Fallback create on the fly if somehow missing
  const fallback = {
    id: `USR-${Date.now()}`,
    username: role.toLowerCase().replace(/\s+/g, ''),
    fullName: `${role} User`,
    role: role,
    status: 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  setCurrentUser(fallback);
  return fallback;
}
