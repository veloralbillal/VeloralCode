import React, { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
} from 'lucide-react';
import { LicenseKey } from '../../types';
import { copyTextToClipboard, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface SellerRecentKeysTableProps {
  keys: LicenseKey[];
  onNavigate: (route: string) => void;
}

export const SellerRecentKeysTable: React.FC<SellerRecentKeysTableProps> = ({
  keys,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (keyStr: string) => {
    copyTextToClipboard(keyStr);
    setCopiedKey(keyStr);
    showToast('Key copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyClientMessage = (k: LicenseKey) => {
    const durationLabel = k.durationDays === 0 ? 'Lifetime Access' : `${k.durationDays} Days`;
    const message = `🎉 License Key: ${k.key}\n⏱ Plan: ${k.plan.toUpperCase()} (${durationLabel})\n🌐 Activate here: ${window.location.origin}/#/profile`;
    copyTextToClipboard(message);
    showToast('Client delivery message copied!', 'success');
  };

  const recentKeys = keys.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Recent Generated Keys
          </h3>
          <p className="text-xs text-slate-500">Your latest generated customer activation keys</p>
        </div>
        <button
          onClick={() => onNavigate('#/seller/keys')}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>View All ({keys.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentKeys.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No license keys generated yet. Use the Key Generator to create keys.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 px-2">License Key</th>
                <th className="pb-3 px-2">Plan</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Created</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentKeys.map((item) => {
                const isCopied = copiedKey === item.key;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      {item.key}
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                      {item.durationDays === 0 ? 'Lifetime' : `${item.durationDays}d`}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : item.status === 'used'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                        }`}
                      >
                        {item.status === 'active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{item.status === 'active' ? 'Active' : 'Redeemed'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(item.key)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="Copy Key"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {item.status === 'active' && (
                          <button
                            onClick={() => handleCopyClientMessage(item)}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                            title="Copy Client Text"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
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
  );
};
