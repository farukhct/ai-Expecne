import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Tag,
  CheckCircle2,
  XCircle,
  FolderTree,
} from 'lucide-react';
import { Category } from '../types';

interface MasterDataViewProps {
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onToggleCategoryStatus?: (id: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  categories,
  onAddCategory,
}) => {
  const [selectedType, setSelectedType] = useState<Category['type']>('PERSONAL_EXPENSE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    onAddCategory({
      name: name.trim(),
      type: selectedType,
      isDefault: false,
      isActive: true,
      description: description.trim(),
    });

    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            Configuration & Master Classification
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Chart of Accounts & Categories
          </h1>
          <p className="text-xs text-slate-500">
            Configure income streams, personal expense heads (Bazar, Utilities, Prince), and bike operating classifications.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 bg-[#044E36] hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 w-fit">
        {[
          { type: 'PERSONAL_EXPENSE', label: 'Personal Expense Heads' },
          { type: 'INCOME', label: 'Income Heads' },
          { type: 'BIKE_EXPENSE', label: 'Bike Fleet Expense Heads' },
        ].map((tab) => (
          <button
            key={tab.type}
            onClick={() => setSelectedType(tab.type as Category['type'])}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              selectedType === tab.type
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Grid Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Classification Head</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Description / Workbook Equivalent</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCategories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{c.name}</span>
                  {c.isDefault && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      System Default
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-600">
                  {c.type}
                </td>
                <td className="py-2.5 px-3 text-slate-500">
                  {c.description || 'Configured classification category'}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#044E36] text-white px-4 py-3 border-b-2 border-amber-500 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Category Head</h3>
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity Bill, Bike Spare Chain..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Type</label>
                <input
                  type="text"
                  disabled
                  value={selectedType}
                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-slate-100 rounded text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="Additional notes for accounting reference..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
