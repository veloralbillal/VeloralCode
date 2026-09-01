import React, { useState } from 'react';
import { Copy, Check, Share2, Code, ExternalLink, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface EmbedShareModalProps {
  codeId: string;
  toolTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedShareModal: React.FC<EmbedShareModalProps> = ({ codeId, toolTitle, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const shareUrl = `${currentOrigin}/#/code/${codeId}`;
  const embedCode = `<iframe \n  src="${shareUrl}" \n  width="100%" \n  height="600px" \n  frameborder="0" \n  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" \n  allowfullscreen\n></iframe>`;

  const copyToClipboard = (text: string, isEmbed = false) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Share & Embed Tool</h3>
              <p className="text-xs text-slate-400">{toolTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Direct Share Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono"
            />
            <button
              onClick={() => copyToClipboard(shareUrl, false)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Iframe Embed Code */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Embed iFrame Widget</label>
            <span className="text-[10px] text-slate-500">Insert into WordPress, Webflow, Notion or HTML</span>
          </div>
          <div className="relative">
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
              {embedCode}
            </pre>
            <button
              onClick={() => copyToClipboard(embedCode, true)}
              className="absolute right-2 top-2 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1 transition"
            >
              {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
              <span>{copiedEmbed ? 'Embed Code Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
