import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, copyTextToClipboard } from '../../utils/helpers';
import { updateUserProfileData } from '../../services/authService';
import { LicenseRedeemCard } from './LicenseRedeemCard';
import { UserLicenseHistoryCard } from './UserLicenseHistoryCard';
import { UserBookmarksCard } from './UserBookmarksCard';
import { UserRecentActivityCard } from './UserRecentActivityCard';
import { UserActiveSessionsCard } from './UserActiveSessionsCard';
import { UserAnnouncementsCard } from './UserAnnouncementsCard';
import { UserFeatureRequestCard } from './UserFeatureRequestCard';
import { ContactAdminModal } from './ContactAdminModal';
import { UserLayout } from './UserLayout';

interface UserProfileProps {
  currentRoute?: string;
  onNavigate: (route: string) => void;
  onNavigateToCode?: (codeId: string) => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({ currentRoute = '#/profile', onNavigate, onNavigateToCode }) => {
  const { currentUser, userProfile, isAdmin, isPremium, resetPassword, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [showContactModal, setShowContactModal] = useState(false);

  const [displayName, setDisplayName] = useState(userProfile?.name || currentUser?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name || currentUser?.displayName || '');
      setBio(userProfile.bio || '');
      setPhone(userProfile.phone || '');
    }
  }, [userProfile, currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Login Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please sign in to your account to view and manage your profile details and membership plan.
        </p>
        <button
          onClick={() => onNavigate('#/login')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
        >
          <span>Sign In / Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const numericUidValue = userProfile?.numericUid || '89536985';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('Display name cannot be empty', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfileData(currentUser.uid, {
        name: displayName.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
      });
      await refreshUserProfile();
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyUid = async () => {
    const textToCopy = userProfile?.numericUid || currentUser.uid;
    const ok = await copyTextToClipboard(textToCopy);
    if (ok) {
      setCopiedUid(true);
      showToast(`UID ${textToCopy} copied to clipboard!`, 'info');
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser.email) return;
    setSendingReset(true);
    const res = await resetPassword(currentUser.email);
    setSendingReset(false);
    if (res.success) {
      showToast(`Password reset link sent to ${currentUser.email}`, 'success');
    } else {
      showToast(res.error || 'Failed to send password reset link', 'error');
    }
  };

  // Determine section title and content based on currentRoute hash
  const getPageConfig = () => {
    switch (currentRoute) {
      case '#/profile/licenses':
        return {
          title: 'Licenses & Redemptions',
          subtitle: 'Redeem Pro activation license keys and view renewal history',
          content: (
            <div className="space-y-6">
              <LicenseRedeemCard />
              <UserLicenseHistoryCard userId={currentUser.uid} />
            </div>
          ),
        };
      case '#/profile/bookmarks':
        return {
          title: 'Bookmarked Codes',
          subtitle: 'Quick access to your saved code snippets and tools',
          content: <UserBookmarksCard userId={currentUser.uid} onNavigateToCode={onNavigateToCode} />,
        };
      case '#/profile/history':
        return {
          title: 'Recently Run & Viewed',
          subtitle: 'History of tools and codes you recently inspected or tested',
          content: <UserRecentActivityCard onNavigateToCode={onNavigateToCode} />,
        };
      case '#/profile/sessions':
        return {
          title: 'Connected Devices',
          subtitle: 'Active browser sessions and security metadata',
          content: <UserActiveSessionsCard />,
        };
      case '#/profile/announcements':
        return {
          title: 'Admin Notices & Updates',
          subtitle: 'Announcements and broadcast messages from system administrators',
          content: <UserAnnouncementsCard />,
        };
      case '#/profile/requests':
        return {
          title: 'Feature Request Box',
          subtitle: 'Request new code tools or report bugs directly to admin',
          content: (
            <UserFeatureRequestCard
              userId={currentUser.uid}
              userEmail={currentUser.email || ''}
              userNumericUid={numericUidValue}
            />
          ),
        };
      default:
        return {
          title: 'Profile Overview',
          subtitle: 'Manage your developer account details and membership tier',
          content: (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Information</h3>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">
                        Bio / Role Note
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="Tell a little about what you build..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">
                        Phone / Contact (Optional)
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="+880..."
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/30"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px] block font-medium">Display Name</span>
                      <span className="text-slate-900 dark:text-white font-bold">{displayName || 'Not set'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px] block font-medium">Email Address</span>
                      <span className="text-slate-900 dark:text-white font-bold">{currentUser.email}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1 sm:col-span-2">
                      <span className="text-slate-400 text-[11px] block font-medium">Bio</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {bio || 'No bio specified yet.'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px] block font-medium">Phone</span>
                      <span className="text-slate-900 dark:text-white font-bold">{phone || 'Not set'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[11px] block font-medium">Account 8-Digit UID</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{numericUidValue}</span>
                      </div>
                      <button
                        onClick={handleCopyUid}
                        className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                        title="Copy UID"
                      >
                        {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px] block font-medium">Joined Date</span>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'Recently'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Membership Tier & Privileges Card */}
              <div className={`rounded-3xl p-6 border shadow-xs space-y-5 ${
                isPremium
                  ? 'bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Plan</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isPremium ? (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-amber-400">Premium Pro</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-indigo-500" />
                          <span>Free Member</span>
                        </>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Full-screen Live Tool Output</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Unlimited Tool Executions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {isPremium ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Lock className="w-4 h-4 text-amber-500 shrink-0" />}
                    <span className={`font-medium ${isPremium ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 line-through'}`}>
                      Source Code Viewing & Inspection
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {isPremium ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Lock className="w-4 h-4 text-amber-500 shrink-0" />}
                    <span className={`font-medium ${isPremium ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 line-through'}`}>
                      One-click Source Code Download & Copy
                    </span>
                  </div>
                </div>

                {!isPremium && (
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow-sm text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Get License Key (Contact Admin)</span>
                  </button>
                )}
              </div>

              {/* Password Reset Section */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <KeyRound className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Password</h3>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">Reset Account Password</h4>
                    <p className="text-slate-500">
                      A password reset link will be sent to <span className="font-medium text-slate-700 dark:text-slate-300">{currentUser.email}</span>.
                    </p>
                  </div>

                  <button
                    onClick={handlePasswordReset}
                    disabled={sendingReset}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition shrink-0"
                  >
                    {sendingReset ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </div>
            </div>
          ),
        };
    }
  };

  const { title, subtitle, content } = getPageConfig();

  return (
    <>
      <UserLayout currentRoute={currentRoute} onNavigate={onNavigate} title={title} subtitle={subtitle}>
        {content}
      </UserLayout>

      {/* Contact Admin Modal */}
      <ContactAdminModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        userEmail={currentUser.email || ''}
        userNumericUid={numericUidValue}
      />
    </>
  );
};
