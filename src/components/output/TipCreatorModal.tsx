import React, { useState } from 'react';
import { Heart, X, CheckCircle2, Coins, Sparkles, User } from 'lucide-react';
import { sendTipToCreator } from '../../services/toolInteractionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bdtToUsd, formatBDT, formatUSD } from '../../utils/currency';
import { formatCreatorName } from '../../utils/userDisplay';

interface TipCreatorModalProps {
  codeId: string;
  toolTitle: string;
  creatorUid?: string;
  creatorName?: string;
  creatorEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TipCreatorModal: React.FC<TipCreatorModalProps> = ({
  codeId,
  toolTitle,
  creatorUid,
  creatorName,
  creatorEmail,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const cleanCreatorName = formatCreatorName(creatorName, creatorEmail, 'Creator');

  // BDT is the primary currency for tipping
  const [bdtAmount, setBdtAmount] = useState<number>(100);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const usdEquivalent = bdtToUsd(bdtAmount);

  const handleSendTip = async () => {
    if (!currentUser) {
      showToast('Please sign in to tip the creator', 'info');
      return;
    }
    if (bdtAmount <= 0) {
      showToast('Please choose a valid tip amount in BDT', 'warning');
      return;
    }

    try {
      setLoading(true);
      await sendTipToCreator({
        codeId,
        toolTitle,
        senderUid: currentUser.uid,
        senderName: formatCreatorName(currentUser.displayName, currentUser.email, 'Supporter'),
        senderEmail: currentUser.email || '',
        creatorUid: creatorUid || '',
        creatorEmail: creatorEmail || '',
        amountBDT: bdtAmount,
        amountUSD: usdEquivalent,
        message,
      });

      setSuccess(true);
      showToast(`Thank you! ৳${bdtAmount} ($${usdEquivalent.toFixed(2)}) tip sent to ${cleanCreatorName}!`, 'success');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      showToast(err.message || 'Failed to send tip', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Heart className="w-6 h-6 fill-rose-500/30" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Tip & Support Creator</h3>
              <p className="text-xs text-slate-400">
                Supporting <span className="text-rose-300 font-semibold">{cleanCreatorName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2.5">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <p className="font-bold text-base text-emerald-400">Tip Sent Successfully!</p>
            <p className="text-xs text-slate-300">
              The creator received <span className="font-bold text-amber-300">{formatBDT(bdtAmount)}</span> ({formatUSD(usdEquivalent)}) in their creator wallet!
            </p>
          </div>
        ) : (
          <>
            {/* Quick BDT Amount Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Select Tip Amount (টাকা ৳ BDT)</label>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3" /> Rate: 1 USD = 120 BDT
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[50, 100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBdtAmount(val)}
                    className={`py-2.5 px-1 rounded-xl font-bold text-xs transition border flex flex-col items-center justify-center ${
                      bdtAmount === val
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span>৳{val}</span>
                    <span className="text-[9px] opacity-75 font-normal">~${bdtToUsd(val)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom BDT Amount Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Custom Amount (৳ BDT)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 font-bold text-base">
                  ৳
                </span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={bdtAmount || ''}
                  onChange={(e) => setBdtAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="Enter amount in Taka (e.g. 150)"
                  className="w-full pl-9 pr-24 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-hidden focus:border-rose-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  ≈ {formatUSD(usdEquivalent)}
                </span>
              </div>
            </div>

            {/* Friendly Message */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Encouragement Note (Optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Amazing web tool! Keep building great things."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Tool: <strong className="text-slate-200">{toolTitle}</strong></span>
              <span className="text-emerald-400 font-semibold">Instant Wallet Credit</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                disabled={loading || bdtAmount <= 0}
                onClick={handleSendTip}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{loading ? 'Processing Tip...' : `Send ৳${bdtAmount} (${formatUSD(usdEquivalent)}) Tip`}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

