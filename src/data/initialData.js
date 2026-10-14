// Clean Production Initial Dataset (No demo records)
export const INITIAL_DRIVERS = [];

export const INITIAL_VEHICLES = [];

export const INITIAL_PUMPS = [];

export const INITIAL_TRANSACTIONS = [];

// Initial Master Admin Account for First-Time Setup
export const INITIAL_USERS = [
  {
    id: "USR-ADMIN-01",
    username: "admin",
    email: "admin@company.com",
    password: "admin123",
    fullName: "Master Administrator",
    role: "Admin",
    status: "Active",
    createdAt: new Date().toISOString().split('T')[0]
  }
];
