import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, Eye, EyeOff, KeyRound } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  users,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      setErrorMsg('User account not found.');
      return;
    }

    if (user.passwordHash !== password) {
      setErrorMsg('Invalid password credentials.');
      return;
    }

    if (!user.isActive) {
      setErrorMsg('This user account has been disabled by an administrator.');
      return;
    }

    setErrorMsg('');
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#022117]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-emerald-900/20 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top header badge */}
        <div className="bg-[#044E36] text-white p-6 text-center border-b-4 border-amber-500 relative">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-amber-400 mx-auto flex items-center justify-center shadow-md mb-2">
            <span className="text-amber-400 font-bold text-2xl font-mono">৳</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight font-mono">EXPANCE</h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Personal Finance & Bike Management Suite
          </p>
          <div className="text-[10px] text-amber-300 font-mono mt-1 uppercase tracking-wider">
            Offline SQLite Secure Session
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-medium text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Username ID
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded focus:outline-emerald-600 font-medium text-slate-900"
                placeholder="Username (e.g. admin)"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded focus:outline-emerald-600 font-medium text-slate-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-3 top-2.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
            Default credentials: <span className="font-bold text-slate-700">admin</span> / <span className="font-bold text-slate-700">admin123</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#044E36] hover:bg-emerald-800 text-white font-bold rounded shadow-md cursor-pointer transition-colors text-sm"
          >
            Authenticate & Open Console
          </button>
        </form>
      </div>
    </div>
  );
};
