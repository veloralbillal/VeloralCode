import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Ban,
  User,
  Hash,
  Clock,
} from 'lucide-react';
import { LicenseKey } from '../../types';
import {
  fetchLicenseKeys,
  generateAndSaveLicenseKeys,
  revokeLicenseKey,
  deleteLicenseKey,
  CreateLicenseParams,
} from '../../services/licenseService';
import { formatDate, formatDateTime, copyTextToClipboard } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TableRowSkeleton } from '../common/LoadingSkeleton';
import { LicenseExpiryBadge } from './LicenseExpiryBadge';
import { GenerateKeyModal } from './GenerateKeyModal';

export const AdminLicenses: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'used' | 'revoked'>('all');
  const [showGenModal, setShowGenModal] = useState(false);

  // Copy tracking & action busy tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await fetchLicenseKeys();
      setKeys(data);
    } catch (err) {
      console.warn('Error loading keys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerate = async (params: CreateLicenseParams) => {
    try {
      const newKeys = await generateAndSaveLicenseKeys(params);
      setKeys((prev) => [...newKeys, ...prev]);
      showToast(`Generated ${newKeys.length} new license key(s)!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate license keys', 'error');
      throw err;
    }
  };

  const handleCopy = async (key: LicenseKey) => {
    const ok = await copyTextToClipboard(key.key);
    if (ok) {
      setCopiedId(key.id);
      showToast(`Copied ${key.key} to clipboard!`, 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRevoke = async (key: LicenseKey) => {
    if (key.status === 'revoked') return;
    setActionId(key.id);
    try {
      await revokeLicenseKey(key.id);
      setKeys((prev) =>
        prev.map((k) => (k.id === key.id ? { ...k, status: 'revoked' } : k))
      );
      showToast(`License key ${key.key} has been revoked.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke key', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (key: LicenseKey) => {
    if (!window.confirm(`Are you sure you want to delete license key ${key.key}?`)) return;
    setActionId(key.id);
    try {
      await deleteLicenseKey(key.id);
      setKeys((prev) => prev.filter((k) => k.id !== key.id));
      showToast(`License key deleted successfully.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete key', 'error');
    } finally {
      setActionId(null);
    }
  };

  // Stats
  const totalKeys = keys.length;
  const activeKeys = keys.filter((k) => k.status === 'active').length;
  const usedKeys = keys.filter((k) => k.status === 'used').length;
  const revokedKeys = keys.filter((k) => k.status === 'revoked').length;

  const filteredKeys = keys.filter((k) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      k.key.toLowerCase().includes(q) ||
      (k.note && k.note.toLowerCase().includes(q)) ||
      (k.usedByEmail && k.usedByEmail.toLowerCase().includes(q)) ||
      (k.usedByNumericUid && k.usedByNumericUid.includes(q));

    const matchesStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Keys
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalKeys}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Active / Available
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeKeys}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Activated with Timer
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {usedKeys}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            Revoked
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {revokedKeys}
          </span>
        </div>
      </div>

      {/* 2. Top Controls & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search key, user email, or 8-digit UID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">🟢 Active</option>
            <option value="used">🟡 Activated</option>
            <option value="revoked">🔴 Revoked</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadKeys}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Generate Keys</span>
          </button>
        </div>
      </div>

      {/* 3. Keys Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6">
            <table className="w-full">
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No License Keys Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Generate new license keys with expiration timer to distribute to users for Premium Pro upgrades.
            </p>
            <button
              onClick={() => setShowGenModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate First Key</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">License Key</th>
                  <th className="py-3.5 px-4">Plan Tier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Validity / Expiry Timer</th>
                  <th className="py-3.5 px-4">Redeemed By (User)</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Note</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredKeys.map((k) => {
                  const isCopied = copiedId === k.id;
                  const isBusy = actionId === k.id;

                  return (
                    <tr key={k.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      {/* Key Code */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 tracking-wider">
                            {k.key}
                          </span>
                          <button
                            onClick={() => handleCopy(k)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition"
                            title="Copy License Key"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                          <Sparkles className="w-3 h-3 fill-current" />
                          <span>{k.plan.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {k.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span>● Active</span>
                          </span>
                        )}
                        {k.status === 'used' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Activated</span>
                          </span>
                        )}
                        {k.status === 'revoked' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <Ban className="w-2.5 h-2.5" />
                            <span>Revoked</span>
                          </span>
                        )}
                      </td>

                      {/* Validity / Expiry Timer */}
                      <td className="py-4 px-4">
                        <LicenseExpiryBadge license={k} />
                      </td>

                      {/* Redeemed User Info */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {k.usedByEmail ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                              <User className="w-3 h-3 text-indigo-500" />
                              <span>{k.usedByEmail}</span>
                            </div>
                            {k.usedByNumericUid && (
                              <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                                <Hash className="w-2.5 h-2.5" />
                                <span>UID: {k.usedByNumericUid}</span>
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400 block">
                              Activated on {formatDateTime(k.usedAt || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Not activated yet</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-slate-400 text-[11px]">
                        {formatDate(k.createdAt)}
                      </td>

                      {/* Note */}
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 max-w-[150px] truncate">
                        {k.note || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {k.status === 'active' && (
                            <button
                              onClick={() => handleRevoke(k)}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-[11px] font-bold transition"
                              title="Revoke key"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(k)}
                            disabled={isBusy}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            title="Delete record"
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

      {/* 4. Generate Keys Modal Component */}
      <GenerateKeyModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        onGenerate={handleGenerate}
        userEmail={currentUser?.email || 'Admin'}
      />
    </div>
  );
};
