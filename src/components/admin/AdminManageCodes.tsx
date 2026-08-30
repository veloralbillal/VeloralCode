import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Filter,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { CodeItem, SupportedLanguage } from '../../types';
import {
  subscribeToAllCodes,
  deleteExistingCode,
  updateExistingCode,
} from '../../services/codeService';
import { TableRowSkeleton } from '../common/LoadingSkeleton';
import { DeleteConfirmModal } from '../common/Modal';
import { formatDate, getCategoryBadgeClass } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface AdminManageCodesProps {
  onNavigate: (route: string) => void;
}

export const AdminManageCodes: React.FC<AdminManageCodesProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [selectedForDelete, setSelectedForDelete] = useState<CodeItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAllCodes(
      (items) => {
        setCodes(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    codes.forEach((item) => {
      if (item.category && item.category.trim()) {
        cats.add(item.category.trim());
      }
    });
    return Array.from(cats).sort();
  }, [codes]);

  const filtered = useMemo(() => {
    return codes.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.language?.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [codes, statusFilter, categoryFilter, searchQuery]);

  const handleToggleStatus = async (item: CodeItem) => {
    if (!item.id) return;
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await updateExistingCode(item.id, { status: newStatus });
      showToast(
        `Code status changed to ${newStatus === 'published' ? 'Live' : 'Draft'}`,
        'success'
      );
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete?.id) return;
    setDeleteLoading(true);
    try {
      await deleteExistingCode(selectedForDelete.id);
      showToast('Code entry removed from Realtime Database.', 'info');
      setSelectedForDelete(null);
    } catch (err: any) {
      showToast('Failed to delete item', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter codes by title, tag, language..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {availableCategories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses ({codes.length})</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <button
            onClick={() => onNavigate('#/admin/add')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Code</span>
          </button>
        </div>
      </div>

      {/* Table & Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            <table className="w-full">
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Code2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No code entries found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or add your first snippet now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Language</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    {/* Title */}
                    <td className="py-4 px-4 max-w-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                          {item.description || 'No description'}
                        </span>
                      </div>
                    </td>

                    {/* Language */}
                    <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {item.language}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      <span className="text-[11px] font-semibold">{item.category}</span>
                    </td>

                    {/* Version */}
                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">
                      v{item.version || '1.0.0'}
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {item.views || 0}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          item.status === 'published'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> Live
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Updated */}
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => item.id && onNavigate(`#/code/${item.id}`)}
                          title="Preview in User view"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => item.id && onNavigate(`#/admin/edit/${item.id}`)}
                          title="Edit Code"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedForDelete(item)}
                          title="Delete Code"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(selectedForDelete)}
        onClose={() => setSelectedForDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Code Entry"
        itemTitle={selectedForDelete?.title}
        loading={deleteLoading}
      />
    </div>
  );
};
