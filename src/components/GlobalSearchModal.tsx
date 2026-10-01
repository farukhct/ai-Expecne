import React, { useState, useMemo } from 'react';
import { Search, X, Tag, ArrowRight, Wallet, Bike, Fuel, PiggyBank } from 'lucide-react';
import { BikeDailyLog, FuelLog, PersonalTransaction, LoanAccount } from '../types';
import { formatCurrency, formatDate } from '../services/calculations';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalTransactions: PersonalTransaction[];
  bikeLogs: BikeDailyLog[];
  fuelLogs: FuelLog[];
  loans: LoanAccount[];
  onSelectResult: (module: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  personalTransactions,
  bikeLogs,
  fuelLogs,
  loans,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: Array<{
      id: string;
      module: string;
      title: string;
      subtitle: string;
      amount?: number;
      date?: string;
      icon: any;
    }> = [];

    // Personal Tx
    personalTransactions.forEach((t) => {
      if (
        t.categoryName.toLowerCase().includes(q) ||
        t.payeeOrSource.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.accountName.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          module: 'Personal Finance',
          title: `${t.type}: ${t.categoryName} (${t.payeeOrSource})`,
          subtitle: `${t.description} · ${t.accountName}`,
          amount: t.amount,
          date: t.date,
          icon: Wallet,
        });
      }
    });

    // Bike Logs
    bikeLogs.forEach((b) => {
      if (
        b.dayName.toLowerCase().includes(q) ||
        (b.remarks && b.remarks.toLowerCase().includes(q)) ||
        b.date.includes(q)
      ) {
        results.push({
          id: b.id,
          module: 'Bike Mileage',
          title: `Bike Run: ${b.totalMileage} KM (${b.dayName})`,
          subtitle: `Gross: ৳${b.earnAmount} · Net: ৳${b.actualIncome} · ${b.remarks || 'Standard run'}`,
          amount: b.netBikeIncome,
          date: b.date,
          icon: Bike,
        });
      }
    });

    // Fuel Logs
    fuelLogs.forEach((f) => {
      if (f.station.toLowerCase().includes(q) || f.fuelType.toLowerCase().includes(q)) {
        results.push({
          id: f.id,
          module: 'Fuel Management',
          title: `Refuel: ${f.quantityLiters}L ${f.fuelType} @ ${f.station}`,
          subtitle: `Odometer: ${f.odometer} KM · Efficiency: ${f.fuelEfficiencyKmPerL} KM/L`,
          amount: -f.totalCost,
          date: f.date,
          icon: Fuel,
        });
      }
    });

    // Loans
    loans.forEach((l) => {
      if (l.personOrInstitution.toLowerCase().includes(q) || (l.remarks && l.remarks.toLowerCase().includes(q))) {
        results.push({
          id: l.id,
          module: 'Loans',
          title: `Loan: ${l.personOrInstitution} (${l.type})`,
          subtitle: `Outstanding: ৳${l.outstandingBalance} · ${l.remarks || ''}`,
          amount: l.outstandingBalance,
          icon: PiggyBank,
        });
      }
    });

    return results.slice(0, 15);
  }, [query, personalTransactions, bikeLogs, fuelLogs, loans]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-800 shrink-0" />
          <input
            type="text"
            placeholder="Search transactions, bike runs, fuel stations, loans (Ctrl + K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-hidden text-sm text-slate-900 placeholder:text-slate-400 font-medium"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-mono text-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords to search across personal transactions, bike mileage, fuel, and loan accounts.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            searchResults.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item.module);
                    onClose();
                  }}
                  className="p-2.5 rounded-md hover:bg-emerald-50/60 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {item.module}
                        </span>
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle} {item.date ? `· ${formatDate(item.date)}` : ''}
                      </div>
                    </div>
                  </div>

                  {item.amount !== undefined && (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        {formatCurrency(item.amount)}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
