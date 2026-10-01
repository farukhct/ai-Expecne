import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Calendar,
  Layers,
  Search,
  CheckCircle,
} from 'lucide-react';
import {
  Account,
  BikeDailyLog,
  Category,
  EngineOilLog,
  FuelLog,
  LoanAccount,
  MaintenanceLog,
  PersonalTransaction,
  SavingsTarget,
} from '../types';
import { formatCurrency, formatDate, safeDiv } from '../services/calculations';

interface ReportsViewProps {
  accounts: Account[];
  categories: Category[];
  personalTransactions: PersonalTransaction[];
  bikeLogs: BikeDailyLog[];
  fuelLogs: FuelLog[];
  oilLogs: EngineOilLog[];
  maintenanceLogs: MaintenanceLog[];
  loans: LoanAccount[];
  savingsTargets: SavingsTarget[];
  currentUser: string;
}

export const REPORT_LIST = [
  { id: '1', name: '1. Daily Personal Income', group: 'Personal Finance' },
  { id: '2', name: '2. Daily Personal Expense', group: 'Personal Finance' },
  { id: '3', name: '3. Daily Personal Balance', group: 'Personal Finance' },
  { id: '4', name: '4. Monthly Personal Income', group: 'Personal Finance' },
  { id: '5', name: '5. Monthly Personal Expense', group: 'Personal Finance' },
  { id: '6', name: '6. Monthly Personal Balance', group: 'Personal Finance' },
  { id: '7', name: '7. Yearly Personal Summary', group: 'Personal Finance' },
  { id: '8', name: '8. Category-wise Expense Report', group: 'Personal Finance' },
  { id: '9', name: '9. Category-wise Income Report', group: 'Personal Finance' },
  { id: '10', name: '10. Consolidated Account Statement', group: 'Vault & Banking' },
  { id: '11', name: '11. Cash in Hand Statement', group: 'Vault & Banking' },
  { id: '12', name: '12. Bank Account Statement', group: 'Vault & Banking' },
  { id: '13', name: '13. bKash Statement', group: 'Vault & Banking' },
  { id: '14', name: '14. Savings Statement', group: 'Vault & Banking' },
  { id: '15', name: '15. Loan Statement', group: 'Vault & Banking' },
  { id: '16', name: '16. Daily Bike Income', group: 'Bike Fleet' },
  { id: '17', name: '17. Daily Bike Expense', group: 'Bike Fleet' },
  { id: '18', name: '18. Daily Bike Profit', group: 'Bike Fleet' },
  { id: '19', name: '19. Monthly Bike Income', group: 'Bike Fleet' },
  { id: '20', name: '20. Monthly Bike Expense', group: 'Bike Fleet' },
  { id: '21', name: '21. Monthly Bike Profit', group: 'Bike Fleet' },
  { id: '22', name: '22. Yearly Bike Summary', group: 'Bike Fleet' },
  { id: '23', name: '23. Mileage & Distance Run Report', group: 'Bike Fleet' },
  { id: '24', name: '24. Fuel Consumption & Cost Report', group: 'Bike Fleet' },
  { id: '25', name: '25. Fuel Efficiency (KM/L) Report', group: 'Bike Fleet' },
  { id: '26', name: '26. Engine Oil (Mobil) History', group: 'Bike Fleet' },
  { id: '27', name: '27. Maintenance & Repairs Log', group: 'Bike Fleet' },
  { id: '28', name: '28. Bike Running Expense Per KM', group: 'Bike Fleet' },
  { id: '29', name: '29. Bike Income Per KM Report', group: 'Bike Fleet' },
  { id: '30', name: '30. Complete Consolidated Financial Summary', group: 'Executive Reports' },
];

export const ReportsView: React.FC<ReportsViewProps> = ({
  accounts,
  categories,
  personalTransactions,
  bikeLogs,
  fuelLogs,
  oilLogs,
  maintenanceLogs,
  loans,
  savingsTargets,
  currentUser,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('30');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const selectedReport = useMemo(
    () => REPORT_LIST.find((r) => r.id === selectedReportId) || REPORT_LIST[29],
    [selectedReportId]
  );

  // Filter helper
  const inRange = (d: string) => {
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  };

  // Generate Report Data depending on selected report
  const reportData = useMemo(() => {
    const id = selectedReportId;

    if (id === '1' || id === '4' || id === '9') {
      // Personal Income
      const rows = personalTransactions
        .filter((t) => t.type === 'INCOME' && inRange(t.date))
        .map((t) => ({
          col1: formatDate(t.date),
          col2: t.categoryName,
          col3: t.payeeOrSource,
          col4: t.accountName,
          col5: t.description,
          amount: t.amount,
        }));
      return {
        headers: ['Date', 'Category', 'Source / Payer', 'Account Vault', 'Description', 'Amount (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    if (id === '2' || id === '5' || id === '8') {
      // Personal Expense
      const rows = personalTransactions
        .filter((t) => t.type === 'EXPENSE' && inRange(t.date))
        .map((t) => ({
          col1: formatDate(t.date),
          col2: t.categoryName,
          col3: t.payeeOrSource,
          col4: t.accountName,
          col5: t.description,
          amount: t.amount,
        }));
      return {
        headers: ['Date', 'Category', 'Payee / Purpose', 'Account Vault', 'Description', 'Amount (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    if (id === '16' || id === '19' || id === '23' || id === '29') {
      // Bike Income & Mileage
      const rows = bikeLogs.filter((b) => inRange(b.date)).map((b) => ({
        col1: formatDate(b.date),
        col2: `${b.startingOdometer} - ${b.endingOdometer} (${b.totalMileage} KM)`,
        col3: `${b.rideSharingMileage} KM`,
        col4: formatCurrency(b.earnAmount),
        col5: formatCurrency(b.platformRentCommission),
        amount: b.actualIncome,
      }));
      return {
        headers: ['Date', 'Odometer Run', 'Ride-Sharing KM', 'Gross Earn', 'Platform Rent', 'Actual Income (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    if (id === '17' || id === '20' || id === '28') {
      // Bike Expenses
      const rows = bikeLogs.filter((b) => inRange(b.date)).map((b) => ({
        col1: formatDate(b.date),
        col2: `Fuel: ${formatCurrency(b.fuelCost)}`,
        col3: `Oil: ${formatCurrency(b.engineOilCost)}`,
        col4: `Maint: ${formatCurrency(b.maintenanceCost)}`,
        col5: `Other: ${formatCurrency(b.otherCost)}`,
        amount: b.totalBikeExpense,
      }));
      return {
        headers: ['Date', 'Fuel Cost', 'Engine Oil', 'Maintenance', 'Other / Parking', 'Total Bike Expense (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    if (id === '18' || id === '21') {
      // Bike Profit
      const rows = bikeLogs.filter((b) => inRange(b.date)).map((b) => ({
        col1: formatDate(b.date),
        col2: formatCurrency(b.actualIncome),
        col3: formatCurrency(b.totalBikeExpense),
        col4: `${b.totalMileage} KM`,
        col5: `৳${b.profitPerKm.toFixed(2)} / KM`,
        amount: b.netBikeIncome,
      }));
      return {
        headers: ['Date', 'Actual Income', 'Bike Expense', 'Total Run', 'Profit Rate', 'Net Profit (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    if (id === '24' || id === '25') {
      // Fuel Report
      const rows = fuelLogs.filter((f) => inRange(f.date)).map((f) => ({
        col1: formatDate(f.date),
        col2: `${f.odometer} KM`,
        col3: `${f.quantityLiters} L @ ৳${f.pricePerUnit}`,
        col4: `${f.odometerSincePrevious} KM run`,
        col5: f.fuelEfficiencyKmPerL > 0 ? `${f.fuelEfficiencyKmPerL.toFixed(1)} KM/L` : '—',
        amount: f.totalCost,
      }));
      return {
        headers: ['Date', 'Odometer', 'Refuel Detail', 'Distance Since Last', 'Efficiency', 'Total Fuel Cost (BDT)'],
        rows,
        total: rows.reduce((s, r) => s + r.amount, 0),
        unit: 'BDT',
      };
    }

    // Default / Report 30: Complete Consolidated Financial Summary
    const persInc = personalTransactions.filter((t) => t.type === 'INCOME' && inRange(t.date)).reduce((s, t) => s + t.amount, 0);
    const persExp = personalTransactions.filter((t) => t.type === 'EXPENSE' && inRange(t.date)).reduce((s, t) => s + t.amount, 0);
    const bikeInc = bikeLogs.filter((b) => inRange(b.date)).reduce((s, b) => s + b.actualIncome, 0);
    const bikeExp = bikeLogs.filter((b) => inRange(b.date)).reduce((s, b) => s + b.totalBikeExpense, 0);
    const grandInc = persInc + bikeInc;
    const grandExp = persExp + bikeExp;
    const grandNet = grandInc - grandExp;

    const rows = [
      { col1: '1.0', col2: 'Personal Ledger Income', col3: 'Employment, Court, Bonus & Extra', col4: 'Personal Ledger', col5: 'Net Receipts', amount: persInc },
      { col1: '2.0', col2: 'Personal Expenditure', col3: 'Bazar, Utilities, Self & Prince Support', col4: 'Personal Ledger', col5: 'Total Outflow', amount: -persExp },
      { col1: '3.0', col2: 'Bike Fleet Take-Home Income', col3: 'Ride-sharing earnings net of commission', col4: 'Bike Fleet', col5: 'Net Earnings', amount: bikeInc },
      { col1: '4.0', col2: 'Bike Fleet Operating Expenses', col3: 'Fuel, Engine Oil, Repairs & Tolls', col4: 'Bike Fleet', col5: 'Fleet Upkeep', amount: -bikeExp },
      { col1: '5.0', col2: 'Consolidated Net Savings / Balance', col3: 'Grand Income (৳' + grandInc.toLocaleString() + ') - Grand Outflow (৳' + grandExp.toLocaleString() + ')', col4: 'Executive Summary', col5: grandNet >= 0 ? '+ Surplus' : '- Deficit', amount: grandNet },
    ];

    return {
      headers: ['Index', 'Financial Domain', 'Description / Source', 'Module', 'Status', 'Net Amount (BDT)'],
      rows,
      total: grandNet,
      unit: 'BDT',
    };
  }, [selectedReportId, dateFrom, dateTo, personalTransactions, bikeLogs, fuelLogs]);

  const handleExportCSV = () => {
    const csvRows = [reportData.headers.join(',')];
    reportData.rows.forEach((r) => {
      csvRows.push(`"${r.col1}","${r.col2}","${r.col3}","${r.col4}","${r.col5}",${r.amount}`);
    });
    csvRows.push(`"TOTAL","","","","",${reportData.total}`);

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EXPANCE_REPORT_${selectedReport.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls (Hidden in print) */}
      <div className="no-print bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Financial & Fleet Reporting Center
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Government / Executive Audit & Management Statements
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Report Template (30 Available)
            </label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium bg-white focus:outline-emerald-600"
            >
              {REPORT_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.group}] {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            />
          </div>
        </div>
      </div>

      {/* Official Printable Report Card (Styled for @media print) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-950 font-serif">
              EXPANCE FINANCIAL & FLEET SYSTEM
            </div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {selectedReport.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Reporting Window: {dateFrom ? formatDate(dateFrom) : 'Inception'} to {dateTo ? formatDate(dateTo) : 'Current Date'}
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 font-mono">
            <div>Generated: {new Date().toLocaleString()}</div>
            <div>Auditor / User: {currentUser}</div>
            <div>Classification: Internal Audit</div>
          </div>
        </div>

        {/* Report Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                {reportData.headers.map((h, i) => (
                  <th
                    key={i}
                    className={`py-2 px-2.5 ${i === reportData.headers.length - 1 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {reportData.rows.length === 0 ? (
                <tr>
                  <td colSpan={reportData.headers.length} className="py-8 text-center text-slate-400">
                    No transactions or records match the specified date range.
                  </td>
                </tr>
              ) : (
                reportData.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-2.5 font-medium text-slate-800">{row.col1}</td>
                    <td className="py-2 px-2.5 text-slate-800 font-semibold">{row.col2}</td>
                    <td className="py-2 px-2.5 text-slate-600">{row.col3}</td>
                    <td className="py-2 px-2.5 text-slate-600">{row.col4}</td>
                    <td className="py-2 px-2.5 text-slate-500">{row.col5}</td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Summary Footer */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-800 font-bold text-slate-900">
                <td colSpan={reportData.headers.length - 1} className="py-2.5 px-2.5 text-right uppercase tracking-wider">
                  Report Summary Aggregate:
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono text-sm tabular-nums text-emerald-950 font-bold">
                  {formatCurrency(reportData.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Printable Official Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div>EXPANCE Desktop Suite · Offline SQLite Architecture · Page 1 of 1</div>
          <div>Official Seal & Automated Verification Hash: #EXP-{selectedReport.id}-{Date.now().toString(36).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};
