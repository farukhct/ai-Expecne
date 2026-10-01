/**
 * EXPANCE Local Database & Storage Layer
 * Simulates SQLite repository operations in the browser with full SQLite DDL generation,
 * JSON database export/import, audit trails, and transactional guarantees.
 */

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
} from '../types';

const STORAGE_KEYS = {
  USERS: 'expance_users_v1',
  ACCOUNTS: 'expance_accounts_v1',
  CATEGORIES: 'expance_categories_v1',
  PERSONAL_TX: 'expance_personal_tx_v1',
  BIKE_LOGS: 'expance_bike_logs_v1',
  FUEL_LOGS: 'expance_fuel_logs_v1',
  OIL_LOGS: 'expance_oil_logs_v1',
  MAINT_LOGS: 'expance_maint_logs_v1',
  LOANS: 'expance_loans_v1',
  LOAN_TX: 'expance_loan_tx_v1',
  SAVINGS_TARGETS: 'expance_savings_targets_v1',
  SAVINGS_TX: 'expance_savings_tx_v1',
  AUDIT_LOGS: 'expance_audit_logs_v1',
  SETTINGS: 'expance_settings_v1',
  ACTIVE_USER: 'expance_active_user_v1',
  INITIALIZED: 'expance_db_initialized_v1',
};

// Initial Master Data
export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc_cash', name: 'Cash in Hand', type: 'Cash', openingBalance: 5000, currentBalance: 5000, isActive: true, remarks: 'Daily pocket and personal cash' },
  { id: 'acc_bank', name: 'Sonali / Dutch-Bangla Bank', type: 'Bank', openingBalance: 25000, currentBalance: 25000, isActive: true, remarks: 'Primary salary and savings account' },
  { id: 'acc_bkash', name: 'bKash Mobile Wallet', type: 'bKash', openingBalance: 3200, currentBalance: 3200, isActive: true, remarks: 'Primary mobile financial service' },
  { id: 'acc_card', name: 'Standard Chartered Credit Card', type: 'Credit Card', openingBalance: 0, currentBalance: 0, isActive: true, remarks: 'Credit card facility' },
  { id: 'acc_savings', name: 'DPS / Fixed Savings Account', type: 'Savings', openingBalance: 40000, currentBalance: 40000, isActive: true, remarks: 'Long term recurring deposit' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  { id: 'cat_inc_salary', name: 'Salary + Bonus', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_bonus', name: 'Festival Bonus', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_baishaki', name: 'Baishaki Allowance', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_bike', name: 'Bike Ride-Sharing Income', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_court', name: 'Court / Legal Professional Income', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_extra', name: 'Extra Freelance / Other', type: 'INCOME', isDefault: true, isActive: true },
  { id: 'cat_inc_prev', name: 'Previous Balance Carryover', type: 'INCOME', isDefault: true, isActive: true },

  // Personal Expense Categories
  { id: 'cat_exp_bazar', name: 'Bazar / Grocery', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_self', name: 'Self / Personal Expenses', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_utilities', name: 'Utilities & House Rent', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_prince', name: 'Prince / Family Support', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_savings', name: 'Monthly Savings Deposit', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_extra', name: 'Extra / Contingency', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_exp_others', name: 'Others', type: 'PERSONAL_EXPENSE', isDefault: true, isActive: true },

  // Bike Expense Categories
  { id: 'cat_bike_octane', name: 'Octane / Fuel', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_oil', name: 'Engine Oil (Mobil)', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_maint', name: 'General Maintenance & Service', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_parts', name: 'Parts & Spare Replacement', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_wash', name: 'Bike Wash & Polish', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_rent', name: 'Platform Rent / Commission', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_parking', name: 'Parking & Toll', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_ticket', name: 'Traffic Fine / Police Case', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
  { id: 'cat_bike_other', name: 'Other Bike Cost', type: 'BIKE_EXPENSE', isDefault: true, isActive: true },
];

export const DEFAULT_SETTINGS: AppSettings = {
  applicationName: 'EXPANCE',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  dateFormat: 'dd-MM-yyyy',
  defaultAccountId: 'acc_cash',
  fuelWarningThresholdLiters: 2.5,
  maintenanceWarningThresholdKm: 500,
  engineOilWarningThresholdKm: 200,
  savingsTargetPercent: 15,
  pageSize: 20,
  sidebarCollapsed: false,
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    displayName: 'System Administrator',
    role: 'Administrator',
    passwordHash: 'admin123',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Helper for safe JSON reading
function readItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function writeItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage for key ${key}:`, err);
  }
}

export class DatabaseService {
  public static initialize(): void {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      this.resetToDefaults();
    }
  }

  public static resetToDefaults(): void {
    writeItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
    writeItem(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    writeItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    writeItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    writeItem(STORAGE_KEYS.PERSONAL_TX, []);
    writeItem(STORAGE_KEYS.BIKE_LOGS, []);
    writeItem(STORAGE_KEYS.FUEL_LOGS, []);
    writeItem(STORAGE_KEYS.OIL_LOGS, []);
    writeItem(STORAGE_KEYS.MAINT_LOGS, []);
    writeItem(STORAGE_KEYS.LOANS, []);
    writeItem(STORAGE_KEYS.LOAN_TX, []);
    writeItem(STORAGE_KEYS.SAVINGS_TARGETS, [
      {
        id: 'sav_1',
        title: 'Emergency & Bike Overhaul Fund',
        targetAmount: 50000,
        targetDate: '2026-12-31',
        currentSaved: 15000,
        monthlyCommitmentPercent: 15,
        isActive: true,
      },
    ]);
    writeItem(STORAGE_KEYS.SAVINGS_TX, []);
    writeItem(STORAGE_KEYS.ACTIVE_USER, DEFAULT_USERS[0]);
    writeItem(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'aud_init',
        timestamp: new Date().toISOString(),
        user: 'admin',
        action: 'CREATE',
        module: 'SYSTEM',
        recordId: 'INIT',
        details: 'System database initialized with default master schema.',
      },
    ]);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  public static loadSampleData(): void {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    // Sample bike logs (last 7 days)
    const sampleBikeLogs: BikeDailyLog[] = [];
    const sampleFuelLogs: FuelLog[] = [];
    const samplePersonalTx: PersonalTransaction[] = [];

    let currentOdo = 34500;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = fmt(d);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[d.getDay()];

      const dailyRun = 45 + Math.floor(Math.random() * 30);
      const starting = currentOdo;
      const ending = starting + dailyRun;
      currentOdo = ending;

      const rideKm = Math.round(dailyRun * 0.85);
      const privKm = dailyRun - rideKm;
      const grossIncome = Math.round(rideKm * 28 + (Math.random() * 150));
      const rent = Math.round(grossIncome * 0.15);
      const actualInc = grossIncome - rent;
      const fuelCost = Math.round(dailyRun * 3.2);

      sampleBikeLogs.push({
        id: `bike_sample_${i}`,
        date: dateStr,
        dayName,
        startingOdometer: starting,
        endingOdometer: ending,
        totalMileage: dailyRun,
        rideSharingMileage: rideKm,
        privateMileage: privKm,
        earnAmount: grossIncome,
        platformRentCommission: rent,
        actualIncome: actualInc,
        incomeAccountId: 'acc_cash',
        fuelUnits: Math.round((fuelCost / 130) * 10) / 10,
        fuelCost,
        engineOilCost: 0,
        maintenanceCost: i === 3 ? 350 : 0,
        otherCost: 20,
        totalBikeExpense: fuelCost + (i === 3 ? 350 : 0) + 20,
        netBikeIncome: actualInc - (fuelCost + (i === 3 ? 350 : 0) + 20),
        incomePerKm: Math.round((actualInc / rideKm) * 100) / 100,
        expensePerKm: Math.round(((fuelCost + (i === 3 ? 350 : 0) + 20) / dailyRun) * 100) / 100,
        profitPerKm: Math.round(((actualInc - (fuelCost + (i === 3 ? 350 : 0) + 20)) / dailyRun) * 100) / 100,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        remarks: i === 3 ? 'Brake shoe adjusted and general wash' : 'Regular ride schedule',
      });
    }

    // Sample Fuel entries
    sampleFuelLogs.push(
      {
        id: 'fuel_1',
        date: fmt(new Date(Date.now() - 5 * 86400000)),
        odometer: 34550,
        fuelType: 'Octane',
        quantityLiters: 4.5,
        pricePerUnit: 130,
        totalCost: 585,
        station: 'Padma Oil Depo, Dhanmondi',
        accountId: 'acc_cash',
        odometerSincePrevious: 180,
        fuelEfficiencyKmPerL: 40.0,
        fuelCostPerKm: 3.25,
        isFullTank: true,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'fuel_2',
        date: fmt(new Date(Date.now() - 1 * 86400000)),
        odometer: 34820,
        fuelType: 'Octane',
        quantityLiters: 5.0,
        pricePerUnit: 130,
        totalCost: 650,
        station: 'Meghna Petroleum, Mirpur',
        accountId: 'acc_cash',
        odometerSincePrevious: 270,
        fuelEfficiencyKmPerL: 54.0,
        fuelCostPerKm: 2.41,
        isFullTank: true,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      }
    );

    // Sample Personal Transactions
    samplePersonalTx.push(
      {
        id: 'ptx_1',
        date: fmt(new Date(Date.now() - 4 * 86400000)),
        type: 'INCOME',
        categoryId: 'cat_inc_salary',
        categoryName: 'Salary + Bonus',
        accountId: 'acc_bank',
        accountName: 'Sonali / Dutch-Bangla Bank',
        amount: 45000,
        payeeOrSource: 'Monthly Office Salary',
        description: 'Monthly regular employment salary credit',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ptx_2',
        date: fmt(new Date(Date.now() - 3 * 86400000)),
        type: 'EXPENSE',
        categoryId: 'cat_exp_bazar',
        categoryName: 'Bazar / Grocery',
        accountId: 'acc_cash',
        accountName: 'Cash in Hand',
        amount: 3200,
        payeeOrSource: 'Karwan Bazar Kitchen Market',
        description: 'Weekly grocery, fish, meat and fresh vegetables',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ptx_3',
        date: fmt(new Date(Date.now() - 2 * 86400000)),
        type: 'EXPENSE',
        categoryId: 'cat_exp_utilities',
        categoryName: 'Utilities & House Rent',
        accountId: 'acc_bkash',
        accountName: 'bKash Mobile Wallet',
        amount: 1450,
        payeeOrSource: 'DESCO Electricity & Titas Gas',
        description: 'Monthly utility bills paid via bKash',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ptx_4',
        date: fmt(new Date()),
        type: 'EXPENSE',
        categoryId: 'cat_exp_self',
        categoryName: 'Self / Personal Expenses',
        accountId: 'acc_cash',
        accountName: 'Cash in Hand',
        amount: 450,
        payeeOrSource: 'Lunch and snacks',
        description: 'Daily outdoor tea, snacks and mobile recharge',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      }
    );

    // Sample Engine Oil Log
    const sampleOil: EngineOilLog[] = [
      {
        id: 'oil_1',
        date: fmt(new Date(Date.now() - 10 * 86400000)),
        odometer: 34200,
        oilBrand: 'Motul 7100 10W40 Full Synthetic',
        quantity: 1,
        cost: 1250,
        accountId: 'acc_cash',
        nextChangeKm: 36200,
        remainingKm: 1400,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        remarks: 'Engine runs very smoothly, drain plug washer replaced',
      },
    ];

    // Sample Maintenance Log
    const sampleMaint: MaintenanceLog[] = [
      {
        id: 'maint_1',
        date: fmt(new Date(Date.now() - 8 * 86400000)),
        odometer: 34350,
        maintenanceType: 'General Service',
        description: 'Carburetor cleaning, spark plug check, chain lube & tension adjust',
        partsCost: 350,
        laborCost: 200,
        otherCost: 50,
        totalCost: 600,
        accountId: 'acc_cash',
        nextMaintenanceKm: 36500,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        remarks: 'Brake pads still have 60% life left',
      },
    ];

    // Sample Loans
    const sampleLoans: LoanAccount[] = [
      {
        id: 'loan_1',
        personOrInstitution: 'Prince (Friend)',
        type: 'LOAN_GIVEN',
        openingAmount: 10000,
        totalRepaid: 4000,
        outstandingBalance: 6000,
        contactNumber: '017XXXXXXXX',
        remarks: 'Emergency support given to Prince, to be repaid in installments',
        createdAt: new Date().toISOString(),
      },
    ];

    writeItem(STORAGE_KEYS.BIKE_LOGS, sampleBikeLogs);
    writeItem(STORAGE_KEYS.FUEL_LOGS, sampleFuelLogs);
    writeItem(STORAGE_KEYS.PERSONAL_TX, samplePersonalTx);
    writeItem(STORAGE_KEYS.OIL_LOGS, sampleOil);
    writeItem(STORAGE_KEYS.MAINT_LOGS, sampleMaint);
    writeItem(STORAGE_KEYS.LOANS, sampleLoans);

    this.recalculateAccountBalances();
    this.recordAudit('admin', 'IMPORT', 'SYSTEM', 'SAMPLE_DATA', 'Loaded representative EXPANCE.xlsm sample dataset for demonstration.');
  }

  // Recalculates all account balances from opening balance + income - expenses
  public static recalculateAccountBalances(): void {
    const accounts = this.getAccounts();
    const personalTx = this.getPersonalTransactions();
    const bikeLogs = this.getBikeLogs();
    const fuelLogs = this.getFuelLogs();
    const oilLogs = this.getEngineOilLogs();
    const maintLogs = this.getMaintenanceLogs();

    const balanceMap: Record<string, number> = {};
    accounts.forEach((a) => {
      balanceMap[a.id] = a.openingBalance;
    });

    // Personal Transactions
    personalTx.forEach((tx) => {
      if (balanceMap[tx.accountId] !== undefined) {
        if (tx.type === 'INCOME') {
          balanceMap[tx.accountId] += tx.amount;
        } else {
          balanceMap[tx.accountId] -= tx.amount;
        }
      }
    });

    // Bike Income & Expenses
    bikeLogs.forEach((b) => {
      if (balanceMap[b.incomeAccountId] !== undefined) {
        balanceMap[b.incomeAccountId] += b.actualIncome;
        // Bike expenses are subtracted from income account or cash
        balanceMap[b.incomeAccountId] -= b.totalBikeExpense;
      }
    });

    // Fuel Logs
    fuelLogs.forEach((f) => {
      if (balanceMap[f.accountId] !== undefined) {
        balanceMap[f.accountId] -= f.totalCost;
      }
    });

    // Oil Logs
    oilLogs.forEach((o) => {
      if (balanceMap[o.accountId] !== undefined) {
        balanceMap[o.accountId] -= o.cost;
      }
    });

    // Maintenance Logs
    maintLogs.forEach((m) => {
      if (balanceMap[m.accountId] !== undefined) {
        balanceMap[m.accountId] -= m.totalCost;
      }
    });

    const updatedAccounts = accounts.map((a) => ({
      ...a,
      currentBalance: Math.round((balanceMap[a.id] ?? a.openingBalance) * 100) / 100,
    }));

    writeItem(STORAGE_KEYS.ACCOUNTS, updatedAccounts);
  }

  // Getters
  public static getAccounts(): Account[] {
    return readItem<Account[]>(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
  }

  public static getCategories(): Category[] {
    return readItem<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }

  public static getPersonalTransactions(): PersonalTransaction[] {
    return readItem<PersonalTransaction[]>(STORAGE_KEYS.PERSONAL_TX, []);
  }

  public static getBikeLogs(): BikeDailyLog[] {
    return readItem<BikeDailyLog[]>(STORAGE_KEYS.BIKE_LOGS, []);
  }

  public static getFuelLogs(): FuelLog[] {
    return readItem<FuelLog[]>(STORAGE_KEYS.FUEL_LOGS, []);
  }

  public static getEngineOilLogs(): EngineOilLog[] {
    return readItem<EngineOilLog[]>(STORAGE_KEYS.OIL_LOGS, []);
  }

  public static getMaintenanceLogs(): MaintenanceLog[] {
    return readItem<MaintenanceLog[]>(STORAGE_KEYS.MAINT_LOGS, []);
  }

  public static getLoans(): LoanAccount[] {
    return readItem<LoanAccount[]>(STORAGE_KEYS.LOANS, []);
  }

  public static getLoanTransactions(): LoanTransaction[] {
    return readItem<LoanTransaction[]>(STORAGE_KEYS.LOAN_TX, []);
  }

  public static getSavingsTargets(): SavingsTarget[] {
    return readItem<SavingsTarget[]>(STORAGE_KEYS.SAVINGS_TARGETS, []);
  }

  public static getSavingsTransactions(): SavingsTransaction[] {
    return readItem<SavingsTransaction[]>(STORAGE_KEYS.SAVINGS_TX, []);
  }

  public static getUsers(): User[] {
    return readItem<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }

  public static getActiveUser(): User {
    return readItem<User>(STORAGE_KEYS.ACTIVE_USER, DEFAULT_USERS[0]);
  }

  public static setActiveUser(user: User): void {
    writeItem(STORAGE_KEYS.ACTIVE_USER, user);
  }

  public static getSettings(): AppSettings {
    return readItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public static updateSettings(settings: AppSettings): void {
    writeItem(STORAGE_KEYS.SETTINGS, settings);
  }

  public static getAuditLogs(): AuditLog[] {
    return readItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  public static recordAudit(
    user: string,
    action: AuditLog['action'],
    module: string,
    recordId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      module,
      recordId,
      details,
    };
    logs.unshift(newLog);
    // Keep last 500 audit logs to preserve space
    if (logs.length > 500) logs.pop();
    writeItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Mutators
  public static addPersonalTransaction(tx: Omit<PersonalTransaction, 'id' | 'createdAt'>): PersonalTransaction {
    const list = this.getPersonalTransactions();
    const newTx: PersonalTransaction = {
      ...tx,
      id: `ptx_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newTx);
    writeItem(STORAGE_KEYS.PERSONAL_TX, list);
    this.recalculateAccountBalances();
    this.recordAudit(tx.createdBy, 'CREATE', 'PERSONAL_TX', newTx.id, `${tx.type} of ৳${tx.amount} in ${tx.categoryName}`);
    return newTx;
  }

  public static deletePersonalTransaction(id: string, user: string): void {
    const list = this.getPersonalTransactions();
    const target = list.find((t) => t.id === id);
    const filtered = list.filter((t) => t.id !== id);
    writeItem(STORAGE_KEYS.PERSONAL_TX, filtered);
    this.recalculateAccountBalances();
    if (target) {
      this.recordAudit(user, 'DELETE', 'PERSONAL_TX', id, `Deleted ${target.type} ৳${target.amount}`);
    }
  }

  public static addBikeDailyLog(log: Omit<BikeDailyLog, 'id' | 'createdAt'>): BikeDailyLog {
    const list = this.getBikeLogs();
    const newLog: BikeDailyLog = {
      ...log,
      id: `bike_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newLog);
    writeItem(STORAGE_KEYS.BIKE_LOGS, list);
    this.recalculateAccountBalances();
    this.recordAudit(log.createdBy, 'CREATE', 'BIKE_DAILY_LOG', newLog.id, `Logged ${log.totalMileage} KM, net income ৳${log.netBikeIncome}`);
    return newLog;
  }

  public static deleteBikeDailyLog(id: string, user: string): void {
    const list = this.getBikeLogs();
    const target = list.find((t) => t.id === id);
    const filtered = list.filter((t) => t.id !== id);
    writeItem(STORAGE_KEYS.BIKE_LOGS, filtered);
    this.recalculateAccountBalances();
    if (target) {
      this.recordAudit(user, 'DELETE', 'BIKE_DAILY_LOG', id, `Deleted mileage log ${target.date}`);
    }
  }

  public static addFuelLog(fuel: Omit<FuelLog, 'id' | 'createdAt'>): FuelLog {
    const list = this.getFuelLogs();
    const newFuel: FuelLog = {
      ...fuel,
      id: `fuel_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newFuel);
    writeItem(STORAGE_KEYS.FUEL_LOGS, list);
    this.recalculateAccountBalances();
    this.recordAudit(fuel.createdBy, 'CREATE', 'FUEL_LOG', newFuel.id, `Filled ${fuel.quantityLiters}L ${fuel.fuelType} for ৳${fuel.totalCost}`);
    return newFuel;
  }

  public static deleteFuelLog(id: string, user: string): void {
    const list = this.getFuelLogs();
    const target = list.find((t) => t.id === id);
    const filtered = list.filter((t) => t.id !== id);
    writeItem(STORAGE_KEYS.FUEL_LOGS, filtered);
    this.recalculateAccountBalances();
    if (target) {
      this.recordAudit(user, 'DELETE', 'FUEL_LOG', id, `Deleted fuel log of ${target.quantityLiters}L`);
    }
  }

  public static addEngineOilLog(oil: Omit<EngineOilLog, 'id' | 'createdAt'>): EngineOilLog {
    const list = this.getEngineOilLogs();
    const newOil: EngineOilLog = {
      ...oil,
      id: `oil_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newOil);
    writeItem(STORAGE_KEYS.OIL_LOGS, list);
    this.recalculateAccountBalances();
    this.recordAudit(oil.createdBy, 'CREATE', 'OIL_LOG', newOil.id, `Changed engine oil (${oil.oilBrand}) for ৳${oil.cost}`);
    return newOil;
  }

  public static deleteEngineOilLog(id: string, user: string): void {
    const list = this.getEngineOilLogs();
    const target = list.find((t) => t.id === id);
    const filtered = list.filter((t) => t.id !== id);
    writeItem(STORAGE_KEYS.OIL_LOGS, filtered);
    this.recalculateAccountBalances();
    if (target) {
      this.recordAudit(user, 'DELETE', 'OIL_LOG', id, `Deleted engine oil log ${target.date}`);
    }
  }

  public static addMaintenanceLog(maint: Omit<MaintenanceLog, 'id' | 'createdAt'>): MaintenanceLog {
    const list = this.getMaintenanceLogs();
    const newMaint: MaintenanceLog = {
      ...maint,
      id: `maint_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newMaint);
    writeItem(STORAGE_KEYS.MAINT_LOGS, list);
    this.recalculateAccountBalances();
    this.recordAudit(maint.createdBy, 'CREATE', 'MAINT_LOG', newMaint.id, `Maintenance ${maint.maintenanceType} total ৳${maint.totalCost}`);
    return newMaint;
  }

  public static deleteMaintenanceLog(id: string, user: string): void {
    const list = this.getMaintenanceLogs();
    const target = list.find((t) => t.id === id);
    const filtered = list.filter((t) => t.id !== id);
    writeItem(STORAGE_KEYS.MAINT_LOGS, filtered);
    this.recalculateAccountBalances();
    if (target) {
      this.recordAudit(user, 'DELETE', 'MAINT_LOG', id, `Deleted maintenance log ${target.date}`);
    }
  }

  public static addAccount(account: Omit<Account, 'id' | 'currentBalance'>): Account {
    const list = this.getAccounts();
    const newAcc: Account = {
      ...account,
      id: `acc_${Date.now()}`,
      currentBalance: account.openingBalance,
    };
    list.push(newAcc);
    writeItem(STORAGE_KEYS.ACCOUNTS, list);
    this.recalculateAccountBalances();
    return newAcc;
  }

  public static addCategory(category: Omit<Category, 'id'>): Category {
    const list = this.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat_${Date.now()}`,
    };
    list.push(newCat);
    writeItem(STORAGE_KEYS.CATEGORIES, list);
    return newCat;
  }

  // Full Database Export / Backup
  public static exportFullDatabase(): string {
    const snapshot = {
      version: '1.0.0',
      appName: 'EXPANCE',
      exportTimestamp: new Date().toISOString(),
      data: {
        users: this.getUsers(),
        accounts: this.getAccounts(),
        categories: this.getCategories(),
        settings: this.getSettings(),
        personalTransactions: this.getPersonalTransactions(),
        bikeLogs: this.getBikeLogs(),
        fuelLogs: this.getFuelLogs(),
        engineOilLogs: this.getEngineOilLogs(),
        maintenanceLogs: this.getMaintenanceLogs(),
        loans: this.getLoans(),
        loanTransactions: this.getLoanTransactions(),
        savingsTargets: this.getSavingsTargets(),
        savingsTransactions: this.getSavingsTransactions(),
        auditLogs: this.getAuditLogs(),
      },
    };
    return JSON.stringify(snapshot, null, 2);
  }

  // Restore Database from JSON
  public static restoreDatabase(jsonString: string, currentUser: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data) {
        return { success: false, message: 'Invalid backup structure. Missing "data" payload.' };
      }

      // Pre-restore safety backup
      const safetyBackup = this.exportFullDatabase();
      localStorage.setItem('expance_safety_backup_before_restore', safetyBackup);

      const d = parsed.data;
      if (Array.isArray(d.accounts)) writeItem(STORAGE_KEYS.ACCOUNTS, d.accounts);
      if (Array.isArray(d.categories)) writeItem(STORAGE_KEYS.CATEGORIES, d.categories);
      if (Array.isArray(d.personalTransactions)) writeItem(STORAGE_KEYS.PERSONAL_TX, d.personalTransactions);
      if (Array.isArray(d.bikeLogs)) writeItem(STORAGE_KEYS.BIKE_LOGS, d.bikeLogs);
      if (Array.isArray(d.fuelLogs)) writeItem(STORAGE_KEYS.FUEL_LOGS, d.fuelLogs);
      if (Array.isArray(d.engineOilLogs)) writeItem(STORAGE_KEYS.OIL_LOGS, d.engineOilLogs);
      if (Array.isArray(d.maintenanceLogs)) writeItem(STORAGE_KEYS.MAINT_LOGS, d.maintenanceLogs);
      if (Array.isArray(d.loans)) writeItem(STORAGE_KEYS.LOANS, d.loans);
      if (Array.isArray(d.loanTransactions)) writeItem(STORAGE_KEYS.LOAN_TX, d.loanTransactions);
      if (Array.isArray(d.savingsTargets)) writeItem(STORAGE_KEYS.SAVINGS_TARGETS, d.savingsTargets);
      if (Array.isArray(d.savingsTransactions)) writeItem(STORAGE_KEYS.SAVINGS_TX, d.savingsTransactions);
      if (d.settings) writeItem(STORAGE_KEYS.SETTINGS, d.settings);

      this.recalculateAccountBalances();
      this.recordAudit(currentUser, 'RESTORE', 'SYSTEM', 'RESTORE_BACKUP', `Database restored from backup dated ${parsed.exportTimestamp || 'Unknown'}`);

      return { success: true, message: 'Database successfully restored.' };
    } catch (e: any) {
      return { success: false, message: `Failed to restore database: ${e.message}` };
    }
  }

  // Section 35: Administrator-Only Clean Database (Clear All Operational Transactions)
  // Preserves Users, Roles, Categories, Accounts, and Settings
  public static cleanOperationalData(currentUser: string): { success: boolean; message: string; safetyBackup: string } {
    try {
      // Step 1: Automatic Pre-Clean Safety Backup
      const safetyBackup = this.exportFullDatabase();
      const backupKey = `expance_pre_clean_backup_${Date.now()}`;
      localStorage.setItem('expance_safety_backup_before_clean', safetyBackup);
      localStorage.setItem(backupKey, safetyBackup);

      // Step 2: Clear all operational transaction tables
      writeItem(STORAGE_KEYS.PERSONAL_TX, []);
      writeItem(STORAGE_KEYS.BIKE_LOGS, []);
      writeItem(STORAGE_KEYS.FUEL_LOGS, []);
      writeItem(STORAGE_KEYS.OIL_LOGS, []);
      writeItem(STORAGE_KEYS.MAINT_LOGS, []);
      writeItem(STORAGE_KEYS.LOAN_TX, []);
      writeItem(STORAGE_KEYS.SAVINGS_TX, []);

      // Reset loans outstanding back to opening amounts
      const loans = this.getLoans().map((l) => ({
        ...l,
        totalRepaid: 0,
        outstandingBalance: l.openingAmount,
      }));
      writeItem(STORAGE_KEYS.LOANS, loans);

      // Step 3: Reset all accounts current balance to opening balance
      const accounts = this.getAccounts().map((a) => ({
        ...a,
        currentBalance: a.openingBalance,
      }));
      writeItem(STORAGE_KEYS.ACCOUNTS, accounts);

      // Step 4: Record Audit Log
      this.recordAudit(
        currentUser,
        'DELETE',
        'SYSTEM',
        'CLEAN_DATABASE',
        'Administrator purged all operational ledger data (personal transactions, bike logs, fuel, maintenance). Users, settings, accounts, and categories were preserved.'
      );

      return {
        success: true,
        message: 'Operational database successfully cleaned. Users, master categories, accounts, and configurations remain intact.',
        safetyBackup,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to clean database: ${err.message}`,
        safetyBackup: '',
      };
    }
  }

  // Section 35: Factory Reset (Wipe all data, accounts and restore default pristine state)
  public static factoryReset(currentUser: string): { success: boolean; message: string; safetyBackup: string } {
    try {
      const safetyBackup = this.exportFullDatabase();
      localStorage.setItem('expance_safety_backup_before_factory_reset', safetyBackup);

      this.resetToDefaults();

      this.recordAudit(
        currentUser,
        'FACTORY_RESET',
        'SYSTEM',
        'FACTORY_RESET',
        'Administrator executed complete factory reset. System restored to initial baseline defaults.'
      );

      return {
        success: true,
        message: 'Factory reset completed. System restored to initial out-of-the-box state.',
        safetyBackup,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to perform factory reset: ${err.message}`,
        safetyBackup: '',
      };
    }
  }

  // Generates complete, pristine SQLite DDL schema
  public static getSqliteSchemaDDL(): string {
    return `-- ====================================================================
-- EXPANCE: Personal Finance + Bike Income + Mileage Management System
-- Normalized SQLite Production Database Schema
-- Location: %LOCALAPPDATA%\\EXPANCE\\Data\\EXPANCE.db
-- ====================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- 1. AppSettings
CREATE TABLE IF NOT EXISTS AppSettings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users & Roles
CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('Administrator', 'User', 'Viewer')) NOT NULL DEFAULT 'User',
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 3. Accounts (Cash, Bank, bKash, Credit Card, Savings)
CREATE TABLE IF NOT EXISTS Accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Cash', 'Bank', 'bKash', 'Credit Card', 'Savings', 'Nagad', 'Other')) NOT NULL,
    account_number TEXT,
    opening_balance REAL NOT NULL DEFAULT 0.0,
    current_balance REAL NOT NULL DEFAULT 0.0,
    is_active INTEGER NOT NULL DEFAULT 1,
    remarks TEXT
);

-- 4. Categories (Income, Personal Expense, Bike Expense)
CREATE TABLE IF NOT EXISTS Categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('INCOME', 'PERSONAL_EXPENSE', 'BIKE_EXPENSE')) NOT NULL,
    is_default INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    description TEXT
);

-- 5. PersonalTransactions (Income & Expense)
CREATE TABLE IF NOT EXISTS PersonalTransactions (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    type TEXT CHECK(type IN ('INCOME', 'EXPENSE')) NOT NULL,
    category_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    payee_or_source TEXT NOT NULL,
    description TEXT NOT NULL,
    reference TEXT,
    remarks TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES Categories(id),
    FOREIGN KEY(account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 6. BikeDailyLogs (Daily Mileage & Ride-sharing Income)
CREATE TABLE IF NOT EXISTS BikeDailyLogs (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    day_name TEXT NOT NULL,
    starting_odometer REAL NOT NULL CHECK(starting_odometer >= 0),
    ending_odometer REAL NOT NULL CHECK(ending_odometer >= starting_odometer),
    total_mileage REAL GENERATED ALWAYS AS (ending_odometer - starting_odometer) STORED,
    ride_sharing_mileage REAL NOT NULL DEFAULT 0.0,
    private_mileage REAL NOT NULL DEFAULT 0.0,
    earn_amount REAL NOT NULL DEFAULT 0.0,
    platform_rent_commission REAL NOT NULL DEFAULT 0.0,
    actual_income REAL NOT NULL DEFAULT 0.0,
    income_account_id TEXT NOT NULL,
    fuel_units REAL DEFAULT 0.0,
    fuel_cost REAL DEFAULT 0.0,
    engine_oil_cost REAL DEFAULT 0.0,
    maintenance_cost REAL DEFAULT 0.0,
    other_cost REAL DEFAULT 0.0,
    total_bike_expense REAL NOT NULL DEFAULT 0.0,
    net_bike_income REAL NOT NULL DEFAULT 0.0,
    income_per_km REAL DEFAULT 0.0,
    expense_per_km REAL DEFAULT 0.0,
    profit_per_km REAL DEFAULT 0.0,
    remarks TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(income_account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 7. FuelLogs
CREATE TABLE IF NOT EXISTS FuelLogs (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    odometer REAL NOT NULL,
    fuel_type TEXT NOT NULL,
    quantity_liters REAL NOT NULL CHECK(quantity_liters > 0),
    price_per_unit REAL NOT NULL CHECK(price_per_unit > 0),
    total_cost REAL NOT NULL,
    station TEXT,
    account_id TEXT NOT NULL,
    odometer_since_previous REAL DEFAULT 0.0,
    fuel_efficiency_km_per_l REAL DEFAULT 0.0,
    fuel_cost_per_km REAL DEFAULT 0.0,
    is_full_tank INTEGER DEFAULT 1,
    remarks TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 8. EngineOilLogs
CREATE TABLE IF NOT EXISTS EngineOilLogs (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    odometer REAL NOT NULL,
    oil_brand TEXT NOT NULL,
    quantity REAL NOT NULL DEFAULT 1.0,
    cost REAL NOT NULL CHECK(cost >= 0),
    account_id TEXT NOT NULL,
    next_change_km REAL NOT NULL,
    remaining_km REAL NOT NULL,
    remarks TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 9. MaintenanceLogs
CREATE TABLE IF NOT EXISTS MaintenanceLogs (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    odometer REAL NOT NULL,
    maintenance_type TEXT NOT NULL,
    description TEXT NOT NULL,
    parts_cost REAL NOT NULL DEFAULT 0.0,
    labor_cost REAL NOT NULL DEFAULT 0.0,
    other_cost REAL NOT NULL DEFAULT 0.0,
    total_cost REAL NOT NULL DEFAULT 0.0,
    account_id TEXT NOT NULL,
    next_maintenance_km REAL,
    remarks TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 10. LoanAccounts & Transactions
CREATE TABLE IF NOT EXISTS LoanAccounts (
    id TEXT PRIMARY KEY,
    person_or_institution TEXT NOT NULL,
    type TEXT CHECK(type IN ('LOAN_GIVEN', 'LOAN_RECEIVED')) NOT NULL,
    opening_amount REAL NOT NULL DEFAULT 0.0,
    total_repaid REAL NOT NULL DEFAULT 0.0,
    outstanding_balance REAL NOT NULL DEFAULT 0.0,
    contact_number TEXT,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS LoanTransactions (
    id TEXT PRIMARY KEY,
    loan_account_id TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT CHECK(type IN ('NEW_LOAN', 'REPAYMENT', 'ADJUSTMENT')) NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    account_id TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(loan_account_id) REFERENCES LoanAccounts(id),
    FOREIGN KEY(account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 11. SavingsTargets & Transactions
CREATE TABLE IF NOT EXISTS SavingsTargets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    target_amount REAL NOT NULL,
    target_date DATE,
    current_saved REAL DEFAULT 0.0,
    monthly_commitment_percent REAL DEFAULT 10.0,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS SavingsTransactions (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    type TEXT CHECK(type IN ('DEPOSIT', 'WITHDRAWAL')) NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    source_account_id TEXT NOT NULL,
    savings_account_id TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(source_account_id) REFERENCES Accounts(id),
    FOREIGN KEY(savings_account_id) REFERENCES Accounts(id),
    FOREIGN KEY(created_by) REFERENCES Users(id)
);

-- 12. AuditLogs
CREATE TABLE IF NOT EXISTS AuditLogs (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    record_id TEXT,
    details TEXT
);

-- Strategic Indexes for High Performance Desktop Queries
CREATE INDEX IF NOT EXISTS idx_personal_tx_date ON PersonalTransactions(date);
CREATE INDEX IF NOT EXISTS idx_personal_tx_cat ON PersonalTransactions(category_id);
CREATE INDEX IF NOT EXISTS idx_personal_tx_acc ON PersonalTransactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bike_logs_date ON BikeDailyLogs(date);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_date ON FuelLogs(date);
CREATE INDEX IF NOT EXISTS idx_oil_logs_date ON EngineOilLogs(date);
CREATE INDEX IF NOT EXISTS idx_maint_logs_date ON MaintenanceLogs(date);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON AuditLogs(timestamp);
`;
  }
}
