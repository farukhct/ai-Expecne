import React, { useState } from 'react';
import { PlusCircle, Zap, Bike, Wallet, Fuel, X } from 'lucide-react';
import { Account, Category } from '../types';
import { computeBikeDailyMetrics } from '../services/calculations';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetModule?: string;
  accounts: Account[];
  categories: Category[];
  currentUser: string;
  onSavePersonalTx: (tx: any) => void;
  onSaveBikeLog: (bike: any) => void;
  onSaveFuelLog: (fuel: any) => void;
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({
  isOpen,
  onClose,
  presetModule = 'PERSONAL_EXPENSE',
  accounts,
  categories,
  currentUser,
  onSavePersonalTx,
  onSaveBikeLog,
  onSaveFuelLog,
}) => {
  const [entryType, setEntryType] = useState<string>(presetModule);

  const todayStr = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Common Form
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'acc_cash');
  const [payee, setPayee] = useState('');
  const [desc, setDesc] = useState('');

  // Bike specific
  const [startOdo, setStartOdo] = useState(34600);
  const [endOdo, setEndOdo] = useState(34650);
  const [earn, setEarn] = useState(1300);
  const [fuelCost, setFuelCost] = useState(150);

  // Fuel specific
  const [liters, setLiters] = useState(4.5);
  const [rate, setRate] = useState(130);

  if (!isOpen) return null;

  const relevantCats = categories.filter((c) => {
    if (entryType === 'PERSONAL_INCOME') return c.type === 'INCOME';
    if (entryType === 'PERSONAL_EXPENSE') return c.type === 'PERSONAL_EXPENSE';
    return c.type === 'BIKE_EXPENSE';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entryType === 'PERSONAL_INCOME' || entryType === 'PERSONAL_EXPENSE') {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      const cat = categories.find((c) => c.id === categoryId) || relevantCats[0];
      const acc = accounts.find((a) => a.id === accountId) || accounts[0];

      onSavePersonalTx({
        date,
        type: entryType === 'PERSONAL_INCOME' ? 'INCOME' : 'EXPENSE',
        categoryId: cat.id,
        categoryName: cat.name,
        accountId: acc.id,
        accountName: acc.name,
        amount: amt,
        payeeOrSource: payee || (entryType === 'PERSONAL_INCOME' ? 'Payer' : 'Payee'),
        description: desc || `${cat.name} transaction`,
        createdBy: currentUser,
      });
    } else if (entryType === 'BIKE_DAILY') {
      const metrics = computeBikeDailyMetrics({
        startingOdometer: startOdo,
        endingOdometer: endOdo,
        earnAmount: earn,
        platformRentCommission: Math.round(earn * 0.15),
        fuelCost,
        engineOilCost: 0,
        maintenanceCost: 0,
        otherCost: 20,
      });

      onSaveBikeLog({
        date,
        dayName: 'Workday',
        startingOdometer: startOdo,
        endingOdometer: endOdo,
        totalMileage: metrics.totalMileage,
        rideSharingMileage: metrics.rideSharingMileage,
        privateMileage: metrics.privateMileage,
        earnAmount: earn,
        platformRentCommission: Math.round(earn * 0.15),
        actualIncome: metrics.actualIncome,
        incomeAccountId: accountId,
        fuelUnits: Math.round((fuelCost / 130) * 10) / 10,
        fuelCost,
        engineOilCost: 0,
        maintenanceCost: 0,
        otherCost: 20,
        totalBikeExpense: metrics.totalBikeExpense,
        netBikeIncome: metrics.netBikeIncome,
        incomePerKm: metrics.incomePerKm,
        expensePerKm: metrics.expensePerKm,
        profitPerKm: metrics.profitPerKm,
        remarks: desc || 'Quick entry bike run',
        createdBy: currentUser,
      });
    } else if (entryType === 'FUEL') {
      const total = liters * rate;
      onSaveFuelLog({
        date,
        odometer: endOdo,
        fuelType: 'Octane',
        quantityLiters: liters,
        pricePerUnit: rate,
        totalCost: total,
        station: payee || 'City Refuel Station',
        accountId,
        odometerSincePrevious: 180,
        fuelEfficiencyKmPerL: 42,
        fuelCostPerKm: 3.1,
        isFullTank: true,
        createdBy: currentUser,
      });
    }

    // Reset fields for fast repeated entry
    setAmount('');
    setPayee('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Quick Multi-Entry Terminal (Ctrl + N)</span>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white font-mono cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Module Switcher Buttons */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-1">
          {[
            { id: 'PERSONAL_EXPENSE', label: 'Personal Expense', icon: Wallet },
            { id: 'PERSONAL_INCOME', label: 'Personal Income', icon: PlusCircle },
            { id: 'BIKE_DAILY', label: 'Bike Run', icon: Bike },
            { id: 'FUEL', label: 'Fuel Fill', icon: Fuel },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEntryType(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  entryType === tab.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            {entryType.startsWith('PERSONAL') && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (৳ BDT) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  autoFocus
                />
              </div>
            )}

            {entryType === 'BIKE_DAILY' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gross Earn (৳) *</label>
                <input
                  type="number"
                  required
                  value={earn}
                  onChange={(e) => setEarn(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-emerald-800"
                />
              </div>
            )}

            {entryType === 'FUEL' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fuel Quantity (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={liters}
                  onChange={(e) => setLiters(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                />
              </div>
            )}
          </div>

          {entryType.startsWith('PERSONAL') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Head</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  {relevantCats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Vault</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {entryType === 'BIKE_DAILY' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Odo</label>
                <input
                  type="number"
                  value={startOdo}
                  onChange={(e) => setStartOdo(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Odo</label>
                <input
                  type="number"
                  value={endOdo}
                  onChange={(e) => setEndOdo(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fuel Cost (৳)</label>
                <input
                  type="number"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {entryType.startsWith('PERSONAL') ? 'Payee / Description' : 'Notes / Remarks'}
            </label>
            <input
              type="text"
              placeholder="Context or item details..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">
              Press Enter to save
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded shadow-xs"
              >
                Save & Record
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
