import React, { useState } from 'react';
import { Database, Plus, Sparkles } from 'lucide-react';
import { COMPREHENSIVE_INDEX_RULES } from './indexRulesData';
import { IndexSearchFilter } from './IndexSearchFilter';
import { IndexCardItem } from './IndexCardItem';
import { CustomIndexGeneratorModal } from './CustomIndexGeneratorModal';

export const DatabaseIndexesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredRules = COMPREHENSIVE_INDEX_RULES.filter((rule) => {
    const matchesPriority = priorityFilter === 'all' || rule.priority === priorityFilter;
    const matchesSearch =
      rule.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.indexes.some((idx) => idx.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rule.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Database .indexOn Registry</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Firebase Realtime Database indexing schema providing instant query response
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Index Rule</span>
        </button>
      </div>

      {/* Filter and Search */}
      <IndexSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedPriority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        totalCount={COMPREHENSIVE_INDEX_RULES.length}
        filteredCount={filteredRules.length}
      />

      {/* List of Index Cards */}
      <div className="space-y-2.5 pt-1">
        {filteredRules.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No index rules match your search criteria.
          </div>
        ) : (
          filteredRules.map((rule) => <IndexCardItem key={rule.collection} rule={rule} />)
        )}
      </div>

      {/* Modal */}
      <CustomIndexGeneratorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
