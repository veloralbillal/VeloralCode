import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Upload,
  CheckCircle2,
  FileText,
  Sparkles,
  Globe,
  Github,
  Send,
  Camera,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateCreatorProfile } from '../../services/creatorProfileService';
import { formatCreatorName } from '../../utils/userDisplay';
import { CreatorKycSection } from './kyc/CreatorKycSection';
import { CreatorLinkGeneratorCard } from './CreatorLinkGeneratorCard';

interface CreatorProfileSettingsProps {
  onNavigate?: (route: string) => void;
}

export const CreatorProfileSettings: React.FC<CreatorProfileSettingsProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  // Profile Form State
  const [displayName, setDisplayName] = useState(userProfile?.name || '');
  const [specialty, setSpecialty] = useState(userProfile?.creatorSpecialty || 'Web Tool Creator');
  const [bio, setBio] = useState(userProfile?.creatorBio || userProfile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.creatorAvatarUrl || '');
  const [socialGithub, setSocialGithub] = useState(userProfile?.creatorSocialGithub || '');
  const [socialWebsite, setSocialWebsite] = useState(userProfile?.creatorSocialWebsite || '');
  const [socialTelegram, setSocialTelegram] = useState(userProfile?.creatorSocialTelegram || '');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.creatorDisplayName || userProfile.name || '');
      setSpecialty(userProfile.creatorSpecialty || 'Web Tool Creator');
      setBio(userProfile.creatorBio || userProfile.bio || '');
      setAvatarUrl(userProfile.creatorAvatarUrl || '');
      setSocialGithub(userProfile.creatorSocialGithub || '');
      setSocialWebsite(userProfile.creatorSocialWebsite || '');
      setSocialTelegram(userProfile.creatorSocialTelegram || '');
    }
  }, [userProfile]);

  // Handle image file selection with base64 conversion
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image file must be under 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 1. Save Public Creator Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!displayName.trim()) {
      showToast('Please provide a public creator name', 'warning');
      return;
    }

    try {
      setProfileSaving(true);
      await updateCreatorProfile(currentUser.uid, {
        displayName: displayName.trim(),
        specialty: specialty.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        socialGithub: socialGithub.trim(),
        socialWebsite: socialWebsite.trim(),
        socialTelegram: socialTelegram.trim(),
      });

      await refreshUserProfile();
      showToast('Creator profile updated! This name will now appear on all your tools & tips.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Banner & Quick Public Link */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Official Creator Identity
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Creator Profile & KYC Verification</h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Set your public creator name (Gmail will be completely hidden), upload your portfolio details, and submit identification documents for the Verified Badge.
            </p>
          </div>

          {currentUser?.uid && onNavigate && (
            <button
              onClick={() => {
                const handle = userProfile?.creatorUsername || userProfile?.creatorSlug || currentUser.uid;
                onNavigate(`#/creator/${handle}`);
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md hover:bg-emerald-50 transition flex items-center gap-2 self-start md:self-auto"
            >
              <Eye className="w-4 h-4" /> View Public Profile
            </button>
          )}
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Creator Public Link Generator & Share Card */}
      <CreatorLinkGeneratorCard onNavigate={onNavigate} />

      {/* 1. Public Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Public Creator Identity</h3>
            <p className="text-xs text-slate-400">
              The name you enter here will be displayed on all your tools, tipping modal, and portfolio instead of Gmail.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Public Creator Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Billal Hossain or CodeCraft Studio"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                ✓ Publicly shown on all tools & tips. Your Gmail ({currentUser?.email}) will remain private.
              </p>
            </div>

            {/* Specialty / Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Creator Role / Title
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Frontend Engineer & Tool Designer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Short Bio / About You
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other developers about yourself, the tools you build, and what technologies you use..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Avatar URL / Image */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Avatar / Profile Picture URL
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                    {displayName ? displayName.slice(0, 2).toUpperCase() : 'CR'}
                  </span>
                )}
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" /> GitHub Profile
              </label>
              <input
                type="text"
                value={socialGithub}
                onChange={(e) => setSocialGithub(e.target.value)}
                placeholder="github.com/username"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Website / Portfolio
              </label>
              <input
                type="text"
                value={socialWebsite}
                onChange={(e) => setSocialWebsite(e.target.value)}
                placeholder="https://portfolio.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Telegram Contact
              </label>
              <input
                type="text"
                value={socialTelegram}
                onChange={(e) => setSocialTelegram(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {profileSaving ? 'Saving Changes...' : 'Save Public Creator Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Document & KYC Identity Verification */}
      <CreatorKycSection userProfile={userProfile} userId={currentUser?.uid || ''} />
    </div>
  );
};
