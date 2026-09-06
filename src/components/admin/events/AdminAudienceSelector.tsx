import React from 'react';
import { Users, User, Palette, Coins, Check } from 'lucide-react';
import { TargetRole } from '../../../types/event';

interface AdminAudienceSelectorProps {
  selectedRoles: TargetRole[];
  onChange: (roles: TargetRole[]) => void;
}

interface RoleOption {
  id: TargetRole;
  label: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'all',
    label: 'All Accounts & Visitors',
    description: 'Shows to everyone visiting the platform',
    icon: Users,
    badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
  },
  {
    id: 'user',
    label: 'Regular Users',
    description: 'General developers and code browsers',
    icon: User,
    badgeColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60',
  },
  {
    id: 'creator',
    label: 'Creators & Authors',
    description: 'Registered creator tool publishers',
    icon: Palette,
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
  },
  {
    id: 'seller',
    label: 'Sellers & Distributors',
    description: 'Resellers and license distributors',
    icon: Coins,
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
  },
];

export const AdminAudienceSelector: React.FC<AdminAudienceSelectorProps> = ({
  selectedRoles,
  onChange,
}) => {
  const toggleRole = (role: TargetRole) => {
    if (role === 'all') {
      onChange(['all']);
      return;
    }

    let updated: TargetRole[] = selectedRoles.filter((r) => r !== 'all');
    if (updated.includes(role)) {
      updated = updated.filter((r) => r !== role);
    } else {
      updated.push(role);
    }

    if (updated.length === 0) {
      updated = ['all'];
    }
    onChange(updated);
  };

  const isSelected = (role: TargetRole) => {
    if (role === 'all') {
      return selectedRoles.includes('all');
    }
    return selectedRoles.includes(role) && !selectedRoles.includes('all');
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        Target Audience (Kader Account a Show Korbe)
      </label>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Choose whether this warning notice appears for all accounts, users, creators, or sellers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {ROLE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = isSelected(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleRole(opt.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                active
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2 rounded-xl ${opt.badgeColor} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {opt.label}
                  </span>
                  {active && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
