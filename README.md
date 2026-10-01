# EXPANCE - Personal Finance + Bike Income + Mileage Management System

> **Offline-First Windows Desktop Application & Financial Fleet Console**  
> *UI/UX Theme and Structure Inspired by the Government of Bangladesh Integrated Budget and Accounting System (iBAS++)*

---

## 1. System Overview

**EXPANCE** is a dedicated, production-grade, 100% offline personal finance and bike fleet management desktop suite. It is engineered to replace spreadsheet-based financial workflows (specifically based on the business logic, data models, and calculations of `EXPANCE.xlsm`) with a normalized, high-performance, database-driven system.

### Key Objectives
- **Zero Remote Dependencies**: Works completely offline without internet connectivity, remote databases, external CDNs, or online authentication.
- **Embedded Database**: Utilizes an integrated, local SQLite database with strict foreign keys (`PRAGMA foreign_keys = ON`) and WAL mode.
- **Mathematical Integrity**: Centralized calculation services with zero-division safety (`safeDiv`) preventing `#REF!`, `#DIV/0!`, or formula corruption.
- **Government Financial Theme (iBAS++)**: Built with deep emerald greens (`#044E36`, `#065F46`), gold highlights (`#D97706`), crisp tabular typography (`font-variant-numeric: tabular-nums`), and Bangladeshi Taka (`৳`) currency conventions.

---

## 2. Technology Stack & Offline-First Principles

- **Desktop Shell**: [Electron](https://www.electronjs.org/) (Strict security: `contextIsolation: true`, `nodeIntegration: false`, typed IPC preload bridge).
- **Frontend Architecture**: [Next.js](https://nextjs.org/) / [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/).
- **Database Engine**: [SQLite](https://www.sqlite.org/) via `better-sqlite3`.
- **Packaging & Distribution**: [Electron Builder](https://www.electron.build/) producing a standalone Windows NSIS installer (`EXPANCE-Setup-x64.exe`) and portable standalone executable.
- **Document Exporting**: Client-side / local Node.js CSV generation, PDF layout printing via CSS `@media print`, and Excel format exporter.

---

## 3. Database Architecture & File Locations

The application maintains a local database file on Windows:

```
%LOCALAPPDATA%\EXPANCE\Data\EXPANCE.db
```
*(Fallback location: `%APPDATA%\EXPANCE\Data\EXPANCE.db`)*

### 12 Normalized Core Tables:
1. `Users` - Local user credentials, bcrypt password hashes, and active status.
2. `AppSettings` - Key-value application configurations (currency symbol `৳`, date format `dd-MM-yyyy`, warning thresholds).
3. `Accounts` - Liquid vaults: Cash in Hand, Sonali/Dutch-Bangla Bank, bKash, Credit Card, Savings.
4. `Categories` - Master classification heads: Income, Personal Expense, Bike Expense.
5. `PersonalTransactions` - Personal income and expense ledger entries.
6. `BikeDailyLogs` - Daily odometer checkpoints, gross ride-sharing earnings, platform commission, net take-home, and bike expenses.
7. `FuelLogs` - Refuel events, fuel type (Octane/Petrol), price per liter, and calculated efficiency ($KM/L$).
8. `EngineOilLogs` - Mobil/oil change events, odometer, drain intervals, and remaining KM alerts.
9. `MaintenanceLogs` - Scheduled general services, washing, brake pads, tire repairs, and labor costs.
10. `LoanAccounts` & `LoanTransactions` - Personal loans (e.g. Prince Support), loans given/received, and repayments.
11. `SavingsTargets` & `SavingsTransactions` - Recurring deposit goals and progress tracking.
12. `AuditLogs` - Immutable chronological audit trail recording all database mutations.

---

## 4. Installation & Build Instructions

### Prerequisites
- Node.js version 18.x or 20.x LTS
- Windows 10 or Windows 11 (64-bit)

### Developer Build & Packaging Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/expance-desktop.git
   cd expance-desktop
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run in Local Development Mode**:
   ```bash
   npm run dev
   ```

4. **Compile Windows Installer (`EXPANCE-Setup-x64.exe`)**:
   ```bash
   npm run build
   npx electron-builder --win --x64
   ```
   *The installer will be generated in `dist-electron/EXPANCE-Setup-x64.exe`.*

---

## 5. End-User Manual & Step-by-Step Instructions

### Chapter 1: First Run & Initial Administrator Setup
1. Launch **EXPANCE** from your desktop or start menu.
2. On first launch, the local SQLite database file and tables are initialized automatically.
3. Default master accounts (Cash, Bank, bKash) and categories (Bazar, Utilities, Salary, Bike) are created with clean zero balances.
4. Log in using the baseline administrator account:
   - **Username**: `admin`
   - **Password**: `admin123`
5. You can update your administrator password anytime in **Settings** or manage additional local user accounts.

---

### Chapter 2: Executive Dashboard
The dashboard presents a high-level command center with 14 real-time KPI cards:
- **Financial Balances**: Today's Income, Today's Expense, Net Balance, Cash in Hand, Bank Balance, bKash Wallet, and Total Savings.
- **Fleet Metrics**: Total Distance Run ($KM$), Ride-Sharing Mileage ($KM$), Income/KM, Expense/KM, and Net Profit/KM.
- **Period Filter**: Toggle effortlessly between **Today**, **This Month**, **This Year**, and **All-Time** to recalculate all figures in real time.
- **Quick Action Bar**: Direct buttons to record income, expenses, bike runs, or load test data.

---

### Chapter 3: Personal Finance Ledger (Income & Expense)
1. Navigate to **Personal Expenses** or **Personal Income** in the left sidebar.
2. Click **+ Add Expense** (or **+ Add Income**).
3. Fill in the required fields:
   - **Date**: Format `dd-MM-yyyy`.
   - **Category**: Select category head (e.g. *Bazar / Grocery*, *Utilities & House Rent*, *Self*, *Prince Support*, *Salary + Bonus*).
   - **Account**: Select which vault to debit or credit (*Cash in Hand*, *Bank*, *bKash*).
   - **Amount**: Value in Bangladeshi Taka ($৳$).
   - **Payee / Source**: Person, vendor, or employer name.
   - **Description**: Detailed context.
4. Click **Save Transaction**. The account current balance updates automatically.

---

### Chapter 4: Bike Daily & Mileage Management
This module digitizes the source workbook's `MILEAGE` worksheet:
1. Open **Daily Mileage & Income** from the sidebar.
2. Click **+ Log Daily Mileage**.
3. Enter the day's trip parameters:
   - **Date**: Automatic day-of-week detection (e.g. Saturday, Sunday).
   - **Starting Odometer (KM)**: Auto-filled from the previous day's ending odometer.
   - **Ending Odometer (KM)**: Must be greater than or equal to starting odometer.
   - **Private / Non-Ride KM**: Kilometers driven for private errands.
   - **Gross Ride Earnings (৳)**: Total fare billed through ridesharing apps.
   - **Platform Commission / Rent (৳)**: Deduction taken by Uber / Pathao.
   - **Daily Expenses**: Breakdowns for Fuel, Oil, Maintenance, and Parking/Tolls.
4. **Live Preview**: The modal calculates and previews in real time:
   $$\text{Total Mileage} = \text{Ending Odometer} - \text{Starting Odometer}$$
   $$\text{Ride-Sharing Mileage} = \text{Total Mileage} - \text{Private Mileage}$$
   $$\text{Actual Take-Home Income} = \text{Gross Earnings} - \text{Platform Commission}$$
   $$\text{Net Bike Profit} = \text{Actual Income} - \text{Total Bike Expense}$$
   $$\text{Income per KM} = \frac{\text{Actual Income}}{\text{Ride Mileage}}$$
5. Click **Save Daily Log**.

---

### Chapter 5: Fuel & Refueling Management
1. Open **Fuel Management** in the sidebar.
2. Click **+ Refuel Log**.
3. Input:
   - **Current Odometer**: Odometer reading at the gas station.
   - **Fuel Type**: Octane, Petrol, or Diesel.
   - **Liters Filled**: Fuel quantity.
   - **Rate / Liter (৳)**: Price per unit.
   - **Distance Since Last Fuel (KM)**: Automatic or manual odometer delta.
   - **Full Tank Checkbox**: Check if filled to auto-cutoff for exact fuel consumption benchmarks.
4. **Automated Output**:
   $$\text{Fuel Efficiency} = \frac{\text{Distance Run}}{\text{Liters Consumed}} \quad (KM/L)$$
   $$\text{Fuel Cost per KM} = \frac{\text{Total Fuel Cost}}{\text{Distance Run}} \quad (৳/KM)$$

---

### Chapter 6: Engine Oil (Mobil) & Proactive Upkeep Alerts
1. Open **Engine Oil (Mobil)** in the sidebar.
2. Click **+ Record Oil Change**.
3. Specify:
   - **Odometer Changed**: Current vehicle odometer.
   - **Brand / Grade**: e.g., *Motul 7100 10W40 Full Synthetic*, *Shell Advance Ultra*.
   - **Cost (৳)**: Purchase price of engine oil.
   - **Drain Interval (KM)**: Configured lifespan (typically $2,000\text{ KM}$ or $2,500\text{ KM}$).
4. **Automated Life Remaining**:
   $$\text{Remaining KM} = \text{Next Change KM} - \text{Current Highest Odometer}$$
5. **Proactive Alerts**: If remaining life drops below **$200\text{ KM}$**, the application highlights the record in red and triggers the notification badge in the top navigation bar.

---

### Chapter 7: Maintenance & Spare Parts Management
1. Open **Maintenance & Parts** in the sidebar.
2. Click **+ Record Maintenance**.
3. Record repair details:
   - **Maintenance Type**: General Service, Wash & Polish, Brake Pad/Shoe, Tire/Tube, Chain Sprocket, Electrical, Spare Parts.
   - **Cost Breakdown**: Parts Cost + Labor Cost + Other Cost = Total Maintenance Outflow.

---

### Chapter 8: BIKEDETELS Commercial Profitability Engine
Recreates and enhances the analytical intelligence of the workbook's `BIKEDETELS` worksheet:
- **Unit Economics**: Running cost per KM vs commercial fare yield per KM.
- **Statistical Extrema**:
  - Highest Earning Day vs Lowest Earning Day
  - Highest Expense Day
  - Peak Fare Yield ($৳/KM$)
  - Peak Fuel Mileage ($KM/L$)
- **26-Day Workday Commercial Projection**: Estimates monthly distance run, take-home earnings, bike expenses, and net profit based on logged daily averages.

---

### Chapter 9: Savings Targets & Loan Portfolios
1. **Savings Targets**: Set target fund goals (e.g. *Emergency Reserve*, *Bike Overhaul Fund*) with target dates and observe real-time progress bars and percentage achievements.
2. **Loan Ledger**:
   - Manage loans given to friends or relatives (e.g. *Prince Support*) or loans borrowed from financial institutions.
   - Record repayments with automatic live recalculation of outstanding balances.

---

### Chapter 10: Quick Multi-Entry Mode (`Ctrl + N`)
- Press **Ctrl + N** (or click **Quick Entry** on the top bar) from anywhere in the application.
- Quickly toggle between *Personal Expense*, *Personal Income*, *Bike Run*, and *Fuel Fill*.
- Press **Enter** to save and immediately reset fields for rapid, multi-record data entry.

---

### Chapter 11: Global Search (`Ctrl + K`)
- Press **Ctrl + K** (or click the search button in the top bar) to launch the unified command palette.
- Instantly searches across personal transactions, bike trips, fuel stations, and loan accounts.
- Click any search result to jump directly to its respective module.

---

### Chapter 12: Reporting Center & Dedicated Print Preview
Contains **30 standardized financial and fleet reports**:
- Daily/Monthly/Yearly Personal Income, Expense, and Balance reports.
- Account statements for Cash, Bank, and bKash.
- Daily/Monthly/Yearly Bike Income, Expense, and Profit reports.
- Fuel consumption, fuel efficiency ($KM/L$), engine oil history, and cost-per-kilometer reports.
- **Report 30: Complete Consolidated Financial Statement**.
- **Printing**: Click **Print Preview** to trigger an official A4 document layout with headers, auditor attribution, verification seals, and no sidebars (`@media print`).
- **Exporting**: Export any filtered report directly to **CSV** or Excel.

---

### Chapter 13: Database Backup, Clean Database (Section 35) & Restore
1. **Backup**:
   - Click **Export Full Database Backup** to download a complete, portable JSON snapshot of all 12 tables.
   - Click **Download schema.sql** to obtain the clean SQLite DDL definitions.
2. **Restore**:
   - Select a previously exported `.json` backup file.
   - An automated safety snapshot is saved to local storage before applying changes.
3. **Clean Database (Section 35 Specification)**:
   - **Option A (Clean Operational Database)**: Purges transactions, bike logs, and fuel entries while preserving master accounts, categories, users, and settings. Requires entering the administrator password and typing `"CONFIRM CLEAR"`. An automatic pre-clean backup is downloaded immediately.
   - **Option B (Factory Reset)**: Wipes all data and resets the database back to factory defaults. Requires typing `"FACTORY RESET"` and entering the admin password.

---

### Chapter 14: EXPANCE.xlsm Migration Utility
- Converts legacy Excel spreadsheets into normalized SQLite database records.
- Isolates raw input values from calculated cells.
- Eliminates legacy `#REF!` and `#DIV/0!` formula artifacts.
- Includes a live migration terminal and execution log.

---

### Chapter 15: Audit Trail Logs
- Every transaction added, edited, deleted, backed up, restored, or cleaned is permanently recorded in **Audit Trail Logs**.
- Records include the exact UTC timestamp, username, action type, module, record key, and audit details.

---

## 6. Troubleshooting & Uninstallation

### Common Questions & Troubleshooting
- **Database file not found**: On Windows, check `%LOCALAPPDATA%\EXPANCE\Data\EXPANCE.db`. If the directory does not exist, launching the application will automatically create it.
- **Accidental Deletion**: Check the **Backup & Clean Database** tab. Every purge operation automatically generates a recovery JSON backup file in your Downloads folder.
- **Forgot Admin Password**: Use the built-in backup restore or execute a factory reset to restore default credentials (`admin` / `admin123`).

### Uninstallation
- On Windows, open **Settings > Apps > Installed apps**, locate **EXPANCE**, and click **Uninstall**.
- The uninstaller will remove application binaries while optionally giving you the choice to retain your database data in `%LOCALAPPDATA%\EXPANCE\Data`.

---

## 7. License & Credits

- **Application Architecture**: EXPANCE Personal Finance & Bike Fleet Suite.
- **Visual Design**: Inspired by the Government of Bangladesh Integrated Budget and Accounting System (iBAS++).
- **License**: Apache-2.0.
