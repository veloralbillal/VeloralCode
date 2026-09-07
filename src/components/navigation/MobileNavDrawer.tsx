import React from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  BookOpen,
  User,
  KeyRound,
  Bookmark,
  Activity,
  Coins,
  Sparkles,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  Code2,
  Link2,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: any;
  userProfile: any;
  isAdmin?: boolean;
  isSeller?: boolean;
  isPremium?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  currentUser,
  userProfile,
  isAdmin,
  isSeller,
  isPremium,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const { siteConfig } = useSiteConfig();

  if (!isOpen) return null;

  const navTo = (route: string) => {
    onNavigate(route);
    onClose();
  };

  const displayName =
    userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const isCreator = userProfile?.role === 'creator' || isAdmin;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 md:hidden transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 text-white shadow-2xl flex flex-col justify-between md:hidden animate-in slide-in-from-left duration-200">
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo('#/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">
                    {siteConfig.siteName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {siteConfig.version || 'v2.0'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Developer Library & Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Account Pill if logged in */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {displayName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    {userProfile?.numericUid && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        #{userProfile.numericUid}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] inline-block font-bold uppercase ${
                      isPremium ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {isPremium ? '★ Premium' : 'Free User'}
                  </span>
                </div>
              </div>
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-slate-700/60 text-slate-300 hover:text-white"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navTo('#/login')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => navTo('#/login?mode=register')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Section 1: Main Exploration */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Navigation
            </span>
            <button
              onClick={() => navTo('#/')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                currentRoute === '#/events'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Events & Drops</span>
            </button>
          </div>

          {/* Section 2: Apps & Utilities */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Apps & Utilities
            </span>
            <button
              onClick={() => navTo('#/app/bakikhata')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition border ${
                currentRoute.startsWith('#/app/bakikhata')
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Baki Khata Ledger</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white">
                Ledger
              </span>
            </button>

            <button
              onClick={() => navTo('#/app/shortener')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition border ${
                currentRoute.startsWith('#/app/shortener')
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/20'
                  : 'bg-violet-950/40 border-violet-800/60 text-violet-300 hover:bg-violet-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Link2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>URL Shortener & Ads</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-violet-500 text-white">
                New / Free
              </span>
            </button>
          </div>

          {/* Section 3: User Personal Menu */}
          {currentUser && (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                User Dashboard
              </span>
              <button
                onClick={() => navTo('#/profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentRoute === '#/profile'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => navTo('#/profile/licenses')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentRoute === '#/profile/licenses'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>License Keys</span>
              </button>

              <button
                onClick={() => navTo('#/profile/bookmarks')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentRoute === '#/profile/bookmarks'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Bookmarked Codes</span>
              </button>

              <button
                onClick={() => navTo('#/profile/history')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentRoute === '#/profile/history'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Recently Executed</span>
              </button>
            </div>
          )}

          {/* Section 4: Professional Hubs */}
          {(isSeller || isCreator || isAdmin) && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Hubs & Administration
              </span>

              {(isSeller || isAdmin) && (
                <button
                  onClick={() => navTo('#/seller')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-bold hover:bg-amber-900/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Seller Hub</span>
                  </div>
                  {userProfile?.coinsBalance !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      {userProfile.coinsBalance} Pts
                    </span>
                  )}
                </button>
              )}

              {isCreator && (
                <button
                  onClick={() => navTo('#/creator')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold hover:bg-emerald-900/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Creator Studio</span>
                  </div>
                  {userProfile?.creatorBalance !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      ${Number(userProfile.creatorBalance).toFixed(2)}
                    </span>
                  )}
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => navTo('#/admin')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-300 text-xs font-bold hover:bg-purple-900/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    Master
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer */}
        {currentUser && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/95">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
