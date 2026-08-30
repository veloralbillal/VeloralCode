import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, Clock, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import { FeatureRequest } from '../../types';
import { submitFeatureRequest, getUserFeatureRequests } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

interface UserFeatureRequestCardProps {
  userId: string;
  userEmail: string;
  userNumericUid?: string;
}

export const UserFeatureRequestCard: React.FC<UserFeatureRequestCardProps> = ({
  userId,
  userEmail,
  userNumericUid,
}) => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('New Tool / Script');
  const [description, setDescription] = useState('');

  const loadRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserFeatureRequests(userId);
      setRequests(data);
    } catch (err) {
      console.warn('Could not load feature requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in title and description', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeatureRequest({
        userId,
        userEmail,
        userNumericUid,
        title: title.trim(),
        category,
        description: description.trim(),
      });

      showToast('Feature request submitted to Admin!', 'success');
      setTitle('');
      setDescription('');
      setShowForm(false);
      await loadRequests();
    } catch {
      showToast('Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: FeatureRequest['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Completed
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Approved
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400">
            Under Review
          </span>
        );
      case 'declined':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Feature & Code Request Box
            </h3>
            <p className="text-[10px] text-slate-400">
              Request new codes, scripts, or features from Admin
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showForm ? 'Cancel' : 'New Request'}</span>
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3 animate-in fade-in duration-150 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Title / What do you need?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need Python Discord Bot Script with Buttons"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="New Tool / Script">New Tool / Script</option>
                <option value="UI Template">UI Template</option>
                <option value="API Integration">API Integration</option>
                <option value="Platform Improvement">Platform Improvement</option>
                <option value="Bug Fix">Bug Fix</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Your Email / UID
              </label>
              <input
                type="text"
                disabled
                value={`${userEmail} (${userNumericUid || 'UID'})`}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Description & Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what features, dependencies, or inputs this code should have..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>{submitting ? 'Sending...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Requests list */}
      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
          Loading your submitted requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500">
            Have an idea for a code or tool? Submit a request above and our team will review it!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(req.status)}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {req.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatDate(req.createdAt)}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {req.description}
              </p>

              {req.adminReply && (
                <div className="mt-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-[11px] text-indigo-700 dark:text-indigo-300">
                  <span className="font-bold block text-[10px] text-indigo-500 uppercase tracking-wider">
                    Admin Response:
                  </span>
                  {req.adminReply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
