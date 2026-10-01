import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Coins,
  CreditCard,
  Bike,
  Gauge,
  Fuel,
  Wrench,
  Droplet,
  TrendingUp,
  PiggyBank,
  FileSpreadsheet,
  Database,
  SlidersHorizontal,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileUp,
  BookOpen,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'personal_expenses'
  | 'personal_income'
  | 'accounts'
  | 'bike_mileage'
  | 'fuel'
  | 'engine_oil'
  | 'maintenance'
  | 'bike_profitability'
  | 'savings_loans'
  | 'reports'
  | 'migration'
  | 'master_data'
  | 'backup_restore'
  | 'audit_logs'
  | 'desktop_architect'
  | 'user_manual';

export interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  alertBadge?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  oilAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  oilAlertCount,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'Main Navigation',
      items: [
        { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'user_manual' as NavTab, label: 'User Manual & Instructions', icon: BookOpen, badge: 'Guide' },
        { id: 'desktop_architect' as NavTab, label: 'Master Prompt & Roadmap', icon: Code2, badge: 'Architect' },
      ],
    },
    {
      title: 'Personal Finance',
      items: [
        { id: 'personal_expenses' as NavTab, label: 'Personal Expenses', icon: Wallet },
        { id: 'personal_income' as NavTab, label: 'Personal Income', icon: Coins },
        { id: 'accounts' as NavTab, label: 'Accounts & Balances', icon: CreditCard },
      ],
    },
    {
      title: 'Bike & Mileage',
      items: [
        { id: 'bike_mileage' as NavTab, label: 'Daily Mileage & Income', icon: Gauge },
        { id: 'fuel' as NavTab, label: 'Fuel Management', icon: Fuel },
        { id: 'engine_oil' as NavTab, label: 'Engine Oil (Mobil)', icon: Droplet, alertBadge: oilAlertCount },
        { id: 'maintenance' as NavTab, label: 'Maintenance & Parts', icon: Wrench },
        { id: 'bike_profitability' as NavTab, label: 'Bike Profitability (BIKEDETELS)', icon: TrendingUp },
      ],
    },
    {
      title: 'Assets & Liabilities',
      items: [
        { id: 'savings_loans' as NavTab, label: 'Savings & Loans', icon: PiggyBank },
      ],
    },
    {
      title: 'Reporting & Integration',
      items: [
        { id: 'reports' as NavTab, label: 'Reports & Printing', icon: FileSpreadsheet },
        { id: 'migration' as NavTab, label: 'EXPANCE.xlsm Migration', icon: FileUp, badge: 'Excel' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'master_data' as NavTab, label: 'Master Data Setup', icon: SlidersHorizontal },
        { id: 'backup_restore' as NavTab, label: 'Backup & Clean Database', icon: Database, badge: 'Clean' },
        { id: 'audit_logs' as NavTab, label: 'Audit Trail Logs', icon: ScrollText },
      ],
    },
  ];

  return (
    <aside
      className={`no-print bg-[#033625] text-slate-200 transition-all duration-200 ease-in-out border-r border-emerald-950 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation list */}
      <div className="py-2 overflow-y-auto max-h-[calc(100vh-60px)] space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="px-2">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 font-mono">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors text-left cursor-pointer group relative ${
                      isActive
                        ? 'bg-emerald-800/90 text-white font-semibold border-l-4 border-amber-400 shadow-sm'
                        : 'text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-amber-400' : 'text-emerald-300 group-hover:text-amber-300'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono">
                        {item.badge}
                      </span>
                    )}

                    {item.alertBadge && item.alertBadge > 0 ? (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse ${
                          isCollapsed ? 'absolute top-1 right-1' : ''
                        }`}
                      >
                        {item.alertBadge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Footer Toggle */}
      <div className="p-2 border-t border-emerald-900/60 bg-emerald-950/40 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[10px] text-emerald-400/80 font-mono pl-2">
            v1.0.0 · Offline SQLite
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors cursor-pointer ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
