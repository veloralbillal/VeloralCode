import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Code2,
  PlusCircle,
  Wallet,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  UserCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { formatBDT, usdToBdt } from '../../utils/currency';
import { formatCreatorName } from '../../utils/userDisplay';

interface CreatorLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  title?: string;
  subtitle?: string;
}

export const CreatorLayout: React.FC<CreatorLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  title,
  subtitle,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const creatorName = formatCreatorName(
    userProfile?.creatorDisplayName || userProfile?.name,
    currentUser?.email,
    'Creator'
  );

  const balanceBDT = usdToBdt(Number(userProfile?.creatorBalance || 0));
  const isVerified = userProfile?.creatorVerificationStatus === 'verified';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Studio Dashboard',
      route: '#/creator',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'profile',
      label: 'Profile & Verification',
      route: '#/creator/profile',
      icon: UserCheck,
      badge: isVerified ? 'Verified' : userProfile?.creatorVerificationStatus === 'pending' ? 'Reviewing' : null,
    },
    {
      id: 'upload',
      label: 'Upload New Tool',
      route: '#/creator/upload',
      icon: PlusCircle,
      badge: null,
    },
    {
      id: 'my-tools',
      label: 'My Uploaded Tools',
      route: '#/creator/tools',
      icon: Code2,
      badge: null,
    },
    {
      id: 'wallet',
      label: 'Earnings & Wallet',
      route: '#/creator/wallet',
      icon: Wallet,
      badge: formatBDT(balanceBDT),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out of Creator Studio', 'info');
      onNavigate('#/login');
    } catch {
      showToast('Failed to logout', 'error');
    }
  };

  const navTo = (r: string) => {
    onNavigate(r);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navTo('#/creator')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Creator Studio</span>
            {isVerified && (
              <span className="ml-1.5 text-[10px] uppercase font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top brand */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo('#/creator')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-tight">Creator Studio</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <Award className="w-3 h-3" /> Tool Contributor
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Balance Preview Card */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Available Wallet</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                ${Number(userProfile?.creatorBalance || 0).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => navTo('#/creator/wallet')}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.id}
                onClick={() => navTo(item.route)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/60 dark:border-emerald-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
            <button
              onClick={() => navTo('#/')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> Public Explorer
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isAdmin && (
              <button
                onClick={() => navTo('#/admin')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Control
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            )}
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {creatorName}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
                {isVerified ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Contributor
                  </>
                ) : (
                  <>UID: {userProfile?.numericUid || 'Creator'}</>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top bar for Desktop */}
        <header className="hidden md:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title || 'Creator Studio'}</h1>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => navTo('#/creator/upload')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Upload Tool
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">{children}</div>
      </main>
    </div>
  );
};
