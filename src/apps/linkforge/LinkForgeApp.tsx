import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Smartphone,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  User,
  Globe,
  BarChart3,
  ShieldCheck,
  ArrowLeft,
  Eye,
  Plus,
  QrCode,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Menu,
  Sun,
  Moon,
  Flame,
  Wallet,
  Link2,
  Code2,
} from 'lucide-react';
import { Profile } from './types';
import { linkForgeService } from './services/linkForgeService';
import { ProfileEditor } from './components/ProfileEditor';
import { BlockManager } from './components/BlockManager';
import { DomainManager } from './components/DomainManager';
import { AnalyticsTab } from './components/AnalyticsTab';
import { AdminTab } from './components/AdminTab';
import { BioView } from './components/BioView';
import { LinkForgeMainMenuDrawer } from './components/LinkForgeMainMenuDrawer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface LinkForgeAppProps {
  onNavigate?: (route: string) => void;
  initialBioUsername?: string;
}

export const LinkForgeApp: React.FC<LinkForgeAppProps> = ({
  onNavigate,
  initialBioUsername,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>(linkForgeService.getProfiles());
  const [activeUsername, setActiveUsername] = useState<string>(() => {
    if (initialBioUsername) return initialBioUsername.replace(/^@/, '');
    // Check URL params
    const hash = window.location.hash;
    const match = hash.match(/bio=([^&]+)/) || hash.match(/#\/bio\/([^/?]+)/);
    if (match && match[1]) return match[1];
    return 'billalhossen';
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'analytics' | 'domains' | 'admin' | 'live_preview'>('studio');
  const [studioSubTab, setStudioSubTab] = useState<'blocks' | 'profile'>('blocks');
  const [mobileStudioView, setMobileStudioView] = useState<'editor' | 'preview'>('editor');
  const [mobileTenantSelectOpen, setMobileTenantSelectOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Auto-create 5-digit guest account on entry if none exists
  useEffect(() => {
    const guestKey = 'linkforge_guest_active';
    const existingGuest = localStorage.getItem(guestKey);
    if (!existingGuest && !initialBioUsername) {
      const fiveDigit = Math.floor(10000 + Math.random() * 90000).toString();
      const guestUsername = `guest${fiveDigit}`;
      const guestProfile: Profile = {
        id: 'prof_' + Math.random().toString(36).substring(2, 9),
        userId: 'usr_' + guestUsername,
        username: guestUsername,
        displayName: `Guest User #${fiveDigit}`,
        bio: 'Welcome to my LinkForge Bio SaaS page. Created automatically as a guest session.',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestUsername}`,
        isVerified: false,
        tier: 'free',
        isGuest: true,
        accountPassword: '',
        isPublished: false,
        themePreset: 'dark_glass',
        accentColor: '#6366f1',
        fontFamily: 'Plus Jakarta Sans',
        socialLinks: {},
        blocks: [
          {
            id: 'blk_guest_1',
            type: 'LINK',
            title: 'My Portfolio / Website',
            url: 'https://example.com',
            orderIndex: 0,
            isActive: true,
            clickCount: 0,
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      linkForgeService.saveProfile(guestProfile);
      localStorage.setItem(guestKey, guestUsername);
      setProfiles(linkForgeService.getProfiles());
      setActiveUsername(guestUsername);
    }
  }, []);

  const handlePublishClick = () => {
    if (currentProfile.isGuest) {
      setRegUsername(currentProfile.username);
      setRegPassword('pass' + Math.random().toString(36).substring(2, 8));
      setShowPublishModal(true);
    } else {
      setActiveTab('live_preview');
      showToast('Bio page is published and live!', 'success');
    }
  };

  const handleConvertAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPassword.trim()) {
      showToast('Please enter a username and password', 'error');
      return;
    }
    const existing = linkForgeService.getProfileByUsername(regUsername.trim());
    if (existing && existing.id !== currentProfile.id) {
      showToast('Username already taken. Please choose another.', 'error');
      return;
    }

    const updated: Profile = {
      ...currentProfile,
      username: regUsername.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      accountPassword: regPassword.trim(),
      isGuest: false,
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    linkForgeService.saveProfile(updated);
    setProfiles(linkForgeService.getProfiles());
    setActiveUsername(updated.username);
    setShowPublishModal(false);
    showToast('Account created & Bio published successfully!', 'success');
    setActiveTab('live_preview');
  };

  // Platform Context
  const { currentUser, userProfile, isAdmin, isSeller, isPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleNavigate = (route: string) => {
    setSidebarOpen(false);
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== 'undefined') {
      window.location.hash = route;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
    } catch {
      showToast('Failed to log out', 'error');
    }
  };

  // Keyboard shortcut Ctrl+M / Cmd+M to toggle Main Menu
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

  // Check if current URL is directly requesting a public bio page
  const isDirectBioRoute = (() => {
    const hash = window.location.hash;
    return hash.startsWith('#/bio/') || hash.startsWith('#/@') || (hash.includes('view=bio') && !hash.includes('mode=studio'));
  })();

  const currentProfile =
    linkForgeService.getProfileByUsername(activeUsername) ||
    profiles[0] ||
    linkForgeService.createProfile({ name: 'Billal Hossen', username: 'billalhossen' });

  // OpenGraph and Twitter sharing meta tags synchronization using currentProfile displayName & bio
  useEffect(() => {
    if (currentProfile) {
      document.title = `${currentProfile.displayName} (@${currentProfile.username}) | LinkForge Bio`;

      const updateMeta = (key: string, content: string, isProperty = true) => {
        const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
        let tag = document.querySelector(selector);
        if (!tag) {
          tag = document.createElement('meta');
          if (isProperty) {
            tag.setAttribute('property', key);
          } else {
            tag.setAttribute('name', key);
          }
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateMeta('description', currentProfile.bio, false);
      updateMeta('og:title', `${currentProfile.displayName} (@${currentProfile.username}) | LinkForge Bio`, true);
      updateMeta('og:description', currentProfile.bio, true);
      updateMeta('og:image', currentProfile.avatarUrl, true);
      updateMeta('og:url', window.location.href, true);
      updateMeta('twitter:card', 'summary_large_image', false);
      updateMeta('twitter:title', `${currentProfile.displayName} (@${currentProfile.username})`, false);
      updateMeta('twitter:description', currentProfile.bio, false);
      updateMeta('twitter:image', currentProfile.avatarUrl, false);
    }
  }, [currentProfile]);

  const handleProfileUpdated = (updated: Profile) => {
    linkForgeService.saveProfile(updated);
    setProfiles(linkForgeService.getProfiles());
  };

  const handleCreateNewProfile = () => {
    const handle = 'creator_' + Math.random().toString(36).substring(2, 6);
    const newP = linkForgeService.createProfile({
      name: 'New Creator Profile',
      username: handle,
    });
    setProfiles(linkForgeService.getProfiles());
    setActiveUsername(newP.username);
  };

  const bioShareUrl = `${window.location.origin}/#/app/linkforge?bio=${currentProfile.username}&view=bio`;

  const handleCopyShareUrl = () => {
    navigator.clipboard?.writeText(bioShareUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // If in direct public bio view mode
  if (isDirectBioRoute || activeTab === 'live_preview') {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative">
        <BioView
          profile={currentProfile}
          onShare={handleCopyShareUrl}
          onNavigate={handleNavigate}
          onOpenMainMenu={() => setSidebarOpen(true)}
        />

        <LinkForgeMainMenuDrawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profiles={profiles}
          activeUsername={activeUsername}
          setActiveUsername={setActiveUsername}
          onCreateNewProfile={handleCreateNewProfile}
          onShowQr={() => setShowQrModal(true)}
          currentProfile={currentProfile}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-1 sm:gap-3">
            {/* Left: Main Menu Nav Button & Brand */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Primary Main Menu Navigation Toggle Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition active:scale-95 font-extrabold text-xs shadow-xs cursor-pointer group shrink-0"
                title="Open Platform Main Menu Navigation (Ctrl+M)"
                aria-label="Open Platform Main Menu Navigation"
              >
                <Menu className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-extrabold text-xs">Main Menu</span>
              </button>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('#/')}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                  title="Return to Veloral Homepage"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-base tracking-tight text-slate-900 dark:text-white">
                    LinkForge
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Bio SaaS
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Profile Switcher (Desktop) */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2">
                Tenant:
              </span>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveUsername(p.username)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeUsername === p.username
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>@{p.username}</span>
                  {p.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-500" />}
                </button>
              ))}

              <button
                onClick={handleCreateNewProfile}
                className="p-1 rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-500 hover:text-indigo-500 transition cursor-pointer"
                title="Create New Profile"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Tenant Selector (Dropdown) */}
            <div className="relative md:hidden">
              <button
                onClick={() => setMobileTenantSelectOpen(!mobileTenantSelectOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 transition"
              >
                <span className="max-w-[85px] truncate">@{activeUsername}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {mobileTenantSelectOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Switch Tenant
                    </p>
                    <span className="text-[10px] text-slate-400">{profiles.length} profiles</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveUsername(p.username);
                          setMobileTenantSelectOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                          activeUsername === p.username
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">@{p.username}</span>
                        {p.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      handleCreateNewProfile();
                      setMobileTenantSelectOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 mt-1 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Profile</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Switcher Button */}
              <button
                onClick={toggleTheme}
                className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Desktop QR Code Button */}
              <button
                onClick={() => setShowQrModal(true)}
                className="hidden sm:flex items-center justify-center min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Scan QR Code"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" />
                <span>QR Code</span>
              </button>

              {/* Desktop Copy Link Button */}
              <button
                onClick={handleCopyShareUrl}
                className="hidden md:flex items-center justify-center min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Copy Bio URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
              </button>

              {/* Mobile Actions Dropdown Toggle */}
              <div className="relative sm:hidden">
                <button
                  onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                  className="flex items-center justify-center min-h-[36px] min-w-[36px] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="More Actions"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                {mobileActionsOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <button
                      onClick={() => {
                        setShowQrModal(true);
                        setMobileActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-indigo-500" />
                      <span>Scan QR Code</span>
                    </button>
                    <button
                      onClick={() => {
                        handleCopyShareUrl();
                        setMobileActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
                      <span>{copiedUrl ? 'Copied URL!' : 'Copy Bio URL'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
          <div>
            {/* Mobile View Toggle (Editor vs Phone Simulator) */}
            <div className="lg:hidden mb-5 flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                onClick={() => setMobileStudioView('editor')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  mobileStudioView === 'editor'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Builder & Settings</span>
              </button>
              <button
                onClick={() => setMobileStudioView('preview')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  mobileStudioView === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Live Phone Preview</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Editor Controls (7 Cols) */}
              <div className={`lg:col-span-7 space-y-6 ${mobileStudioView === 'preview' ? 'hidden lg:block' : 'block'}`}>
                {/* Studio Subtab Switcher */}
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <button
                    onClick={() => setStudioSubTab('blocks')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      studioSubTab === 'blocks'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="truncate">Links & Blocks ({currentProfile.blocks.length})</span>
                  </button>

                  <button
                    onClick={() => setStudioSubTab('profile')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      studioSubTab === 'profile'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">Appearance & Theme</span>
                  </button>
                </div>

                {studioSubTab === 'blocks' ? (
                  <BlockManager profile={currentProfile} onUpdate={handleProfileUpdated} />
                ) : (
                  <ProfileEditor profile={currentProfile} onSave={handleProfileUpdated} />
                )}
              </div>

              {/* Right Column: Live Phone Simulator / Frame (5 Cols) */}
              <div className={`lg:col-span-5 ${mobileStudioView === 'editor' ? 'hidden lg:block' : 'block'} sticky top-28`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Live Bio Simulator
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Syncing in Realtime
                    </span>
                  </div>

                  {/* iPhone Outer Frame */}
                  <div className="relative mx-auto w-[310px] sm:w-[330px] h-[640px] sm:h-[660px] bg-slate-900 rounded-[44px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl border-[3px] sm:border-[4px] border-slate-800 ring-1 ring-white/10">
                    {/* Dynamic Island / Speaker Notch */}
                    <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-900 mr-2" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
                    </div>

                    {/* Simulator Screen Container */}
                    <div className="w-full h-full rounded-[34px] sm:rounded-[38px] overflow-y-auto overflow-x-hidden bg-slate-950 relative scrollbar-none">
                      <BioView
                        profile={currentProfile}
                        isSimulator
                        onNavigate={handleNavigate}
                        onOpenMainMenu={() => setSidebarOpen(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Floating Quick Switcher */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setMobileStudioView(mobileStudioView === 'editor' ? 'preview' : 'editor')}
                className="flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transition-all cursor-pointer"
              >
                {mobileStudioView === 'editor' ? (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>View Simulator</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Back to Editor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsTab profile={currentProfile} />}

        {activeTab === 'domains' && (
          <DomainManager profile={currentProfile} onUpdate={handleProfileUpdated} />
        )}

        {activeTab === 'admin' && (
          <AdminTab
            onImpersonate={(username) => {
              setActiveUsername(username);
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scan Bio QR Code
            </h3>
            <p className="text-xs text-slate-500">
              Point your smartphone camera to open <br />
              <strong className="text-indigo-600 dark:text-indigo-400">
                {currentProfile.customDomain || `${currentProfile.username}.linkforge.app`}
              </strong>
            </p>

            {/* Generated QR Code preview */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  bioShareUrl
                )}`}
                alt="Profile QR Code"
                className="w-44 h-44"
              />
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Publish & Account Creation Modal (for Guest Conversion) */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Publish Your Bio & Create Account
                </h3>
                <p className="text-xs text-slate-500">
                  To publish your bio page publicly, convert your 5-digit guest account into a permanent LinkForge main account.
                </p>
              </div>
            </div>

            <form onSubmit={handleConvertAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Permanent Username Handle
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 text-xs rounded-l-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-r-0 border-slate-200 dark:border-slate-700 font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="yourname"
                    className="w-full px-3 py-2 text-xs rounded-r-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Password (for Profile Security)
                </label>
                <input
                  type="text"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set secure password"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  Publish & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LinkForge Custom Main Menu Drawer */}
      <LinkForgeMainMenuDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profiles={profiles}
        activeUsername={activeUsername}
        setActiveUsername={setActiveUsername}
        onCreateNewProfile={handleCreateNewProfile}
        onShowQr={() => setShowQrModal(true)}
        currentProfile={currentProfile}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
};

export default LinkForgeApp;

