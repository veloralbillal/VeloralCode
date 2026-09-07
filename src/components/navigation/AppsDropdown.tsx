import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen, Calendar, Terminal, Sparkles, ArrowRight, Link2 } from 'lucide-react';

interface AppsDropdownProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const AppsDropdown: React.FC<AppsDropdownProps> = ({ currentRoute, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAppActive = currentRoute.startsWith('#/app/') || currentRoute.startsWith('#/events');

  const appItems = [
    {
      title: 'Baki Khata Ledger',
      subtitle: 'Digital store credit ledger, accounts & daily transactions',
      route: '#/app/bakikhata',
      icon: BookOpen,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      tag: 'Featured',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'URL Shortener & Ads',
      subtitle: 'Fast short links, domain/random, QR codes & ad monetization',
      route: '#/app/shortener',
      icon: Link2,
      iconColor: 'text-violet-500 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800',
      tag: 'New / Free',
      tagColor: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
    },
    {
      title: 'Events & Pricing Drops',
      subtitle: 'Special developer workshops, discounts & flash events',
      route: '#/events',
      icon: Calendar,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
      tag: 'Active',
      tagColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          isAppActive
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/50 font-semibold shadow-2xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <span>Apps & Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Apps & Utilities
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              Integrated Tools
            </span>
          </div>

          <div className="space-y-1.5 pt-2">
            {appItems.map((item) => {
              const Icon = item.icon;
              const active = currentRoute.startsWith(item.route);
              return (
                <div
                  key={item.route}
                  onClick={() => {
                    onNavigate(item.route);
                    setIsOpen(false);
                  }}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition border ${
                    active
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-xl border shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {item.title}
                      </span>
                      {item.tag && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
