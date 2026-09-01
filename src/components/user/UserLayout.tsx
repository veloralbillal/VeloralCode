import React from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Bookmark,
  Activity,
  Laptop,
  Megaphone,
  Lightbulb,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface UserLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
  title,
  subtitle,
}) => {
  const { currentUser, userProfile, isAdmin, isPremium, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { label: 'Explore Codes', icon: LayoutDashboard, route: '#/' },
    { label: 'Profile Overview', icon: UserIcon, route: '#/profile' },
    { label: 'Licenses & Redemptions', icon: KeyRound, route: '#/profile/licenses' },
    { label: 'Bookmarked Codes', icon: Bookmark, route: '#/profile/bookmarks' },
    { label: 'Recently Run & Viewed', icon: Activity, route: '#/profile/history' },
    { label: 'Connected Devices', icon: Laptop, route: '#/profile/sessions' },
    { label: 'Admin Notices', icon: Megaphone, route: '#/profile/announcements' },
    { label: 'Feature Request Box', icon: Lightbulb, route: '#/profile/requests' },
  ];

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    onNavigate('#/');
  };

  const navTo = (r: string) => {
    onNavigate(r);
    setSidebarOpen(false);
  };

  const displayName = userProfile?.name || currentUser?.displayName || 'User';
  const userInitial = displayName[0].toUpperCase();

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
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* User Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navTo('#/')}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                {userInitial}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                  {displayName}
                </span>
                <p className="text-[10px] text-slate-400 font-mono truncate">UID: {userProfile?.numericUid || '89536985'}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navTo(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {isAdmin && (
            <button
              onClick={() => navTo('#/admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition border border-indigo-200/50 dark:border-indigo-800/50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => navTo('#/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition border border-rose-200/50 dark:border-rose-900/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{title}</span>
              </h1>
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{displayName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};
