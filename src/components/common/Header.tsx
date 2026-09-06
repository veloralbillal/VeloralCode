import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  NavBrand,
  DesktopNav,
  UserNavMenu,
  MobileNavDrawer,
} from '../navigation';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const { currentUser, userProfile, isAdmin, isSeller, isPremium, logout } = useAuth();
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
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <NavBrand onNavigate={navTo} isAdmin={isAdmin} isSeller={isSeller} />

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

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentRoute={currentRoute}
        onNavigate={navTo}
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
