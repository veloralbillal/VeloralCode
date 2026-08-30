import React from 'react';
import { X, Lock, Sparkles, CheckCircle2, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PremiumCodeLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export const PremiumCodeLockModal: React.FC<PremiumCodeLockModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { currentUser, userProfile } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Source Code is Premium Protected</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Free users have unlimited access to <span className="text-emerald-400 font-semibold">run & use all live tools</span>. Inspecting and copying raw source code is reserved for Premium Members.
          </p>
        </div>

        {/* Perks list */}
        <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Full source code inspection & export</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>One-click copy & file downloads</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Pro Member badge on Profile</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="space-y-2 pt-1">
          {currentUser ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('#/profile');
                  else window.location.hash = '#/profile';
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>View Profile & Plan Status</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
              <p className="text-[11px] text-center text-slate-500">
                To upgrade to Premium, request access from the system administrator.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('#/login');
                  else window.location.hash = '#/login';
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Continue Using Live Tool
          </button>
        </div>
      </div>
    </div>
  );
};
