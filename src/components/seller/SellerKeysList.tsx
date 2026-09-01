import React, { useState, useEffect } from 'react';
import {
  FolderKey,
  Search,
  Copy,
  Check,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchKeysBySeller } from '../../services/sellerService';
import { LicenseKey } from '../../types';
import { copyTextToClipboard, formatDate } from '../../utils/helpers';

interface SellerKeysListProps {
  onNavigate: (route: string) => void;
}

export const SellerKeysList: React.FC<SellerKeysListProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.userId) {
      loadKeys();
    }
  }, [userProfile?.userId]);

  const loadKeys = async () => {
    if (!userProfile?.userId) return;
    setLoading(true);
    try {
      const data = await fetchKeysBySeller(userProfile.userId);
      setKeys(data);
    } catch (err: any) {
      showToast('Error loading keys: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (keyStr: string) => {
    copyTextToClipboard(keyStr);
    setCopiedKey(keyStr);
    showToast('Key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredKeys = keys.filter((item) => {
    const matchesSearch =
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.usedByEmail && item.usedByEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportAllKeys = () => {
    if (filteredKeys.length === 0) return;
    const rows = filteredKeys.map(
      (k) =>
        `"${k.key}","${k.plan}","${k.durationDays === 0 ? 'Lifetime' : `${k.durationDays} Days`}","${
          k.status
        }","${k.usedByEmail || ''}","${formatDate(k.createdAt)}","${k.note || ''}"`
    );
    const csvContent =
      'data:text/csv;charset=utf-8,Key,Plan,Duration,Status,RedeemedBy,CreatedAt,CustomerNote\n' +
      rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `my_generated_keys_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported filtered keys to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <FolderKey className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              My Generated License Keys
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                {keys.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track customer redemption and license statuses in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAllKeys}
            disabled={filteredKeys.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('#/seller/generate')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/25 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keys, customer note, redeemed user email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'used', 'revoked'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">License Key</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Cost</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Redeemed By</th>
                <th className="py-3.5 px-4">Customer Note</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading keys...</span>
                  </td>
                </tr>
              ) : filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FolderKey className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No license keys found</p>
                    <p className="text-[11px]">Generate keys using your points wallet.</p>
                  </td>
                </tr>
              ) : (
                filteredKeys.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {item.key}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.durationDays === 0 ? 'Lifetime' : `${item.durationDays} Days`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-amber-600 font-bold">{item.coinsCost || 10} Pts</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                      {item.status === 'used' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                          Redeemed
                        </span>
                      )}
                      {item.status === 'revoked' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <Ban className="w-3 h-3 text-rose-500" />
                          Revoked
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.usedByEmail ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                            {item.usedByEmail}
                          </p>
                          {item.usedAt && (
                            <p className="text-[10px] text-slate-400">{formatDate(item.usedAt)}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not redeemed yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[140px] truncate">
                      {item.note || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopy(item.key)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                        title="Copy Key"
                      >
                        {copiedKey === item.key ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
