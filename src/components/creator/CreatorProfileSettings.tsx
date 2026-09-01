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
import { updateCreatorProfile, submitCreatorKyc } from '../../services/creatorProfileService';
import { formatCreatorName } from '../../utils/userDisplay';

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

  // Document Verification State
  const [documentType, setDocumentType] = useState<'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license'>('nid');
  const [legalFullName, setLegalFullName] = useState(userProfile?.creatorKyc?.legalFullName || userProfile?.name || '');
  const [documentNumber, setDocumentNumber] = useState(userProfile?.creatorKyc?.documentNumber || '');
  const [frontImage, setFrontImage] = useState<string>(userProfile?.creatorKyc?.frontImageUrl || '');
  const [backImage, setBackImage] = useState<string>(userProfile?.creatorKyc?.backImageUrl || '');
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [showResubmitForm, setShowResubmitForm] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.creatorDisplayName || userProfile.name || '');
      setSpecialty(userProfile.creatorSpecialty || 'Web Tool Creator');
      setBio(userProfile.creatorBio || userProfile.bio || '');
      setAvatarUrl(userProfile.creatorAvatarUrl || '');
      setSocialGithub(userProfile.creatorSocialGithub || '');
      setSocialWebsite(userProfile.creatorSocialWebsite || '');
      setSocialTelegram(userProfile.creatorSocialTelegram || '');
      if (userProfile.creatorKyc) {
        setDocumentType(userProfile.creatorKyc.documentType || 'nid');
        setLegalFullName(userProfile.creatorKyc.legalFullName || userProfile.name || '');
        setDocumentNumber(userProfile.creatorKyc.documentNumber || '');
        setFrontImage(userProfile.creatorKyc.frontImageUrl || '');
        setBackImage(userProfile.creatorKyc.backImageUrl || '');
      }
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

  // 2. Submit KYC Document for Verification
  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!legalFullName.trim()) {
      showToast('Legal full name is required as per document', 'warning');
      return;
    }
    if (!documentNumber.trim()) {
      showToast('Document / NID number is required', 'warning');
      return;
    }
    if (!frontImage) {
      showToast('Please upload front side of your document', 'warning');
      return;
    }

    try {
      setKycSubmitting(true);
      await submitCreatorKyc(currentUser.uid, {
        documentType,
        legalFullName: legalFullName.trim(),
        documentNumber: documentNumber.trim(),
        frontImageUrl: frontImage,
        backImageUrl: backImage,
      });

      await refreshUserProfile();
      setShowResubmitForm(false);
      showToast('Document submitted successfully! Admin will review and verify your identity.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit document', 'error');
    } finally {
      setKycSubmitting(false);
    }
  };

  const kycStatus = userProfile?.creatorVerificationStatus || userProfile?.creatorKyc?.status || 'not_submitted';

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
              onClick={() => onNavigate(`#/creator-profile/${currentUser.uid}`)}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md hover:bg-emerald-50 transition flex items-center gap-2 self-start md:self-auto"
            >
              <Eye className="w-4 h-4" /> View Public Profile
            </button>
          )}
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Document & Identity Verification</h3>
              <p className="text-xs text-slate-400">
                Submit official government document (NID, Passport, or Student ID) for the Verified Creator Badge.
              </p>
            </div>
          </div>

          {/* Verification Status Badge */}
          <div>
            {kycStatus === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Creator
              </span>
            )}
            {kycStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" /> Verification Under Review
              </span>
            )}
            {kycStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Rejected
              </span>
            )}
            {kycStatus === 'not_submitted' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Not Submitted
              </span>
            )}
          </div>
        </div>

        {/* Existing Status Details Banner */}
        {kycStatus === 'verified' && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Identity Verified & Approved
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              Your official identification ({userProfile?.creatorKyc?.documentType?.toUpperCase()} #{userProfile?.creatorKyc?.documentNumber}) has been verified. Your profile now carries the verified shield badge across all tool pages and creator listings.
            </p>
          </div>
        )}

        {kycStatus === 'pending' && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600" /> Document Submitted for Review
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              You submitted <strong>{userProfile?.creatorKyc?.legalFullName}</strong> ({userProfile?.creatorKyc?.documentType?.toUpperCase()}: {userProfile?.creatorKyc?.documentNumber}). Our platform administration is reviewing your details (usually within 12-24 hours).
            </p>
          </div>
        )}

        {kycStatus === 'rejected' && (
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Verification Could Not Be Approved
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
              Reason: {userProfile?.creatorKyc?.rejectionReason || 'Document photo was blurry or details did not match.'}
            </p>
            <button
              onClick={() => setShowResubmitForm(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
            >
              Re-submit Valid Document
            </button>
          </div>
        )}

        {/* Submission Form (Shown if not submitted, rejected, or explicitly re-submitting) */}
        {(kycStatus === 'not_submitted' || showResubmitForm || kycStatus === 'rejected') && (
          <form onSubmit={handleSubmitKyc} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Document Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Document Type (ডকুমেন্ট ধরন) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={documentType}
                  onChange={(e: any) => setDocumentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                >
                  <option value="nid">National ID (NID Card) - জাতীয় পরিচয়পত্র</option>
                  <option value="passport">Passport - পাসপোর্ট</option>
                  <option value="driving_license">Driving License - ড্রাইভিং লাইসেন্স</option>
                  <option value="student_id">Student ID - স্টুডেন্ট আইডি</option>
                  <option value="trade_license">Trade License - ট্রেড লাইসেন্স</option>
                </select>
              </div>

              {/* Legal Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Legal Name (ডকুমেন্টের নাম) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={legalFullName}
                  onChange={(e) => setLegalFullName(e.target.value)}
                  placeholder="Exact name as printed on document"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Document Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Document / NID Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g. 199XXXXXXXX or NID No."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Document Photo Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Front Side */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Front Side Photo (সামনের ছবি) <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition relative bg-slate-50/50 dark:bg-slate-800/50 min-h-[140px] flex flex-col items-center justify-center">
                  {frontImage ? (
                    <div className="space-y-2">
                      <img
                        src={frontImage}
                        alt="Front Document"
                        className="max-h-28 rounded-lg shadow-xs mx-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFrontImage('')}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Remove & re-upload
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block w-full">
                      <Upload className="w-6 h-6 text-indigo-500 mx-auto" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Upload Document Front Photo
                      </span>
                      <span className="text-[10px] text-slate-400 block">PNG, JPG up to 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setFrontImage)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Back Side (Optional) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Back Side Photo (পেছনের ছবি - ঐচ্ছিক)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition relative bg-slate-50/50 dark:bg-slate-800/50 min-h-[140px] flex flex-col items-center justify-center">
                  {backImage ? (
                    <div className="space-y-2">
                      <img
                        src={backImage}
                        alt="Back Document"
                        className="max-h-28 rounded-lg shadow-xs mx-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBackImage('')}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Remove & re-upload
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block w-full">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Upload Document Back Photo
                      </span>
                      <span className="text-[10px] text-slate-400 block">Optional</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setBackImage)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Your identity documents are encrypted and kept strictly confidential. They are used only by our platform administrators to verify creator authenticity.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={kycSubmitting || !frontImage}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {kycSubmitting ? 'Submitting Document...' : 'Submit Document for Verification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
