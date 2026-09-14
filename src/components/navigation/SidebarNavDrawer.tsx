import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
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
  Globe,
  PlusCircle,
  Receipt,
  Layers,
  DollarSign,
  Users,
  CheckCircle2,
  Flame,
  Settings,
  Megaphone,
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Wallet,
  LucideIcon,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export interface SidebarNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenGuide?: () => void;
  currentUser: any;
  userProfile: any;
  isAdmin?: boolean;
  isSeller?: boolean;
  isPremium?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}

interface NavItemDef {
  id: string;
  label: string;
  sublabel?: string;
  route?: string;
  action?: () => void;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  keywords?: string[];
  requiresAuth?: boolean;
  requiresRole?: 'admin' | 'seller' | 'creator';
  highlight?: boolean;
}

interface NavSectionDef {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  items: NavItemDef[];
  badge?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
}

export const SidebarNavDrawer: React.FC<SidebarNavDrawerProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  onOpenGuide,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const isCreator = userProfile?.role === 'creator' || isAdmin;

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navTo = (route: string) => {
    onNavigate(route);
    onClose();
  };

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const displayName =
    userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Guest User';

  // Comprehensive sections defining all options across the entire platform
  const allSections: NavSectionDef[] = useMemo(
    () => [
      {
        id: 'main',
        title: 'Main Platform',
        subtitle: 'Explore code and live drops',
        icon: LayoutDashboard,
        defaultOpen: true,
        items: [
          {
            id: 'explore',
            label: 'Explore Codes',
            sublabel: 'Browse verified code snippets & UI templates',
            route: '#/',
            icon: Code2,
            keywords: ['home', 'explore', 'codes', 'snippets', 'templates', 'library', 'all'],
          },
          {
            id: 'events',
            label: 'Events & Code Drops',
            sublabel: 'Timed developer drops & discount pricing',
            route: '#/events',
            icon: Calendar,
            badge: 'Live',
            badgeColor: 'bg-rose-500 text-white',
            keywords: ['events', 'drops', 'timed', 'free', 'promotions', 'giveaways'],
          },
          {
            id: 'guide',
            label: 'Interactive User Guide',
            sublabel: 'System documentation, rules & features walkthrough',
            action: () => {
              if (onOpenGuide) onOpenGuide();
              else navTo('#/?guide=true');
            },
            icon: BookOpen,
            badge: 'Docs',
            badgeColor: 'bg-indigo-500 text-white',
            keywords: ['guide', 'help', 'docs', 'manual', 'rules', 'how to use', 'faq'],
          },
        ],
      },
      {
        id: 'apps',
        title: 'Web Apps & SaaS Suite',
        subtitle: 'All standalone applications & tools',
        icon: Globe,
        defaultOpen: true,
        badge: '3 Apps',
        badgeColor: 'bg-indigo-600 text-white',
        items: [
          {
            id: 'app-linkforge',
            label: 'LinkForge - Bio Page SaaS',
            sublabel: 'Custom multi-link bio sites, blocks, themes & analytics',
            route: '#/app/linkforge',
            icon: Globe,
            badge: 'New SaaS',
            badgeColor: 'bg-indigo-600 text-white',
            highlight: true,
            keywords: ['linkforge', 'bio', 'link in bio', 'portfolio', 'links', 'saas', 'profile site'],
          },
          {
            id: 'app-linkforge-preview',
            label: 'Live Bio Preview',
            sublabel: 'View and test your published bio landing page',
            route: '#/app/linkforge?view=bio',
            icon: Eye,
            badge: 'Preview',
            badgeColor: 'bg-cyan-600 text-white',
            highlight: true,
            keywords: ['bio', 'preview', 'linkforge', 'live view'],
          },
          {
            id: 'app-bakikhata',
            label: 'Baki Khata Digital Ledger',
            sublabel: 'Customer credit ledger, dues calculation & accounts',
            route: '#/app/bakikhata',
            icon: Wallet,
            badge: 'Ledger',
            badgeColor: 'bg-emerald-600 text-white',
            highlight: true,
            keywords: ['baki khata', 'khata', 'ledger', 'accounting', 'dues', 'customer balance', 'tally'],
          },
          {
            id: 'app-shortener',
            label: 'URL Shortener & Link Ads',
            sublabel: 'Short links, monetization ad interstitial & QR generator',
            route: '#/app/shortener',
            icon: Link2,
            badge: 'Free / Ads',
            badgeColor: 'bg-violet-600 text-white',
            highlight: true,
            keywords: ['shortener', 'url', 'links', 'monetization', 'ads', 'qr code', 'redirect'],
          },
        ],
      },
      {
        id: 'user',
        title: 'User Dashboard',
        subtitle: 'Profile, licenses & saved library',
        icon: User,
        defaultOpen: true,
        items: [
          {
            id: 'user-profile',
            label: 'My Profile & Security',
            sublabel: 'Manage username, password & security credentials',
            route: '#/profile',
            icon: User,
            requiresAuth: true,
            keywords: ['profile', 'account', 'security', 'settings', 'password', 'uid', 'email'],
          },
          {
            id: 'user-licenses',
            label: 'License Keys',
            sublabel: 'View active licenses & purchased access keys',
            route: '#/profile/licenses',
            icon: KeyRound,
            requiresAuth: true,
            badge: 'VIP',
            badgeColor: 'bg-amber-500 text-white',
            keywords: ['license', 'keys', 'activation', 'premium', 'access'],
          },
          {
            id: 'user-bookmarks',
            label: 'Bookmarked Codes',
            sublabel: 'Your saved code snippets & favorite algorithms',
            route: '#/profile/bookmarks',
            icon: Bookmark,
            requiresAuth: true,
            keywords: ['bookmarks', 'saved', 'favorites', 'saved codes', 'starred'],
          },
          {
            id: 'user-history',
            label: 'Execution History',
            sublabel: 'Recently viewed, tested and executed tools',
            route: '#/profile/history',
            icon: Activity,
            requiresAuth: true,
            keywords: ['history', 'recent', 'activity', 'executed', 'logs'],
          },
        ],
      },
      {
        id: 'seller',
        title: 'Seller Hub',
        subtitle: 'Reseller dashboard, keys & points',
        icon: Coins,
        defaultOpen: isSeller || isAdmin,
        badge: userProfile?.coinsBalance !== undefined ? `${userProfile.coinsBalance} Pts` : undefined,
        badgeColor: 'bg-amber-500 text-white',
        items: [
          {
            id: 'seller-dashboard',
            label: 'Seller Overview',
            sublabel: 'Distributor dashboard & key generation metrics',
            route: '#/seller',
            icon: Coins,
            requiresRole: 'seller',
            keywords: ['seller', 'distributor', 'reseller', 'wallet', 'dashboard'],
          },
          {
            id: 'seller-generate',
            label: 'Generate License Keys',
            sublabel: 'Burn points from your wallet to generate client activation keys',
            route: '#/seller/generate',
            icon: PlusCircle,
            requiresRole: 'seller',
            keywords: ['generate', 'create key', 'burn points', 'license', 'resell'],
          },
          {
            id: 'seller-keys',
            label: 'Active & Ready Keys',
            sublabel: 'Unused license keys ready for customer dispatch',
            route: '#/seller/keys',
            icon: KeyRound,
            requiresRole: 'seller',
            keywords: ['ready keys', 'unused', 'active keys', 'dispatch', 'customer'],
          },
          {
            id: 'seller-history',
            label: 'Key Generation History',
            sublabel: 'Full log of generated keys and activation statuses',
            route: '#/seller/history',
            icon: Receipt,
            requiresRole: 'seller',
            keywords: ['seller history', 'audit', 'logs', 'redemption'],
          },
          {
            id: 'seller-reports',
            label: 'Sales & Income Reports',
            sublabel: 'Detailed sales breakdowns, activations & performance',
            route: '#/seller/reports',
            icon: TrendingUp,
            requiresRole: 'seller',
            keywords: ['sales', 'income', 'reports', 'performance', 'stats'],
          },
          {
            id: 'seller-wallet',
            label: 'Seller Points Wallet',
            sublabel: 'Check coin balance and wallet recharge history',
            route: '#/seller/wallet',
            icon: Wallet,
            requiresRole: 'seller',
            keywords: ['points', 'wallet', 'coins', 'recharge', 'balance'],
          },
        ],
      },
      {
        id: 'creator',
        title: 'Creator Studio',
        subtitle: 'Publish tools, manage earnings & KYC',
        icon: Sparkles,
        defaultOpen: isCreator,
        badge:
          userProfile?.creatorBalance !== undefined
            ? `$${Number(userProfile.creatorBalance).toFixed(2)}`
            : undefined,
        badgeColor: 'bg-emerald-600 text-white',
        items: [
          {
            id: 'creator-dashboard',
            label: 'Creator Studio Dashboard',
            sublabel: 'Real-time performance, views and revenue overview',
            route: '#/creator',
            icon: Sparkles,
            requiresRole: 'creator',
            keywords: ['creator', 'studio', 'overview', 'earnings', 'author'],
          },
          {
            id: 'creator-upload',
            label: 'Upload New Tool',
            sublabel: 'Submit source code or web widget for admin review',
            route: '#/creator/upload',
            icon: PlusCircle,
            requiresRole: 'creator',
            keywords: ['upload', 'publish', 'submit', 'new tool', 'new code'],
          },
          {
            id: 'creator-tools',
            label: 'My Uploaded Tools',
            sublabel: 'Review moderation statuses and manage live tools',
            route: '#/creator/tools',
            icon: Layers,
            requiresRole: 'creator',
            keywords: ['my tools', 'manage tools', 'moderation', 'approved'],
          },
          {
            id: 'creator-earnings',
            label: 'Earnings & Cashouts',
            sublabel: 'Tool milestone rewards, balance and withdrawal requests',
            route: '#/creator/earnings',
            icon: DollarSign,
            requiresRole: 'creator',
            keywords: ['earnings', 'withdraw', 'cashout', 'balance', 'money', 'payout'],
          },
          {
            id: 'creator-analytics',
            label: 'Clicks & Copies Report',
            sublabel: 'Pay-per-click royalties and unique action tracking',
            route: '#/creator/analytics',
            icon: TrendingUp,
            requiresRole: 'creator',
            keywords: ['analytics', 'clicks', 'downloads', 'copies', 'royalties'],
          },
          {
            id: 'creator-profile',
            label: 'Creator KYC & Profile',
            sublabel: 'Submit national ID, bio, and earn Verified Creator badge',
            route: '#/creator/profile',
            icon: CheckCircle2,
            requiresRole: 'creator',
            keywords: ['kyc', 'verification', 'badge', 'verified', 'id card'],
          },
        ],
      },
      {
        id: 'admin',
        title: 'Admin Management Suite',
        subtitle: 'System master control and administration',
        icon: Shield,
        defaultOpen: isAdmin,
        badge: 'Master',
        badgeColor: 'bg-purple-600 text-white',
        items: [
          {
            id: 'admin-dashboard',
            label: 'Admin Master Panel',
            sublabel: 'Platform metrics, system health & quick controls',
            route: '#/admin',
            icon: Shield,
            requiresRole: 'admin',
            keywords: ['admin', 'master', 'dashboard', 'control', 'overview'],
          },
          {
            id: 'admin-create',
            label: 'Publish Code Snippet',
            sublabel: 'Add & publish new code directly to database',
            route: '#/admin/create',
            icon: PlusCircle,
            requiresRole: 'admin',
            keywords: ['admin create', 'publish snippet', 'new code'],
          },
          {
            id: 'admin-manage',
            label: 'Manage Code Library',
            sublabel: 'Search, edit, hide, or feature any code entry',
            route: '#/admin/manage',
            icon: Code2,
            requiresRole: 'admin',
            keywords: ['admin manage', 'edit code', 'delete snippet', 'feature'],
          },
          {
            id: 'admin-creator-tools',
            label: 'Review Creator Submissions',
            sublabel: 'Moderate, preview, approve and reward custom tools',
            route: '#/admin/creator-tools',
            icon: Layers,
            requiresRole: 'admin',
            keywords: ['review', 'approve tool', 'moderation', 'submissions'],
          },
          {
            id: 'admin-kyc',
            label: 'Creator KYC Verifications',
            sublabel: 'Review IDs, passports and grant verified badges',
            route: '#/admin/kyc',
            icon: CheckCircle2,
            requiresRole: 'admin',
            keywords: ['verify kyc', 'identity', 'passport', 'student id'],
          },
          {
            id: 'admin-withdrawals',
            label: 'Creator Withdrawal Requests',
            sublabel: 'Review pending cashouts and record payments',
            route: '#/admin/withdrawals',
            icon: DollarSign,
            requiresRole: 'admin',
            keywords: ['payouts', 'withdrawals', 'cashout requests', 'pay creators'],
          },
          {
            id: 'admin-licenses',
            label: 'License Keys Control',
            sublabel: 'Generate, monitor and revoke activation keys',
            route: '#/admin/licenses',
            icon: KeyRound,
            requiresRole: 'admin',
            keywords: ['manage licenses', 'revoke key', 'vip generation'],
          },
          {
            id: 'admin-sellers',
            label: 'Sellers & Points Control',
            sublabel: 'Create seller accounts and allocate recharge coins',
            route: '#/admin/sellers',
            icon: Coins,
            requiresRole: 'admin',
            keywords: ['manage sellers', 'allocate points', 'reseller management'],
          },
          {
            id: 'admin-creators',
            label: 'Creators & Contributors',
            sublabel: 'Manage creator accounts, balances and specialty tags',
            route: '#/admin/creators',
            icon: Users,
            requiresRole: 'admin',
            keywords: ['creators management', 'reward balances', 'tags'],
          },
          {
            id: 'admin-banners',
            label: 'Hero Slider Banners',
            sublabel: 'Upload promo sliders, set priority and links',
            route: '#/admin/banners',
            icon: ImageIcon,
            requiresRole: 'admin',
            keywords: ['banners', 'slider', 'promotions', 'hero'],
          },
          {
            id: 'admin-shortener',
            label: 'URL Shortener & Ads Zone',
            sublabel: 'Monitor link clicks and configure ad zones',
            route: '#/admin/shortener',
            icon: Link2,
            requiresRole: 'admin',
            keywords: ['shortener admin', 'ads config', 'click tracking'],
          },
          {
            id: 'admin-events',
            label: 'Events & Down Pricing',
            sublabel: 'Manage live events, flash drops and discount rules',
            route: '#/admin/events',
            icon: Flame,
            requiresRole: 'admin',
            keywords: ['events admin', 'discounts', 'down pricing', 'flash sale'],
          },
          {
            id: 'admin-announcements',
            label: 'Site Announcements Bar',
            sublabel: 'Broadcast real-time alert banners across the site',
            route: '#/admin/announcements',
            icon: Megaphone,
            requiresRole: 'admin',
            keywords: ['announcements', 'broadcast', 'alerts', 'banner bar'],
          },
          {
            id: 'admin-users',
            label: 'User Accounts & Roles',
            sublabel: 'View users, change roles, assign coins, or manage access',
            route: '#/admin/users',
            icon: Users,
            requiresRole: 'admin',
            keywords: ['users', 'roles', 'permissions', 'ban', 'accounts'],
          },
          {
            id: 'admin-settings',
            label: 'System & Database Config',
            sublabel: 'Firebase config, cache policies, SEO & site settings',
            route: '#/admin/settings',
            icon: Settings,
            requiresRole: 'admin',
            keywords: ['settings', 'database', 'env', 'config', 'seo', 'system'],
          },
        ],
      },
    ],
    [isSeller, isAdmin, isCreator, userProfile, onOpenGuide]
  );

  // Filter items based on user role and search query
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allSections
      .map((section) => {
        // Filter out sections where user has no access (unless searching)
        if (section.id === 'admin' && !isAdmin && !q) return null;
        if (section.id === 'seller' && !isSeller && !isAdmin && !q) return null;
        if (section.id === 'creator' && !isCreator && !q) return null;

        const visibleItems = section.items.filter((item) => {
          // Role access filter (unless user is searching)
          if (!q) {
            if (item.requiresRole === 'admin' && !isAdmin) return false;
            if (item.requiresRole === 'seller' && !isSeller && !isAdmin) return false;
            if (item.requiresRole === 'creator' && !isCreator) return false;
            if (item.requiresAuth && !currentUser) return false;
          }

          if (!q) return true;

          // Search match
          const matchLabel = item.label.toLowerCase().includes(q);
          const matchSublabel = item.sublabel?.toLowerCase().includes(q);
          const matchSection = section.title.toLowerCase().includes(q);
          const matchRoute = item.route?.toLowerCase().includes(q);
          const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));

          return matchLabel || matchSublabel || matchSection || matchRoute || matchKeywords;
        });

        if (visibleItems.length === 0) return null;

        return {
          ...section,
          items: visibleItems,
        };
      })
      .filter(Boolean) as NavSectionDef[];
  }, [allSections, searchQuery, isAdmin, isSeller, isCreator, currentUser]);

  const totalOptionsCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [filteredSections]);

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Drawer */}
      <aside
        id="sidebar-navigation-drawer"
        aria-label="Sidebar Navigation Menu"
        className="fixed top-0 left-0 bottom-0 z-50 w-[320px] sm:w-[360px] md:w-[400px] max-w-[92vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250 ease-out"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Logo & Name */}
            <div
              onClick={() => navTo('#/')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-150">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    {siteConfig.siteName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {siteConfig.version || 'v2.0'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Complete Navigation Hub
                </p>
              </div>
            </div>

            {/* Quick Actions in Header (Theme + Close) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close Sidebar (Esc)"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Search Filter */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all options, apps & tools..."
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Tag / Counter */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 font-medium">
            <span>
              {searchQuery ? `Found ${totalOptionsCount} matching options` : `All Platform Menus (${totalOptionsCount})`}
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
              Press Esc to close
            </span>
          </div>
        </div>

        {/* Scrollable Body Containing All Options */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          {/* User Account / Identity Section */}
          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-slate-100 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-800/80 border border-indigo-100 dark:border-slate-700/80 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md shadow-indigo-600/20">
                  {displayName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    {userProfile?.numericUid && (
                      <span className="text-[9px] font-mono font-bold px-1 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        #{userProfile.numericUid}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Badges & Balance Rows */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                    isPremium
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isPremium ? '★ Premium VIP' : 'Free Member'}
                </span>

                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                    Admin
                  </span>
                )}

                {isSeller && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Seller
                  </span>
                )}

                {isCreator && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Creator
                  </span>
                )}

                {/* Balances */}
                {userProfile?.coinsBalance !== undefined && (
                  <button
                    onClick={() => navTo('#/seller/wallet')}
                    className="ml-auto px-2 py-0.5 rounded-md font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 hover:bg-amber-100 transition cursor-pointer"
                    title="View Seller Coins"
                  >
                    <Coins className="w-2.5 h-2.5" />
                    <span>{userProfile.coinsBalance} Pts</span>
                  </button>
                )}

                {userProfile?.creatorBalance !== undefined && (
                  <button
                    onClick={() => navTo('#/creator/earnings')}
                    className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                    title="View Creator Earnings"
                  >
                    <DollarSign className="w-2.5 h-2.5" />
                    <span>${Number(userProfile.creatorBalance).toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-50 dark:via-slate-900 to-indigo-500/5 border border-indigo-200/60 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Join {siteConfig.siteName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Sign in to save codes, generate keys, unlock LinkForge SaaS, or earn as a creator.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navTo('#/login')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => navTo('#/login?mode=register')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          )}

          {/* Categorized Options Lists */}
          {filteredSections.map((section) => {
            const isCollapsed = collapsedSections[section.id] && !searchQuery;

            return (
              <div
                key={section.id}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 p-2 space-y-1"
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition select-none cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <section.icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
                      {section.title}
                    </span>
                    {section.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          section.badgeColor || 'bg-indigo-600 text-white'
                        }`}
                      >
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-[10px] font-mono">{section.items.length}</span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-1 pt-1">
                    {section.items.map((item) => {
                      const isActive =
                        item.route &&
                        (currentRoute === item.route ||
                          (item.route !== '#/' && currentRoute.startsWith(item.route)));

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.action) {
                              item.action();
                              onClose();
                            } else if (item.route) {
                              navTo(item.route);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                              : item.highlight
                              ? 'bg-white dark:bg-slate-800/80 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.highlight
                                  ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                              }`}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p
                                  className={`text-xs truncate ${
                                    isActive ? 'text-white' : 'font-semibold text-slate-800 dark:text-slate-100'
                                  }`}
                                >
                                  {item.label}
                                </p>
                              </div>
                              {item.sublabel && (
                                <p
                                  className={`text-[10px] truncate max-w-[210px] ${
                                    isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                                  }`}
                                >
                                  {item.sublabel}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Item Badge or Active Indicator */}
                          <div className="shrink-0 flex items-center gap-1.5">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  isActive
                                    ? 'bg-white text-indigo-700'
                                    : item.badgeColor || 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No matching options found for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>

        {/* Drawer Bottom Actions & Footer */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/95 space-y-2">
          {/* PWA Install shortcut button */}
          <div className="flex items-center justify-between gap-2">
            <PWAInstallButton />
            <button
              onClick={() => {
                if (onOpenGuide) onOpenGuide();
                else navTo('#/?guide=true');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Help & Rules</span>
            </button>
          </div>

          {/* Sign Out Button if logged in */}
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <div className="text-center pt-1 text-[11px] text-slate-400">
              © {new Date().getFullYear()} {siteConfig.siteName} • Developer Ecosystem
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
