import React, { useState, useEffect } from 'react';
import { Bell, Megaphone, Pin, AlertCircle, Info, Sparkles } from 'lucide-react';
import { AdminAnnouncement } from '../../types';
import { getAnnouncements } from '../../services/userService';
import { formatDate } from '../../utils/helpers';

export const UserAnnouncementsCard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements().then((res) => {
      setAnnouncements(res);
      setLoading(false);
    });
  }, []);

  const getTypeBadge = (type: AdminAnnouncement['type']) => {
    switch (type) {
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-2.5 h-2.5" />
            <span>Alert</span>
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Update</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Info className="w-2.5 h-2.5" />
            <span>Notice</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Announcements & Updates
            </h3>
            <p className="text-[10px] text-slate-400">
              Official notices and system updates from Admin
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {announcements.length} bulletin(s)
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
          Checking for notices...
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          No new announcements right now.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border transition ${
                ann.isPinned
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white shadow-xs">
                      <Pin className="w-2.5 h-2.5 fill-current" />
                      <span>PINNED</span>
                    </span>
                  )}
                  {getTypeBadge(ann.type)}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ann.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {formatDate(ann.createdAt)}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-0.5">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
