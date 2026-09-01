import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  ArrowDownToLine,
  Wallet,
  CreditCard,
  Building2,
  FileText
} from 'lucide-react';
import { CreatorTransaction } from '../../types';
import { fetchWithdrawalRequests, updateWithdrawalStatus } from '../../services/creatorService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminWithdrawals: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [withdrawals, setWithdrawals] = useState<CreatorTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  // Action Modals
  const [selectedTx, setSelectedTx] = useState<CreatorTransaction | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await fetchWithdrawalRequests();
      setWithdrawals(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load withdrawal requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const filteredList = useMemo(() => {
    return withdrawals.filter((tx) => {
      const matchesSearch = 
        tx.creatorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, searchTerm, statusFilter]);

  const pendingRequests = withdrawals.filter(w => w.status === 'pending');
  const totalPendingAmount = pendingRequests.reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0);
  const completedCount = withdrawals.filter(w => w.status === 'completed').length;
  const totalPayout = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0);

  const handleProcess = async (newStatus: 'completed' | 'cancelled') => {
    if (!selectedTx) return;
    try {
      setActionLoading(true);
      await updateWithdrawalStatus(
        selectedTx.id, 
        newStatus, 
        adminNote, 
        currentUser?.email || 'Admin'
      );

      if (newStatus === 'completed') {
        showToast(`Withdrawal of $${Math.abs(selectedTx.amount).toFixed(2)} for ${selectedTx.creatorEmail} marked as completed!`, 'success');
      } else {
        showToast(`Withdrawal cancelled. $${Math.abs(selectedTx.amount).toFixed(2)} refunded to creator balance.`, 'info');
      }

      setShowApproveModal(false);
      setShowCancelModal(false);
      setSelectedTx(null);
      setAdminNote('');
      loadWithdrawals();
    } catch (err: any) {
      showToast(err.message || 'Failed to update withdrawal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('pending')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'pending'
              ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white">{pendingRequests.length}</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">${totalPendingAmount.toFixed(2)}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Awaiting bank/bKash/crypto transfer</p>
        </div>

        <div 
          onClick={() => setStatusFilter('completed')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'completed'
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed Payouts</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white">{completedCount}</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${totalPayout.toFixed(2)}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Successfully transferred to creators</p>
        </div>

        <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Total Volume</span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white">{withdrawals.length}</p>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              ${(totalPendingAmount + totalPayout).toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All-time withdrawal requests</p>
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
            placeholder="Search creator email, reference..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['all', 'pending', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Requests' : st}
              </button>
            ))}
          </div>

          <button
            onClick={loadWithdrawals}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading payout requests...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No withdrawal requests found</p>
            <p className="text-xs text-slate-500">When creators request money payouts, they will be listed here for approval.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Creator / Email</th>
                  <th className="py-3.5 px-4">Requested Amount</th>
                  <th className="py-3.5 px-4">Payout Method & Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {filteredList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{tx.creatorEmail}</p>
                          <p className="text-[10px] text-slate-400 font-mono">UID: {tx.creatorUid}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                        ${Math.abs(tx.amount).toFixed(2)} USD
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="max-w-xs space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{tx.description || 'Withdrawal request'}</p>
                        {tx.adminNote && (
                          <p className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <strong>Note:</strong> {tx.adminNote}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {tx.status === 'completed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Transferred
                        </span>
                      )}
                      {tx.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[11px] font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Pending Approval
                        </span>
                      )}
                      {tx.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Cancelled / Refunded
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setShowApproveModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setShowCancelModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600/10 dark:bg-rose-950/40 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve / Mark Paid Modal */}
      {showApproveModal && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Approve Payout</h3>
                <p className="text-xs text-slate-500">Confirm payment has been sent to creator</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Creator:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTx.creatorEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${Math.abs(selectedTx.amount).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method Details:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedTx.description}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Payment Reference / Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Sent via bKash TrxID: 9X29A10B / Bank Ref: #88219"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleProcess('completed')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm & Mark Completed'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel / Refund Modal */}
      {showCancelModal && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cancel Withdrawal Request</h3>
                <p className="text-xs text-slate-500">Refund funds back into creator wallet</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Cancelling this request will automatically credit <strong>${Math.abs(selectedTx.amount).toFixed(2)} USD</strong> back to <strong>{selectedTx.creatorEmail}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Cancellation Reason
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Invalid account details provided, please update wallet information."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleProcess('cancelled')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Cancel & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
