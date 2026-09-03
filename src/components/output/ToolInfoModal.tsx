import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Eye,
  Tag,
  User,
  Shield,
  Layers,
  FileCode,
  Star,
  Heart,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CodeItem } from '../../types';
import { formatDate, getCategoryBadgeClass } from '../../utils/helpers';
import { CodeSafetyBadge } from '../admin/CodeSafetyBadge';
import { formatCreatorName } from '../../utils/userDisplay';
import { fetchCreatorVerificationInfo } from '../../services/creatorProfileService';
import { scanCodeSafety } from '../../utils/codeSafetyScanner';

interface ToolInfoModalProps {
  item: CodeItem;
  isOpen: boolean;
  onClose: () => void;
  onOpenCode: () => void;
  onNavigate?: (route: string) => void;
  onOpenTip?: () => void;
}

export const ToolInfoModal: React.FC<ToolInfoModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenCode,
  onNavigate,
  onOpenTip,
}) => {
  const [creatorInfo, setCreatorInfo] = useState<{
    isVerified: boolean;
    status: string;
    creatorName: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && item.creatorUid) {
      fetchCreatorVerificationInfo(item.creatorUid).then((info) => {
        setCreatorInfo(info);
      });
    } else {
      setCreatorInfo(null);
    }
  }, [isOpen, item.creatorUid]);

  if (!isOpen) return null;

  const categoryStyle = getCategoryBadgeClass(item.category);
  const cleanCreator = formatCreatorName(
    creatorInfo?.creatorName || item.creatorName,
    item.creatorEmail,
    'Creator'
  );

  // Check verification: must be explicitly verified by admin
  const isCreatorVerified = Boolean(
    creatorInfo?.isVerified ?? item.creatorVerified ?? false
  );

  // Run security scanner
  const safetyReport = scanCodeSafety(item.html, item.css, item.js, item.code);
  const isSafeTool = safetyReport.riskLevel === 'safe' || safetyReport.riskLevel === 'low';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
                {item.category}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {item.language}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Info & Identity Verification Status */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
              {cleanCreator ? cleanCreator.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{cleanCreator}</p>
              <div className="mt-0.5">
                {isCreatorVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Contributor
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                    <User className="w-3 h-3 text-slate-400" /> Community Author
                  </span>
                )}
              </div>
            </div>
          </div>

          {item.creatorUid && onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate(`#/creator/${item.creatorUid}`);
              }}
              className="text-[11px] text-emerald-400 hover:underline font-semibold self-start sm:self-auto"
            >
              View Creator Portfolio →
            </button>
          )}
        </div>

        {/* Tool Safety & Security Assessment */}
        <div className={`p-4 rounded-2xl border space-y-2.5 ${
          isSafeTool
            ? 'bg-emerald-950/30 border-emerald-800/50'
            : safetyReport.riskLevel === 'medium'
            ? 'bg-amber-950/30 border-amber-800/50'
            : 'bg-rose-950/30 border-rose-800/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSafeTool ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : safetyReport.riskLevel === 'medium' ? (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              ) : (
                <ShieldX className="w-4 h-4 text-rose-400" />
              )}
              <span className={`text-xs font-bold ${
                isSafeTool
                  ? 'text-emerald-300'
                  : safetyReport.riskLevel === 'medium'
                  ? 'text-amber-300'
                  : 'text-rose-300'
              }`}>
                {isSafeTool
                  ? 'Tool Safety Status: Safe (সুরক্ষিত)'
                  : safetyReport.riskLevel === 'medium'
                  ? 'Tool Safety Status: Review Needed (সতর্কতা)'
                  : 'Tool Safety Status: High Risk (ঝুঁকিপূর্ণ)'}
              </span>
            </div>

            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 text-slate-200">
              Safety Score: {safetyReport.score}/100
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isSafeTool
              ? '✓ No malicious code, cookies stealing, phishing scripts, or harmful redirects detected. This tool executes inside an isolated sandbox iframe environment.'
              : safetyReport.flags.map((f) => f.message).join('. ')}
          </p>
        </div>

        {/* Description */}
        {item.description ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            {item.description}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic">No description provided for this tool.</p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[10px]">
              <Eye className="w-3 h-3" /> Total Views
            </span>
            <span className="font-bold text-white text-xs">{item.views || 0}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[10px]">
              <Star className="w-3 h-3 text-amber-400" /> Rating
            </span>
            <span className="font-bold text-amber-400 text-xs">
              {item.averageRating ? `${item.averageRating} ★` : 'New Tool'}
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[10px]">
              <Calendar className="w-3 h-3" /> Date
            </span>
            <span className="font-bold text-white text-xs">{formatDate(item.updatedAt || item.createdAt)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenCode();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Inspect Code</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenTip && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTip();
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-rose-600/30"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Tip</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
            >
              Return to Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

