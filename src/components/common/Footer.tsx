import React from 'react';
import { Code2, Shield, Flame } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface FooterProps {
  onOpenGuide: () => void;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteConfig } = useSiteConfig();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                {siteConfig.siteName}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {siteConfig.siteTagline}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Firebase RTDB
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Auth & Security Rules
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('#/')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Explore Snippets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/login')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.siteName}. {siteConfig.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
};
