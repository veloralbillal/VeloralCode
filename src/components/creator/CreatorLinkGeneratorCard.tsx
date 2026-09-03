import React, { useState } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Edit3, 
  Save, 
  Sparkles, 
  Globe, 
  QrCode, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  getCreatorShareableUrl, 
  updateCreatorHandle, 
  slugifyCreatorHandle 
} from '../../services/creatorProfileService';

interface CreatorLinkGeneratorCardProps {
  onNavigate?: (route: string) => void;
}

export const CreatorLinkGeneratorCard: React.FC<CreatorLinkGeneratorCardProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [savingHandle, setSavingHandle] = useState(false);

  // Derive initial custom handle
  const currentHandle = 
    userProfile?.creatorUsername?.trim() || 
    userProfile?.creatorSlug?.trim() || 
    slugifyCreatorHandle(userProfile?.creatorDisplayName || userProfile?.name || userProfile?.email || 'creator');

  const [inputHandle, setInputHandle] = useState(currentHandle);

  const { fullUrl, shortPath, displayUrl } = getCreatorShareableUrl(userProfile, currentUser?.uid);

  // Copy shareable link
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('পাবলিক ক্রিয়েটর প্রোফাইল লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  // Save new custom handle
  const handleSaveCustomHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const clean = slugifyCreatorHandle(inputHandle);
    if (!clean || clean.length < 3) {
      showToast('ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে (ইংরেজি অক্ষর, সংখ্যা ও আন্ডারস্কোর)', 'warning');
      return;
    }

    try {
      setSavingHandle(true);
      const savedHandle = await updateCreatorHandle(currentUser.uid, clean);
      await refreshUserProfile();
      setIsEditingHandle(false);
      setInputHandle(savedHandle);
      showToast(`আপনার কাস্টম লিংক হ্যান্ডেল @${savedHandle} সফলভাবে সেট করা হয়েছে!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'হ্যান্ডেল আপডেট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSavingHandle(false);
    }
  };

  // Share handlers
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`আমার তৈরি সকল ওয়েব টুলস ও কোড দেখুন এখানে: ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Explore my web tools & developer components on Veloral:`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Creator Account Link Generator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Personalized Link
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার আলাদা ক্রিয়েটর পাবলিক পেজের ইউনিক লিংক জেনারেট ও শেয়ার করুন
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300/40 dark:border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Direct /creator blocked</span>
          </span>
        </div>
      </div>

      {/* Generated Link Display Box */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>আপনার পার্সোনালাইজড পাবলিক লিংক (Shareable URL):</span>
          {!isEditingHandle && (
            <button
              type="button"
              onClick={() => {
                setInputHandle(currentHandle);
                setIsEditingHandle(true);
              }}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>ইউজারনেম পরিবর্তন করুন</span>
            </button>
          )}
        </label>

        {isEditingHandle ? (
          <form onSubmit={handleSaveCustomHandle} className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-emerald-300 dark:border-emerald-700">
            <div className="flex items-center flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-mono">
              <span className="text-slate-400 select-none">{window.location.host}/creator/</span>
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="veloralbillal"
                maxLength={30}
                className="bg-transparent border-none outline-hidden font-bold text-emerald-600 dark:text-emerald-400 flex-1 ml-0.5"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <button
                type="submit"
                disabled={savingHandle || !inputHandle.trim()}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingHandle ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingHandle(false)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                বাতিল
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-mono overflow-x-auto select-all">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                {fullUrl}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'কপি হয়েছে!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(`#/creator/${currentHandle}`);
                  } else {
                    window.location.hash = `#/creator/${currentHandle}`;
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                title="View your public profile page"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ভিজিট করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                title="Show QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sharing & Explanatory Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
        <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
          💡 <strong className="text-slate-700 dark:text-slate-300">অ্যাক্সেস নিয়ম:</strong> যেকোনো ভিজিটর আপনার নির্দিষ্ট লিংক (<span className="font-mono text-emerald-600 dark:text-emerald-400">/creator/{currentHandle}</span>) ব্যবহার করে সরাসরি আপনার পাবলিক পোর্টফোলিও দেখতে পারবেন। কিন্তু সরাসরি <span className="font-mono text-red-500">/creator</span> ব্রাউজ করতে গেলে সাধারণ ভিজিটরদের জন্য অ্যাক্সেস ডিনাইড/ব্লক স্ক্রিন শো করবে।
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Share2 className="w-3 h-3" /> শেয়ার:
          </span>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-[11px] font-bold transition"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={handleShareTelegram}
            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 text-[11px] font-bold transition"
          >
            Telegram
          </button>
          <button
            type="button"
            onClick={handleShareFacebook}
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[11px] font-bold transition"
          >
            Facebook
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                ক্রিয়েটর প্রোফাইল QR কোড
              </h4>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fullUrl)}`}
                alt="Creator Profile QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate px-2">
              {fullUrl}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-4 h-4" />
              <span>লিংক কপি করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
