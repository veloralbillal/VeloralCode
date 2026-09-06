import React from 'react';
import { Coffee, Sparkles, Zap, Smartphone, ShoppingBag } from 'lucide-react';
import { BakiCategory, BkashType } from '../types';

interface PresetItem {
  label: string;
  amount: number;
  category: BakiCategory;
  bkashType?: BkashType;
  itemsSummary: string;
  icon: React.ElementType;
}

const PRESETS: PresetItem[] = [
  {
    label: 'দুধ চা (৳১০)',
    amount: 10,
    category: 'cha_pan',
    itemsSummary: '১ কাপ স্পেশাল দুধ চা',
    icon: Coffee,
  },
  {
    label: 'লাল চা (৳৬)',
    amount: 6,
    category: 'cha_pan',
    itemsSummary: '১ কাপ রঙ চা / লেবু চা',
    icon: Coffee,
  },
  {
    label: 'মিষ্টি পান (৳১০)',
    amount: 10,
    category: 'cha_pan',
    itemsSummary: '১ খিলি মিষ্টি সুপারি পান',
    icon: Sparkles,
  },
  {
    label: 'চা + পান (৳২০)',
    amount: 20,
    category: 'cha_pan',
    itemsSummary: '১ কাপ দুধ চা ও ১ খিলি পান',
    icon: Zap,
  },
  {
    label: 'রিচার্জ (৳২০)',
    amount: 20,
    category: 'bkash',
    bkashType: 'recharge',
    itemsSummary: 'মোবাইল রিচার্জ ২০ টাকা',
    icon: Smartphone,
  },
  {
    label: 'মুদি সওদা',
    amount: 0,
    category: 'mudi',
    itemsSummary: 'মুদি নিত্যপ্রয়োজনীয় সামগ্রী',
    icon: ShoppingBag,
  },
];

interface QuickAddBarProps {
  onSelectPreset: (preset: PresetItem) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap px-1">
          দ্রুত বাকি লিখুন:
        </span>
        {PRESETS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPreset(p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-700 transition whitespace-nowrap shrink-0 active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
