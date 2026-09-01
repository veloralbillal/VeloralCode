import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  User, 
  Code2, 
  DollarSign, 
  ArrowUpRight,
  RefreshCw,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { CodeItem } from '../../types';
import { fetchAllCreatorCodes, approveCreatorCode, rejectCreatorCode } from '../../services/creatorService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminCreatorToolsProps {
  onNavigate?: (route: string) => void;
}

export const AdminCreatorTools: React.FC<AdminCreatorToolsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [tools, setTools] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'published' | 'rejected'>('all');
  
  // Action Modals
  const [selectedTool, setSelectedTool] = useState<CodeItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalReward, setApprovalReward] = useState<number>(5.0);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [previewTool, setPreviewTool] = useState<CodeItem | null>(null);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCreatorCodes();
      setTools(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load creator tools', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.creatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.creatorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tools, searchTerm, statusFilter]);

  const pendingCount = tools.filter(t => t.status === 'pending_approval').length;
  const publishedCount = tools.filter(t => t.status === 'published').length;
  const rejectedCount = tools.filter(t => t.status === 'rejected').length;

  const handleApprove = async () => {
    if (!selectedTool) return;
    try {
      setActionLoading(true);
      await approveCreatorCode(selectedTool.id, currentUser?.email || 'Admin', approvalReward);
      showToast(`"${selectedTool.title}" has been approved and published live! Creator rewarded with $${approvalReward.toFixed(2)}`, 'success');
      setShowApproveModal(false);
      setSelectedTool(null);
      loadTools();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve tool', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTool) return;
    try {
      setActionLoading(true);
      await rejectCreatorCode(selectedTool.id, currentUser?.email || 'Admin', rejectReason || 'Does not meet standards');
      showToast(`"${selectedTool.title}" marked as rejected.`, 'info');
      setShowRejectModal(false);
      setSelectedTool(null);
      setRejectReason('');
      loadTools();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject tool', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('pending_approval')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'pending_approval' 
              ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-2 ring-amber-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{pendingCount}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tools awaiting admin moderation</p>
        </div>

        <div 
          onClick={() => setStatusFilter('published')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'published' 
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live & Published</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{publishedCount}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Available in public catalog</p>
        </div>

        <div 
          onClick={() => setStatusFilter('rejected')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'rejected' 
              ? 'bg-rose-500/10 border-rose-500/50 shadow-md ring-2 ring-rose-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Rejected / Revisions</span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{rejectedCount}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Returned for fixes</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tool title, creator, tags..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['all', 'pending_approval', 'published', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Tools' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={loadTools}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tools Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading submitted tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tools match your filter</p>
            <p className="text-xs text-slate-500">When creators upload code snippets or tools, they will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tool Details</th>
                  <th className="py-3.5 px-4">Creator</th>
                  <th className="py-3.5 px-4">Category & Tech</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {filteredTools.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold uppercase">
                          {t.title ? t.title.substring(0, 2) : 'TL'}
                        </div>
                        <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{t.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{t.description || 'No description provided.'}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                              ID: {t.id}
                            </span>
                            {t.plan === 'premium' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                                Premium Only
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{t.creatorName || 'Unknown Creator'}</p>
                          <p className="text-[11px] text-slate-400">{t.creatorEmail || 'No email'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          {t.category}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {t.tags?.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-slate-500 dark:text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {t.status === 'published' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      )}
                      {t.status === 'pending_approval' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[11px] font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      )}
                      {t.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewTool(t)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                          title="Preview Code"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {t.status !== 'published' && (
                          <button
                            onClick={() => {
                              setSelectedTool(t);
                              setShowApproveModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {t.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setSelectedTool(t);
                              setShowRejectModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/10 dark:bg-rose-950/40 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        {onNavigate && (
                          <button
                            onClick={() => onNavigate(`#/code/${t.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                            title="Open in Runner"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Inspector / Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{previewTool.title}</h3>
                  <p className="text-xs text-slate-400">By {previewTool.creatorName} ({previewTool.creatorEmail})</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTool(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-300 mb-1">Description:</p>
                <p className="text-slate-400">{previewTool.description || 'No description'}</p>
              </div>

              {previewTool.html && (
                <div>
                  <p className="text-amber-400 font-bold mb-1 uppercase tracking-wider text-[11px]">HTML Markup</p>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-slate-300 font-mono text-[11px]">
                    {previewTool.html}
                  </pre>
                </div>
              )}

              {previewTool.css && (
                <div>
                  <p className="text-blue-400 font-bold mb-1 uppercase tracking-wider text-[11px]">CSS Styles</p>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-slate-300 font-mono text-[11px]">
                    {previewTool.css}
                  </pre>
                </div>
              )}

              {previewTool.js && (
                <div>
                  <p className="text-emerald-400 font-bold mb-1 uppercase tracking-wider text-[11px]">JavaScript Logic</p>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-slate-300 font-mono text-[11px]">
                    {previewTool.js}
                  </pre>
                </div>
              )}

              {previewTool.code && (
                <div>
                  <p className="text-purple-400 font-bold mb-1 uppercase tracking-wider text-[11px]">Single File / Main Source</p>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-slate-300 font-mono text-[11px]">
                    {previewTool.code}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
              <button
                onClick={() => setPreviewTool(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Preview
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTool(previewTool);
                    setPreviewTool(null);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-xs font-semibold"
                >
                  Reject Tool
                </button>
                <button
                  onClick={() => {
                    setSelectedTool(previewTool);
                    setPreviewTool(null);
                    setShowApproveModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold"
                >
                  Approve & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Approve Creator Tool</h3>
                <p className="text-xs text-slate-500">Publish live to catalog and reward the creator</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              You are about to publish <strong>{selectedTool.title}</strong> by <strong>{selectedTool.creatorName}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Approval Bounty Reward ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={approvalReward}
                  onChange={(e) => setApprovalReward(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <p className="text-[11px] text-slate-400">This amount will be directly deposited into creator's wallet balance.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {actionLoading ? 'Publishing...' : 'Approve & Credit Reward'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Reject Tool Submission</h3>
                <p className="text-xs text-slate-500">Provide feedback for creator revision</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason / Revision Note
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Please fix JavaScript runtime console error on button click, or provide a clearer layout."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
