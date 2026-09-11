import React, { useState } from 'react';
import { Users, AlertCircle, ArrowUpDown, Search, X } from 'lucide-react';
import { Customer } from '../types';
import { CustomerCard } from './CustomerCard';

interface CustomerListViewProps {
  customers: Customer[];
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  isTuesdayFilterActive: boolean;
  onOpenAddDue: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
  onOpenAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onOpenMessage?: (customer: Customer, initialType?: 'whatsapp' | 'sms') => void;
}

type TabFilter = 'all' | 'due_only' | 'tuesday' | 'settled';
type SortOption = 'due_desc' | 'activity_desc' | 'name_asc';

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  searchQuery,
  onSearchChange,
  isTuesdayFilterActive,
  onOpenAddDue,
  onOpenPayment,
  onViewDetails,
  onOpenAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onOpenMessage,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>(
    isTuesdayFilterActive ? 'tuesday' : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('due_desc');

  // Internal search state to guarantee immediate responsive UI feedback on any keyboard/browser
  const [internalQuery, setInternalQuery] = useState<string>(searchQuery || '');

  // Synchronize internal query whenever external prop changes
  React.useEffect(() => {
    setInternalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleQueryChange = (val: string) => {
    setInternalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearQuery = () => {
    setInternalQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // React to Tuesday filter prop change
  React.useEffect(() => {
    if (isTuesdayFilterActive) {
      setActiveTab('tuesday');
    }
  }, [isTuesdayFilterActive]);

  // Active query normalized for filtering
  const activeQuery = (internalQuery || '').trim().toLowerCase();

  // Filter customers with case-insensitive check on name and phone number
  const filtered = React.useMemo(() => {
    const q = activeQuery;
    const cleanQ = q.replace(/\D/g, '');

    return customers.filter((c) => {
      // 1. Search Query Filter (case-insensitive check against both customer name and phone string)
      if (q) {
        const nameStr = (c.name || '').toLowerCase();
        const phoneStr = (c.phone || '').toLowerCase();
        const addrStr = (c.address || '').toLowerCase();

        const matchName = nameStr.includes(q);
        const matchPhone =
          phoneStr.includes(q) ||
          (cleanQ.length >= 3 && phoneStr.replace(/\D/g, '').includes(cleanQ));
        const matchAddr = addrStr.includes(q);

        if (!matchName && !matchPhone && !matchAddr) {
          return false;
        }
      }

      // 2. Tab Filter
      if (activeTab === 'due_only') return c.totalDue > 0;
      if (activeTab === 'tuesday') return c.settlesOnTuesday && c.totalDue > 0;
      if (activeTab === 'settled') return c.totalDue <= 0;
      return true;
    });
  }, [customers, activeQuery, activeTab]);

  // Sort filtered customers
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'due_desc') return b.totalDue - a.totalDue;
      if (sortBy === 'activity_desc') return b.lastActivityAt - a.lastActivityAt;
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '', 'bn');
      return 0;
    });
  }, [filtered, sortBy]);

  return (
    <div className="space-y-4">
      {/* Enhanced Modern Search Bar */}
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={internalQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="🔍 কাস্টমার নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
          className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-md transition-all font-medium"
        />
        {internalQuery && (
          <button
            type="button"
            onClick={handleClearQuery}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Clear search"
          >
            <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
              <X className="w-3.5 h-3.5" />
            </div>
          </button>
        )}
      </div>

      {/* Tab Filters and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Customers ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('due_only')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'due_only'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Has Due ({customers.filter((c) => c.totalDue > 0).length})
          </button>

          <button
            onClick={() => setActiveTab('tuesday')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'tuesday'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🗓️ Tuesday Settlement ({customers.filter((c) => c.settlesOnTuesday && c.totalDue > 0).length})
          </button>

          <button
            onClick={() => setActiveTab('settled')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settled'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Fully Cleared ({customers.filter((c) => c.totalDue <= 0).length})
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none border-0"
          >
            <option value="due_desc">Highest Due First</option>
            <option value="activity_desc">Recent Activity</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sorted.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              searchQuery={internalQuery}
              onOpenAddDue={onOpenAddDue}
              onOpenPayment={onOpenPayment}
              onViewDetails={onViewDetails}
              onEditCustomer={onEditCustomer}
              onDeleteCustomer={onDeleteCustomer}
              onOpenMessage={onOpenMessage}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {internalQuery ? 'কোনো কাস্টমার পাওয়া যায়নি' : 'কোনো কাস্টমার নেই'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {internalQuery
                ? `"${internalQuery}" নামে বা এই নম্বরে কোনো কাস্টমার বা খাতা খুঁজে পাওয়া যায়নি। সঠিক নাম বা নম্বর দিয়ে আবার চেষ্টা করুন।`
                : 'দোকানের প্রথম কাস্টমার যোগ করতে নিচের বাটনে ক্লিক করুন।'}
            </p>
          </div>
          {internalQuery ? (
            <button
              type="button"
              onClick={handleClearQuery}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <span>সার্চ রিসেট করুন</span>
            </button>
          ) : (
            <button
              onClick={onOpenAddCustomer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
            >
              <Users className="w-4 h-4" />
              <span>নতুন কাস্টমার যোগ করুন</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
