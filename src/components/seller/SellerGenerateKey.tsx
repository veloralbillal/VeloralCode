import React, { useState, useEffect } from 'react';
import {
  Key,
  Coins,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getSellerPricingConfig,
  calculateKeyCoinCost,
  sellerGenerateLicenseKeys,
} from '../../services/sellerService';
import { SellerPricingConfig, LicenseKey } from '../../types';
import { copyTextToClipboard } from '../../utils/helpers';

interface SellerGenerateKeyProps {
  onNavigate: (route: string) => void;
}

export const SellerGenerateKey: React.FC<SellerGenerateKeyProps> = ({ onNavigate }) => {
  const { userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [pricing, setPricing] = useState<SellerPricingConfig | null>(null);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [count, setCount] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>('SLR');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedKeys, setGeneratedKeys] = useState<LicenseKey[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    const config = await getSellerPricingConfig();
    setPricing(config);
  };

  const currentCoins = userProfile?.coinsBalance !== undefined ? userProfile.coinsBalance : 0;
  const perKeyCost = pricing ? calculateKeyCoinCost(durationDays, pricing) : 10;
  const totalCost = perKeyCost * count;
  const hasEnoughCoins = currentCoins >= totalCost;

  const durationOptions = [
    { label: '7 Days Trial', days: 7, desc: 'Short-term access' },
    { label: '1 Month (30 Days)', days: 30, desc: 'Standard monthly' },
    { label: '3 Months (90 Days)', days: 90, desc: 'Quarterly pack' },
    { label: '6 Months (180 Days)', days: 180, desc: 'Half-year pass' },
    { label: '1 Year (365 Days)', days: 365, desc: 'Annual pass' },
    { label: 'Lifetime Access', days: 0, desc: 'Unlimited permanent access' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      showToast('You must be logged in as a seller to generate keys.', 'error');
      return;
    }

    if (!hasEnoughCoins) {
      showToast(`Insufficient points! You need ${totalCost} coins but have ${currentCoins}.`, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await sellerGenerateLicenseKeys({
        seller: userProfile,
        plan: 'premium',
        durationDays,
        count,
        prefix: prefix.trim() || 'SLR',
        note: customerNote.trim() || undefined,
      });

      setGeneratedKeys(res.keys);
      showToast(`Successfully generated ${res.keys.length} key(s)! (${res.totalCost} coins spent)`, 'success');
      await refreshUserProfile();
    } catch (err: any) {
      showToast(err.message || 'Key generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key: string) => {
    copyTextToClipboard(key);
    setCopiedKey(key);
    showToast('License key copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyAll = () => {
    const text = generatedKeys.map((k) => k.key).join('\n');
    copyTextToClipboard(text);
    showToast(`Copied all ${generatedKeys.length} license keys!`, 'success');
  };

  const handleDownloadTxt = () => {
    const lines = generatedKeys.map(
      (k) =>
        `Key: ${k.key} | Plan: ${k.plan.toUpperCase()} | Duration: ${
          k.durationDays === 0 ? 'Lifetime' : `${k.durationDays} Days`
        }${k.note ? ` | Note: ${k.note}` : ''}`
    );
    const content = `=== GENERATED LICENSE KEYS ===\nSeller: ${userProfile?.name} (${userProfile?.email})\nGenerated At: ${new Date().toLocaleString()}\n\n${lines.join(
      '\n'
    )}\n\nRedeem URL: ${window.location.origin}/#/login`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `license_keys_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Keys downloaded as text file!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Live Point Balance & Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Reseller Point Wallet</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Generate Pro Activation Keys</h2>
            <p className="text-xs text-slate-300">
              Each key you generate burns points from your wallet according to the admin point rates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right space-y-0.5 min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Available Coins</span>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-3xl font-black text-amber-400">{currentCoins}</span>
              <span className="text-xs font-semibold text-slate-300">Pts</span>
            </div>
            <p className="text-[10px] text-slate-300">
              {hasEnoughCoins ? 'Ready to generate' : 'Low balance'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Key Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the access duration and quantity for your customer
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select License Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {durationOptions.map((opt) => {
                  const cost = pricing ? calculateKeyCoinCost(opt.days, pricing) : 10;
                  const isSelected = durationDays === opt.days;
                  return (
                    <div
                      key={opt.days}
                      onClick={() => setDurationDays(opt.days)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black">
                          <Coins className="w-3 h-3 text-amber-500" />
                          {cost} Pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Prefix Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Number of Keys
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-1">
                    {[1, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCount(num)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                          count === num
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prefix */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Key Prefix Tag
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP, SLR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 uppercase"
                />
              </div>
            </div>

            {/* Customer Note */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Customer Reference Note <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. Sold to Client X via WhatsApp / Order #1042"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Cost Summary Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Rate per key:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{perKeyCost} Coins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{count} Key(s)</span>
              </div>
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-sm font-bold text-amber-900 dark:text-amber-200">Total Coins Required:</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">{totalCost} Coins</span>
              </div>
            </div>

            {!hasEnoughCoins && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>You do not have enough coins ({currentCoins} available). Contact Admin to recharge.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !hasEnoughCoins}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md shadow-amber-600/30 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading ? 'Burning points & generating...' : `Generate ${count} Key(s) for ${totalCost} Coins`}
              </span>
            </button>
          </form>
        </div>

        {/* Results / Key Delivery Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Generated Output
            </h3>
            {generatedKeys.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyAll}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Copy All"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Download TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {generatedKeys.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Key className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-semibold">No keys generated in this batch</p>
              <p className="text-[10px] max-w-[200px] mx-auto text-slate-400">
                Configure your key options on the left and click Generate.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{generatedKeys.length} license key(s) ready to send to customer</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {generatedKeys.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 select-all">
                        {item.key}
                      </span>
                      <button
                        onClick={() => handleCopy(item.key)}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                      >
                        {copiedKey === item.key ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span>{item.durationDays === 0 ? 'Lifetime Access' : `${item.durationDays} Days`}</span>
                      <span className="font-semibold text-amber-600">{item.coinsCost} Pts Spent</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleDownloadTxt}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
                <button
                  onClick={() => onNavigate('#/seller/keys')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
                >
                  <span>View All Keys</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
