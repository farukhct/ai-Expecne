import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChapter, setActiveChapter] = useState('chapter_1');

  const chapters = [
    {
      id: 'chapter_1',
      title: '1. First Run & Administrator Setup',
      summary: 'Database initialization, baseline credentials, and login setup.',
      content: `### 1. First Run & Administrator Setup
- When launched for the first time, EXPANCE initializes the local SQLite database (%LOCALAPPDATA%\\EXPANCE\\Data\\EXPANCE.db).
- Default master accounts (Cash in Hand, Sonali/Dutch-Bangla Bank, bKash) and categories (Bazar, Utilities, Salary) are populated with clean zero balances.
- Authenticate with the baseline administrator account:
  * Username: admin
  * Password: admin123
- The administrator can manage user accounts, assign roles (Administrator, User, Viewer), and change passwords.`,
    },
    {
      id: 'chapter_2',
      title: '2. Executive Dashboard & 14 KPIs',
      summary: 'Live balances, mileage economics, and period filters.',
      content: `### 2. Executive Dashboard & 14 KPI Cards
- The dashboard is the primary command center providing real-time financial synchronization.
- 14 Key Performance Indicators (KPIs):
  1. Total Income (Personal + Bike Fleet)
  2. Total Expenses
  3. Net Savings / Balance Surplus or Deficit
  4. Bike Net Take-Home Income
  5. Bike Operating Expenses
  6. Bike Net Commercial Profit
  7. Total Mileage Run (KM)
  8. Fare Income per Ride KM (৳/KM)
  9. Running Cost per KM (৳/KM)
  10. Net Profit per KM (৳/KM)
  11. Cash in Hand Vault Balance
  12. Bank Account Vault Balance
  13. bKash Wallet Balance
  14. Total Savings & Reserve Funds
- Use the segmented period controls: Today, This Month, This Year, All-Time.`,
    },
    {
      id: 'chapter_3',
      title: '3. Personal Finance (Income & Expense)',
      summary: 'Recording daily grocery (Bazar), utilities, and office salary.',
      content: `### 3. Personal Financial Ledger
- Navigate to Personal Expenses or Personal Income from the sidebar.
- Click "+ Add Expense" or "+ Add Income".
- Required inputs: Date (dd-MM-yyyy), Category (Bazar, Utilities, Self, Salary, Prince Support), Account Vault (Cash, Bank, bKash), and Amount in Taka (৳).
- Account current balances are updated automatically upon saving.
- Filter records by date range, category, or account, and export directly to CSV or print official statements.`,
    },
    {
      id: 'chapter_4',
      title: '4. Bike Daily Mileage & Ride Income',
      summary: 'Odometer tracking, ride-sharing earnings, and net take-home.',
      content: `### 4. Bike Daily Mileage & Income (EXPANCE.xlsm MILEAGE Sheet)
- Open Daily Mileage & Income from the sidebar and click "+ Log Daily Mileage".
- Enter:
  * Starting Odometer (KM): Auto-filled from previous day.
  * Ending Odometer (KM): Must be greater than or equal to start.
  * Private / Non-Ride KM: Personal driving excluded from ride-sharing fare calculations.
  * Gross Fare Earned (৳): Total billed through Uber/Pathao.
  * Platform Commission / Rent (৳): Platform percentage deduction.
  * Operating Expenses: Fuel, Engine Oil, Maintenance, and Parking/Toll.
- Live Real-Time Formulas:
  * Total Mileage = Ending Odo - Starting Odo
  * Ride-Sharing Mileage = Total Mileage - Private Mileage
  * Actual Take-Home = Gross Earn - Platform Rent
  * Net Bike Profit = Actual Take-Home - Total Bike Expense
  * Income per KM = Actual Take-Home / Ride Mileage (with safe zero division protection)`,
    },
    {
      id: 'chapter_5',
      title: '5. Fuel Management & Refuel Logs',
      summary: 'Octane/Petrol tracking, liters, rate, and KM/L efficiency.',
      content: `### 5. Fuel Management & Refuel History
- Click "+ Refuel Log" under Fuel Management.
- Record:
  * Current Odometer
  * Fuel Type (Octane / Petrol)
  * Quantity in Liters
  * Rate per Liter (৳)
  * Distance Since Previous Refuel (KM)
  * Full Tank Checkbox (used to ensure accurate KM/L benchmarks)
- Automatic Calculations:
  * Fuel Efficiency = Distance Run / Liters Consumed (KM/L)
  * Fuel Cost per KM = Total Cost / Distance Run (৳/KM)`,
    },
    {
      id: 'chapter_6',
      title: '6. Engine Oil (Mobil) & Life Warnings',
      summary: 'Oil change intervals and proactive < 200 KM warning alert.',
      content: `### 6. Engine Oil (Mobil) & Upkeep Alerts
- Click "+ Record Oil Change" under Engine Oil.
- Specify oil brand (e.g. Motul 7100 10W40, Shell Advance Ultra), cost, odometer, and drain interval (e.g. 2,000 KM).
- The system continuously calculates: Remaining KM = Next Change KM - Current Odometer.
- When remaining life is 200 KM or less, the system highlights the row in red and triggers the notification alert bell in the top navigation bar.`,
    },
    {
      id: 'chapter_7',
      title: '7. BIKEDETELS Commercial Profitability',
      summary: 'Extrema analysis, unit economics, and 26-day workday projections.',
      content: `### 7. BIKEDETELS Fleet Analytics & Forecasts
- Recreates and enhances the analytical intelligence of EXPANCE.xlsm BIKEDETELS sheet.
- Unit Economics: Running cost per KM vs gross income per commercial KM.
- Statistical Extrema:
  * Highest Earning Day vs Lowest Earning Day
  * Highest Expense Day
  * Peak Fare Yield (৳/KM)
  * Peak Fuel Mileage (KM/L)
- 26-Day Workday Projection: Mathematically projects monthly distance run, take-home income, operating costs, and net commercial profit.`,
    },
    {
      id: 'chapter_8',
      title: '8. Savings Commitments & Loan Portfolios',
      summary: 'Target funds, family loans (Prince), and repayment ledger.',
      content: `### 8. Savings Goals & Loan Accounts
- Savings: Define target fund objectives (Emergency Fund, Bike Overhaul) with target dates and monitor progress bars and percentage achievements.
- Loans:
  * Track loans given (receivables) or loans taken (payables).
  * Record repayments with live automatic reduction of outstanding loan balances.`,
    },
    {
      id: 'chapter_9',
      title: '9. Quick Entry (Ctrl + N) & Global Search (Ctrl + K)',
      summary: 'Rapid keyboard-driven shortcuts and universal search.',
      content: `### 9. Quick Entry & Universal Command Search
- Quick Entry (Ctrl + N): Rapid modal allowing swift entry of personal income, expenses, bike trips, or fuel fills. Press Enter to save and immediately prepare for the next entry.
- Global Search (Ctrl + K): Instant universal search indexing all personal transactions, bike trips, fuel logs, and loans with category badges and jump-to-record navigation.`,
    },
    {
      id: 'chapter_10',
      title: '10. 30 Standardized Reports & Print Engine',
      summary: 'Daily, monthly, yearly statements and A4 printable layouts.',
      content: `### 10. Reporting Center & Print Layouts
- Select from 30 standardized report templates covering personal finance, account vaults, bike fleet runs, fuel efficiency, and executive summaries.
- Filter by custom date ranges.
- Click "Export CSV" to download clean tabular spreadsheets.
- Click "Print Preview" to trigger an official government-style A4 report with executive headers, auditor attribution, and automated verification seal (#EXP-XXX).`,
    },
    {
      id: 'chapter_11',
      title: '11. Clean Database (Section 35) & Factory Reset',
      summary: 'Operational ledger purges, password confirmation, and pre-clean backups.',
      content: `### 11. Clean Database & Data Purge Controls (Section 35)
- Accessible via "Backup & Clean Database" in the sidebar (Administrator role only).
- Option A: Clean Database (Clear Operational Ledger)
  * Purges: Personal transactions, bike logs, fuel logs, maintenance logs.
  * Preserves: User accounts, roles, chart of categories, master account vaults, settings.
  * Resets account current balances back to opening balances.
  * Requires admin password and typing "CONFIRM CLEAR".
  * Automatically creates and downloads a pre-clean backup file.
- Option B: Factory Reset (Total System Wipe)
  * Completely wipes all data and restores pristine initial defaults.
  * Requires admin password and typing "FACTORY RESET".`,
    },
    {
      id: 'chapter_12',
      title: '12. EXPANCE.xlsm Migration Utility',
      summary: 'Converting spreadsheet formulas into normalized SQLite tables.',
      content: `### 12. EXPANCE.xlsm Source Migration Engine
- Translates legacy sheets (DB, EXP, MILEAGE, BIKEDETELS) into clean SQLite database entities.
- Extracts raw numerical values and recomputes all derived metrics via verified pure services.
- Eliminates legacy #REF! and #DIV/0! errors permanently.
- Includes interactive simulation preview and terminal execution logs.`,
    },
  ];

  const handleCopyAll = () => {
    const fullText = chapters.map((c) => c.content).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReadme = () => {
    const fullText = chapters.map((c) => c.content).join('\n\n---\n\n');
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EXPANCE_USER_MANUAL.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredChapters = chapters.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.content.toLowerCase().includes(q);
  });

  const selectedChapterObj = chapters.find((c) => c.id === activeChapter) || chapters[0];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            Standard Operating Procedures & Documentation
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            EXPANCE User Manual & Process Guide
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive operating instructions covering all financial, bike fleet, reporting, and database management workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied Manual!' : 'Copy Manual'}</span>
          </button>
          <button
            onClick={handleDownloadReadme}
            className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Main 2-column Documentation Browser */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Chapters Navigation (4 cols) */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search instructions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-emerald-600 bg-white"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredChapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChapter(c.id)}
                className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer block ${
                  activeChapter === c.id
                    ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-amber-500 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="truncate font-semibold">{c.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{c.summary}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Chapter Detailed Instructions (8 cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {selectedChapterObj.title}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
              Official SOP
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-sans text-xs text-slate-700 leading-relaxed space-y-3">
            <pre className="font-sans whitespace-pre-wrap">{selectedChapterObj.content}</pre>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>EXPANCE Desktop Documentation · 100% Offline Architecture</span>
            <span>Ref: EXP-SOP-V1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
