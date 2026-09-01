import { CreatorBadgeInfo } from '../types';

export function getCreatorBadge(stats: {
  totalTools?: number;
  liveTools?: number;
  totalViews?: number;
  totalEarnings?: number;
  averageRating?: number;
}): CreatorBadgeInfo {
  const tools = stats.liveTools || stats.totalTools || 0;
  const views = stats.totalViews || 0;
  const earnings = stats.totalEarnings || 0;

  if (tools >= 20 || earnings >= 100 || views >= 5000) {
    return {
      level: 'master',
      title: 'Master Architect',
      icon: '👑',
      color: 'from-amber-400 to-rose-500 text-amber-900 border-amber-300',
      perks: ['Instant Tool Approvals', '0% Withdrawal Fee', 'Featured Profile'],
    };
  }

  if (tools >= 10 || earnings >= 50 || views >= 2000) {
    return {
      level: 'diamond',
      title: 'Diamond Creator',
      icon: '💎',
      color: 'from-cyan-400 to-blue-600 text-cyan-900 border-cyan-300',
      perks: ['Priority Moderation', 'Top Creator Ranking', 'Remix Royalties'],
    };
  }

  if (tools >= 5 || earnings >= 20 || views >= 500) {
    return {
      level: 'gold',
      title: 'Gold Creator',
      icon: '🥇',
      color: 'from-yellow-400 to-amber-600 text-yellow-950 border-yellow-300',
      perks: ['Tip & Donation Enabled', 'Remix Attribution Badge'],
    };
  }

  if (tools >= 2 || views >= 100) {
    return {
      level: 'silver',
      title: 'Silver Creator',
      icon: '🥈',
      color: 'from-slate-300 to-slate-400 text-slate-800 border-slate-300',
      perks: ['Pay-per-Run Rewards', 'Public Profile Page'],
    };
  }

  return {
    level: 'bronze',
    title: 'Rising Creator',
    icon: '🥉',
    color: 'from-amber-700/60 to-amber-800/80 text-amber-100 border-amber-600',
    perks: ['Earn on Tool Approvals', 'Community Comments Access'],
  };
}
