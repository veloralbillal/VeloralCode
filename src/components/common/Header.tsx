import React, { useState, useEffect } from 'react';
import { Menu, PanelLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  NavBrand,
  DesktopNav,
  UserNavMenu,
  SidebarNavDrawer,
} from '../navigation';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenGuide }) => {
  const { currentUser, userProfile, isAdmin, isSeller, isPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keyboard shortcut: Ctrl+M or Cmd+M to toggle sidebar menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      onNavigate('#/');
      setSidebarOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Logout failed', 'error');
    }
  };

  const navTo = (hash: string) => {
    onNavigate(hash);
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Sidebar Toggle Button & Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Universal Sidebar Navigation Toggle Button (Desktop & Mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-2xs group cursor-pointer"
                title="Open Complete Navigation Sidebar (Ctrl+M)"
                aria-label="Open Navigation Sidebar Menu"
              >
                <PanelLeft className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200">
                  Menu
                </span>
              </button>

              {/* Brand Logo & Title */}
              <NavBrand onNavigate={navTo} isAdmin={isAdmin} isSeller={isSeller} />
            </div>

            {/* Desktop Navigation Links & Apps Dropdown */}
            <DesktopNav
              currentRoute={currentRoute}
              onNavigate={navTo}
              currentUser={currentUser}
              userProfile={userProfile}
              isAdmin={isAdmin}
              isSeller={isSeller}
            />

            {/* Right Action Icons & User Menu */}
            <div className="flex items-center gap-2">
              <UserNavMenu
                currentUser={currentUser}
                userProfile={userProfile}
                isAdmin={isAdmin}
                isSeller={isSeller}
                isPremium={isPremium}
                theme={theme}
                onToggleTheme={toggleTheme}
                onNavigate={navTo}
                onLogout={handleLogout}
              />

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Comprehensive Sidebar Navigation Drawer */}
      <SidebarNavDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute={currentRoute}
        onNavigate={navTo}
        onOpenGuide={onOpenGuide}
        currentUser={currentUser}
        userProfile={userProfile}
        isAdmin={isAdmin}
        isSeller={isSeller}
        isPremium={isPremium}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </>
  );
};

