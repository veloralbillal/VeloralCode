import React, { useState } from 'react';
import {
  LayoutDashboard,
  Key,
  FolderKey,
  BarChart3,
  Wallet,
  LogOut,
  Coins,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

interface SellerLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const SellerLayout: React.FC<SellerLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
  title,
  subtitle,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Seller Dashboard', icon: LayoutDashboard, route: '#/seller' },
    { label: 'Generate License Key', icon: Key, route: '#/seller/generate' },
    { label: 'Active Keys (Ready)', icon: CheckCircle2, route: '#/seller/active-keys' },
    { label: 'All Generated Keys', icon: FolderKey, route: '#/seller/keys' },
    { label: 'Sales & Income Reports', icon: BarChart3, route: '#/seller/reports' },
    { label: 'Points Wallet', icon: Wallet, route: '#/seller/wallet' },
  ];

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    onNavigate('#/login');
  };

  const navTo = (r: string) => {
    onNavigate(r);
    setSidebarOpen(false);
  };

  const coinsBalance = userProfile?.coinsBalance !== undefined ? userProfile.coinsBalance : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navTo('#/')}>
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">Seller Hub</span>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Reseller Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Points Wallet Live Pill */}
          <div
            onClick={() => navTo('#/seller/wallet')}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/15 dark:from-amber-950/40 dark:to-amber-900/30 border border-amber-500/30 cursor-pointer hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                Available Points
              </span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {coinsBalance}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Coins</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navTo(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {isAdmin && (
            <button
              onClick={() => navTo('#/admin')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Switch to Admin Panel
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => navTo('#/explore')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              Explore Code Library
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                {userProfile?.name || currentUser?.email || 'Seller'}
              </p>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                ★ Authorized Reseller
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="w-4 h-4 text-amber-500" />
              <span>Seller Menu</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Coins className="w-3 h-3" />
              <span>{coinsBalance} Pts</span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
