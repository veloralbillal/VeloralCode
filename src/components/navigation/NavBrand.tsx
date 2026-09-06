import React from 'react';
import { Code2 } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface NavBrandProps {
  onNavigate: (route: string) => void;
  isAdmin?: boolean;
  isSeller?: boolean;
}

export const NavBrand: React.FC<NavBrandProps> = ({ onNavigate, isAdmin, isSeller }) => {
  const { siteConfig } = useSiteConfig();

  const handleBrandClick = () => {
    if (isAdmin) {
      onNavigate('#/admin');
    } else if (isSeller) {
      onNavigate('#/seller');
    } else {
      onNavigate('#/');
    }
  };

  return (
    <div
      onClick={handleBrandClick}
      className="flex items-center gap-3 cursor-pointer group select-none"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
        <Code2 className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
            {siteConfig.siteName}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            {siteConfig.version || 'v2.0'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
          Developer Library & Tools
        </p>
      </div>
    </div>
  );
};
