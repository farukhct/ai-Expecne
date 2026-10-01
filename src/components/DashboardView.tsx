import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Bike,
  Gauge,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  PlusCircle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Account,
  BikeDailyLog,
  EngineOilLog,
  FuelLog,
  PersonalTransaction,
  SavingsTarget,
} from '../types';
import { formatCurrency, formatDate, safeDiv } from '../services/calculations';

interface DashboardViewProps {
  accounts: Account[];
  personalTransactions: PersonalTransaction[];
  bikeLogs: BikeDailyLog[];
  fuelLogs: FuelLog[];
  oilLogs: EngineOilLog[];
  savingsTargets: SavingsTarget[];
  onOpenQuickEntry: (presetModule?: string) => void;
  onNavigateTab: (tab: any) => void;
  onLoadSampleData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  personalTransactions,
  bikeLogs,
  fuelLogs,
  oilLogs,
  savingsTargets,
  onOpenQuickEntry,
  onNavigateTab,
  onLoadSampleData,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'today' | 'month' | 'year' | 'all'>('month');

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const currentMonthPrefix = useMemo(() => todayStr.substring(0, 7), [todayStr]);
  const currentYearPrefix = useMemo(() => todayStr.substring(0, 4), [todayStr]);

  // Filtered transactions based on period
  const filteredPersonal = useMemo(() => {
    return personalTransactions.filter((tx) => {
      if (periodFilter === 'today') return tx.date === todayStr;
      if (periodFilter === 'month') return tx.date.startsWith(currentMonthPrefix);
      if (periodFilter === 'year') return tx.date.startsWith(currentYearPrefix);
      return true;
    });
  }, [personalTransactions, periodFilter, todayStr, currentMonthPrefix, currentYearPrefix]);

  const filteredBike = useMemo(() => {
    return bikeLogs.filter((b) => {
      if (periodFilter === 'today') return b.date === todayStr;
      if (periodFilter === 'month') return b.date.startsWith(currentMonthPrefix);
      if (periodFilter === 'year') return b.date.startsWith(currentYearPrefix);
      return true;
    });
  }, [bikeLogs, periodFilter, todayStr, currentMonthPrefix, currentYearPrefix]);

  // Calculations for Period
  const periodPersonalIncome = filteredPersonal
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const periodPersonalExpense = filteredPersonal
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const periodBikeIncome = filteredBike.reduce((sum, b) => sum + b.actualIncome, 0);
  const periodBikeExpense = filteredBike.reduce((sum, b) => sum + b.totalBikeExpense, 0);
  const periodBikeProfit = periodBikeIncome - periodBikeExpense;

  const totalPeriodIncome = periodPersonalIncome + periodBikeIncome;
  const totalPeriodExpense = periodPersonalExpense + periodBikeExpense;
  const periodNetBalance = totalPeriodIncome - totalPeriodExpense;

  const periodTotalMileage = filteredBike.reduce((sum, b) => sum + b.totalMileage, 0);
  const periodRideMileage = filteredBike.reduce((sum, b) => sum + b.rideSharingMileage, 0);

  const periodIncomePerKm = safeDiv(periodBikeIncome, periodRideMileage > 0 ? periodRideMileage : periodTotalMileage);
  const periodExpensePerKm = safeDiv(periodBikeExpense, periodTotalMileage);
  const periodProfitPerKm = safeDiv(periodBikeProfit, periodTotalMileage);

  // Account balances
  const cashAcc = accounts.find((a) => a.type === 'Cash');
  const bankAcc = accounts.find((a) => a.type === 'Bank');
  const bkashAcc = accounts.find((a) => a.type === 'bKash');
  const savingsAcc = accounts.find((a) => a.type === 'Savings');

  const totalCash = cashAcc ? cashAcc.currentBalance : 0;
  const totalBank = bankAcc ? bankAcc.currentBalance : 0;
  const totalBkash = bkashAcc ? bkashAcc.currentBalance : 0;
  const totalSavings = savingsTargets.reduce((s, t) => s + t.currentSaved, 0) + (savingsAcc ? savingsAcc.currentBalance : 0);

  // Check engine oil alerts
  const pendingOilAlerts = oilLogs.filter((o) => o.remainingKm <= 200);

  const hasData = personalTransactions.length > 0 || bikeLogs.length > 0;

  return (
    <div className="space-y-5">
      {/* Top Banner & Period Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            Executive Financial & Mileage Summary
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-0.5">
            Finance & Fleet Performance Console
          </h1>
          <p className="text-xs text-slate-500">
            Real-time synchronization across accounts, personal ledger, and bike ridesharing fleet.
          </p>
        </div>

        {/* Period Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 self-start md:self-auto">
          {[
            { id: 'today', label: "Today" },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'all', label: 'All-Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriodFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                periodFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Engine Oil Warning Banner if threshold exceeded */}
      {pendingOilAlerts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Maintenance Alert:</strong> Engine oil change due soon ({pendingOilAlerts[0].oilBrand}, only {pendingOilAlerts[0].remainingKm} KM remaining).
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('engine_oil')}
            className="text-amber-800 font-bold hover:underline ml-4 whitespace-nowrap cursor-pointer"
          >
            View Oil Log →
          </button>
        </div>
      )}

      {/* Primary KPI Grid (14 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* KPI 1: Total Period Income */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-emerald-600 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Total Income
          </div>
          <div className="text-base font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {formatCurrency(totalPeriodIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>Personal: {formatCurrency(periodPersonalIncome)}</span>
          </div>
        </div>

        {/* KPI 2: Total Period Expense */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-rose-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Total Expense
          </div>
          <div className="text-base font-bold text-rose-700 mt-1 font-mono tabular-nums">
            {formatCurrency(totalPeriodExpense)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Personal: {formatCurrency(periodPersonalExpense)}
          </div>
        </div>

        {/* KPI 3: Net Balance */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-emerald-600 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Net Savings / Balance
          </div>
          <div
            className={`text-base font-bold mt-1 font-mono tabular-nums ${
              periodNetBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(periodNetBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {periodNetBalance >= 0 ? '+ Surplus' : '- Deficit'}
          </div>
        </div>

        {/* KPI 4: Bike Actual Income */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-emerald-600 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Bike Net Income
          </div>
          <div className="text-base font-bold text-emerald-800 mt-1 font-mono tabular-nums">
            {formatCurrency(periodBikeIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            After Platform Rent
          </div>
        </div>

        {/* KPI 5: Bike Expenses */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-rose-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Bike Expense
          </div>
          <div className="text-base font-bold text-amber-700 mt-1 font-mono tabular-nums">
            {formatCurrency(periodBikeExpense)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Fuel + Oil + Repairs
          </div>
        </div>

        {/* KPI 6: Bike Profit */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-emerald-600 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Bike Net Profit
          </div>
          <div
            className={`text-base font-bold mt-1 font-mono tabular-nums ${
              periodBikeProfit >= 0 ? 'text-emerald-800' : 'text-rose-700'
            }`}
          >
            {formatCurrency(periodBikeProfit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Margin: {totalPeriodIncome > 0 ? Math.round((periodBikeProfit / (periodBikeIncome || 1)) * 100) : 0}%
          </div>
        </div>

        {/* KPI 7: Total Mileage */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-slate-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Total Mileage
          </div>
          <div className="text-base font-bold text-slate-800 mt-1 font-mono tabular-nums">
            {periodTotalMileage.toLocaleString()} KM
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Ride: {periodRideMileage} KM
          </div>
        </div>

        {/* KPI 8: Income / KM */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-slate-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Income / KM
          </div>
          <div className="text-base font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {formatCurrency(periodIncomePerKm)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Per Ride-Sharing KM
          </div>
        </div>

        {/* KPI 9: Expense / KM */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-slate-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Expense / KM
          </div>
          <div className="text-base font-bold text-amber-700 mt-1 font-mono tabular-nums">
            {formatCurrency(periodExpensePerKm)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Per Total KM Run
          </div>
        </div>

        {/* KPI 10: Profit / KM */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-slate-400 transition-colors">
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Profit / KM
          </div>
          <div
            className={`text-base font-bold mt-1 font-mono tabular-nums ${
              periodProfitPerKm >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(periodProfitPerKm)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Net yield per KM
          </div>
        </div>

        {/* KPI 11: Cash in Hand */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
            Cash in Hand
          </div>
          <div className="text-base font-bold text-emerald-900 mt-1 font-mono tabular-nums">
            {formatCurrency(totalCash)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            Physical Currency
          </div>
        </div>

        {/* KPI 12: Bank Balance */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
            Bank Balance
          </div>
          <div className="text-base font-bold text-blue-900 mt-1 font-mono tabular-nums">
            {formatCurrency(totalBank)}
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">
            Current / Salary Acc
          </div>
        </div>

        {/* KPI 13: bKash Wallet */}
        <div className="bg-pink-50/50 border border-pink-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-pink-800 tracking-wider">
            bKash Wallet
          </div>
          <div className="text-base font-bold text-pink-900 mt-1 font-mono tabular-nums">
            {formatCurrency(totalBkash)}
          </div>
          <div className="text-[11px] text-pink-700 mt-0.5">
            MFS Balance
          </div>
        </div>

        {/* KPI 14: Total Savings */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
            Total Savings
          </div>
          <div className="text-base font-bold text-amber-900 mt-1 font-mono tabular-nums">
            {formatCurrency(totalSavings)}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            DPS & Overhaul Reserve
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>QUICK ACTIONS</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenQuickEntry('PERSONAL_INCOME')}
            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Add Income
          </button>
          <button
            onClick={() => onOpenQuickEntry('PERSONAL_EXPENSE')}
            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Add Expense
          </button>
          <button
            onClick={() => onOpenQuickEntry('BIKE_DAILY')}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Bike className="w-3.5 h-3.5" />
            + Log Bike Run
          </button>
          <button
            onClick={() => onOpenQuickEntry('FUEL')}
            className="px-2.5 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            + Log Fuel
          </button>

          {!hasData && (
            <button
              onClick={onLoadSampleData}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ml-2 animate-pulse"
            >
              <FileText className="w-3.5 h-3.5" />
              Load EXPANCE.xlsm Sample Data
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Recent Activity & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Recent Bike Mileage Logs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Recent Daily Bike / Mileage Entries
              </h2>
              <p className="text-xs text-slate-500">
                Odometer checkpoints, ride-sharing earnings, and per-KM efficiency
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bike_mileage')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Full Mileage Table →
            </button>
          </div>

          {bikeLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Gauge className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No mileage logs recorded yet. Click "Log Bike Run" to add the first day.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 px-2.5">Date</th>
                    <th className="py-2 px-2 text-right">Odometer</th>
                    <th className="py-2 px-2 text-right">Total KM</th>
                    <th className="py-2 px-2 text-right">Ride KM</th>
                    <th className="py-2 px-2 text-right">Actual Inc</th>
                    <th className="py-2 px-2 text-right">Bike Exp</th>
                    <th className="py-2 px-2 text-right">Net Profit</th>
                    <th className="py-2 px-2 text-right">Inc/KM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bikeLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-800 whitespace-nowrap">
                        {formatDate(log.date)}
                        <span className="text-[10px] text-slate-400 block">{log.dayName}</span>
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-600">
                        {log.startingOdometer} - {log.endingOdometer}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-semibold tabular-nums text-slate-800">
                        {log.totalMileage}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-600">
                        {log.rideSharingMileage}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {formatCurrency(log.actualIncome)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-rose-600">
                        {formatCurrency(log.totalBikeExpense)}
                      </td>
                      <td
                        className={`py-2 px-2 text-right font-mono tabular-nums font-bold ${
                          log.netBikeIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {formatCurrency(log.netBikeIncome)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-700">
                        ৳{log.incomePerKm.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Recent Personal Transactions & Accounts (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Recent Personal Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Expenses and non-bike income receipts
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('personal_expenses')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              All Expenses →
            </button>
          </div>

          {personalTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No personal transactions entered yet.
            </div>
          ) : (
            <div className="space-y-2">
              {personalTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          tx.type === 'INCOME'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {tx.categoryName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {tx.payeeOrSource} · {formatDate(tx.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-bold font-mono tabular-nums ${
                        tx.type === 'INCOME' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                      {tx.accountName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
