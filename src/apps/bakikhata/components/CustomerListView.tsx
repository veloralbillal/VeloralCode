import React, { useState } from 'react';
import { Users, AlertCircle, ArrowUpDown } from 'lucide-react';
import { Customer } from '../types';
import { CustomerCard } from './CustomerCard';

interface CustomerListViewProps {
  customers: Customer[];
  searchQuery: string;
  isTuesdayFilterActive: boolean;
  onOpenAddDue: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
  onOpenAddCustomer: () => void;
}

type TabFilter = 'all' | 'due_only' | 'tuesday' | 'settled';
type SortOption = 'due_desc' | 'activity_desc' | 'name_asc';

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  searchQuery,
  isTuesdayFilterActive,
  onOpenAddDue,
  onOpenPayment,
  onViewDetails,
  onOpenAddCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>(
    isTuesdayFilterActive ? 'tuesday' : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('due_desc');

  // React to prop change
  React.useEffect(() => {
    if (isTuesdayFilterActive) {
      setActiveTab('tuesday');
    }
  }, [isTuesdayFilterActive]);

  // Filter
  const filtered = customers.filter((c) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchAddr = c.address ? c.address.toLowerCase().includes(q) : false;
      if (!matchName && !matchPhone && !matchAddr) return false;
    }

    // Tabs
    if (activeTab === 'due_only') return c.totalDue > 0;
    if (activeTab === 'tuesday') return c.settlesOnTuesday && c.totalDue > 0;
    if (activeTab === 'settled') return c.totalDue <= 0;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'due_desc') return b.totalDue - a.totalDue;
    if (sortBy === 'activity_desc') return b.lastActivityAt - a.lastActivityAt;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'bn');
    return 0;
  });

  return (
    <div className="space-y-4">
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
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onOpenAddDue={onOpenAddDue}
              onOpenPayment={onOpenPayment}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No customers found
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery
              ? `"${searchQuery}" No matching customer name or number found`
              : 'Click the button below to add a customer and start recording transactions'}
          </p>
          <button
            onClick={onOpenAddCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Add New Customer</span>
          </button>
        </div>
      )}
    </div>
  );
};
