import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  CheckCircle,
  HelpCircle,
  Download,
  Copy,
  Check,
  Table,
  LayoutGrid,
} from 'lucide-react';
import { Account, AccountType } from '../types';
import { formatCurrency } from '../services/calculations';

interface AccountsViewProps {
  accounts: Account[];
  onAddAccount: (acc: Omit<Account, 'id' | 'currentBalance'>) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onAddAccount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copied, setCopied] = useState(false);

  const totalOpeningBalance = accounts.reduce((s, a) => s + a.openingBalance, 0);
  const totalCurrentBalance = accounts.reduce((s, a) => s + a.currentBalance, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an account name.');
      return;
    }

    onAddAccount({
      name: name.trim(),
      type,
      accountNumber: accountNumber.trim(),
      openingBalance: Number(openingBalance) || 0,
      isActive: true,
      remarks: remarks.trim(),
    });

    setName('');
    setAccountNumber('');
    setOpeningBalance(0);
    setRemarks('');
    setIsModalOpen(false);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(accounts, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Account ID,Account Name,Account Type,Account Number,Opening Balance (BDT),Current Balance (BDT),Active Status,Remarks'];
    const rows = accounts.map((a) =>
      `"${a.id}","${a.name}","${a.type}","${a.accountNumber || ''}",${a.openingBalance},${a.currentBalance},"${a.isActive ? 'Active' : 'Inactive'}","${a.remarks || ''}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EXPANCE_ACCOUNTS_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAccountIconBg = (type: AccountType) => {
    switch (type) {
      case 'Cash':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Bank':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bKash':
      case 'Nagad':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Credit Card':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Savings':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            Accounts & Liquidity Sources
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Cash, Bank, bKash & Card Vaults
          </h1>
          <p className="text-xs text-slate-500">
            Every transaction automatically credits or debits its respective account balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Data Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyJSON}
            className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Copy Accounts data as JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Export Accounts data to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded text-xs font-mono text-emerald-950 font-bold">
            Total Vault Liquidity: {formatCurrency(totalCurrentBalance)}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Account</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Account Cards Grid */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-emerald-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getAccountIconBg(
                      acc.type
                    )}`}
                  >
                    {acc.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {acc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 mt-2">
                  {acc.name}
                </h2>
                {acc.accountNumber && (
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    A/C: {acc.accountNumber}
                  </div>
                )}
                {acc.remarks && (
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1" title={acc.remarks}>
                    {acc.remarks}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">
                    Current Balance
                  </div>
                  <div
                    className={`text-lg font-bold font-mono tabular-nums ${
                      acc.currentBalance >= 0 ? 'text-emerald-800' : 'text-rose-700'
                    }`}
                  >
                    {formatCurrency(acc.currentBalance)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">
                    Opening Bal
                  </div>
                  <div className="text-xs font-mono text-slate-500 tabular-nums">
                    {formatCurrency(acc.openingBalance)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode 2: Detailed Data Table */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Account ID</th>
                  <th className="py-2.5 px-3">Account Vault Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">A/C Number</th>
                  <th className="py-2.5 px-3 text-right">Opening Balance</th>
                  <th className="py-2.5 px-3 text-right">Current Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Remarks / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {acc.id}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {acc.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getAccountIconBg(acc.type)}`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {acc.accountNumber || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                      {formatCurrency(acc.openingBalance)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums text-sm ${
                        acc.currentBalance >= 0 ? 'text-emerald-800' : 'text-rose-700'
                      }`}
                    >
                      {formatCurrency(acc.currentBalance)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">
                      {acc.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {acc.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={4} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">
                    Total Liquidity Pool ({accounts.length} Accounts):
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                    {formatCurrency(totalOpeningBalance)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-950 font-bold text-sm">
                    {formatCurrency(totalCurrentBalance)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Financial Account / Vault</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Bank Current A/C, bKash Merchant..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AccountType)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Cash">Cash in Hand</option>
                    <option value="Bank">Bank Account</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Savings">Savings / DPS</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Account / Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20501234567"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Opening Balance (৳ BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks / Description
                </label>
                <input
                  type="text"
                  placeholder="Primary branch, routing number or card limit..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
