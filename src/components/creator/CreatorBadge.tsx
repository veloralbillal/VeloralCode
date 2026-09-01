import React from 'react';
import { getCreatorBadge } from '../../utils/creatorBadgeHelper';

interface CreatorBadgeProps {
  stats: {
    totalTools?: number;
    liveTools?: number;
    totalViews?: number;
    totalEarnings?: number;
  };
  showPerks?: boolean;
}

export const CreatorBadge: React.FC<CreatorBadgeProps> = ({ stats, showPerks = false }) => {
  const badge = getCreatorBadge(stats);

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r ${badge.color} border shadow-xs`}
        title={`Creator Tier: ${badge.title}`}
      >
        <span>{badge.icon}</span>
        <span>{badge.title}</span>
      </div>

      {showPerks && (
        <div className="flex flex-wrap gap-1 mt-1">
          {badge.perks.map((p, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              ✓ {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
