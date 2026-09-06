import React, { useState } from 'react';
import { X, Plus, Sparkles, Copy, Check, Database } from 'lucide-react';
import { copyTextToClipboard } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';

interface CustomIndexGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomIndexGeneratorModal: React.FC<CustomIndexGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [collection, setCollection] = useState('orders');
  const [fieldsInput, setFieldsInput] = useState('userId, status, createdAt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const parsedFields = fieldsInput
    .split(',')
    .map((s) => s.trim().replace(/^\./, ''))
    .filter(Boolean);

  const generatedJson = `"${collection.replace(/^\//, '')}": {\n  ".indexOn": ${JSON.stringify(parsedFields, null, 2).replace(/\n/g, '\n  ')}\n}`;

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(generatedJson);
    if (ok) {
      setCopied(true);
      showToast('Custom index JSON copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Index Rule Generator
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Collection / Path Name
            </label>
            <input
              type="text"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              placeholder="e.g. transactions or coupons"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Fields to Index (comma-separated)
            </label>
            <input
              type="text"
              value={fieldsInput}
              onChange={(e) => setFieldsInput(e.target.value)}
              placeholder="e.g. userId, status, createdAt, amount"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Generated .indexOn Snippet
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
              {generatedJson}
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
