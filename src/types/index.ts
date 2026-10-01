/**
 * EXPANCE - Personal Finance + Bike Income + Mileage Management System
 * Core Normalized Types & Domain Interfaces
 */

export type UserRole = 'Administrator' | 'User' | 'Viewer';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  passwordHash: string; // bcrypt/sha256 simulated local hash
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type AccountType = 'Cash' | 'Bank' | 'bKash' | 'Credit Card' | 'Savings' | 'Nagad' | 'Other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber?: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  remarks?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'PERSONAL_EXPENSE' | 'BIKE_EXPENSE';
  isDefault?: boolean;
  isActive: boolean;
  description?: string;
}

export type PersonalTransactionType = 'INCOME' | 'EXPENSE';

export interface PersonalTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: PersonalTransactionType;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  amount: number;
  payeeOrSource: string;
  description: string;
  reference?: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface BikeDailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. Saturday, Sunday
  startingOdometer: number;
  endingOdometer: number;
  totalMileage: number;
  rideSharingMileage: number;
  privateMileage: number;
  // Income components
  earnAmount: number; // Gross ridesharing income
  platformRentCommission: number; // Rent or platform fee
  actualIncome: number; // Net income taken home
  incomeAccountId: string;
  // Expense components
  fuelUnits: number; // Litres
  fuelCost: number;
  engineOilCost: number;
  maintenanceCost: number;
  otherCost: number;
  totalBikeExpense: number;
  // Calculated KPIs
  netBikeIncome: number;
  incomePerKm: number;
  expensePerKm: number;
  profitPerKm: number;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface FuelLog {
  id: string;
  date: string;
  odometer: number;
  fuelType: 'Octane' | 'Petrol' | 'Diesel' | string;
  quantityLiters: number;
  pricePerUnit: number;
  totalCost: number;
  station: string;
  accountId: string;
  odometerSincePrevious: number;
  fuelEfficiencyKmPerL: number;
  fuelCostPerKm: number;
  isFullTank: boolean;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface EngineOilLog {
  id: string;
  date: string;
  odometer: number;
  oilBrand: string;
  quantity: number;
  cost: number;
  accountId: string;
  nextChangeKm: number;
  remainingKm: number;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  odometer: number;
  maintenanceType: 'General Service' | 'Wash' | 'Brake' | 'Tire' | 'Chain' | 'Engine' | 'Electrical' | 'Parts' | 'Accessories' | 'Other';
  description: string;
  partsCost: number;
  laborCost: number;
  otherCost: number;
  totalCost: number;
  accountId: string;
  nextMaintenanceKm?: number;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface LoanAccount {
  id: string;
  personOrInstitution: string;
  type: 'LOAN_GIVEN' | 'LOAN_RECEIVED';
  openingAmount: number;
  totalRepaid: number;
  outstandingBalance: number;
  contactNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface LoanTransaction {
  id: string;
  loanAccountId: string;
  personName: string;
  date: string;
  type: 'NEW_LOAN' | 'REPAYMENT' | 'ADJUSTMENT';
  amount: number;
  accountId: string;
  description: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface SavingsTarget {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: string;
  currentSaved: number;
  monthlyCommitmentPercent: number; // e.g. 10%
  isActive: boolean;
  remarks?: string;
}

export interface SavingsTransaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  sourceAccountId: string;
  savingsAccountId: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'BACKUP' | 'RESTORE' | 'IMPORT' | 'FACTORY_RESET';
  module: string;
  recordId: string;
  details: string;
}

export interface AppSettings {
  applicationName: string;
  currencySymbol: string;
  currencyCode: string;
  dateFormat: string; // 'dd-MM-yyyy'
  defaultAccountId: string;
  fuelWarningThresholdLiters: number;
  maintenanceWarningThresholdKm: number;
  engineOilWarningThresholdKm: number;
  savingsTargetPercent: number;
  pageSize: number;
  sidebarCollapsed: boolean;
}

export interface DashboardKPIs {
  todayIncome: number;
  todayExpense: number;
  todayBalance: number;
  todayBikeIncome: number;
  todayBikeExpense: number;
  todayBikeProfit: number;
  cashBalance: number;
  bankBalance: number;
  bKashBalance: number;
  savingsBalance: number;
  totalMileage: number;
  rideSharingMileage: number;
  incomePerKm: number;
  expensePerKm: number;
  profitPerKm: number;
  activeLoanOutstanding: number;
  engineOilAlertCount: number;
}
