import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Filter,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CodeItem } from '../../types';
import { subscribeToCreatorCodes } from '../../services/creatorService';
import { deleteExistingCode } from '../../services/codeService';
import { DeleteConfirmModal } from '../common/Modal';
import { formatDate } from '../../utils/helpers';

interface CreatorToolsListProps {
  onNavigate: (route: string) => void;
}

export const CreatorToolsList: React.FC<CreatorToolsListProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending_approval' | 'rejected'>('all');

  const [selectedForDelete, setSelectedForDelete] = useState<CodeItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const unsubscribe = subscribeToCreatorCodes(
      currentUser.uid,
      currentUser.email || '',
      (items) => {
        setCodes(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [currentUser]);

  const filteredCodes = useMemo(() => {
    return codes.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.language.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [codes, searchQuery, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete || !selectedForDelete.id) return;
    setDeleteLoading(true);
    try {
      await deleteExistingCode(selectedForDelete.id);
      showToast('Tool deleted successfully.', 'info');
      setSelectedForDelete(null);
    } catch (err: any) {
      showToast('Error deleting tool: ' + err.message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Uploaded Tools</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your submitted components, check approval statuses, and view live metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('#/creator/upload')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Upload New Tool
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tool title, language, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full md:w-44 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Statuses ({codes.length})</option>
            <option value="published">
              Live Approved ({codes.filter((c) => c.status === 'published').length})
            </option>
            <option value="pending_approval">
              Pending Review ({codes.filter((c) => c.status === 'pending_approval').length})
            </option>
            <option value="rejected">
              Action Needed ({codes.filter((c) => c.status === 'rejected').length})
            </option>
          </select>
        </div>
      </div>

      {/* Tools Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading your repository tools...</div>
        ) : filteredCodes.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Code2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tools found</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Try matching another search query.' : 'Upload your first tool to get started!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Tool Details</th>
                  <th className="py-3.5 px-4">Language / Cat</th>
                  <th className="py-3.5 px-4 text-center">Views</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredCodes.map((item) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  );

                  if (item.status === 'pending_approval') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    );
                  } else if (item.status === 'rejected') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        <XCircle className="w-3 h-3" /> Action Needed
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Tool Title & Bio */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <p className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                        {item.status === 'rejected' && item.rejectionReason && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>Admin reason: {item.rejectionReason}</span>
                          </div>
                        )}
                      </td>

                      {/* Language / Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-semibold mr-1.5">
                          {item.language}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.category}</span>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{(item.views || 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">{statusBadge}</td>

                      {/* Updated */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDate(item.updatedAt || item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'published' && (
                            <button
                              onClick={() => onNavigate(`#/code/${item.id}`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="View Public Applet"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onNavigate(`#/creator/edit/${item.id}`)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                            title="Edit Code"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedForDelete(item)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedForDelete && (
        <DeleteConfirmModal
          isOpen={true}
          title="Delete Tool from Repository"
          message={`Are you sure you want to permanently delete "${selectedForDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete Tool"
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onClose={() => setSelectedForDelete(null)}
        />
      )}
    </div>
  );
};
