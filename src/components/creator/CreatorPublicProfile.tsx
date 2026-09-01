import React, { useState, useEffect } from 'react';
import { User, Sparkles, Code2, Eye, Heart, Users, ExternalLink, ArrowLeft, Star, ShieldCheck, Github, Globe, Send } from 'lucide-react';
import { CodeItem, UserProfile } from '../../types';
import { fetchAllCodes } from '../../services/codeService';
import { ref, get } from 'firebase/database';
import { database } from '../../services/firebase';
import { CreatorBadge } from './CreatorBadge';
import { toggleFollowCreator, checkIsFollowing, getCreatorFollowersCount } from '../../services/toolInteractionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCreatorName } from '../../utils/userDisplay';

interface CreatorPublicProfileProps {
  creatorId?: string;
  creatorUid?: string;
  onNavigate: (route: string) => void;
  onOpenCode?: (id: string) => void;
}

export const CreatorPublicProfile: React.FC<CreatorPublicProfileProps> = ({
  creatorId,
  creatorUid,
  onNavigate,
  onOpenCode,
}) => {
  const targetId = creatorUid || creatorId || '';
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [creatorUser, setCreatorUser] = useState<UserProfile | null>(null);
  const [tools, setTools] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    async function loadCreatorData() {
      try {
        setLoading(true);
        // 1. Fetch user data by UID
        const userSnap = await get(ref(database, `users/${targetId}`));
        if (userSnap.exists()) {
          setCreatorUser(userSnap.val());
        }

        // 2. Fetch published tools by this creator
        const allCodes = await fetchAllCodes();
        const creatorCodes = allCodes.filter(
          (c) => c.creatorUid === targetId || (creatorUser?.email && c.creatorEmail === creatorUser.email)
        );
        setTools(creatorCodes);

        // 3. Followers
        const count = await getCreatorFollowersCount(targetId);
        setFollowersCount(count);

        if (currentUser?.uid) {
          const following = await checkIsFollowing(currentUser.uid, targetId);
          setIsFollowing(following);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (targetId) loadCreatorData();
  }, [targetId, currentUser?.uid]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      showToast('Please sign in to follow this creator', 'info');
      return;
    }
    if (currentUser.uid === targetId) {
      showToast('You cannot follow yourself', 'warning');
      return;
    }

    try {
      const nowFollowing = await toggleFollowCreator(currentUser.uid, targetId);
      setIsFollowing(nowFollowing);
      setFollowersCount((prev) => (nowFollowing ? prev + 1 : Math.max(0, prev - 1)));
      showToast(nowFollowing ? 'Following creator!' : 'Unfollowed', 'success');
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const totalViews = tools.reduce((sum, t) => sum + (t.views || 0), 0);
  const cleanDisplayName = formatCreatorName(
    creatorUser?.creatorDisplayName || creatorUser?.name,
    creatorUser?.email,
    'Creator'
  );
  const isVerified = creatorUser?.creatorVerificationStatus === 'verified';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('#/codes')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 transition hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools Catalog</span>
        </button>

        {/* Creator Hero Banner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/30 overflow-hidden shrink-0">
                {creatorUser?.creatorAvatarUrl ? (
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
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified
                    </span>
                  )}
                  <CreatorBadge stats={{ liveTools: tools.length, totalViews, totalEarnings: creatorUser?.creatorEarnings }} />
                </div>
                <p className="text-xs text-slate-400">
                  {creatorUser?.creatorSpecialty || 'Full-Stack Web & Tool Developer'}
                </p>
                <p className="text-xs text-slate-300 max-w-lg pt-1">
                  {creatorUser?.creatorBio || 'Creating awesome open web tools and utilities for developers.'}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                  {creatorUser?.creatorSocialGithub && (
                    <a
                      href={`https://${creatorUser.creatorSocialGithub.replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {creatorUser?.creatorSocialWebsite && (
                    <a
                      href={creatorUser.creatorSocialWebsite.startsWith('http') ? creatorUser.creatorSocialWebsite : `https://${creatorUser.creatorSocialWebsite}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> Portfolio
                    </a>
                  )}
                  {creatorUser?.creatorSocialTelegram && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Send className="w-3.5 h-3.5" /> {creatorUser.creatorSocialTelegram}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Follow & Action */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                  isFollowing
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isFollowing ? 'Following' : 'Follow Creator'}</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-emerald-400">{tools.length}</p>
              <p className="text-[11px] text-slate-400">Published Tools</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-cyan-400">{totalViews}</p>
              <p className="text-[11px] text-slate-400">Total Tool Runs & Views</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="text-lg font-black text-purple-400">{followersCount}</p>
              <p className="text-[11px] text-slate-400">Followers</p>
            </div>
          </div>
        </div>

        {/* Tools Portfolio Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Created Tools by this Developer</span>
            </h2>
            <span className="text-xs text-slate-400">{tools.length} total</span>
          </div>

          {loading ? (
            <p className="text-center text-xs text-slate-500 py-12">Loading portfolio tools...</p>
          ) : tools.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <p className="text-sm font-semibold text-slate-400">No published tools found for this creator yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
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
                      <Eye className="w-3 h-3" /> {tool.views || 0} views
                    </span>
                    <button
                      onClick={() => onNavigate(`#/code/${tool.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Run Tool</span>
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
