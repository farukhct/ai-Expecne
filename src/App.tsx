/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { DatabaseService } from './services/db';
import {
  Account,
  AppSettings,
  AuditLog,
  BikeDailyLog,
  Category,
  EngineOilLog,
  FuelLog,
  LoanAccount,
  LoanTransaction,
  MaintenanceLog,
  PersonalTransaction,
  SavingsTarget,
  SavingsTransaction,
  User,
} from './types';
import { Header } from './components/Header';
import { NavTab, Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PersonalFinanceView } from './components/PersonalFinanceView';
import { BikeFinanceView } from './components/BikeFinanceView';
import { BikeProfitabilityView } from './components/BikeProfitabilityView';
import { AccountsView } from './components/AccountsView';
import { SavingsAndLoansView } from './components/SavingsAndLoansView';
import { ReportsView } from './components/ReportsView';
import { MasterDataView } from './components/MasterDataView';
import { MigrationView } from './components/MigrationView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { AuditLogsView } from './components/AuditLogsView';
import { DesktopRoadmapView } from './components/DesktopRoadmapView';
import { QuickEntryModal } from './components/QuickEntryModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  // Initialization
  useEffect(() => {
    DatabaseService.initialize();
  }, []);

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User>(() => DatabaseService.getActiveUser());
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(() => DatabaseService.getUsers());
  const [accounts, setAccounts] = useState<Account[]>(() => DatabaseService.getAccounts());
  const [categories, setCategories] = useState<Category[]>(() => DatabaseService.getCategories());
  const [settings, setSettings] = useState<AppSettings>(() => DatabaseService.getSettings());
  const [personalTransactions, setPersonalTransactions] = useState<PersonalTransaction[]>(() => DatabaseService.getPersonalTransactions());
  const [bikeLogs, setBikeLogs] = useState<BikeDailyLog[]>(() => DatabaseService.getBikeLogs());
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => DatabaseService.getFuelLogs());
  const [oilLogs, setOilLogs] = useState<EngineOilLog[]>(() => DatabaseService.getEngineOilLogs());
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => DatabaseService.getMaintenanceLogs());
  const [loans, setLoans] = useState<LoanAccount[]>(() => DatabaseService.getLoans());
  const [loanTransactions, setLoanTransactions] = useState<LoanTransaction[]>(() => DatabaseService.getLoanTransactions());
  const [savingsTargets, setSavingsTargets] = useState<SavingsTarget[]>(() => DatabaseService.getSavingsTargets());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => DatabaseService.getAuditLogs());

  // UI state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  const [quickEntryPreset, setQuickEntryPreset] = useState<string>('PERSONAL_EXPENSE');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync / reload helper
  const reloadData = useCallback(() => {
    setAccounts(DatabaseService.getAccounts());
    setCategories(DatabaseService.getCategories());
    setPersonalTransactions(DatabaseService.getPersonalTransactions());
    setBikeLogs(DatabaseService.getBikeLogs());
    setFuelLogs(DatabaseService.getFuelLogs());
    setOilLogs(DatabaseService.getEngineOilLogs());
    setMaintenanceLogs(DatabaseService.getMaintenanceLogs());
    setLoans(DatabaseService.getLoans());
    setLoanTransactions(DatabaseService.getLoanTransactions());
    setSavingsTargets(DatabaseService.getSavingsTargets());
    setAuditLogs(DatabaseService.getAuditLogs());
    setSettings(DatabaseService.getSettings());
  }, []);

  // Alert count for engine oil (< 200 KM remaining)
  const oilAlertCount = useMemo(() => {
    return oilLogs.filter((o) => o.remainingKm <= 200).length;
  }, [oilLogs]);

  // Global Keyboard Shortcuts (Ctrl+K for search, Ctrl+N for quick entry)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsQuickEntryOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickEntryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Transaction Handlers
  const handleAddPersonalTransaction = (tx: Omit<PersonalTransaction, 'id' | 'createdAt'>) => {
    DatabaseService.addPersonalTransaction(tx);
    reloadData();
  };

  const handleDeletePersonalTransaction = (id: string) => {
    DatabaseService.deletePersonalTransaction(id, currentUser.username);
    reloadData();
  };

  const handleAddBikeDailyLog = (log: Omit<BikeDailyLog, 'id' | 'createdAt'>) => {
    DatabaseService.addBikeDailyLog(log);
    reloadData();
  };

  const handleDeleteBikeDailyLog = (id: string) => {
    DatabaseService.deleteBikeDailyLog(id, currentUser.username);
    reloadData();
  };

  const handleAddFuelLog = (fuel: Omit<FuelLog, 'id' | 'createdAt'>) => {
    DatabaseService.addFuelLog(fuel);
    reloadData();
  };

  const handleDeleteFuelLog = (id: string) => {
    DatabaseService.deleteFuelLog(id, currentUser.username);
    reloadData();
  };

  const handleAddEngineOilLog = (oil: Omit<EngineOilLog, 'id' | 'createdAt'>) => {
    DatabaseService.addEngineOilLog(oil);
    reloadData();
  };

  const handleDeleteEngineOilLog = (id: string) => {
    DatabaseService.deleteEngineOilLog(id, currentUser.username);
    reloadData();
  };

  const handleAddMaintenanceLog = (maint: Omit<MaintenanceLog, 'id' | 'createdAt'>) => {
    DatabaseService.addMaintenanceLog(maint);
    reloadData();
  };

  const handleDeleteMaintenanceLog = (id: string) => {
    DatabaseService.deleteMaintenanceLog(id, currentUser.username);
    reloadData();
  };

  const handleAddAccount = (acc: Omit<Account, 'id' | 'currentBalance'>) => {
    DatabaseService.addAccount(acc);
    reloadData();
  };

  const handleAddCategory = (cat: Omit<Category, 'id'>) => {
    DatabaseService.addCategory(cat);
    reloadData();
  };

  const handleLoadSampleData = () => {
    DatabaseService.loadSampleData();
    reloadData();
  };

  const handleAddLoan = (loan: Omit<LoanAccount, 'id' | 'createdAt'>) => {
    const list = DatabaseService.getLoans();
    const newLoan: LoanAccount = {
      ...loan,
      id: `loan_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newLoan);
    localStorage.setItem('expance_loans_v1', JSON.stringify(list));
    DatabaseService.recordAudit(currentUser.username, 'CREATE', 'LOANS', newLoan.id, `Created loan account for ${loan.personOrInstitution}`);
    reloadData();
  };

  const handleRecordLoanRepayment = (loanId: string, amount: number, desc: string) => {
    const list = DatabaseService.getLoans();
    const target = list.find((l) => l.id === loanId);
    if (!target) return;

    target.totalRepaid += amount;
    target.outstandingBalance = Math.max(0, target.openingAmount - target.totalRepaid);
    localStorage.setItem('expance_loans_v1', JSON.stringify(list));
    DatabaseService.recordAudit(currentUser.username, 'UPDATE', 'LOANS', loanId, `Recorded repayment of ৳${amount} for ${target.personOrInstitution}`);
    reloadData();
  };

  const handleSelectSearchResult = (moduleName: string) => {
    if (moduleName.includes('Personal')) setCurrentTab('personal_expenses');
    else if (moduleName.includes('Bike')) setCurrentTab('bike_mileage');
    else if (moduleName.includes('Fuel')) setCurrentTab('fuel');
    else if (moduleName.includes('Loans')) setCurrentTab('savings_loans');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        settings={settings}
        oilAlertCount={oilAlertCount}
        onOpenQuickEntry={() => {
          setQuickEntryPreset('PERSONAL_EXPENSE');
          setIsQuickEntryOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLogout={() => setIsLocked(true)}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          oilAlertCount={oilAlertCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100">
          {currentTab === 'dashboard' && (
            <DashboardView
              accounts={accounts}
              personalTransactions={personalTransactions}
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              savingsTargets={savingsTargets}
              onOpenQuickEntry={(preset) => {
                if (preset) setQuickEntryPreset(preset);
                setIsQuickEntryOpen(true);
              }}
              onNavigateTab={setCurrentTab}
              onLoadSampleData={handleLoadSampleData}
            />
          )}

          {currentTab === 'personal_expenses' && (
            <PersonalFinanceView
              initialType="EXPENSE"
              transactions={personalTransactions}
              accounts={accounts}
              categories={categories}
              currentUser={currentUser.username}
              onAddTransaction={handleAddPersonalTransaction}
              onDeleteTransaction={handleDeletePersonalTransaction}
            />
          )}

          {currentTab === 'personal_income' && (
            <PersonalFinanceView
              initialType="INCOME"
              transactions={personalTransactions}
              accounts={accounts}
              categories={categories}
              currentUser={currentUser.username}
              onAddTransaction={handleAddPersonalTransaction}
              onDeleteTransaction={handleDeletePersonalTransaction}
            />
          )}

          {currentTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              onAddAccount={handleAddAccount}
            />
          )}

          {currentTab === 'bike_mileage' && (
            <BikeFinanceView
              initialSubTab="mileage"
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
              accounts={accounts}
              currentUser={currentUser.username}
              onAddBikeDailyLog={handleAddBikeDailyLog}
              onDeleteBikeDailyLog={handleDeleteBikeDailyLog}
              onAddFuelLog={handleAddFuelLog}
              onDeleteFuelLog={handleDeleteFuelLog}
              onAddEngineOilLog={handleAddEngineOilLog}
              onDeleteEngineOilLog={handleDeleteEngineOilLog}
              onAddMaintenanceLog={handleAddMaintenanceLog}
              onDeleteMaintenanceLog={handleDeleteMaintenanceLog}
            />
          )}

          {currentTab === 'fuel' && (
            <BikeFinanceView
              initialSubTab="fuel"
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
              accounts={accounts}
              currentUser={currentUser.username}
              onAddBikeDailyLog={handleAddBikeDailyLog}
              onDeleteBikeDailyLog={handleDeleteBikeDailyLog}
              onAddFuelLog={handleAddFuelLog}
              onDeleteFuelLog={handleDeleteFuelLog}
              onAddEngineOilLog={handleAddEngineOilLog}
              onDeleteEngineOilLog={handleDeleteEngineOilLog}
              onAddMaintenanceLog={handleAddMaintenanceLog}
              onDeleteMaintenanceLog={handleDeleteMaintenanceLog}
            />
          )}

          {currentTab === 'engine_oil' && (
            <BikeFinanceView
              initialSubTab="engine_oil"
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
              accounts={accounts}
              currentUser={currentUser.username}
              onAddBikeDailyLog={handleAddBikeDailyLog}
              onDeleteBikeDailyLog={handleDeleteBikeDailyLog}
              onAddFuelLog={handleAddFuelLog}
              onDeleteFuelLog={handleDeleteFuelLog}
              onAddEngineOilLog={handleAddEngineOilLog}
              onDeleteEngineOilLog={handleDeleteEngineOilLog}
              onAddMaintenanceLog={handleAddMaintenanceLog}
              onDeleteMaintenanceLog={handleDeleteMaintenanceLog}
            />
          )}

          {currentTab === 'maintenance' && (
            <BikeFinanceView
              initialSubTab="maintenance"
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
              accounts={accounts}
              currentUser={currentUser.username}
              onAddBikeDailyLog={handleAddBikeDailyLog}
              onDeleteBikeDailyLog={handleDeleteBikeDailyLog}
              onAddFuelLog={handleAddFuelLog}
              onDeleteFuelLog={handleDeleteFuelLog}
              onAddEngineOilLog={handleAddEngineOilLog}
              onDeleteEngineOilLog={handleDeleteEngineOilLog}
              onAddMaintenanceLog={handleAddMaintenanceLog}
              onDeleteMaintenanceLog={handleDeleteMaintenanceLog}
            />
          )}

          {currentTab === 'bike_profitability' && (
            <BikeProfitabilityView
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
            />
          )}

          {currentTab === 'savings_loans' && (
            <SavingsAndLoansView
              savingsTargets={savingsTargets}
              loans={loans}
              loanTransactions={loanTransactions}
              onAddLoan={handleAddLoan}
              onRecordLoanRepayment={handleRecordLoanRepayment}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              accounts={accounts}
              categories={categories}
              personalTransactions={personalTransactions}
              bikeLogs={bikeLogs}
              fuelLogs={fuelLogs}
              oilLogs={oilLogs}
              maintenanceLogs={maintenanceLogs}
              loans={loans}
              savingsTargets={savingsTargets}
              currentUser={currentUser.username}
            />
          )}

          {currentTab === 'migration' && (
            <MigrationView
              currentUser={currentUser.username}
              onRunMigration={handleLoadSampleData}
            />
          )}

          {currentTab === 'master_data' && (
            <MasterDataView
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          )}

          {currentTab === 'backup_restore' && (
            <BackupRestoreView
              currentUser={currentUser}
              onRefreshData={reloadData}
            />
          )}

          {currentTab === 'audit_logs' && (
            <AuditLogsView logs={auditLogs} />
          )}

          {currentTab === 'desktop_architect' && (
            <DesktopRoadmapView />
          )}
        </main>
      </div>

      {/* Quick Multi-Entry Modal */}
      <QuickEntryModal
        isOpen={isQuickEntryOpen}
        onClose={() => setIsQuickEntryOpen(false)}
        presetModule={quickEntryPreset}
        accounts={accounts}
        categories={categories}
        currentUser={currentUser.username}
        onSavePersonalTx={handleAddPersonalTransaction}
        onSaveBikeLog={handleAddBikeDailyLog}
        onSaveFuelLog={handleAddFuelLog}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        personalTransactions={personalTransactions}
        bikeLogs={bikeLogs}
        fuelLogs={fuelLogs}
        loans={loans}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Lock / Authentication Modal */}
      <LoginModal
        isOpen={isLocked}
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLocked(false);
        }}
      />
    </div>
  );
}
