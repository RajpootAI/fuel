export const INITIAL_DRIVERS = [
  {
    id: "DRV-101",
    name: "Muhammad Ali",
    phone: "0300-1234567",
    cnic: "35201-1234567-1",
    licenseNumber: "LHR-98213-C",
    status: "Active",
    createdAt: "2026-03-10"
  },
  {
    id: "DRV-102",
    name: "Tariq Mahmood",
    phone: "0321-7654321",
    cnic: "35202-9876543-3",
    licenseNumber: "LHR-54120-T",
    status: "Active",
    createdAt: "2026-03-12"
  },
  {
    id: "DRV-103",
    name: "Usman Ghani",
    phone: "0333-5556677",
    cnic: "35201-5554443-5",
    licenseNumber: "ISB-33109-M",
    status: "Active",
    createdAt: "2026-03-15"
  }
];

export const INITIAL_VEHICLES = [
  {
    id: "VEH-101",
    vehicleNumber: "LEA-1234",
    vehicleType: "Car",
    assignedDriverName: "Muhammad Ali",
    status: "Active",
    createdAt: "2026-03-10"
  },
  {
    id: "VEH-102",
    vehicleNumber: "KHI-9876",
    vehicleType: "Truck",
    assignedDriverName: "Tariq Mahmood",
    status: "Active",
    createdAt: "2026-03-11"
  },
  {
    id: "VEH-103",
    vehicleNumber: "ISB-5432",
    vehicleType: "Van",
    assignedDriverName: "Usman Ghani",
    status: "Active",
    createdAt: "2026-03-12"
  },
  {
    id: "VEH-104",
    vehicleNumber: "LXM-4411",
    vehicleType: "Bike",
    assignedDriverName: "Unassigned",
    status: "Active",
    createdAt: "2026-03-14"
  }
];

export const INITIAL_PUMPS = [
  {
    id: "PMP-101",
    pumpName: "PSO Main Boulevard Station",
    location: "Gulberg III, Lahore",
    contactPerson: "Asif Raza (0300-8889911)",
    status: "Active",
    createdAt: "2026-03-01"
  },
  {
    id: "PMP-102",
    pumpName: "Shell Highway Express",
    location: "GT Road, Gujranwala",
    contactPerson: "Kamran Siddiqui (0322-4455667)",
    status: "Active",
    createdAt: "2026-03-02"
  },
  {
    id: "PMP-103",
    pumpName: "Total Parco Ring Road",
    location: "Ring Road Interchange, Lahore",
    contactPerson: "Zahid Qureshi (0345-1122334)",
    status: "Active",
    createdAt: "2026-03-05"
  }
];

// Pre-seeded fuel issuance slips for realistic dashboard summary and slip previews
export const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-1001",
    slipNumber: "FL-1001",
    dateTime: "2026-03-25T10:30",
    vehicleNumber: "LEA-1234",
    driverName: "Muhammad Ali",
    pumpName: "PSO Main Boulevard Station",
    fuelType: "Petrol",
    odometerReading: 45200,
    liters: 45.5,
    ratePerLiter: 275.50,
    totalCost: 12535.25,
    remarks: "Official executive travel - Lahore site audit"
  },
  {
    id: "TXN-1002",
    slipNumber: "FL-1002",
    dateTime: "2026-03-26T14:15",
    vehicleNumber: "KHI-9876",
    driverName: "Tariq Mahmood",
    pumpName: "Shell Highway Express",
    fuelType: "Diesel",
    odometerReading: 112450,
    liters: 180.0,
    ratePerLiter: 284.00,
    totalCost: 51120.00,
    remarks: "Heavy freight delivery - Lahore to Gujranwala corridor"
  },
  {
    id: "TXN-1003",
    slipNumber: "FL-1003",
    dateTime: "2026-03-27T09:45",
    vehicleNumber: "ISB-5432",
    driverName: "Usman Ghani",
    pumpName: "Total Parco Ring Road",
    fuelType: "Petrol",
    odometerReading: 68300,
    liters: 65.0,
    ratePerLiter: 275.50,
    totalCost: 17907.50,
    remarks: "Inter-city staff shuttle service"
  },
  {
    id: "TXN-1004",
    slipNumber: "FL-1004",
    dateTime: "2026-03-28T16:20",
    vehicleNumber: "LEA-1234",
    driverName: "Muhammad Ali",
    pumpName: "PSO Main Boulevard Station",
    fuelType: "Petrol",
    odometerReading: 45850,
    liters: 42.0,
    ratePerLiter: 275.50,
    totalCost: 11571.00,
    remarks: "Local client inspections and head office returns"
  }
];


// Phase 5: Seed User Accounts for Role-Based Access Control
export const INITIAL_USERS = [
  {
    id: "USR-001",
    username: "admin",
    email: "admin@fuelflow.com",
    password: "admin123",
    fullName: "Fleet Administrator",
    role: "Admin",
    status: "Active",
    createdAt: "2026-03-01"
  },
  {
    id: "USR-002",
    username: "manager",
    email: "manager@fuelflow.com",
    password: "manager123",
    fullName: "Operations Manager",
    role: "Manager",
    status: "Active",
    createdAt: "2026-03-05"
  },
  {
    id: "USR-003",
    username: "driver1",
    email: "driver1@fuelflow.com",
    password: "driver123",
    fullName: "Muhammad Ali (Driver)",
    role: "Driver",
    status: "Active",
    createdAt: "2026-03-10"
  },
  {
    id: "USR-004",
    username: "pump1",
    email: "pump1@fuelflow.com",
    password: "pump123",
    fullName: "PSO Station Attendant",
    role: "Fuel Pump",
    status: "Active",
    createdAt: "2026-03-12"
  }
];
