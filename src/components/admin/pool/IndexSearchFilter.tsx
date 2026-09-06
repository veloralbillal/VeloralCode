import React from 'react';
import { Search, Filter, Database } from 'lucide-react';

interface IndexSearchFilterProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const IndexSearchFilter: React.FC<IndexSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by collection (e.g. /codes, /licenses) or indexed field..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
        <span className="text-[11px] text-slate-400 font-medium">Priority:</span>
        {[
          { id: 'all', label: 'All' },
          { id: 'critical', label: 'Top Priority' },
          { id: 'high', label: 'High' },
          { id: 'medium', label: 'Standard' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPriorityChange(item.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedPriority === item.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="text-[11px] text-slate-400 ml-1 font-mono">
          ({filteredCount}/{totalCount})
        </span>
      </div>
    </div>
  );
};
