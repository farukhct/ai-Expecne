import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  FileCode,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { DatabaseService } from '../services/db';
import { User } from '../types';

interface BackupRestoreViewProps {
  currentUser: User;
  onRefreshData: () => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({
  currentUser,
  onRefreshData,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State for Clean Database / Factory Reset
  const [cleanModalType, setCleanModalType] = useState<'clean_operational' | 'factory_reset' | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [modalError, setModalError] = useState('');

  const handleDownloadBackup = () => {
    const json = DatabaseService.exportFullDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EXPANCE_BACKUP_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    DatabaseService.recordAudit(currentUser.username, 'BACKUP', 'SYSTEM', 'MANUAL_BACKUP', 'Created full JSON database backup.');
    setStatusMessage({ type: 'success', text: 'Full database snapshot exported successfully.' });
  };

  const handleDownloadSqlSchema = () => {
    const ddl = DatabaseService.getSqliteSchemaDDL();
    const blob = new Blob([ddl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EXPANCE_SQLITE_SCHEMA.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: 'Normalized SQLite schema (schema.sql) downloaded.' });
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      if (!confirm('Are you sure you want to restore from this backup file? Existing data will be updated.')) {
        return;
      }

      const res = DatabaseService.restoreDatabase(content, currentUser.username);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        onRefreshData();
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  // Triggers the modal with fresh inputs
  const openCleanModal = (type: 'clean_operational' | 'factory_reset') => {
    if (currentUser.role !== 'Administrator') {
      alert('Access restricted: Only users with the Administrator role can execute database purge operations.');
      return;
    }
    setCleanModalType(type);
    setPasswordInput('');
    setConfirmationPhrase('');
    setModalError('');
  };

  // Executes clean / reset after verification
  const handleExecuteClean = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Verification
    if (passwordInput !== currentUser.passwordHash) {
      setModalError('Incorrect administrator password.');
      return;
    }

    // 2. Phrase Verification
    const expectedPhrase = cleanModalType === 'clean_operational' ? 'CONFIRM CLEAR' : 'FACTORY RESET';
    if (confirmationPhrase.trim().toUpperCase() !== expectedPhrase) {
      setModalError(`Please type "${expectedPhrase}" exactly to confirm.`);
      return;
    }

    if (cleanModalType === 'clean_operational') {
      const res = DatabaseService.cleanOperationalData(currentUser.username);
      if (res.success) {
        // Trigger automated safety backup download for user convenience
        if (res.safetyBackup) {
          const blob = new Blob([res.safetyBackup], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `EXPANCE_PRE_CLEAN_SAFETY_BACKUP_${Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        onRefreshData();
        setCleanModalType(null);
        setStatusMessage({
          type: 'success',
          text: 'Database cleaned successfully! Operational logs purged. Master accounts, categories, and settings were preserved. A pre-clean backup was automatically downloaded.',
        });
      } else {
        setModalError(res.message);
      }
    } else if (cleanModalType === 'factory_reset') {
      const res = DatabaseService.factoryReset(currentUser.username);
      if (res.success) {
        if (res.safetyBackup) {
          const blob = new Blob([res.safetyBackup], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `EXPANCE_PRE_FACTORY_RESET_BACKUP_${Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        onRefreshData();
        setCleanModalType(null);
        setStatusMessage({
          type: 'success',
          text: 'Factory reset completed. System restored to initial baseline defaults. Pre-reset safety backup was downloaded.',
        });
      } else {
        setModalError(res.message);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
          <Database className="w-4 h-4 text-emerald-700" />
          Disaster Recovery & Database Portability
        </div>
        <h1 className="text-lg font-bold text-slate-900">
          Database Backup, Clean Database & Restore Center
        </h1>
        <p className="text-xs text-slate-500">
          Manage local SQLite database backups, schema definitions, automated pre-clean safeguards, and administrative data purges.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-md text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main 2-column actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-700" />
            Create Database Backup
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exports a complete, pristine JSON snapshot of all 12 tables including accounts, personal transactions, mileage logs, fuel, maintenance, and settings.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-2 bg-[#044E36] hover:bg-emerald-800 text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database Backup</span>
            </button>
            <button
              onClick={handleDownloadSqlSchema}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-slate-500" />
              <span>Download schema.sql (SQLite DDL)</span>
            </button>
          </div>
        </div>

        {/* Restore Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-600" />
            Restore Database from Snapshot
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Restores application state from a valid backup file. An automated safety backup is stored in localStorage before applying any changes.
          </p>

          <div className="pt-2">
            <label className="inline-block px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded cursor-pointer shadow-xs">
              <input
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />
              <span>Select Backup (.json) File to Restore</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 35: CLEAN DATABASE & FACTORY RESET ZONE */}
      <div className="bg-white border border-rose-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2 text-rose-800 font-mono text-xs uppercase font-bold tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Administrative Maintenance & Clean Database (Section 35)</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Data Purge & Clean Database Controls
          </h2>
          <p className="text-xs text-slate-500">
            Administrators can clear transactional records for a new fiscal period or execute a factory reset. All operations require password verification and automatically generate a pre-clean backup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Clean Database (Clear All Operational Data) */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Clean Database (Clear Operational Ledger)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Purges all daily financial records, bike mileage logs, fuel refills, and maintenance logs.
              </p>

              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="text-slate-700 font-semibold">What is purged:</div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Personal Income & Expense entries
                </div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Daily Bike Mileage & Ride-sharing logs
                </div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Fuel & Engine Oil maintenance logs
                </div>
                <div className="text-slate-700 font-semibold pt-1">What is PRESERVED:</div>
                <div className="text-emerald-700 flex items-center gap-1 font-mono">
                  <span>✓</span> User accounts & Administrator credentials
                </div>
                <div className="text-emerald-700 flex items-center gap-1 font-mono">
                  <span>✓</span> Chart of Categories & Master Accounts
                </div>
                <div className="text-emerald-700 flex items-center gap-1 font-mono">
                  <span>✓</span> Application settings (Currency ৳, Date format)
                </div>
              </div>
            </div>

            <button
              onClick={() => openCleanModal('clean_operational')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clean Operational Database</span>
            </button>
          </div>

          {/* Option B: Factory Reset */}
          <div className="border border-rose-200 rounded-lg p-4 bg-rose-50/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-bold text-rose-950">
                  Factory Reset (Total System Wipe)
                </h3>
              </div>
              <p className="text-xs text-rose-800/80 mt-1.5 leading-relaxed">
                Completely wipes the local SQLite database and restores original factory settings.
              </p>

              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="text-slate-700 font-semibold">Result of Factory Reset:</div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Deletes all transactions, logs and custom categories
                </div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Restores default initial admin (admin / admin123)
                </div>
                <div className="text-rose-700 flex items-center gap-1 font-mono">
                  <span>✕</span> Reinitializes default master accounts with zero balances
                </div>
                <div className="text-emerald-800 font-semibold pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Automatic safety backup saved before reset</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openCleanModal('factory_reset')}
              className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Execute Factory Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION & PASSWORD VERIFICATION MODAL */}
      {cleanModalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-rose-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-rose-500">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">
                  {cleanModalType === 'clean_operational'
                    ? 'Confirm Clean Operational Database'
                    : 'Confirm Factory Reset System Wipe'}
                </h3>
              </div>
              <button
                onClick={() => setCleanModalType(null)}
                className="text-rose-200 hover:text-white font-mono cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteClean} className="p-5 space-y-4 text-xs">
              {/* Warning Notice */}
              <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Critical Warning: Destructive Operation</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {cleanModalType === 'clean_operational'
                    ? 'This action will permanently delete all personal transactions, bike mileage records, fuel entries, and maintenance logs. Categories, accounts, users, and system settings will remain preserved. An automated safety backup file will be created and downloaded immediately.'
                    : 'This action will wipe all data, restore factory accounts, and reset the admin user to default credentials. An automated safety backup will be downloaded before wiping.'}
                </p>
              </div>

              {modalError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs">
                  {modalError}
                </div>
              )}

              {/* Requirement 1: Password Confirmation */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1. Enter Administrator Password to Confirm:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password (e.g. admin123)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded font-mono text-slate-900 focus:outline-rose-600"
                    autoFocus
                  />
                </div>
              </div>

              {/* Requirement 2: Confirmation Phrase */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  2. Type{' '}
                  <span className="font-mono font-bold text-rose-700">
                    "{cleanModalType === 'clean_operational' ? 'CONFIRM CLEAR' : 'FACTORY RESET'}"
                  </span>{' '}
                  to unlock:
                </label>
                <input
                  type="text"
                  required
                  placeholder={cleanModalType === 'clean_operational' ? 'CONFIRM CLEAR' : 'FACTORY RESET'}
                  value={confirmationPhrase}
                  onChange={(e) => setConfirmationPhrase(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-rose-600"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCleanModalType(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {cleanModalType === 'clean_operational' ? 'Purge Operational Data' : 'Execute Factory Reset'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
