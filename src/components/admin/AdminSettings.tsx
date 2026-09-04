import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Database,
  Flame,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Bell,
  Lock,
  Globe,
  Sliders,
  Server,
  Layers,
  Cpu
} from 'lucide-react';
import { SiteBrandingSettings } from './SiteBrandingSettings';
import { AdminContactSettings } from './AdminContactSettings';
import { AdminMinWithdrawalCard } from './AdminMinWithdrawalCard';
import { firebaseConfig } from '../../services/firebase';
import { createNewCode } from '../../services/codeService';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { CodeItem } from '../../types';

const STARTER_SNIPPETS: Omit<CodeItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'createdBy' | 'creatorEmail'>[] = [
  {
    title: 'Modern Responsive Navbar with Dark Mode Toggle',
    description: 'Accessible responsive navbar with mobile hamburger menu and Tailwind CSS styling.',
    code: `import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-bold text-lg text-indigo-600">DevBrand</div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <a href="#" className="text-slate-600 hover:text-indigo-600">Home</a>
          <a href="#" className="text-slate-600 hover:text-indigo-600">Components</a>
          <a href="#" className="text-slate-600 hover:text-indigo-600">Documentation</a>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};`,
    language: 'JavaScript',
    category: 'Frontend Components',
    version: '1.2.0',
    tags: ['react', 'tailwind', 'navbar', 'responsive'],
    status: 'published' as const,
  },
  {
    title: 'Python Async Web Scraper & JSON Exporter',
    description: 'High-speed asynchronous HTTP web scraper using aiohttp and beautifulsoup4 with robust error handling.',
    code: `import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json

async def fetch_page(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                title = soup.title.string if soup.title else 'No Title'
                return {'url': url, 'title': title.strip()}
    except Exception as e:
        return {'url': url, 'error': str(e)}

async def main():
    urls = ['https://news.ycombinator.com', 'https://github.com/trending']
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    asyncio.run(main())`,
    language: 'Python',
    category: 'Backend Utilities',
    version: '2.0.0',
    tags: ['python', 'asyncio', 'web-scraping', 'json'],
    status: 'published' as const,
  },
];

export const AdminSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'contact' | 'database'>('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [autoApproveTools, setAutoApproveTools] = useState(false);

  useEffect(() => {
    const savedSys = localStorage.getItem('code_toolkit_system_prefs');
    if (savedSys) {
      try {
        const parsed = JSON.parse(savedSys);
        setMaintenanceMode(parsed.maintenanceMode || false);
        setAllowRegistration(parsed.allowRegistration ?? true);
        setAutoApproveTools(parsed.autoApproveTools || false);
      } catch (err) {
        console.warn('Error loading system prefs', err);
      }
    }
  }, []);

  const handleSaveSystemPrefs = () => {
    localStorage.setItem(
      'code_toolkit_system_prefs',
      JSON.stringify({ maintenanceMode, allowRegistration, autoApproveTools })
    );
    showToast('System preferences successfully updated!', 'success');
  };

  const handleCopyConfig = async () => {
    const ok = await copyTextToClipboard(JSON.stringify(firebaseConfig, null, 2));
    if (ok) {
      setCopiedConfig(true);
      showToast('Firebase config copied to clipboard!', 'info');
      setTimeout(() => setCopiedConfig(false), 2000);
    }
  };

  const handleSeedSnippets = async () => {
    setSeeding(true);
    try {
      let count = 0;
      for (const snippet of STARTER_SNIPPETS) {
        await createNewCode(
          snippet,
          currentUser?.uid || 'admin',
          currentUser?.email || 'admin@codetoolkit.demo'
        );
        count++;
      }
      showToast(`Seeded ${count} starter snippets to Realtime Database!`, 'success');
    } catch (err: any) {
      showToast('Seeding failed: ' + (err.message || 'Check database permissions'), 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
            <Settings className="w-3.5 h-3.5 animate-spin-slow" /> Advanced System Administration
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Admin Settings & Configuration Hub</h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
            Manage global platform toggles, branding, payout thresholds, support handles, and Firebase RTDB integration parameters.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>System & Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'branding'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Branding & Payouts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Support & Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'database'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Firebase RTDB & Seeder</span>
        </button>
      </div>

      {/* Tab 1: General System Controls */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Global Platform Security & Access Toggles</h2>
                <p className="text-xs text-slate-500">Control maintenance modes, creator publishing workflows, and user signups.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-500" /> Maintenance Mode
                  </h4>
                  <p className="text-[11px] text-slate-500">Temporarily disable public visitor access and show maintenance notice.</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={() => setMaintenanceMode(!maintenanceMode)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" /> Allow New User Registrations
                  </h4>
                  <p className="text-[11px] text-slate-500">Enable or disable new developer and creator account signups.</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistration}
                  onChange={() => setAllowRegistration(!allowRegistration)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Auto-Approve Creator Tools
                  </h4>
                  <p className="text-[11px] text-slate-500">Automatically publish submitted creator tools without manual admin review.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveTools}
                  onChange={() => setAutoApproveTools(!autoApproveTools)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSystemPrefs}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
              >
                Save System Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Branding & Payouts */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <AdminMinWithdrawalCard />
          <SiteBrandingSettings />
        </div>
      )}

      {/* Tab 3: Support & Contacts */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <AdminContactSettings />
        </div>
      )}

      {/* Tab 4: Database & Seeder */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Firebase Realtime Database Configuration</h2>
                  <p className="text-xs text-slate-500">Connected production instance parameters</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyConfig}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedConfig ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(firebaseConfig, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1 max-w-md">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Seed Production Starter Snippets
                </h3>
                <p className="text-xs text-slate-500">
                  Populate the Firebase Realtime Database with initial starter tools with one click.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSeedSnippets}
                disabled={seeding}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{seeding ? 'Seeding...' : 'Seed Starter Snippets'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
