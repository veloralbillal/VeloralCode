import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  UserPlus,
  Search,
  RefreshCw,
  Wallet,
  DollarSign,
  Award,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { UserProfile, CreatorTransaction } from '../../types';
import {
  fetchAllCreators,
  createNewCreator,
  fetchCreatorTransactions,
  adjustCreatorWallet,
} from '../../services/creatorService';
import { updateUserStatus } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

export const AdminCreators: React.FC = () => {
  const { showToast } = useToast();
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<CreatorTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Creator Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newInitialBalance, setNewInitialBalance] = useState('10');
  const [newBio, setNewBio] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Frontend & UI Tools');
  const [createLoading, setCreateLoading] = useState(false);

  // Manage Balance Modal
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<UserProfile | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('10');
  const [adjustReason, setAdjustReason] = useState('Special contribution bonus');
  const [adjustLoading, setAdjustLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, txList] = await Promise.all([
        fetchAllCreators(),
        fetchCreatorTransactions(),
      ]);
      setCreators(cList);
      setTransactions(txList);
    } catch (err: any) {
      showToast('Failed to load creator directory: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      showToast('Email is required', 'warning');
      return;
    }

    setCreateLoading(true);
    try {
      await createNewCreator({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword.trim() || undefined,
        initialBalance: parseFloat(newInitialBalance) || 0,
        bio: newBio.trim(),
        specialty: newSpecialty.trim(),
      });

      showToast(`Creator account for ${newEmail} created successfully!`, 'success');
      setAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewInitialBalance('10');
      setNewBio('');
      await loadData();
    } catch (err: any) {
      showToast('Error creating creator: ' + err.message, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator) return;
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    setAdjustLoading(true);
    try {
      await adjustCreatorWallet({
        creatorUid: selectedCreator.userId,
        creatorEmail: selectedCreator.email,
        type: adjustType,
        amount: amt,
        reason: adjustReason.trim(),
      });

      showToast(`Wallet ${adjustType === 'credit' ? 'credited' : 'debited'} successfully!`, 'success');
      setBalanceModalOpen(false);
      setSelectedCreator(null);
      await loadData();
    } catch (err: any) {
      showToast('Error updating wallet: ' + err.message, 'error');
    } finally {
      setAdjustLoading(false);
    }
  };

  const handleToggleStatus = async (creator: UserProfile) => {
    const nextStatus = creator.status === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatus(creator.userId, nextStatus);
      showToast(`Creator account set to ${nextStatus}`, 'info');
      setCreators((prev) =>
        prev.map((c) => (c.userId === creator.userId ? { ...c, status: nextStatus } : c))
      );
    } catch (err: any) {
      showToast('Error updating creator status: ' + err.message, 'error');
    }
  };

  const filteredCreators = creators.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.numericUid?.includes(searchQuery) ||
      c.creatorSpecialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Creators & Tool Contributors</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create verified creator accounts, audit tool rewards, and manage contributor wallets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Create Creator Account
          </button>
        </div>
      </div>

      {/* Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Creators</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {creators.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Creator Balance</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              ${creators.reduce((acc, c) => acc + Number(c.creatorBalance || 0), 0).toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Wallet Operations</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {transactions.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creator by name, email, UID, or specialty..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading creators...</div>
        ) : filteredCreators.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No creators found</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Try matching another name or email.' : 'Click "Create Creator Account" to add the first contributor.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Creator Info</th>
                  <th className="py-3.5 px-4">Specialty</th>
                  <th className="py-3.5 px-4 text-right">Wallet Balance</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredCreators.map((creator) => (
                  <tr key={creator.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{creator.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{creator.email}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        UID: {creator.numericUid || '—'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                        {creator.creatorSpecialty || 'Web & Code Tools'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ${Number(creator.creatorBalance || 0).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(creator)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          creator.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200'
                        } transition-colors`}
                      >
                        {creator.status === 'active' ? 'Active' : 'Suspended'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {formatDate(creator.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedCreator(creator);
                          setBalanceModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Wallet className="w-3.5 h-3.5" /> Adjust Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Creator Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Creator Account</h3>
                <p className="text-xs text-slate-400">Assign tool contributor & creator permissions</p>
              </div>
            </div>

            <form onSubmit={handleCreateCreator} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="creator@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password (Optional, for direct login)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Initial Balance ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInitialBalance}
                    onChange={(e) => setNewInitialBalance(e.target.value)}
                    placeholder="10.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="UI Components"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {balanceModalOpen && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Adjust Creator Wallet</h3>
                <p className="text-xs text-slate-400">{selectedCreator.name} ({selectedCreator.email})</p>
              </div>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustType('credit')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    adjustType === 'credit'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  + Add Credit (Bonus)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('debit')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    adjustType === 'debit'
                      ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  - Deduct Balance
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Top tool creation reward"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBalanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {adjustLoading ? 'Applying...' : 'Apply Wallet Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
