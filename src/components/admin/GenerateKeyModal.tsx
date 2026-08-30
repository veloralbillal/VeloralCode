import React, { useState } from 'react';
import { Key, Clock, Sparkles, Infinity } from 'lucide-react';
import { UserPlan } from '../../types';
import { CreateLicenseParams } from '../../services/licenseService';
import { getDurationLabel } from '../../utils/timeUtils';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: CreateLicenseParams) => Promise<void>;
  userEmail?: string;
}

export const GenerateKeyModal: React.FC<GenerateKeyModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  userEmail,
}) => {
  const [count, setCount] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>('PRO');
  const [plan, setPlan] = useState<UserPlan>('premium');
  const [durationPreset, setDurationPreset] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>('30');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [note, setNote] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const durationOptions = [
    { label: '1 Day', days: 1 },
    { label: '7 Days', days: 7 },
    { label: '30 Days (1 Mo)', days: 30 },
    { label: '90 Days (3 Mo)', days: 90 },
    { label: '365 Days (1 Yr)', days: 365 },
    { label: '♾️ Lifetime', days: 0 },
  ];

  const currentDurationDays = isCustomDuration
    ? Math.max(0, parseInt(customDays, 10) || 0)
    : durationPreset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await onGenerate({
        count: Number(count) || 1,
        prefix: prefix.trim() || 'PRO',
        plan: plan,
        durationDays: currentDurationDays,
        note: note.trim(),
        createdBy: userEmail || 'Admin',
      });
      onClose();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Generate License Keys
              </h3>
              <p className="text-[11px] text-slate-500">
                Create keys with expiration timer for Premium upgrades
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quantity */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Number of Keys to Generate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`py-2 rounded-xl font-bold border transition ${
                    count === num
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Key' : 'Keys'}
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Duration Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Expire Duration (মেয়াদ)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomDuration(!isCustomDuration)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                {isCustomDuration ? 'Choose Presets' : 'Custom Days'}
              </button>
            </div>

            {!isCustomDuration ? (
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setDurationPreset(opt.days)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                      durationPreset === opt.days
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="3650"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    placeholder="e.g. 14"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">Days (0 = Lifetime)</span>
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              {currentDurationDays === 0
                ? 'Unlimited Lifetime access once activated by user.'
                : `Timer begins countdown for ${currentDurationDays} days the moment the user redeems the key.`}
            </p>
          </div>

          {/* Key Prefix */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Key Prefix (e.g. PRO, VIP, BILLAL)
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              placeholder="PRO"
              maxLength={8}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Note / Client Identifier (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 30-Day trial for user"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Preview banner */}
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[11px] text-indigo-700 dark:text-indigo-300 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Preview Key:</span>
              <span className="font-mono">{prefix || 'PRO'}-XXXX-XXXX-XXXX</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span>Duration:</span>
              <span className="font-semibold">{getDurationLabel(currentDurationDays)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/30"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{generating ? 'Generating...' : `Generate ${count} Key(s)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
