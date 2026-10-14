# FuelFlow — Company Fuel Management System

A clean, modern, and high-performance Web Application for tracking company fleet master records, fuel operations, automated voucher generation, and comprehensive audit reports.

## 🚀 Live Access
The development server is running and accessible at:
- **Local:** [http://localhost:3000/](http://localhost:3000/)
- **Network:** Accessible across your local office network on port `3000`.

---

## ✨ Features Implemented

### Phase 1: The Master Records & Dashboard
- **Dashboard Overview:**
  - 4 Top Summary Cards: Total Fuel Issued (Liters), Total Fuel Cost, Active Vehicles, and Total Registered Pumps.
  - Fleet Breakdown visual charts by vehicle type (Cars, Heavy Trucks, Vans, Bikes).
  - Master Records Hub with 1-click navigation.
- **Manage Vehicles:**
  - Add, View, and Delete fleet vehicles.
  - License plate formatting, Vehicle Type (Car, Bike, Truck, Van), and Assigned Driver dropdown.
- **Manage Drivers:**
  - Add, View, and Delete authorized drivers.
  - Driver Name, Phone Number, CNIC / National ID, and License Number.
  - Dynamic cross-vehicle assignment badges.
- **Manage Fuel Pumps (Stations):**
  - Add, View, and Delete contracted fuel pumps.
  - Pump Name, Location / City, and Contact Person.

### Phase 2: "Issue Fuel" (Add Fuel) Module
- **Sidebar Page:** **"Issue Fuel"**
- **11-Field Entry Form:**
  1. `Slip/Voucher Number`: Auto-generated unique sequential number (e.g., `FL-1001`, `FL-1005`), with a regenerate option.
  2. `Date & Time`: Auto-filled with current date & time, editable.
  3. `Select Vehicle Number`: Live dropdown linked to registered fleet vehicles (with smart driver auto-select).
  4. `Select Driver`: Live dropdown linked to authorized drivers directory.
  5. `Select Fuel Pump`: Live dropdown linked to contracted pump stations list.
  6. `Fuel Type`: Dropdown with `Petrol`, `Diesel`, `Hi-Octane`, and `CNG` (with smart market rate defaults).
  7. `Current Odometer / Meter Reading (KM)`: Numeric input for mileage tracking.
  8. `Fuel Quantity in Liters`: Numeric volume input with 2-decimal precision.
  9. `Rate per Liter`: Numeric input for current fuel station price.
  10. `Total Cost`: Auto-calculated in real time (`Quantity x Rate`) with currency display.
  11. `Remarks / Purpose of Trip`: Optional text input for trip context and audit notes.

### Phase 3: The Dual Printable Slip Generator (A4 Single Page)
- **Single A4 Page Layout:**
  - Two identical slips stacked vertically (**Top half** and **Bottom half**).
  - Separated by a dashed horizontal cut-line with a scissor icon: `--- ✂️ Cut Here ---`.
- **Dedicated Top-Right Badges:**
  - **Top Slip:** Bold badge saying **"OFFICE RECORD COPY"**.
  - **Bottom Slip:** Bold badge saying **"FUEL PUMP COPY"**.
- **Complete Information on Each Slip:**
  - Company Name (`"Company Fuel Management System"`) and Header.
  - Slip Number & Date/Time.
  - **Fuel Pump Name & Location (Highlighted clearly with blue accent box)**.
  - Vehicle Number (mono license plate box) & Vehicle Type pill.
  - Driver Name & Phone Number.
  - Fuel Type, Quantity (Liters), Rate per Liter, and Total Amount (**in bold**).
  - Current Meter Reading (KM).
  - **Three Signature Lines:**
    1. `Admin/Issuer Signature`
    2. `Driver Signature`
    3. `Pump Manager Stamp & Sign`
- **One-Click Printing:**
  - Blue **"Print Slips"** button triggers `window.print()` with strict `@media print` rules, hiding UI elements and fitting both slips on a single page.

### Phase 4: Fuel Reports & Search Filter Page
- **New Sidebar Page:** **"Fuel Reports & History"**
- **Comprehensive Search & Filter Bar:**
  1. `Filter by Vehicle Number`: Dropdown of all registered fleet vehicles + "All Vehicles".
  2. `Filter by Driver Name`: Dropdown of all authorized drivers + "All Drivers".
  3. `Filter by Fuel Pump`: Dropdown of all contracted fuel stations + "All Fuel Stations".
  4. `Date Range Filter`: `From Date` -> `To Date` date pickers.
  5. `Search Query`: Instant keyword search across Slip #, vehicle, driver, pump, or remarks.
  6. `Reset Filters`: 1-click button to reset all filters.
- **Dynamic Summary Cards (Real-Time Recalculation):**
  - **Total Liters Consumed:** Dynamically sum of liters for the selected filters.
  - **Total Amount Spent:** Dynamically calculated expenditure (PKR / Rs.).
  - **Matching Records:** Live count of filtered vouchers vs total.
  - **Average Rate per Liter:** Weighted average fuel cost per liter.
- **Clean Audit Ledger Table:**
  - Columns: Slip #, Date & Time, Vehicle #, Driver, Fuel Pump, Quantity (L), Rate (Rs.), Total Cost, and Actions.
  - **"View / Reprint Slip"** button: Re-opens the Phase 3 Dual Printable Slip preview modal.
  - **"Delete"** button: Safely deletes transaction with confirmation.
- **Export to CSV / Excel:**
  - Downloads a clean `.csv` spreadsheet with full transaction details and headers for accounting & audit reconciliation.

---

## 🛠 Tech Stack
- **React 19**
- **Vite 6**
- **Lucide Icons**
- **Print CSS Optimization (`@page { size: A4 portrait; margin: 6mm 8mm; }`)**
- **CSV Data Export Engine**
- **Corporate Navy & White Theme** (`#0B192C`, `#1E3A8A`, `#2563EB`, `#FFFFFF`, `#F8FAFC`)

## 💻 Commands
- Run dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
