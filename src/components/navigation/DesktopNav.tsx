import React from 'react';
import { LayoutDashboard, Shield, Coins, Sparkles, User, Calendar } from 'lucide-react';
import { AppsDropdown } from './AppsDropdown';

interface DesktopNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: any;
  userProfile: any;
  isAdmin?: boolean;
  isSeller?: boolean;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  currentRoute,
  onNavigate,
  currentUser,
  userProfile,
  isAdmin,
  isSeller,
}) => {
  const isCreator = userProfile?.role === 'creator' || isAdmin;

  return (
    <nav className="hidden md:flex items-center gap-1.5">
      {/* Explore Codes */}
      <button
        onClick={() => onNavigate('#/')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          currentRoute === '#/' || currentRoute === ''
            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold shadow-2xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
        <span>Explore Codes</span>
      </button>

      {/* Enhanced Apps Dropdown */}
      <AppsDropdown currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Events */}
      <button
        onClick={() => onNavigate('#/events')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          currentRoute.startsWith('#/events')
            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold shadow-2xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <Calendar className="w-4 h-4 text-indigo-500" />
        <span>Events</span>
      </button>

      {/* Profile quick link if logged in */}
      {currentUser && (
        <button
          onClick={() => onNavigate('#/profile')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            currentRoute.startsWith('#/profile')
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-semibold shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <User className="w-4 h-4 text-indigo-500" />
          <span>Profile</span>
        </button>
      )}

      {/* Seller Hub */}
      {(isSeller || isAdmin) && (
        <button
          onClick={() => onNavigate('#/seller')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentRoute.startsWith('#/seller')
              ? 'text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 shadow-xs'
              : 'text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border-amber-200/70 dark:border-amber-900/50'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Seller Hub</span>
          {userProfile?.coinsBalance !== undefined && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-black">
              {userProfile.coinsBalance} Pts
            </span>
          )}
        </button>
      )}

      {/* Creator Studio */}
      {isCreator && (
        <button
          onClick={() => onNavigate('#/creator')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentRoute.startsWith('#/creator')
              ? 'text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 shadow-xs'
              : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-emerald-200/70 dark:border-emerald-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Creator</span>
          {userProfile?.creatorBalance !== undefined && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black">
              ${Number(userProfile.creatorBalance).toFixed(2)}
            </span>
          )}
        </button>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <button
          onClick={() => onNavigate('#/admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentRoute.startsWith('#/admin')
              ? 'text-purple-800 dark:text-purple-200 bg-purple-100/90 dark:bg-purple-950/80 border-purple-300 dark:border-purple-800 shadow-xs'
              : 'text-purple-700 dark:text-purple-400 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-purple-200/70 dark:border-purple-900/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>Admin</span>
        </button>
      )}
    </nav>
  );
};
