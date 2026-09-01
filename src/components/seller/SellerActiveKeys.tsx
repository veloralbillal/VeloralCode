import React, { useState, useEffect } from 'react';
import {
  Key,
  Search,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Sparkles,
  Share2,
  Calendar,
  Send,
  Zap,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchKeysBySeller } from '../../services/sellerService';
import { LicenseKey } from '../../types';
import { copyTextToClipboard, formatDate } from '../../utils/helpers';

interface SellerActiveKeysProps {
  onNavigate: (route: string) => void;
}

export const SellerActiveKeys: React.FC<SellerActiveKeysProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedKeyForDispatch, setSelectedKeyForDispatch] = useState<LicenseKey | null>(null);

  useEffect(() => {
    if (userProfile?.userId) {
      loadActiveKeys();
    }
  }, [userProfile?.userId]);

  const loadActiveKeys = async () => {
    if (!userProfile?.userId) return;
    setLoading(true);
    try {
      const allKeys = await fetchKeysBySeller(userProfile.userId);
      // Filter only active / unused keys
      const active = allKeys.filter((k) => k.status === 'active');
      setKeys(active);
    } catch (err: any) {
      showToast('Error loading active keys: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (keyStr: string) => {
    copyTextToClipboard(keyStr);
    setCopiedKey(keyStr);
    showToast('Key copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredKeys = keys.filter((item) => {
    const matchesSearch =
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlan =
      planFilter === 'all' ||
      (planFilter === 'lifetime' && item.durationDays === 0) ||
      (planFilter === '30' && item.durationDays === 30) ||
      (planFilter === '90' && item.durationDays === 90) ||
      (planFilter === '180' && item.durationDays === 180) ||
      (planFilter === '365' && item.durationDays === 365);

    return matchesSearch && matchesPlan;
  });

  const handleCopyDispatchMessage = (k: LicenseKey) => {
    const durationLabel = k.durationDays === 0 ? 'Lifetime Access' : `${k.durationDays} Days`;
    const message = `🎉 Thank you for your purchase!\n🔑 License Key: ${k.key}\n⏱ Plan: ${k.plan.toUpperCase()} (${durationLabel})\n🌐 Activate here: ${window.location.origin}/#/profile\n\n📌 Instructions:\n1. Log into your account.\n2. Go to Profile > Activate License.\n3. Paste your key and click 'Redeem Key'.`;
    
    copyTextToClipboard(message);
    showToast('Client delivery message copied!', 'success');
  };

  const exportActiveKeys = () => {
    if (filteredKeys.length === 0) return;
    const text = filteredKeys.map((k) => k.key).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `active_license_keys_${Date.now()}.txt`;
    link.click();
    showToast('Active keys downloaded as TXT file', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Ready to Sell / Active Keys
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black">
                {keys.length} Available
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              These license keys have not been redeemed yet. Copy them directly or generate client dispatch text for immediate delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportActiveKeys}
            disabled={filteredKeys.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export TXT</span>
          </button>
          <button
            onClick={() => onNavigate('#/seller/generate')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Generate More</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active key or customer tag..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Plan:</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
          >
            <option value="all">All Durations</option>
            <option value="30">1 Month (30d)</option>
            <option value="90">3 Months (90d)</option>
            <option value="180">6 Months (180d)</option>
            <option value="365">1 Year (365d)</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </div>
      </div>

      {/* Active Keys Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading active keys...</div>
      ) : filteredKeys.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Key className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No active keys available</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any unredeemed keys in this filter. Use the generator to create new client keys.
          </p>
          <button
            onClick={() => onNavigate('#/seller/generate')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Generate Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKeys.map((item) => {
            const isCopied = copiedKey === item.key;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-600 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Active / Ready
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.durationDays === 0 ? 'Lifetime' : `${item.durationDays} Days`}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-slate-900 dark:text-white tracking-wider">
                      {item.key}
                    </span>
                    <button
                      onClick={() => handleCopy(item.key)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                      title="Copy Key Only"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {item.note && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.note}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDispatchMessage(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Copy Client Text</span>
                  </button>
                  <button
                    onClick={() => handleCopy(item.key)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title="Quick Copy Key"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
