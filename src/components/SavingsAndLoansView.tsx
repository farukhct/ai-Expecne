import React, { useState } from 'react';
import {
  PiggyBank,
  HandCoins,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { LoanAccount, LoanTransaction, SavingsTarget } from '../types';
import { formatCurrency, formatDate } from '../services/calculations';

interface SavingsAndLoansViewProps {
  savingsTargets: SavingsTarget[];
  loans: LoanAccount[];
  loanTransactions: LoanTransaction[];
  onAddLoan: (loan: Omit<LoanAccount, 'id' | 'createdAt'>) => void;
  onRecordLoanRepayment: (loanId: string, amount: number, desc: string) => void;
}

export const SavingsAndLoansView: React.FC<SavingsAndLoansViewProps> = ({
  savingsTargets,
  loans,
  loanTransactions,
  onAddLoan,
  onRecordLoanRepayment,
}) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'loans'>('savings');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [repayDesc, setRepayDesc] = useState<string>('Installment repayment');

  // New Loan Form
  const [loanPerson, setLoanPerson] = useState('');
  const [loanType, setLoanType] = useState<'LOAN_GIVEN' | 'LOAN_RECEIVED'>('LOAN_GIVEN');
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanPhone, setLoanPhone] = useState('');
  const [loanRemarks, setLoanRemarks] = useState('');

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanPerson.trim()) {
      alert('Please enter the person or institution name.');
      return;
    }

    onAddLoan({
      personOrInstitution: loanPerson.trim(),
      type: loanType,
      openingAmount: loanAmount,
      totalRepaid: 0,
      outstandingBalance: loanAmount,
      contactNumber: loanPhone.trim(),
      remarks: loanRemarks.trim(),
    });

    setLoanPerson('');
    setLoanAmount(5000);
    setLoanPhone('');
    setLoanRemarks('');
    setIsLoanModalOpen(false);
  };

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (repayAmount <= 0) {
      alert('Repayment amount must be greater than zero.');
      return;
    }
    onRecordLoanRepayment(selectedLoanId, repayAmount, repayDesc);
    setIsRepayModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-emerald-700" />
            Capital & Obligations
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Savings Commitments & Loan Portfolios
          </h1>
          <p className="text-xs text-slate-500">
            Track family/friend loans (e.g. Prince), repayments, and recurring deposit savings targets.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
          <button
            onClick={() => setActiveTab('savings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'savings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            Savings Targets
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'loans'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HandCoins className="w-3.5 h-3.5" />
            Loan Ledger
          </button>
        </div>
      </div>

      {/* SAVINGS TAB */}
      {activeTab === 'savings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsTargets.map((target) => {
              const remaining = Math.max(0, target.targetAmount - target.currentSaved);
              const percent = Math.min(100, Math.round((target.currentSaved / (target.targetAmount || 1)) * 100));

              return (
                <div
                  key={target.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">{target.title}</h2>
                    <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {percent}% Achieved
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">Target</div>
                      <div className="text-xs font-mono font-bold text-slate-800">
                        {formatCurrency(target.targetAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">Saved</div>
                      <div className="text-xs font-mono font-bold text-emerald-800">
                        {formatCurrency(target.currentSaved)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">Remaining</div>
                      <div className="text-xs font-mono font-bold text-amber-700">
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LOANS TAB */}
      {activeTab === 'loans' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Manage personal loans given to friends/family (e.g. Prince) or borrowed funds.
            </div>
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Loan Account</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Person / Institution</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2 text-right">Principal</th>
                    <th className="py-2.5 px-2 text-right">Total Repaid</th>
                    <th className="py-2.5 px-2 text-right">Outstanding</th>
                    <th className="py-2.5 px-3">Remarks</th>
                    <th className="py-2.5 px-2 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No loan accounts registered.
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {loan.personOrInstitution}
                          {loan.contactNumber && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Ph: {loan.contactNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              loan.type === 'LOAN_GIVEN'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {loan.type === 'LOAN_GIVEN' ? 'Given (Receivable)' : 'Received (Payable)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-800">
                          {formatCurrency(loan.openingAmount)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-700">
                          {formatCurrency(loan.totalRepaid)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-rose-700 tabular-nums">
                          {formatCurrency(loan.outstandingBalance)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate" title={loan.remarks}>
                          {loan.remarks || '—'}
                        </td>
                        <td className="py-2.5 px-2 text-center no-print">
                          {loan.outstandingBalance > 0 ? (
                            <button
                              onClick={() => {
                                setSelectedLoanId(loan.id);
                                setRepayAmount(Math.min(1000, loan.outstandingBalance));
                                setIsRepayModalOpen(true);
                              }}
                              className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Repay
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold text-[10px] flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Settled
                            </span>
                          )}
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

      {/* CREATE LOAN MODAL */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Create Loan Account</h3>
              <button
                onClick={() => setIsLoanModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Person or Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prince, Brother, Bank..."
                  value={loanPerson}
                  onChange={(e) => setLoanPerson(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loan Nature</label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="LOAN_GIVEN">Loan Given (I lent money)</option>
                    <option value="LOAN_RECEIVED">Loan Taken (I borrowed money)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Principal Amount (৳ BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={loanPhone}
                  onChange={(e) => setLoanPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Terms</label>
                <input
                  type="text"
                  placeholder="Repayment agreement or notes..."
                  value={loanRemarks}
                  onChange={(e) => setLoanRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoanModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Create Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD REPAYMENT MODAL */}
      {isRepayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Loan Repayment</h3>
              <button
                onClick={() => setIsRepayModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRepay} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Repayment Amount (৳ BDT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={repayDesc}
                  onChange={(e) => setRepayDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRepayModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
