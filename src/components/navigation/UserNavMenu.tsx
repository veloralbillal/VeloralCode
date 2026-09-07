import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sparkles,
  KeyRound,
  Bookmark,
  Activity,
  Coins,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface UserNavMenuProps {
  currentUser: any;
  userProfile: any;
  isAdmin?: boolean;
  isSeller?: boolean;
  isPremium?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const UserNavMenu: React.FC<UserNavMenuProps> = ({
  currentUser,
  userProfile,
  isAdmin,
  isSeller,
  isPremium,
  theme,
  onToggleTheme,
  onNavigate,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const avatarInitial = displayName[0]?.toUpperCase() || 'U';

  const handleItemClick = (route: string) => {
    onNavigate(route);
    setDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* PWA Install - Desktop only */}
      <div className="hidden sm:block">
        <PWAInstallButton />
      </div>

      {/* Theme Toggle Button - Desktop only (accessible in mobile drawer) */}
      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Auth State Menu */}
      {currentUser ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
              {avatarInitial}
            </div>

            <div className="hidden lg:flex flex-col items-start text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {displayName}
                </span>
                {userProfile?.numericUid && (
                  <span className="text-[9px] font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1 rounded">
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
                  <span className="text-slate-400">Free Account</span>
                )}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Enhanced Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Account summary */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px]">
                  {userProfile?.coinsBalance !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" /> {userProfile.coinsBalance} Coins
                    </span>
                  )}
                  {userProfile?.creatorBalance !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      ${Number(userProfile.creatorBalance).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation items */}
              <div className="space-y-0.5 text-xs">
                <button
                  onClick={() => handleItemClick('#/profile')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition font-medium"
                >
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleItemClick('#/profile/licenses')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition font-medium"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  <span>License Keys</span>
                </button>

                <button
                  onClick={() => handleItemClick('#/profile/bookmarks')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition font-medium"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bookmarked Codes</span>
                </button>

                <button
                  onClick={() => handleItemClick('#/profile/history')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition font-medium"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Recently Executed</span>
                </button>

                {/* Hub switches */}
                {(isSeller || isAdmin) && (
                  <button
                    onClick={() => handleItemClick('#/seller')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition font-medium"
                  >
                    <span className="flex items-center gap-2.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Seller Hub</span>
                    </span>
                    <span className="text-[10px] font-bold">Switch &rarr;</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleItemClick('#/admin')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition font-medium"
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield className="w-3.5 h-3.5 text-purple-500" />
                      <span>Admin Panel</span>
                    </span>
                    <span className="text-[10px] font-bold">Manage &rarr;</span>
                  </button>
                )}

                <div className="pt-1.5 my-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => onNavigate('#/login')}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => onNavigate('#/login?mode=register')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>
      )}
    </div>
  );
};
