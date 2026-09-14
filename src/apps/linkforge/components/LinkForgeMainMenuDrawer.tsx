import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Globe,
  LayoutDashboard,
  BarChart3,
  Shield,
  QrCode,
  Plus,
  CheckCircle2,
  ChevronDown,
  User,
} from 'lucide-react';
import { Profile } from '../types';

interface LinkForgeMainMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  profiles: Profile[];
  activeUsername: string;
  setActiveUsername: (username: string) => void;
  onCreateNewProfile: () => void;
  onShowQr: () => void;
  currentProfile: Profile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LinkForgeMainMenuDrawer: React.FC<LinkForgeMainMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  profiles,
  activeUsername,
  setActiveUsername,
  onCreateNewProfile,
  onShowQr,
  currentProfile,
  theme,
  onToggleTheme,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'live_preview',
      label: 'Public Bio Page',
      sublabel: 'Live interactive preview & sharing',
      icon: Globe,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'studio',
      label: 'Studio Builder',
      sublabel: 'Links, widgets & profile customization',
      icon: LayoutDashboard,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'analytics',
      label: 'Traffic & Analytics',
      sublabel: 'Clicks, views, device breakdown & geo',
      icon: BarChart3,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'domains',
      label: 'Custom Domain',
      sublabel: 'Custom branding & SSL domain setup',
      icon: Globe,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'admin',
      label: 'Super Admin Panel',
      sublabel: 'Tenant management, revenue & platform metrics',
      icon: Shield,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-br from-indigo-50/50 via-white to-transparent dark:from-slate-900 dark:via-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    LinkForge
                  </h2>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                    SaaS v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Multi-Tenant Bio Landing Studio</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Select Option (Dropdown) */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 relative shrink-0">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3 h-3 text-indigo-500" /> Active Profile
              </span>
              <button
                onClick={onCreateNewProfile}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Create New
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-indigo-500 dark:hover:border-indigo-500 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={currentProfile.avatarUrl}
                    alt={currentProfile.username}
                    className="w-8 h-8 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600"
                  />
                  <div className="truncate text-left">
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                      <span>@{currentProfile.username}</span>
                      {currentProfile.isGuest && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono">
                          Guest
                        </span>
                      )}
                      {currentProfile.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{currentProfile.displayName}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-1 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Switch Profile
                  </div>
                  {profiles.map((p) => {
                    const isSelected = activeUsername === p.username;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveUsername(p.username);
                          setProfileDropdownOpen(false);
                          onClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={p.avatarUrl}
                            alt={p.username}
                            className="w-6 h-6 rounded-lg object-cover shrink-0"
                          />
                          <span className="truncate">@{p.username}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Full Studio Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-1">
              Studio Navigation
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 transition group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal leading-snug">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 space-y-2 shrink-0">
            <button
              onClick={() => {
                onShowQr();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black border border-slate-200 dark:border-slate-700 shadow-xs transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-indigo-500" /> Scan & Share QR Code
            </button>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-500 px-1">
              <span className="font-medium text-[11px]">LinkForge SaaS</span>
              <button
                onClick={onToggleTheme}
                className="font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px]"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
