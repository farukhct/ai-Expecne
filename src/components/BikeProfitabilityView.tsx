import React, { useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  Fuel,
  Wrench,
  Gauge,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BikeDailyLog, FuelLog, EngineOilLog, MaintenanceLog } from '../types';
import { formatCurrency, safeDiv, formatDate } from '../services/calculations';

interface BikeProfitabilityViewProps {
  bikeLogs: BikeDailyLog[];
  fuelLogs: FuelLog[];
  oilLogs: EngineOilLog[];
  maintenanceLogs: MaintenanceLog[];
}

export const BikeProfitabilityView: React.FC<BikeProfitabilityViewProps> = ({
  bikeLogs,
  fuelLogs,
  oilLogs,
  maintenanceLogs,
}) => {
  // Aggregate calculations
  const totalEarnGross = useMemo(() => bikeLogs.reduce((s, b) => s + b.earnAmount, 0), [bikeLogs]);
  const totalCommission = useMemo(() => bikeLogs.reduce((s, b) => s + b.platformRentCommission, 0), [bikeLogs]);
  const totalActualIncome = useMemo(() => bikeLogs.reduce((s, b) => s + b.actualIncome, 0), [bikeLogs]);

  const totalFuelCost = useMemo(() => bikeLogs.reduce((s, b) => s + b.fuelCost, 0), [bikeLogs]);
  const totalOilCost = useMemo(() => bikeLogs.reduce((s, b) => s + b.engineOilCost, 0), [bikeLogs]);
  const totalMaintCost = useMemo(() => bikeLogs.reduce((s, b) => s + b.maintenanceCost, 0), [bikeLogs]);
  const totalOtherCost = useMemo(() => bikeLogs.reduce((s, b) => s + b.otherCost, 0), [bikeLogs]);

  const totalBikeExpense = totalFuelCost + totalOilCost + totalMaintCost + totalOtherCost;
  const netBikeIncome = totalActualIncome - totalBikeExpense;

  const totalMileage = useMemo(() => bikeLogs.reduce((s, b) => s + b.totalMileage, 0), [bikeLogs]);
  const totalRideMileage = useMemo(() => bikeLogs.reduce((s, b) => s + b.rideSharingMileage, 0), [bikeLogs]);
  const totalPrivateMileage = useMemo(() => bikeLogs.reduce((s, b) => s + b.privateMileage, 0), [bikeLogs]);

  const avgIncomePerKm = safeDiv(totalActualIncome, totalRideMileage > 0 ? totalRideMileage : totalMileage);
  const avgExpensePerKm = safeDiv(totalBikeExpense, totalMileage);
  const avgProfitPerKm = safeDiv(netBikeIncome, totalMileage);

  const daysWorked = bikeLogs.length;
  const avgDailyIncome = safeDiv(totalActualIncome, daysWorked);
  const avgDailyExpense = safeDiv(totalBikeExpense, daysWorked);
  const avgDailyProfit = safeDiv(netBikeIncome, daysWorked);
  const avgDailyKm = safeDiv(totalMileage, daysWorked);

  // Extrema
  const extrema = useMemo(() => {
    if (bikeLogs.length === 0) return null;

    let highestEarn = bikeLogs[0];
    let lowestEarn = bikeLogs[0];
    let highestExp = bikeLogs[0];
    let bestIncPerKm = bikeLogs[0];
    let worstIncPerKm = bikeLogs[0];

    bikeLogs.forEach((b) => {
      if (b.actualIncome > highestEarn.actualIncome) highestEarn = b;
      if (b.actualIncome < lowestEarn.actualIncome) lowestEarn = b;
      if (b.totalBikeExpense > highestExp.totalBikeExpense) highestExp = b;
      if (b.incomePerKm > bestIncPerKm.incomePerKm) bestIncPerKm = b;
      if (b.incomePerKm < worstIncPerKm.incomePerKm) worstIncPerKm = b;
    });

    return {
      highestEarn,
      lowestEarn,
      highestExp,
      bestIncPerKm,
      worstIncPerKm,
    };
  }, [bikeLogs]);

  // Fuel efficiency extrema
  const fuelExtrema = useMemo(() => {
    const valid = fuelLogs.filter((f) => f.fuelEfficiencyKmPerL > 0);
    if (valid.length === 0) return null;
    let best = valid[0];
    let worst = valid[0];
    valid.forEach((f) => {
      if (f.fuelEfficiencyKmPerL > best.fuelEfficiencyKmPerL) best = f;
      if (f.fuelEfficiencyKmPerL < worst.fuelEfficiencyKmPerL) worst = f;
    });
    return { best, worst };
  }, [fuelLogs]);

  // Monthly 26-working-day projection
  const projectedMonthlyRun = Math.round(avgDailyKm * 26);
  const projectedMonthlyIncome = Math.round(avgDailyIncome * 26);
  const projectedMonthlyExpense = Math.round(avgDailyExpense * 26);
  const projectedMonthlyProfit = projectedMonthlyIncome - projectedMonthlyExpense;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            BIKEDETELS Profitability & Fleet Intelligence
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Bike Commercial Performance Analysis
          </h1>
          <p className="text-xs text-slate-500">
            Directly derived from EXPANCE.xlsm BIKEDETELS sheet with mathematical projections and statistical extrema.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded text-xs text-emerald-900 font-mono">
          <strong>Operating Days Logged:</strong> {daysWorked} Days
        </div>
      </div>

      {/* Primary KPI Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-500">Gross Ride Earnings</div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-1">
            {formatCurrency(totalEarnGross)}
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5">
            - {formatCurrency(totalCommission)} Platform Commission
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-500">Net Take-Home Income</div>
          <div className="text-lg font-bold text-emerald-800 font-mono mt-1">
            {formatCurrency(totalActualIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Daily Average: {formatCurrency(avgDailyIncome)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-500">Total Operating Expenses</div>
          <div className="text-lg font-bold text-rose-700 font-mono mt-1">
            {formatCurrency(totalBikeExpense)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Fuel ({formatCurrency(totalFuelCost)}) + Maintenance
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-500">Net Bike Profit</div>
          <div
            className={`text-lg font-bold font-mono mt-1 ${
              netBikeIncome >= 0 ? 'text-emerald-800' : 'text-rose-700'
            }`}
          >
            {formatCurrency(netBikeIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Margin: {totalActualIncome > 0 ? Math.round((netBikeIncome / totalActualIncome) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Unit Economics: Per KM Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-emerald-700" />
          Unit Economics (Per Kilometer Performance)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <div className="text-[10px] font-bold uppercase text-slate-500">Total Distance Run</div>
            <div className="text-base font-bold font-mono text-slate-800 mt-1">
              {totalMileage.toLocaleString()} KM
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ride: {totalRideMileage} KM · Priv: {totalPrivateMileage} KM
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <div className="text-[10px] font-bold uppercase text-slate-500">Income / Ride KM</div>
            <div className="text-base font-bold font-mono text-emerald-700 mt-1">
              ৳{avgIncomePerKm.toFixed(2)} / KM
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Commercial fare yield</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <div className="text-[10px] font-bold uppercase text-slate-500">Running Cost / KM</div>
            <div className="text-base font-bold font-mono text-amber-700 mt-1">
              ৳{avgExpensePerKm.toFixed(2)} / KM
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Fuel + Oil + Maintenance</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <div className="text-[10px] font-bold uppercase text-slate-500">Net Profit / KM</div>
            <div
              className={`text-base font-bold font-mono mt-1 ${
                avgProfitPerKm >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              ৳{avgProfitPerKm.toFixed(2)} / KM
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Net retention per kilometer</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Extrema Matrix & Monthly Projection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Extrema Highlights */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            Statistical Extrema (Highs & Lows)
          </h2>

          {extrema ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-50/60 border border-emerald-100">
                <div>
                  <span className="font-semibold text-emerald-950">Highest Earning Day</span>
                  <div className="text-[10px] text-slate-500">
                    {formatDate(extrema.highestEarn.date)} ({extrema.highestEarn.dayName}) · {extrema.highestEarn.totalMileage} KM
                  </div>
                </div>
                <div className="font-mono font-bold text-emerald-800 text-sm">
                  {formatCurrency(extrema.highestEarn.actualIncome)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-800">Lowest Earning Day</span>
                  <div className="text-[10px] text-slate-500">
                    {formatDate(extrema.lowestEarn.date)} ({extrema.lowestEarn.dayName})
                  </div>
                </div>
                <div className="font-mono font-semibold text-slate-700 text-sm">
                  {formatCurrency(extrema.lowestEarn.actualIncome)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-rose-50/60 border border-rose-100">
                <div>
                  <span className="font-semibold text-rose-950">Highest Expense Day</span>
                  <div className="text-[10px] text-slate-500">
                    {formatDate(extrema.highestExp.date)} (Repairs / Fuel)
                  </div>
                </div>
                <div className="font-mono font-bold text-rose-700 text-sm">
                  {formatCurrency(extrema.highestExp.totalBikeExpense)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-amber-50/60 border border-amber-100">
                <div>
                  <span className="font-semibold text-amber-950">Peak Fare Efficiency</span>
                  <div className="text-[10px] text-slate-500">
                    Best yield per ride KM on {formatDate(extrema.bestIncPerKm.date)}
                  </div>
                </div>
                <div className="font-mono font-bold text-amber-800 text-sm">
                  ৳{extrema.bestIncPerKm.incomePerKm.toFixed(2)} / KM
                </div>
              </div>

              {fuelExtrema && (
                <div className="flex items-center justify-between p-2 rounded bg-blue-50/60 border border-blue-100">
                  <div>
                    <span className="font-semibold text-blue-950">Peak Fuel Mileage</span>
                    <div className="text-[10px] text-slate-500">
                      Tested on {formatDate(fuelExtrema.best.date)} ({fuelExtrema.best.fuelType})
                    </div>
                  </div>
                  <div className="font-mono font-bold text-blue-800 text-sm">
                    {fuelExtrema.best.fuelEfficiencyKmPerL.toFixed(1)} KM / L
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs">
              Record at least one bike entry to view extrema.
            </div>
          )}
        </div>

        {/* Right: Working Day Projections (From BIKEDETELS sheet) */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-700" />
            26-Day Commercial Workday Projections
          </h2>
          <p className="text-xs text-slate-500">
            Forecasting standard monthly performance based on logged averages.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50">
              <span className="text-slate-600">Daily Average Run</span>
              <span className="font-mono font-bold text-slate-800">
                {avgDailyKm.toFixed(1)} KM / Day
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50">
              <span className="text-slate-600">Projected Monthly Distance (26 Days)</span>
              <span className="font-mono font-bold text-slate-800">
                {projectedMonthlyRun.toLocaleString()} KM
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-emerald-100 bg-emerald-50/50">
              <span className="text-emerald-900 font-medium">Projected Monthly Take-Home</span>
              <span className="font-mono font-bold text-emerald-800">
                {formatCurrency(projectedMonthlyIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-rose-100 bg-rose-50/50">
              <span className="text-rose-900 font-medium">Projected Monthly Bike Cost</span>
              <span className="font-mono font-bold text-rose-700">
                {formatCurrency(projectedMonthlyExpense)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-emerald-200 bg-emerald-100/50">
              <span className="text-emerald-950 font-bold">Estimated Monthly Net Bike Profit</span>
              <span className="font-mono font-bold text-emerald-950 text-sm">
                {formatCurrency(projectedMonthlyProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
