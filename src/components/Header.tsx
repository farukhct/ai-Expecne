import React, { useEffect, useState } from 'react';
import {
  Bell,
  Search,
  PlusCircle,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { User, AppSettings } from '../types';

interface HeaderProps {
  currentUser: User;
  settings: AppSettings;
  onOpenQuickEntry: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  oilAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  settings,
  onOpenQuickEntry,
  onOpenSearch,
  onLogout,
  oilAlertCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
      const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
      setCurrentTime(`${dateStr} | ${timeStr}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="no-print bg-[#044E36] text-white border-b-2 border-amber-500 shadow-md sticky top-0 z-30 select-none">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Brand Zone: Inspired by iBAS++ Government Financial Interface */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-950 border-2 border-amber-400 flex items-center justify-center shadow-inner">
            <span className="text-amber-400 font-bold text-lg font-mono">৳</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                {settings.applicationName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-emerald-950">
                OFFLINE DESKTOP
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 tracking-wide">
              Personal Finance & Bike Management System · iBAS++ Architecture
            </p>
          </div>
        </div>

        {/* Center: Live Dhaka/System Clock */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/60 px-3 py-1 rounded text-xs text-emerald-100 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentTime || 'Loading clock...'}</span>
        </div>

        {/* Right Zone: Controls, User Profile, Quick Entry */}
        <div className="flex items-center gap-2">
          {/* Quick Entry Button */}
          <button
            onClick={onOpenQuickEntry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-semibold text-xs rounded transition-colors shadow-sm cursor-pointer"
            title="Open Quick Entry Modal (Ctrl + N)"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Entry</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs rounded border border-emerald-700 transition-colors cursor-pointer"
            title="Global Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline text-[11px] text-emerald-300">Ctrl + K</span>
          </button>

          {/* Alert Notification */}
          <div className="relative">
            <button
              onClick={() => alert(`System Notifications:\n${oilAlertCount > 0 ? `⚠️ ${oilAlertCount} Engine Oil change warning(s) pending!` : '✅ All vehicle and finance systems nominal.'}`)}
              className="p-1.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {oilAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {oilAlertCount}
                </span>
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-emerald-700 mx-1 hidden sm:block" />

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded bg-emerald-800 border border-emerald-600 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-amber-300 font-mono">
                {currentUser.role}
              </div>
            </div>

            {/* Logout / Switch User */}
            <button
              onClick={onLogout}
              className="p-1.5 rounded hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors cursor-pointer ml-1"
              title="Lock / Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
