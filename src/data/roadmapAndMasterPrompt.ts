/**
 * EXPANCE - Master Prompt, Technical Architecture Blueprint & Actionable Development Roadmap
 * Synthesizes all 75 sections of the EXPANCE.xlsm specification into an actionable plan.
 */

export const MASTER_PROMPT_TEXT = `ACT AS A PRINCIPAL DESKTOP SOFTWARE ARCHITECT, SENIOR FULL-STACK DEVELOPER, AND DATABASE ENGINEER.

You are tasked with building the production-ready Windows Desktop Application named "EXPANCE" (Personal Finance + Bike Income + Mileage Management System).

The application must operate 100% offline with an integrated local SQLite database (%LOCALAPPDATA%\\EXPANCE\\Data\\EXPANCE.db) wrapped in Electron with Next.js, React, Tailwind CSS, and better-sqlite3. The visual theme and structural design must be directly inspired by the Government of Bangladesh Integrated Budget and Accounting System (iBAS++: https://ibas.finance.gov.bd/), utilizing deep emerald tones (#044E36, #065F46), golden accents, structured collapsible sidebar navigation, compact high-density data grids, and tabular figures with Bangladeshi Taka (৳) formatting.

KEY DELIVERABLES & TECHNICAL REQUIREMENTS:

1. ARCHITECTURE & PACKAGING:
   - Desktop Shell: Electron with secure contextIsolation: true, nodeIntegration: false, and strict IPC bridging.
   - Frontend: Next.js (App Router or Pages Router configured for local standalone export), React 19, Tailwind CSS.
   - Database: SQLite via better-sqlite3 with foreign key enforcement (PRAGMA foreign_keys = ON) and WAL journal mode.
   - Packaging: Electron Builder compiling to EXPANCE-Setup-x64.exe (NSIS installer with Start Menu & Desktop shortcuts) and optional portable executable.
   - Offline-First: Zero remote CDN dependencies, bundled local fonts, local icons (Lucide React), and offline PDF/Excel/CSV generation (PDFKit, ExcelJS).

2. DOMAIN MODULES TO IMPLEMENT:
   - Local Authentication: Local accounts (Administrator, User, Viewer) with secure bcrypt password hashing. First run initializes administrator setup.
   - Executive Dashboard: 14 KPI Cards (Today Income, Expense, Balance, Bike Income, Bike Expense, Bike Profit, Cash, Bank, bKash, Savings, Total Mileage, Ride-Sharing Mileage, Income/KM, Expense/KM) with period filtering (Today, This Month, This Year, Custom).
   - Personal Finance: Income and Expense entries with editable master categories (Salary + Bonus, Baishaki, Court Income, Bazar, Self, Utilities, Prince Support, Extra, etc.) and accounts (Cash, Bank, bKash, Credit Card, Savings).
   - Bike Daily & Mileage Management: Odometer start/finish tracking, automatic Total Mileage and Ride-Sharing Mileage calculations, gross ridesharing earnings, platform commissions, fuel costs, oil, maintenance, and safe calculations for Income/KM, Expense/KM, and Profit/KM (safe division against zero).
   - Fuel Management: Tracking Octane/Petrol liters, unit price, total cost, odometer intervals, fuel efficiency (KM/L), and cost/KM.
   - Engine Oil & Maintenance: Brand, cost, threshold warning when remaining KM is below 200 KM, parts vs labor cost breakdown.
   - Bike Profitability & Performance (BIKEDETELS Engine): Detailed metrics including monthly run projections, fuel remaining projections, extrema (highest/lowest earning day, best/worst fuel efficiency), and running cost per KM.
   - Savings & Loan Management: Savings target tracking, loan accounts (Prince, etc.) supporting loans given/received, repayments, and live outstanding balances.
   - Global Search (Ctrl+K): Cross-module searching over all transactions, mileage entries, fuel logs, and loans with filters.
   - Reporting Engine: 30 distinct financial and bike reports with date range filtering, printable preview layouts (printer-friendly, no sidebar), and export to Excel/CSV/PDF.
   - EXPANCE.xlsm Migration Utility: Interactive migration wizard that imports raw data from DB, EXP, MILEAGE, and BIKEDETELS sheets without propagating legacy #REF! formula errors.
   - Backup & Restore: Single-click database backup to .db or JSON snapshot, pre-restore safety backups, and factory reset with admin confirmation.
   - Audit Trail: Immutable logging of CREATE, UPDATE, DELETE, BACKUP, RESTORE, and LOGIN actions.

3. CODE STANDARDS:
   - Strict TypeScript with repository pattern for database interactions.
   - Centralized calculation services (never calculate business logic in React components).
   - Database transactions for multi-table updates (e.g. adding an expense automatically updates account balance and logs audit trail).
   - High-density, accessible iBAS++ inspired interface optimized for 1366x768 to 1920x1080 desktop monitors.`;

export const ROADMAP_SECTIONS = [
  {
    phase: 'Phase 1: Architecture & Foundation Setup',
    duration: 'Week 1',
    status: 'Ready / Implemented',
    goals: [
      'Initialize Next.js + Electron + TypeScript project skeleton.',
      'Configure Tailwind CSS with iBAS++ government color system (emerald #044e36, #065f46, golden highlights #d97706).',
      'Set up secure Electron IPC preload bridge (contextIsolation: true, nodeIntegration: false).',
      'Integrate better-sqlite3 with WAL mode, foreign key pragma, and migration runner.',
      'Create AppSettings and local bcrypt authentication with first-run Admin setup.',
    ],
    artifacts: ['electron/main.ts', 'electron/preload.ts', 'database/schema.sql', 'services/AuthService.ts'],
  },
  {
    phase: 'Phase 2: Database Schema & Migration Engine',
    duration: 'Week 2',
    status: 'Ready / Implemented',
    goals: [
      'Deploy 12 normalized tables: Users, Accounts, Categories, PersonalTransactions, BikeDailyLogs, FuelLogs, EngineOilLogs, MaintenanceLogs, LoanAccounts, LoanTransactions, SavingsTargets, AuditLogs.',
      'Build Repository pattern classes for transactional atomicity (TransactionRepository, BikeRepository, AccountRepository).',
      'Create EXPANCE.xlsm migration utility that converts raw Excel values into normalized tables without copying broken #REF! formulas.',
      'Implement single-click Database Backup (.db / JSON) and safe restore with integrity checks.',
    ],
    artifacts: ['database/migrations/', 'services/DatabaseService.ts', 'services/MigrationService.ts'],
  },
  {
    phase: 'Phase 3: Centralized Calculation Services',
    duration: 'Week 3',
    status: 'Ready / Implemented',
    goals: [
      'Build pure calculation services independent of React rendering.',
      'Implement safeDiv() utility to eliminate any division-by-zero crashes.',
      'Implement BikeDailyCalculation (actualIncome = earn - commission, netIncome = actual - expenses, income/KM, expense/KM, profit/KM).',
      'Implement FuelEfficiencyCalculation (KM/L, cost/KM, willRunKM projection).',
      'Implement SavingsProgress & Loan Outstanding balance calculators.',
      'Implement BIKEDETELS extrema analyzer (highest earning day, lowest earning day, best KM/L).',
    ],
    artifacts: ['services/calculations.ts', 'tests/calculations.test.ts'],
  },
  {
    phase: 'Phase 4: Core UI & iBAS++ Design System',
    duration: 'Week 4',
    status: 'Ready / Implemented',
    goals: [
      'Top Application Bar: User profile, BD Time / Clock, Notifications, Quick Entry shortcut, and Logout.',
      'Collapsible Left Sidebar: Collapsible navigation with active indicator, badges, and state persistence.',
      'Executive Dashboard: 14 KPI Cards with tabular Bengali Taka (৳) formatting, monthly/yearly tabs, and trend visualization.',
      'Personal Finance Views: Structured Income & Expense grids, quick modal filters, category aggregations.',
      'Accounts View: Live running balances for Cash, Bank, bKash, Credit Card, and Savings.',
    ],
    artifacts: ['components/Header.tsx', 'components/Sidebar.tsx', 'components/DashboardView.tsx', 'components/PersonalFinanceView.tsx'],
  },
  {
    phase: 'Phase 5: Bike & Mileage Management Modules',
    duration: 'Week 5',
    status: 'Ready / Implemented',
    goals: [
      'Daily Bike Entry Form: Starting & Ending Odometer, Ride KM, platform commission, fuel/oil/maint costs with live KPI preview.',
      'Fuel Log: Litres, rate/L, total cost, efficiency KM/L, full-tank indicator, station tracking.',
      'Engine Oil Log: Mobil brand, cost, next change odometer, and remaining KM alert (< 200 KM).',
      'Maintenance Log: Categorized maintenance (general, wash, brake, tire, chain, electrical) with parts vs labor breakdown.',
      'BIKEDETELS Profitability View: Comprehensive analytical dashboard mirroring and enhancing the source workbook.',
    ],
    artifacts: ['components/BikeFinanceView.tsx', 'components/BikeProfitabilityView.tsx'],
  },
  {
    phase: 'Phase 6: Search, Reporting & Export Engine',
    duration: 'Week 6',
    status: 'Ready / Implemented',
    goals: [
      'Global Search (Ctrl+K): Cross-module modal indexing transactions, bike logs, fuel, and accounts with instant filters.',
      'Reporting Engine: 30 standardized financial and bike reports with date range, category, and account filters.',
      'Dedicated Print Preview: Clean CSS @media print layout removing sidebars and controls for official A4 financial printing.',
      'Offline Export: Native CSV and Excel (XLSX) generation via client-side/Node routines.',
    ],
    artifacts: ['components/ReportsView.tsx', 'components/GlobalSearchModal.tsx', 'services/ExportService.ts'],
  },
  {
    phase: 'Phase 7: Administration, Audit Logs & Master Data',
    duration: 'Week 7',
    status: 'Ready / Implemented',
    goals: [
      'User Management: Role-based permissions (Administrator, User, Viewer).',
      'Master Data Grids: Editable categories for Income, Personal Expense, Bike Expense, Accounts, and Fuel Types.',
      'Audit Trail View: Searchable log of all database mutations with timestamp and user attribution.',
      'System Settings: Currency symbol (৳), date format (dd-MM-yyyy), warning thresholds.',
    ],
    artifacts: ['components/MasterDataView.tsx', 'components/AuditLogsView.tsx', 'components/SettingsView.tsx'],
  },
  {
    phase: 'Phase 8: Packaging, Testing & Windows Installer',
    duration: 'Week 8',
    status: 'Ready / Implemented',
    goals: [
      'Automated unit testing for all financial and mileage calculations.',
      'Security audit: Parameterized queries verification, malformed IPC handling, SQL injection resilience.',
      'Configure Electron Builder for Windows NSIS x64 installer (EXPANCE-Setup-x64.exe) and portable package.',
      'Bundle all assets, icons, fonts, and SQLite runtime (no external internet requirements).',
      'Produce complete User Manual & README documentation.',
    ],
    artifacts: ['electron-builder.yml', 'package.json', 'README.md', 'USER_MANUAL.md'],
  },
];

export const WORKBOOK_COMPARISON_MATRIX = [
  {
    excelSheet: 'DB',
    excelConcept: 'Consolidated balances, cash, savings, bank, court, bike income summary',
    excelFlaws: 'Hard-coded cell references, scattered sums, risk of formula corruption if rows are inserted',
    appSolution: 'Normalized Accounts & PersonalTransactions tables with dynamic real-time balance aggregation and transactional integrity',
  },
  {
    excelSheet: 'EXP',
    excelConcept: 'Daily personal expenses (Bazar, Self, Utilities, Others, Prince, Extra)',
    excelFlaws: 'Columns fixed in spreadsheet; adding new categories requires modifying sheet formulas; no audit trail',
    appSolution: 'Configurable Categories master data, fast multi-entry grid with keyboard navigation (Enter key flow), and complete change history',
  },
  {
    excelSheet: 'MILEAGE',
    excelConcept: 'Odometer start/end, total KM, ride KM, earn amount, rent, actual rent, fuel, oil, TDINC, TDExp',
    excelFlaws: 'Ambiguous abbreviations (AcExp, AcInc, IncDEF), division by zero if mileage is blank, #REF! errors on row delete',
    appSolution: 'Explicit domain entities (BikeDailyLogs), safeDiv() calculations, auto-calculated net income and profit/KM, zero formula breaks',
  },
  {
    excelSheet: 'BIKEDETELS',
    excelConcept: 'Profitability, income/KM, expense/KM, fuel remaining, future running projection, working day estimate',
    excelFlaws: 'Manual projections with hard-coded fuel rates (e.g. 130 Tk/L) and arbitrary multiplier constants',
    appSolution: 'Dynamic BIKEDETELS engine using actual historical averages, configurable warning thresholds, and clean statistical extrema',
  },
];
