import {
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_PUMPS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS
} from '../data/initialData.js';

// Production Storage Keys (Clean database without demo data)
const STORAGE_KEYS = {
  DRIVERS: 'fuel_mgmt_prod_drivers',
  VEHICLES: 'fuel_mgmt_prod_vehicles',
  PUMPS: 'fuel_mgmt_prod_pumps',
  TRANSACTIONS: 'fuel_mgmt_prod_transactions',
  USERS: 'fuel_mgmt_prod_users',
  CURRENT_USER: 'fuel_mgmt_prod_current_user'
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

// Reset all data to clean empty state (keeping Master Admin only)
export function resetToSampleData() {
  safeSet(STORAGE_KEYS.DRIVERS, []);
  safeSet(STORAGE_KEYS.VEHICLES, []);
  safeSet(STORAGE_KEYS.PUMPS, []);
  safeSet(STORAGE_KEYS.TRANSACTIONS, []);
  safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// ==========================================
// DRIVERS API
// ==========================================
export function getDrivers() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
}

export function addDriver(driverData) {
  const drivers = getDrivers();
  const driverId = `DRV-${Date.now().toString().slice(-4)}`;
  const cleanName = driverData.name.trim();

  const newDriver = {
    id: driverId,
    name: cleanName,
    phone: driverData.phone?.trim() || '',
    cnic: driverData.cnic?.trim() || '',
    licenseNumber: driverData.licenseNumber?.trim() || '',
    username: driverData.username?.trim().toLowerCase() || '',
    password: driverData.password || '',
    status: driverData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newDriver, ...drivers];
  safeSet(STORAGE_KEYS.DRIVERS, updated);

  // If login credentials provided, auto-create Driver User Account
  if (newDriver.username && newDriver.password) {
    syncUserAccountForEntity({
      entityId: driverId,
      username: newDriver.username,
      password: newDriver.password,
      fullName: cleanName,
      driverName: cleanName,
      role: 'Driver'
    });
  }

  return newDriver;
}

export function updateDriver(id, driverData) {
  const drivers = getDrivers();
  const cleanName = driverData.name ? driverData.name.trim() : '';

  const updated = drivers.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        ...driverData,
        name: cleanName || d.name,
        phone: driverData.phone !== undefined ? driverData.phone.trim() : d.phone,
        cnic: driverData.cnic !== undefined ? driverData.cnic.trim() : d.cnic,
        licenseNumber: driverData.licenseNumber !== undefined ? driverData.licenseNumber.trim() : d.licenseNumber,
        username: driverData.username !== undefined ? driverData.username.trim().toLowerCase() : d.username,
        password: driverData.password !== undefined ? driverData.password : d.password
      };
    }
    return d;
  });

  safeSet(STORAGE_KEYS.DRIVERS, updated);

  // Update linked user account if credentials exist
  if (driverData.username || driverData.password) {
    const updatedTarget = updated.find(d => d.id === id);
    if (updatedTarget?.username && updatedTarget?.password) {
      syncUserAccountForEntity({
        entityId: id,
        username: updatedTarget.username,
        password: updatedTarget.password,
        fullName: updatedTarget.name,
        driverName: updatedTarget.name,
        role: 'Driver'
      });
    }
  }

  return updated;
}

export function deleteDriver(id) {
  const drivers = getDrivers();
  const target = drivers.find(d => d.id === id);
  const updated = drivers.filter((d) => d.id !== id);
  safeSet(STORAGE_KEYS.DRIVERS, updated);

  // If this driver was assigned to any vehicle, unassign gracefully
  if (target) {
    const vehicles = getVehicles();
    const updatedVehicles = vehicles.map(v => {
      if (v.assignedDriverName === target.name) {
        return { ...v, assignedDriverName: 'Unassigned' };
      }
      return v;
    });
    safeSet(STORAGE_KEYS.VEHICLES, updatedVehicles);

    // Also remove linked user account if exists
    removeUserAccountForEntity(id, target.username);
  }

  return updated;
}

// ==========================================
// VEHICLES API
// ==========================================
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
    vehicleNumber: vehicleData.vehicleNumber ? vehicleData.vehicleNumber.trim().toUpperCase() : v.vehicleNumber,
    vehicleType: vehicleData.vehicleType || v.vehicleType,
    assignedDriverName: vehicleData.assignedDriverName !== undefined ? vehicleData.assignedDriverName.trim() : v.assignedDriverName,
    status: vehicleData.status || v.status
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

// ==========================================
// FUEL PUMPS API
// ==========================================
export function getPumps() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.PUMPS, INITIAL_PUMPS);
}

export function addPump(pumpData) {
  const pumps = getPumps();
  const pumpId = `PMP-${Date.now().toString().slice(-4)}`;
  const cleanName = pumpData.pumpName.trim();

  const newPump = {
    id: pumpId,
    pumpName: cleanName,
    location: pumpData.location?.trim() || '',
    contactPerson: pumpData.contactPerson?.trim() || '',
    username: pumpData.username?.trim().toLowerCase() || '',
    password: pumpData.password || '',
    status: pumpData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newPump, ...pumps];
  safeSet(STORAGE_KEYS.PUMPS, updated);

  // If login credentials provided, auto-create Fuel Pump User Account
  if (newPump.username && newPump.password) {
    syncUserAccountForEntity({
      entityId: pumpId,
      username: newPump.username,
      password: newPump.password,
      fullName: cleanName,
      pumpName: cleanName,
      role: 'Fuel Pump'
    });
  }

  return newPump;
}

export function updatePump(id, pumpData) {
  const pumps = getPumps();
  const cleanName = pumpData.pumpName ? pumpData.pumpName.trim() : '';

  const updated = pumps.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        ...pumpData,
        pumpName: cleanName || p.pumpName,
        location: pumpData.location !== undefined ? pumpData.location.trim() : p.location,
        contactPerson: pumpData.contactPerson !== undefined ? pumpData.contactPerson.trim() : p.contactPerson,
        username: pumpData.username !== undefined ? pumpData.username.trim().toLowerCase() : p.username,
        password: pumpData.password !== undefined ? pumpData.password : p.password
      };
    }
    return p;
  });

  safeSet(STORAGE_KEYS.PUMPS, updated);

  // Update linked user account if credentials exist
  if (pumpData.username || pumpData.password) {
    const updatedTarget = updated.find(p => p.id === id);
    if (updatedTarget?.username && updatedTarget?.password) {
      syncUserAccountForEntity({
        entityId: id,
        username: updatedTarget.username,
        password: updatedTarget.password,
        fullName: updatedTarget.pumpName,
        pumpName: updatedTarget.pumpName,
        role: 'Fuel Pump'
      });
    }
  }

  return updated;
}

export function deletePump(id) {
  const pumps = getPumps();
  const target = pumps.find(p => p.id === id);
  const updated = pumps.filter((p) => p.id !== id);
  safeSet(STORAGE_KEYS.PUMPS, updated);

  if (target) {
    removeUserAccountForEntity(id, target.username);
  }

  return updated;
}

// ==========================================
// TRANSACTIONS / FUEL ISSUANCE API
// ==========================================
export function getTransactions() {
  initializeStorage();
  return safeGet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
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
    status: issueData.status || 'Pending',
    filledAt: issueData.status === 'Filled' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString()
  };

  const updated = [newSlip, ...txns];
  safeSet(STORAGE_KEYS.TRANSACTIONS, updated);
  return newSlip;
}

export function updateTransactionStatus(id, newStatus) {
  const txns = getTransactions();
  const now = new Date().toISOString();
  let updatedRecord = null;

  const updated = txns.map((t) => {
    if (t.id === id || t.slipNumber === id) {
      updatedRecord = {
        ...t,
        status: newStatus,
        filledAt: newStatus === 'Filled' ? (t.filledAt || now) : null
      };
      return updatedRecord;
    }
    return t;
  });

  safeSet(STORAGE_KEYS.TRANSACTIONS, updated);
  return updatedRecord;
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
// USER ACCOUNTS & AUTHENTICATION API
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
    throw new Error(`Username "${cleanUsername}" is already taken.`);
  }

  const newUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    username: cleanUsername,
    email: userData.email?.trim() || `${cleanUsername}@company.com`,
    password: userData.password || 'password123',
    fullName: userData.fullName?.trim() || cleanUsername,
    driverName: userData.driverName?.trim() || (userData.role === 'Driver' ? userData.fullName?.trim() : undefined),
    pumpName: userData.pumpName?.trim() || (userData.role === 'Fuel Pump' ? userData.fullName?.trim() : undefined),
    role: userData.role || 'Manager',
    status: userData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [...users, newUser];
  safeSet(STORAGE_KEYS.USERS, updated);
  return newUser;
}

export function updateUser(id, userData) {
  const users = getUsers();
  const updated = users.map((u) => {
    if (u.id === id) {
      return {
        ...u,
        ...userData,
        username: userData.username ? userData.username.trim().toLowerCase() : u.username,
        email: userData.email !== undefined ? userData.email.trim() : u.email,
        password: userData.password || u.password,
        fullName: userData.fullName !== undefined ? userData.fullName.trim() : u.fullName,
        role: userData.role || u.role,
        status: userData.status || u.status
      };
    }
    return u;
  });
  safeSet(STORAGE_KEYS.USERS, updated);
  return updated;
}

export function deleteUser(id) {
  const users = getUsers();
  // Prevent deleting primary master admin
  const target = users.find(u => u.id === id);
  if (target?.username === 'admin') {
    throw new Error('Default Master Admin account cannot be deleted.');
  }
  const updated = users.filter((u) => u.id !== id);
  safeSet(STORAGE_KEYS.USERS, updated);
  return updated;
}

// Internal helper to create or update linked user account for drivers and pumps
function syncUserAccountForEntity({ entityId, username, password, fullName, driverName, pumpName, role }) {
  const users = getUsers();
  const cleanUsername = username.trim().toLowerCase();
  const existingIdx = users.findIndex(u => u.linkedEntityId === entityId || u.username.toLowerCase() === cleanUsername);

  if (existingIdx >= 0) {
    users[existingIdx] = {
      ...users[existingIdx],
      username: cleanUsername,
      password: password,
      fullName: fullName,
      driverName: driverName,
      pumpName: pumpName,
      role: role
    };
  } else {
    users.push({
      id: `USR-${Date.now().toString().slice(-4)}`,
      linkedEntityId: entityId,
      username: cleanUsername,
      password: password,
      fullName: fullName,
      driverName: driverName,
      pumpName: pumpName,
      email: `${cleanUsername}@company.com`,
      role: role,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    });
  }

  safeSet(STORAGE_KEYS.USERS, users);
}

function removeUserAccountForEntity(entityId, username) {
  const users = getUsers();
  const updated = users.filter(u => {
    if (u.username === 'admin') return true;
    if (u.linkedEntityId === entityId) return false;
    if (username && u.username.toLowerCase() === username.toLowerCase()) return false;
    return true;
  });
  safeSet(STORAGE_KEYS.USERS, updated);
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

export function authenticate(identifier, password) {
  const users = getUsers();
  const cleanId = (identifier || '').trim().toLowerCase();

  const found = users.find((u) => {
    return u.username.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId;
  });

  if (!found) {
    return { 
      success: false, 
      error: `Invalid credentials. No user found matching "${identifier}".` 
    };
  }

  if (found.password !== password) {
    return { 
      success: false, 
      error: 'Invalid password. Please check your credentials.' 
    };
  }

  if (found.status === 'Inactive') {
    return {
      success: false,
      error: 'This account has been deactivated. Please contact the administrator.'
    };
  }

  // Ensure linked name fields for driver / pump
  if (found.role === 'Driver' && !found.driverName) {
    found.driverName = found.fullName;
  }
  if (found.role === 'Fuel Pump' && !found.pumpName) {
    found.pumpName = found.fullName;
  }

  setCurrentUser(found);
  return { success: true, user: found };
}
