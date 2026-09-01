import React, { useState, useEffect } from 'react';
import { Megaphone, X, ArrowRight, AlertCircle, Info, Sparkles } from 'lucide-react';
import { AdminAnnouncement } from '../../types';
import { fetchAnnouncements } from '../../services/announcementService';

export const GlobalAnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function load() {
      const list = await fetchAnnouncements();
      setAnnouncements(list.filter((a) => a.isPinned || a.type === 'alert' || a.type === 'update'));
    }
    load();
  }, []);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-4 py-2 text-xs border-b border-indigo-500/30 flex items-center justify-between shadow-lg relative z-40">
      <div className="flex items-center gap-2.5 mx-auto">
        <span className="p-1 rounded-md bg-indigo-500/30 text-indigo-300">
          {current.type === 'alert' ? <AlertCircle className="w-3.5 h-3.5" /> : <Megaphone className="w-3.5 h-3.5" />}
        </span>
        <span className="font-bold text-amber-300">{current.title}:</span>
        <span className="text-slate-200">{current.content}</span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0 ml-2"
        title="Dismiss Banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
