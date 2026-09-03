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
  KeyRound,
  Bookmark,
  Activity,
  Laptop,
  Megaphone,
  Lightbulb,
  LogIn,
  ChevronRight,
  Coins,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenGuide }) => {
  const { currentUser, userProfile, isAdmin, isSeller, isPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { siteConfig } = useSiteConfig();
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

  const displayName = userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo(isAdmin ? '#/admin' : (isSeller ? '#/seller' : '#/'))}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
                    {siteConfig.siteName}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    {siteConfig.version || 'v2.0'}
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
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Explore Code
              </button>

              <button
                onClick={() => navTo('#/events')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentRoute.startsWith('#/events')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Events</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => navTo('#/profile')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentRoute.startsWith('#/profile')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold'
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
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span>Admin Panel</span>
                </button>
              )}

              {(isSeller || isAdmin) && (
                <button
                  onClick={() => navTo('#/seller')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentRoute.startsWith('#/seller')
                      ? 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300/60 dark:border-amber-800/80 shadow-xs'
                      : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40'
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Seller Hub</span>
                  {userProfile?.coinsBalance !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                      {userProfile.coinsBalance} Pts
                    </span>
                  )}
                </button>
              )}

              {(userProfile?.role === 'creator' || isAdmin) && (
                <button
                  onClick={() => navTo('#/creator')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentRoute.startsWith('#/creator')
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300/60 dark:border-emerald-800/80 shadow-xs'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Creator Studio</span>
                  {userProfile?.creatorBalance !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      ${Number(userProfile.creatorBalance).toFixed(2)}
                    </span>
                  )}
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

              {/* Auth State (Desktop) */}
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
                          {displayName}
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
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 md:hidden transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Left Sidebar Drawer (Identical structure to Admin Panel Sidebar) */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 text-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo('#/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">{siteConfig.siteName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {siteConfig.version || 'v2.0'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Developer Library & Hub</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Styled like Admin Panel Menu) */}
          <nav className="space-y-1.5">
            <button
              onClick={() => navTo('#/')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                currentRoute === '#/' || currentRoute === ''
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Explore Codes</span>
            </button>

            <button
              onClick={() => navTo('#/events')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                currentRoute === '#/events'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Events & Down Pricing</span>
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => navTo('#/profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentRoute === '#/profile'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => navTo('#/profile/licenses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentRoute === '#/profile/licenses'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>License Keys</span>
                </button>

                <button
                  onClick={() => navTo('#/profile/bookmarks')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentRoute === '#/profile/bookmarks'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4 shrink-0" />
                  <span>Bookmarked Codes</span>
                </button>

                <button
                  onClick={() => navTo('#/profile/history')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentRoute === '#/profile/history'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Recently Run</span>
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => navTo('#/admin')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                  currentRoute.startsWith('#/admin')
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>Admin Panel</span>
              </button>
            )}

            {(isSeller || isAdmin) && (
              <button
                onClick={() => navTo('#/seller')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                  currentRoute.startsWith('#/seller')
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Coins className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Seller Hub</span>
              </button>
            )}

            {(userProfile?.role === 'creator' || isAdmin) && (
              <button
                onClick={() => navTo('#/creator')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                  currentRoute.startsWith('#/creator')
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Creator Studio</span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom User Info & Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/90">
          {currentUser ? (
            <div className="space-y-3">
              {/* Account Information Card */}
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(userProfile?.name || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isPremium
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                      }`}>
                        {isPremium ? '★ Premium' : 'Free User'}
                      </span>
                      {userProfile?.numericUid && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          #{userProfile.numericUid}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {(isSeller || isAdmin) && (
                <button
                  onClick={() => navTo('#/seller')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-600/30 transition"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Switch to Seller Hub</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => navTo('#/admin')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Switch to Admin Panel</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => navTo('#/login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-slate-700 hover:border-slate-600 text-slate-200 hover:bg-slate-800 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => navTo('#/login?mode=register')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
