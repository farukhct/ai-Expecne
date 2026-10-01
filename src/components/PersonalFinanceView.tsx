import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Filter,
  Download,
  Printer,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Account, Category, PersonalTransaction, PersonalTransactionType } from '../types';
import { formatCurrency, formatDate } from '../services/calculations';

interface PersonalFinanceViewProps {
  initialType?: PersonalTransactionType;
  transactions: PersonalTransaction[];
  accounts: Account[];
  categories: Category[];
  currentUser: string;
  onAddTransaction: (tx: Omit<PersonalTransaction, 'id' | 'createdAt'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const PersonalFinanceView: React.FC<PersonalFinanceViewProps> = ({
  initialType = 'EXPENSE',
  transactions,
  accounts,
  categories,
  currentUser,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<PersonalTransactionType>(initialType);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAccount, setSelectedAccount] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDate, setFormDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [formCategory, setFormCategory] = useState<string>('');
  const [formAccount, setFormAccount] = useState<string>('acc_cash');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formPayee, setFormPayee] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formRef, setFormRef] = useState<string>('');

  // Categories matching active tab
  const relevantCategories = useMemo(() => {
    const expectedType = activeTab === 'INCOME' ? 'INCOME' : 'PERSONAL_EXPENSE';
    return categories.filter((c) => c.type === expectedType && c.isActive);
  }, [categories, activeTab]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.type !== activeTab) return false;
      if (selectedCategory !== 'ALL' && tx.categoryId !== selectedCategory) return false;
      if (selectedAccount !== 'ALL' && tx.accountId !== selectedAccount) return false;
      if (dateFrom && tx.date < dateFrom) return false;
      if (dateTo && tx.date > dateTo) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchPayee = tx.payeeOrSource.toLowerCase().includes(query);
        const matchDesc = tx.description.toLowerCase().includes(query);
        const matchCat = tx.categoryName.toLowerCase().includes(query);
        if (!matchPayee && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [transactions, activeTab, selectedCategory, selectedAccount, dateFrom, dateTo, searchTerm]);

  // Summary totals
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount greater than zero.');
      return;
    }

    const catObj = categories.find((c) => c.id === formCategory) || relevantCategories[0];
    const accObj = accounts.find((a) => a.id === formAccount) || accounts[0];

    if (!catObj || !accObj) {
      alert('Please select both a valid category and account.');
      return;
    }

    onAddTransaction({
      date: formDate,
      type: activeTab,
      categoryId: catObj.id,
      categoryName: catObj.name,
      accountId: accObj.id,
      accountName: accObj.name,
      amount: amt,
      payeeOrSource: formPayee || (activeTab === 'INCOME' ? 'Income Source' : 'General Payee'),
      description: formDesc || `${catObj.name} entry`,
      reference: formRef,
      createdBy: currentUser,
    });

    // Reset Form
    setFormAmount('');
    setFormPayee('');
    setFormDesc('');
    setFormRef('');
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['ID,Date,Type,Category,Account,Amount,Payee/Source,Description,Reference'];
    const rows = filteredTransactions.map((t) =>
      `"${t.id}","${t.date}","${t.type}","${t.categoryName}","${t.accountName}",${t.amount},"${t.payeeOrSource}","${t.description}","${t.reference || ''}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EXPANCE_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Tab switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
            Personal Financial Ledger
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            {activeTab === 'EXPENSE' ? 'Personal Expenditure Records' : 'Personal Income & Receipts'}
          </h1>
          <p className="text-xs text-slate-500">
            Manage daily grocery (Bazar), personal allowance, utilities, and employment earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Income / Expense Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveTab('EXPENSE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'EXPENSE'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('INCOME')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'INCOME'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Income
            </button>
          </div>

          {/* Add New Button */}
          <button
            onClick={() => {
              if (relevantCategories.length > 0) setFormCategory(relevantCategories[0].id);
              setIsModalOpen(true);
            }}
            className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add {activeTab === 'INCOME' ? 'Income' : 'Expense'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search payee or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600 bg-white"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600 bg-white text-slate-700"
          >
            <option value="ALL">All Categories</option>
            {relevantCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Account Filter */}
        <div>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600 bg-white text-slate-700"
          >
            <option value="ALL">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({formatCurrency(a.currentBalance)})
              </option>
            ))}
          </select>
        </div>

        {/* Date From & To */}
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 focus:outline-emerald-600"
            title="Date From"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 focus:outline-emerald-600"
            title="Date To"
          />
        </div>

        {/* Export & Reset */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={exportCSV}
            className="px-2.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1 cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-2.5 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1 cursor-pointer"
            title="Print View"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Payee / Source</th>
                <th className="py-2.5 px-3">Account</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                <th className="py-2.5 px-3 text-center no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions match your criteria. Click "+ Add {activeTab === 'INCOME' ? 'Income' : 'Expense'}" to create an entry.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {tx.categoryName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {tx.payeeOrSource}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {tx.accountName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums text-sm ${
                        tx.type === 'INCOME' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-center no-print">
                      <button
                        onClick={() => {
                          if (confirm(`Delete transaction of ${formatCurrency(tx.amount)}?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer with Summary Total */}
            <tfoot>
              <tr className="bg-slate-100/80 border-t-2 border-slate-300 font-bold text-slate-800">
                <td colSpan={5} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">
                  Total Filtered {activeTab === 'INCOME' ? 'Income' : 'Expenditure'} ({filteredTransactions.length} records):
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-mono text-base tabular-nums ${
                    activeTab === 'INCOME' ? 'text-emerald-800' : 'text-rose-800'
                  }`}
                >
                  {formatCurrency(totalAmount)}
                </td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Add New {activeTab === 'INCOME' ? 'Personal Income' : 'Personal Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white text-lg font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Amount (৳ BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600 bg-white"
                >
                  {relevantCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account / Source <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formAccount}
                  onChange={(e) => setFormAccount(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600 bg-white"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type}) — Bal: {formatCurrency(a.currentBalance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payee / Source */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {activeTab === 'INCOME' ? 'Source / Payer' : 'Payee / Vendor'}
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'INCOME' ? 'e.g. Office Salary, Court Fee' : 'e.g. Bazar, Supermarket, Landlord'}
                  value={formPayee}
                  onChange={(e) => setFormPayee(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or bill details..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded shadow-xs cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
