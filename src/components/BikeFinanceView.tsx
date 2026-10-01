import React, { useState, useMemo } from 'react';
import {
  Bike,
  Gauge,
  Fuel,
  Droplet,
  Wrench,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Account,
  BikeDailyLog,
  EngineOilLog,
  FuelLog,
  MaintenanceLog,
} from '../types';
import {
  computeBikeDailyMetrics,
  computeFuelMetrics,
  formatCurrency,
  formatDate,
  getDayName,
} from '../services/calculations';

interface BikeFinanceViewProps {
  initialSubTab?: 'mileage' | 'fuel' | 'engine_oil' | 'maintenance';
  bikeLogs: BikeDailyLog[];
  fuelLogs: FuelLog[];
  oilLogs: EngineOilLog[];
  maintenanceLogs: MaintenanceLog[];
  accounts: Account[];
  currentUser: string;
  onAddBikeDailyLog: (log: Omit<BikeDailyLog, 'id' | 'createdAt'>) => void;
  onDeleteBikeDailyLog: (id: string) => void;
  onAddFuelLog: (log: Omit<FuelLog, 'id' | 'createdAt'>) => void;
  onDeleteFuelLog: (id: string) => void;
  onAddEngineOilLog: (log: Omit<EngineOilLog, 'id' | 'createdAt'>) => void;
  onDeleteEngineOilLog: (id: string) => void;
  onAddMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'createdAt'>) => void;
  onDeleteMaintenanceLog: (id: string) => void;
}

export const BikeFinanceView: React.FC<BikeFinanceViewProps> = ({
  initialSubTab = 'mileage',
  bikeLogs,
  fuelLogs,
  oilLogs,
  maintenanceLogs,
  accounts,
  currentUser,
  onAddBikeDailyLog,
  onDeleteBikeDailyLog,
  onAddFuelLog,
  onDeleteFuelLog,
  onAddEngineOilLog,
  onDeleteEngineOilLog,
  onAddMaintenanceLog,
  onDeleteMaintenanceLog,
}) => {
  const [subTab, setSubTab] = useState<'mileage' | 'fuel' | 'engine_oil' | 'maintenance'>(initialSubTab);

  // Modals
  const [isMileageModalOpen, setIsMileageModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isOilModalOpen, setIsOilModalOpen] = useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);

  // Mileage Form States
  const todayStr = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const lastOdometer = useMemo(() => {
    if (bikeLogs.length === 0) return 34000;
    return Math.max(...bikeLogs.map((b) => b.endingOdometer));
  }, [bikeLogs]);

  const [mDate, setMDate] = useState(todayStr());
  const [mStartOdo, setMStartOdo] = useState<number>(lastOdometer);
  const [mEndOdo, setMEndOdo] = useState<number>(lastOdometer + 50);
  const [mPrivateKm, setMPrivateKm] = useState<number>(5);
  const [mEarn, setMEarn] = useState<number>(1400);
  const [mRent, setMRent] = useState<number>(200);
  const [mFuelCost, setMFuelCost] = useState<number>(160);
  const [mOilCost, setMOilCost] = useState<number>(0);
  const [mMaintCost, setMMaintCost] = useState<number>(0);
  const [mOtherCost, setMOtherCost] = useState<number>(20);
  const [mAccount, setMAccount] = useState<string>('acc_cash');
  const [mRemarks, setMRemarks] = useState<string>('');

  // Live preview for Mileage Form
  const liveMileageMetrics = useMemo(() => {
    return computeBikeDailyMetrics({
      startingOdometer: mStartOdo,
      endingOdometer: mEndOdo,
      privateMileage: mPrivateKm,
      earnAmount: mEarn,
      platformRentCommission: mRent,
      fuelCost: mFuelCost,
      engineOilCost: mOilCost,
      maintenanceCost: mMaintCost,
      otherCost: mOtherCost,
    });
  }, [mStartOdo, mEndOdo, mPrivateKm, mEarn, mRent, mFuelCost, mOilCost, mMaintCost, mOtherCost]);

  // Fuel Form States
  const [fDate, setFDate] = useState(todayStr());
  const [fOdo, setFOdo] = useState<number>(lastOdometer);
  const [fType, setFType] = useState<string>('Octane');
  const [fQty, setFQty] = useState<number>(4.5);
  const [fRate, setFRate] = useState<number>(130);
  const [fStation, setFStation] = useState<string>('Padma Oil, Mirpur');
  const [fSincePrev, setFSincePrev] = useState<number>(190);
  const [fFullTank, setFFullTank] = useState<boolean>(true);
  const [fAccount, setFAccount] = useState<string>('acc_cash');

  // Oil Form States
  const [oDate, setODate] = useState(todayStr());
  const [oOdo, setOOdo] = useState<number>(lastOdometer);
  const [oBrand, setOBrand] = useState<string>('Motul 7100 10W40');
  const [oCost, setOCost] = useState<number>(1250);
  const [oInterval, setOInterval] = useState<number>(2000);
  const [oAccount, setOAccount] = useState<string>('acc_cash');
  const [oRemarks, setORemarks] = useState<string>('');

  // Maintenance Form States
  const [maintDate, setMaintDate] = useState(todayStr());
  const [maintOdo, setMaintOdo] = useState<number>(lastOdometer);
  const [maintType, setMaintType] = useState<any>('General Service');
  const [maintDesc, setMaintDesc] = useState<string>('Tuning, chain lubrication and wash');
  const [maintParts, setMaintParts] = useState<number>(300);
  const [maintLabor, setMaintLabor] = useState<number>(200);
  const [maintOther, setMaintOther] = useState<number>(0);
  const [maintAccount, setMaintAccount] = useState<string>('acc_cash');

  const handleSaveMileage = (e: React.FormEvent) => {
    e.preventDefault();
    if (mEndOdo < mStartOdo) {
      alert('Ending odometer cannot be less than starting odometer.');
      return;
    }

    onAddBikeDailyLog({
      date: mDate,
      dayName: getDayName(mDate) || 'Workday',
      startingOdometer: mStartOdo,
      endingOdometer: mEndOdo,
      totalMileage: liveMileageMetrics.totalMileage,
      rideSharingMileage: liveMileageMetrics.rideSharingMileage,
      privateMileage: liveMileageMetrics.privateMileage,
      earnAmount: mEarn,
      platformRentCommission: mRent,
      actualIncome: liveMileageMetrics.actualIncome,
      incomeAccountId: mAccount,
      fuelUnits: Math.round((mFuelCost / 130) * 10) / 10,
      fuelCost: mFuelCost,
      engineOilCost: mOilCost,
      maintenanceCost: mMaintCost,
      otherCost: mOtherCost,
      totalBikeExpense: liveMileageMetrics.totalBikeExpense,
      netBikeIncome: liveMileageMetrics.netBikeIncome,
      incomePerKm: liveMileageMetrics.incomePerKm,
      expensePerKm: liveMileageMetrics.expensePerKm,
      profitPerKm: liveMileageMetrics.profitPerKm,
      remarks: mRemarks,
      createdBy: currentUser,
    });

    setIsMileageModalOpen(false);
  };

  const handleSaveFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const metrics = computeFuelMetrics(fQty, fRate, fSincePrev);
    onAddFuelLog({
      date: fDate,
      odometer: fOdo,
      fuelType: fType,
      quantityLiters: fQty,
      pricePerUnit: fRate,
      totalCost: metrics.totalCost,
      station: fStation,
      accountId: fAccount,
      odometerSincePrevious: fSincePrev,
      fuelEfficiencyKmPerL: metrics.fuelEfficiencyKmPerL,
      fuelCostPerKm: metrics.fuelCostPerKm,
      isFullTank: fFullTank,
      createdBy: currentUser,
    });
    setIsFuelModalOpen(false);
  };

  const handleSaveOil = (e: React.FormEvent) => {
    e.preventDefault();
    const nextKm = oOdo + oInterval;
    onAddEngineOilLog({
      date: oDate,
      odometer: oOdo,
      oilBrand: oBrand,
      quantity: 1,
      cost: oCost,
      accountId: oAccount,
      nextChangeKm: nextKm,
      remainingKm: oInterval,
      remarks: oRemarks,
      createdBy: currentUser,
    });
    setIsOilModalOpen(false);
  };

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const total = maintParts + maintLabor + maintOther;
    onAddMaintenanceLog({
      date: maintDate,
      odometer: maintOdo,
      maintenanceType: maintType,
      description: maintDesc,
      partsCost: maintParts,
      laborCost: maintLabor,
      otherCost: maintOther,
      totalCost: total,
      accountId: maintAccount,
      nextMaintenanceKm: maintOdo + 3000,
      createdBy: currentUser,
    });
    setIsMaintModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <Bike className="w-4 h-4 text-emerald-700" />
            Bike Operations & Fleet Management
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Mileage, Ride-Sharing Earnings & Vehicle Upkeep
          </h1>
          <p className="text-xs text-slate-500">
            Based on EXPANCE.xlsm MILEAGE and BIKEDETELS logs with automated KM efficiency analytics.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 overflow-x-auto">
          {[
            { id: 'mileage', label: 'Daily Mileage & Income', icon: Gauge },
            { id: 'fuel', label: 'Fuel Logs', icon: Fuel },
            { id: 'engine_oil', label: 'Engine Oil (Mobil)', icon: Droplet },
            { id: 'maintenance', label: 'Maintenance & Parts', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  subTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: DAILY MILEAGE & RIDE-SHARING INCOME */}
      {subTab === 'mileage' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Daily odometer logs with automatic calculation of total KM, actual income, and profit per KM.
            </div>
            <button
              onClick={() => {
                setMStartOdo(lastOdometer);
                setMEndOdo(lastOdometer + 45);
                setIsMileageModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Daily Mileage</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Date / Day</th>
                    <th className="py-2.5 px-2 text-right">Odometer (Start - End)</th>
                    <th className="py-2.5 px-2 text-right">Total KM</th>
                    <th className="py-2.5 px-2 text-right">Ride KM</th>
                    <th className="py-2.5 px-2 text-right">Gross Earn</th>
                    <th className="py-2.5 px-2 text-right">Rent / Comm</th>
                    <th className="py-2.5 px-2 text-right">Actual Income</th>
                    <th className="py-2.5 px-2 text-right">Bike Exp</th>
                    <th className="py-2.5 px-2 text-right">Net Profit</th>
                    <th className="py-2.5 px-2 text-right">Inc / KM</th>
                    <th className="py-2.5 px-2 text-right">Profit / KM</th>
                    <th className="py-2.5 px-2 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bikeLogs.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-400">
                        No bike mileage entries recorded yet. Click "+ Log Daily Mileage" to begin.
                      </td>
                    </tr>
                  ) : (
                    bikeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{formatDate(log.date)}</span>
                          <span className="text-[10px] text-slate-400 block">{log.dayName}</span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                          {log.startingOdometer} → {log.endingOdometer}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {log.totalMileage}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-600 tabular-nums">
                          {log.rideSharingMileage}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {formatCurrency(log.earnAmount)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-rose-600">
                          {formatCurrency(log.platformRentCommission)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-800 tabular-nums">
                          {formatCurrency(log.actualIncome)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-amber-700" title={`Fuel: ${log.fuelCost}, Oil: ${log.engineOilCost}, Maint: ${log.maintenanceCost}, Other: ${log.otherCost}`}>
                          {formatCurrency(log.totalBikeExpense)}
                        </td>
                        <td
                          className={`py-2.5 px-2 text-right font-mono font-bold tabular-nums ${
                            log.netBikeIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {formatCurrency(log.netBikeIncome)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          ৳{log.incomePerKm.toFixed(2)}
                        </td>
                        <td
                          className={`py-2.5 px-2 text-right font-mono font-semibold tabular-nums ${
                            log.profitPerKm >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          ৳{log.profitPerKm.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center no-print">
                          <button
                            onClick={() => {
                              if (confirm(`Delete mileage record for ${formatDate(log.date)}?`)) {
                                onDeleteBikeDailyLog(log.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FUEL LOGS */}
      {subTab === 'fuel' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Detailed fuel refueling history, cost per liter, and calculated efficiency (KM / Liter).
            </div>
            <button
              onClick={() => setIsFuelModalOpen(true)}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Refuel Log</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-2 text-right">Odometer</th>
                    <th className="py-2.5 px-2">Fuel Type</th>
                    <th className="py-2.5 px-2 text-right">Quantity (L)</th>
                    <th className="py-2.5 px-2 text-right">Price/L</th>
                    <th className="py-2.5 px-2 text-right">Total Cost</th>
                    <th className="py-2.5 px-2 text-right">Distance Run</th>
                    <th className="py-2.5 px-2 text-right">KM / Liter</th>
                    <th className="py-2.5 px-2 text-right">Cost / KM</th>
                    <th className="py-2.5 px-2">Fuel Station</th>
                    <th className="py-2.5 px-2 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fuelLogs.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        No fuel logs recorded. Click "+ Refuel Log" to add an entry.
                      </td>
                    </tr>
                  ) : (
                    fuelLogs.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                          {formatDate(f.date)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {f.odometer} KM
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="font-semibold text-slate-800">{f.fuelType}</span>
                          {f.isFullTank && <span className="text-[10px] text-emerald-600 block">Full Tank</span>}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums font-bold text-slate-800">
                          {f.quantityLiters.toFixed(2)} L
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-600">
                          ৳{f.pricePerUnit}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-rose-700 tabular-nums">
                          {formatCurrency(f.totalCost)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {f.odometerSincePrevious} KM
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-800 tabular-nums">
                          {f.fuelEfficiencyKmPerL > 0 ? `${f.fuelEfficiencyKmPerL.toFixed(1)} km/L` : '—'}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {f.fuelCostPerKm > 0 ? `৳${f.fuelCostPerKm.toFixed(2)}/km` : '—'}
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 truncate max-w-xs" title={f.station}>
                          {f.station || 'Local Station'}
                        </td>
                        <td className="py-2.5 px-2 text-center no-print">
                          <button
                            onClick={() => {
                              if (confirm('Delete this fuel log?')) onDeleteFuelLog(f.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ENGINE OIL (MOBIL) */}
      {subTab === 'engine_oil' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Engine oil change schedule with automated remaining kilometer warning.
            </div>
            <button
              onClick={() => setIsOilModalOpen(true)}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Oil Change</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-2 text-right">Odometer Changed</th>
                    <th className="py-2.5 px-3">Engine Oil Brand</th>
                    <th className="py-2.5 px-2 text-right">Cost</th>
                    <th className="py-2.5 px-2 text-right">Next Change Odo</th>
                    <th className="py-2.5 px-2 text-right">Remaining Life</th>
                    <th className="py-2.5 px-3">Remarks</th>
                    <th className="py-2.5 px-2 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {oilLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No engine oil records found.
                      </td>
                    </tr>
                  ) : (
                    oilLogs.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                          {formatDate(o.date)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {o.odometer} KM
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {o.oilBrand}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-rose-700 tabular-nums">
                          {formatCurrency(o.cost)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {o.nextChangeKm} KM
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums">
                          <span
                            className={
                              o.remainingKm <= 200
                                ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200'
                                : 'text-emerald-700'
                            }
                          >
                            {o.remainingKm} KM {o.remainingKm <= 200 ? '⚠️ DUE' : 'left'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate" title={o.remarks}>
                          {o.remarks || '—'}
                        </td>
                        <td className="py-2.5 px-2 text-center no-print">
                          <button
                            onClick={() => {
                              if (confirm('Delete this oil record?')) onDeleteEngineOilLog(o.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MAINTENANCE & PARTS */}
      {subTab === 'maintenance' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Log periodic general service, wash, brake pads, chain replacement, and labor expenses.
            </div>
            <button
              onClick={() => setIsMaintModalOpen(true)}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Maintenance</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-2 text-right">Odometer</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-2 text-right">Parts Cost</th>
                    <th className="py-2.5 px-2 text-right">Labor Cost</th>
                    <th className="py-2.5 px-2 text-right">Total Cost</th>
                    <th className="py-2.5 px-2 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maintenanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No maintenance entries found. Click "+ Record Maintenance" to log repairs.
                      </td>
                    </tr>
                  ) : (
                    maintenanceLogs.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                          {formatDate(m.date)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {m.odometer} KM
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {m.maintenanceType}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate" title={m.description}>
                          {m.description}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {formatCurrency(m.partsCost)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                          {formatCurrency(m.laborCost)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-rose-700 tabular-nums">
                          {formatCurrency(m.totalCost)}
                        </td>
                        <td className="py-2.5 px-2 text-center no-print">
                          <button
                            onClick={() => {
                              if (confirm('Delete this maintenance record?')) onDeleteMaintenanceLog(m.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD DAILY MILEAGE LOG */}
      {isMileageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Log Daily Bike Mileage & Earnings
              </h3>
              <button
                onClick={() => setIsMileageModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMileage} className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Row 1: Date & Odometers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{getDayName(mDate)}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Starting Odometer (KM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={mStartOdo}
                    onChange={(e) => setMStartOdo(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ending Odometer (KM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={mEndOdo}
                    onChange={(e) => setMEndOdo(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>

              {/* Row 2: Private KM & Earnings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Private / Non-Ride KM
                  </label>
                  <input
                    type="number"
                    value={mPrivateKm}
                    onChange={(e) => setMPrivateKm(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gross Earn Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={mEarn}
                    onChange={(e) => setMEarn(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Platform Commission / Rent (৳)
                  </label>
                  <input
                    type="number"
                    value={mRent}
                    onChange={(e) => setMRent(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-rose-700"
                  />
                </div>
              </div>

              {/* Row 3: Daily Bike Expenses breakdown */}
              <div className="border border-slate-200 bg-slate-50/60 p-3 rounded-md space-y-2">
                <div className="font-semibold text-slate-700 text-xs flex items-center justify-between">
                  <span>Daily Bike Operating Expenses</span>
                  <span className="font-mono text-rose-700 font-bold">
                    Total: {formatCurrency(liveMileageMetrics.totalBikeExpense)}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600">Fuel Cost (৳)</label>
                    <input
                      type="number"
                      value={mFuelCost}
                      onChange={(e) => setMFuelCost(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Oil Cost (৳)</label>
                    <input
                      type="number"
                      value={mOilCost}
                      onChange={(e) => setMOilCost(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Maintenance (৳)</label>
                    <input
                      type="number"
                      value={mMaintCost}
                      onChange={(e) => setMMaintCost(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Parking / Other (৳)</label>
                    <input
                      type="number"
                      value={mOtherCost}
                      onChange={(e) => setMOtherCost(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Real-time KPI Preview Callout */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Total Run</div>
                  <div className="font-mono text-sm font-bold text-emerald-950">
                    {liveMileageMetrics.totalMileage} KM
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Actual Income</div>
                  <div className="font-mono text-sm font-bold text-emerald-800">
                    {formatCurrency(liveMileageMetrics.actualIncome)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Net Profit</div>
                  <div
                    className={`font-mono text-sm font-bold ${
                      liveMileageMetrics.netBikeIncome >= 0 ? 'text-emerald-800' : 'text-rose-700'
                    }`}
                  >
                    {formatCurrency(liveMileageMetrics.netBikeIncome)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Inc / KM</div>
                  <div className="font-mono text-sm font-bold text-emerald-950">
                    ৳{liveMileageMetrics.incomePerKm.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Account and Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Income Credited Account
                  </label>
                  <select
                    value={mAccount}
                    onChange={(e) => setMAccount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Route / Remarks
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Gulshan, Airport trips..."
                    value={mRemarks}
                    onChange={(e) => setMRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMileageModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded shadow-xs cursor-pointer"
                >
                  Save Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FUEL LOG */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Fuel Log</h3>
              <button
                onClick={() => setIsFuelModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFuel} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={fDate}
                    onChange={(e) => setFDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Odometer (KM)</label>
                  <input
                    type="number"
                    required
                    value={fOdo}
                    onChange={(e) => setFOdo(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={fType}
                    onChange={(e) => setFType(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Octane">Octane</option>
                    <option value="Petrol">Petrol</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Liters</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fQty}
                    onChange={(e) => setFQty(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rate/Liter (৳)</label>
                  <input
                    type="number"
                    required
                    value={fRate}
                    onChange={(e) => setFRate(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KM Since Last Fuel</label>
                  <input
                    type="number"
                    value={fSincePrev}
                    onChange={(e) => setFSincePrev(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Station</label>
                  <input
                    type="text"
                    value={fStation}
                    onChange={(e) => setFStation(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fullTankCheck"
                  checked={fFullTank}
                  onChange={(e) => setFFullTank(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <label htmlFor="fullTankCheck" className="text-xs text-slate-700 font-medium">
                  Full Tank (Used for accurate KM/L efficiency benchmark)
                </label>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Save Fuel Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD OIL LOG */}
      {isOilModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Engine Oil (Mobil) Change</h3>
              <button
                onClick={() => setIsOilModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOil} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={oDate}
                    onChange={(e) => setODate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    required
                    value={oOdo}
                    onChange={(e) => setOOdo(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Oil Brand / Grade</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Motul 7100 10W40, Shell Advance Ultra..."
                  value={oBrand}
                  onChange={(e) => setOBrand(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    value={oCost}
                    onChange={(e) => setOCost(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drain Interval (KM)</label>
                  <input
                    type="number"
                    required
                    value={oInterval}
                    onChange={(e) => setOInterval(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Filter changed, drain washer replaced..."
                  value={oRemarks}
                  onChange={(e) => setORemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOilModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Save Oil Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD MAINTENANCE LOG */}
      {isMaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Maintenance / Repair</h3>
              <button
                onClick={() => setIsMaintModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaintenance} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={maintDate}
                    onChange={(e) => setMaintDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    required
                    value={maintOdo}
                    onChange={(e) => setMaintOdo(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maintenance Type</label>
                <select
                  value={maintType}
                  onChange={(e) => setMaintType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="General Service">General Service</option>
                  <option value="Wash">Wash & Polish</option>
                  <option value="Brake">Brake Pad / Shoe</option>
                  <option value="Tire">Tire / Tube Repair</option>
                  <option value="Chain">Chain Sprocket & Lube</option>
                  <option value="Electrical">Electrical / Battery</option>
                  <option value="Parts">Spare Parts Replacement</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other Repairs</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Description</label>
                <textarea
                  rows={2}
                  required
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parts Cost (৳)</label>
                  <input
                    type="number"
                    value={maintParts}
                    onChange={(e) => setMaintParts(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Labor Cost (৳)</label>
                  <input
                    type="number"
                    value={maintLabor}
                    onChange={(e) => setMaintLabor(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Other Cost (৳)</label>
                  <input
                    type="number"
                    value={maintOther}
                    onChange={(e) => setMaintOther(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMaintModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
