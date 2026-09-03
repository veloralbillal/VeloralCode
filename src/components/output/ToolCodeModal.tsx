import React from 'react';
import { X, Copy, Download, Check, FileCode, Lock, Sparkles } from 'lucide-react';
import { CodeViewer } from '../common/CodeViewer';
import { copyTextToClipboard, downloadCodeFile } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { trackToolCodeAction } from '../../services/distributionService';

interface ToolCodeModalProps {
  codeId?: string;
  creatorUid?: string;
  creatorEmail?: string;
  code: string;
  language: string;
  title: string;
  isOpen: boolean;
  isPremium: boolean;
  onClose: () => void;
  onOpenPremiumPrompt?: () => void;
}

export const ToolCodeModal: React.FC<ToolCodeModalProps> = ({
  codeId,
  creatorUid,
  creatorEmail,
  code,
  language,
  title,
  isOpen,
  isPremium,
  onClose,
  onOpenPremiumPrompt,
}) => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!isPremium) {
      if (onOpenPremiumPrompt) onOpenPremiumPrompt();
      return;
    }
    const ok = await copyTextToClipboard(code);
    if (ok) {
      setCopied(true);
      showToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);

      // Track distribution & anti-cheating
      if (codeId) {
        trackToolCodeAction({
          codeId,
          toolTitle: title,
          creatorUid,
          creatorEmail,
          userUid: currentUser?.uid,
          userEmail: currentUser?.email || undefined,
          isPremium,
          actionType: 'copy',
        });
      }
    }
  };

  const handleDownload = () => {
    if (!isPremium) {
      if (onOpenPremiumPrompt) onOpenPremiumPrompt();
      return;
    }
    downloadCodeFile(code, title, language);
    showToast(`Downloaded ${title}`, 'info');

    // Track distribution & anti-cheating
    if (codeId) {
      trackToolCodeAction({
        codeId,
        toolTitle: title,
        creatorUid,
        creatorEmail,
        userUid: currentUser?.uid,
        userEmail: currentUser?.email || undefined,
        isPremium,
        actionType: 'download',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Source Code: {title}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800">
              {language}
            </span>
            {!isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" /> Premium Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!isPremium}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title={isPremium ? 'Copy source code' : 'Premium required to copy'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!isPremium}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title={isPremium ? 'Download code file' : 'Premium required to download'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 relative">
          {isPremium ? (
            <CodeViewer
              code={code}
              language={language}
              title={title}
              showLineNumbers={true}
              maxHeight="60vh"
            />
          ) : (
            <div className="relative">
              {/* Blurred preview */}
              <div className="filter blur-md select-none pointer-events-none opacity-40">
                <CodeViewer
                  code={code.slice(0, 300) + '\n\n// Protected content hidden for free tier...'}
                  language={language}
                  title={title}
                  showLineNumbers={true}
                  maxHeight="350px"
                />
              </div>

              {/* Locked Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 backdrop-blur-xs rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-sm font-bold text-white">Source Code is Locked for Free Tier</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have full access to run and use this tool live in full-screen. Source code download & copy access is reserved for Premium Members.
                  </p>
                </div>
                {onOpenPremiumPrompt && (
                  <button
                    onClick={onOpenPremiumPrompt}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Learn How to Get Premium Access</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
