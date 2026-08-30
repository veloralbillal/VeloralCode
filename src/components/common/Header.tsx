import React, { useState } from 'react';
import {
  Code2,
  Moon,
  Sun,
  Shield,
  LogOut,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  Terminal,
  User,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenGuide }) => {
  const { currentUser, userProfile, isAdmin, isPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      onNavigate('#/');
      setMobileMenuOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Logout failed', 'error');
    }
  };

  const navTo = (hash: string) => {
    onNavigate(hash);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo('#/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
                  CodeToolkit
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
                Developer Library & RTDB
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navTo('#/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentRoute === '#/' || currentRoute === ''
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Explore Code
            </button>

            {currentUser && (
              <button
                onClick={() => navTo('#/profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentRoute === '#/profile'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>My Profile</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => navTo('#/admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentRoute.startsWith('#/admin')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth State */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navTo('#/profile')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {(userProfile?.name || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                        {userProfile?.name || currentUser.displayName || currentUser.email?.split('@')[0]}
                      </span>
                      {userProfile?.numericUid && (
                        <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1 rounded">
                          #{userProfile.numericUid}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] flex items-center gap-1 font-bold">
                      {isPremium ? (
                        <span className="text-amber-500 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 fill-current" /> Premium
                        </span>
                      ) : (
                        <span className="text-slate-400">Free Plan</span>
                      )}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navTo('#/login')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navTo('#/login?mode=register')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-500/25 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => navTo('#/')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentRoute === '#/' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>Explore Code</span>
          </button>

          {currentUser && (
            <button
              onClick={() => navTo('#/profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentRoute === '#/profile' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>My Profile</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navTo('#/admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentRoute.startsWith('#/admin') ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Admin Panel</span>
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {userProfile?.name || currentUser.displayName || currentUser.email}
                    </span>
                    <span className="text-[10px] text-slate-400">{currentUser.email}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isPremium
                      ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navTo('#/login')}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navTo('#/login?mode=register')}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
