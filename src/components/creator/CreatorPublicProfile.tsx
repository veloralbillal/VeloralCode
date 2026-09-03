import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  Code2, 
  Eye, 
  Heart, 
  Users, 
  ExternalLink, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Github, 
  Globe, 
  Send,
  Share2,
  Copy,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';
import { CodeItem, UserProfile } from '../../types';
import { fetchAllCodes } from '../../services/codeService';
import { CreatorBadge } from './CreatorBadge';
import { 
  toggleFollowCreator, 
  checkIsFollowing, 
  getCreatorFollowersCount 
} from '../../services/toolInteractionService';
import { 
  resolveCreatorBySlugOrUid, 
  getCreatorShareableUrl, 
  slugifyCreatorHandle 
} from '../../services/creatorProfileService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCreatorName } from '../../utils/userDisplay';

interface CreatorPublicProfileProps {
  creatorId?: string;
  creatorUid?: string;
  creatorIdentifier?: string;
  onNavigate: (route: string) => void;
  onOpenCode?: (id: string) => void;
}

export const CreatorPublicProfile: React.FC<CreatorPublicProfileProps> = ({
  creatorId,
  creatorUid,
  creatorIdentifier,
  onNavigate,
  onOpenCode,
}) => {
  const targetIdentifier = (creatorIdentifier || creatorUid || creatorId || '').trim();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [creatorUser, setCreatorUser] = useState<UserProfile | null>(null);
  const [actualUid, setActualUid] = useState<string>('');
  const [tools, setTools] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadCreatorData() {
      if (!targetIdentifier) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);

        // 1. Resolve Creator by UID, username, or slug
        const resolved = await resolveCreatorBySlugOrUid(targetIdentifier);
        if (!resolved) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const creator = resolved.profile;
        const uid = resolved.uid;
        setCreatorUser(creator);
        setActualUid(uid);

        // 2. Fetch published tools by this creator
        const allCodes = await fetchAllCodes();
        const creatorCodes = allCodes.filter((c) => {
          if (c.creatorUid && c.creatorUid === uid) return true;
          if (c.createdBy && c.createdBy === uid) return true;
          if (creator.email && c.creatorEmail && c.creatorEmail.toLowerCase() === creator.email.toLowerCase()) return true;
          return false;
        });
        setTools(creatorCodes);

        // 3. Followers count & check following status
        const count = await getCreatorFollowersCount(uid);
        setFollowersCount(count);

        if (currentUser?.uid) {
          const following = await checkIsFollowing(currentUser.uid, uid);
          setIsFollowing(following);
        }
      } catch (err) {
        console.error('Failed to load creator public profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadCreatorData();
  }, [targetIdentifier, currentUser?.uid]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      showToast('ক্রিয়েটরকে ফলো করতে প্রথমে লগইন করুন', 'info');
      onNavigate('#/login');
      return;
    }
    if (currentUser.uid === actualUid) {
      showToast('আপনি নিজেকে ফলো করতে পারবেন না', 'warning');
      return;
    }

    try {
      const nowFollowing = await toggleFollowCreator(currentUser.uid, actualUid);
      setIsFollowing(nowFollowing);
      setFollowersCount((prev) => (nowFollowing ? prev + 1 : Math.max(0, prev - 1)));
      showToast(nowFollowing ? 'ক্রিয়েটরকে ফলো করা শুরু করেছেন!' : 'আনফলো করা হয়েছে', 'success');
    } catch (err: any) {
      showToast(err.message || 'অ্যাকশন সম্পন্ন করা যায়নি', 'error');
    }
  };

  const handleCopyProfileLink = async () => {
    const { fullUrl } = getCreatorShareableUrl(creatorUser, actualUid);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = fullUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedLink(true);
      showToast('ক্রিয়েটরের পাবলিক লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      showToast('লিংক কপি করা যায়নি', 'error');
    }
  };

  // Filter tools
  const categories = ['all', ...Array.from(new Set(tools.map((t) => t.category).filter(Boolean)))];
  const filteredTools = tools.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalViews = tools.reduce((sum, t) => sum + (t.views || 0), 0);
  const cleanDisplayName = formatCreatorName(
    creatorUser?.creatorDisplayName || creatorUser?.name,
    creatorUser?.email,
    'Creator'
  );
  const handle = 
    creatorUser?.creatorUsername || 
    creatorUser?.creatorSlug || 
    slugifyCreatorHandle(cleanDisplayName);
  const isVerified = creatorUser?.creatorVerificationStatus === 'verified';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          ক্রিয়েটর পোর্টফোলিও লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // Not Found state
  if (notFound || !creatorUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ক্রিয়েটর প্রোফাইল পাওয়া যায়নি
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                "{targetIdentifier}"
              </span>{' '}
              নামে কোনো নিবন্ধিত ক্রিয়েটরের পাবলিক একাউন্ট খুঁজে পাওয়া যায়নি। লিংকটি সঠিক কিনা যাচাই করুন।
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onNavigate('#/codes')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              সকল পাবলিক টুলস এক্সপ্লোর করুন
            </button>
            <button
              onClick={() => onNavigate('#/')}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              হোম পেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('#/codes')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 transition hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল টুলস ক্যাটালগ</span>
          </button>

          {/* Share Profile Link button */}
          <button
            onClick={handleCopyProfileLink}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার প্রোফাইল'}</span>
          </button>
        </div>

        {/* Creator Hero Banner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/30 overflow-hidden shrink-0">
                {creatorUser.creatorAvatarUrl ? (
                  <img src={creatorUser.creatorAvatarUrl} alt={cleanDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <span>{cleanDisplayName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black">{cleanDisplayName}</h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ভেরিফাইড
                    </span>
                  )}
                  <CreatorBadge stats={{ liveTools: tools.length, totalViews, totalEarnings: creatorUser.creatorEarnings }} />
                </div>

                {/* Handle display */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-emerald-400 font-semibold">@{handle}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium">
                    {creatorUser.creatorSpecialty || 'Web Tool Creator'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-lg pt-1">
                  {creatorUser.creatorBio || 'Creating awesome open web tools and developer components.'}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 flex-wrap">
                  {creatorUser.creatorSocialGithub && (
                    <a
                      href={`https://${creatorUser.creatorSocialGithub.replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {creatorUser.creatorSocialWebsite && (
                    <a
                      href={creatorUser.creatorSocialWebsite.startsWith('http') ? creatorUser.creatorSocialWebsite : `https://${creatorUser.creatorSocialWebsite}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> Portfolio
                    </a>
                  )}
                  {creatorUser.creatorSocialTelegram && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Send className="w-3.5 h-3.5" /> {creatorUser.creatorSocialTelegram}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                  isFollowing
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isFollowing ? 'ফলোয়িং (Following)' : 'ফলো করুন (Follow)'}</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-emerald-400">{tools.length}</p>
              <p className="text-[11px] text-slate-400">পাবলিশ করা টুলস</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-cyan-400">{totalViews.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">মোট ভিউ ও রান</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-purple-400">{followersCount.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">ফলোয়ার্স</p>
            </div>
          </div>
        </div>

        {/* Tools Portfolio Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>এই ক্রিয়েটরের তৈরি টুলস ({filteredTools.length})</span>
            </h2>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="টুল খুঁজুন..."
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {categories.length > 2 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <p className="text-sm font-semibold text-slate-400">
                {searchQuery ? 'কোনো টুল পাওয়া যায়নি।' : 'এই ক্রিয়েটরের এখনও কোনো লাইভ পাবলিক টুল নেই।'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                        {tool.category}
                      </span>
                      {tool.averageRating ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" /> {tool.averageRating}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {(tool.views || 0).toLocaleString()} views
                    </span>
                    <button
                      onClick={() => {
                        if (onOpenCode) {
                          onOpenCode(tool.id);
                        } else {
                          onNavigate(`#/code/${tool.id}`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>টুল ব্যবহার করুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
