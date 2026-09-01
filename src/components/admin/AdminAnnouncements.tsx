import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AdminAnnouncement } from '../../types';
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement } from '../../services/announcementService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminAnnouncements: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AdminAnnouncement['type']>('update');
  const [isPinned, setIsPinned] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await fetchAnnouncements();
      setAnnouncements(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in title and announcement message', 'warning');
      return;
    }

    try {
      setCreating(true);
      await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type,
        isPinned,
        authorEmail: currentUser?.email || 'Admin',
      });

      showToast('Announcement published globally!', 'success');
      setTitle('');
      setContent('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish announcement', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      showToast('Announcement removed', 'info');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove announcement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Announcement Box */}
      <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Broadcast Global Site Announcement</h3>
            <p className="text-xs text-slate-400">Pushes a live notification banner to all visitors and users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-300">Banner Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Creator Bonus Week / Server Upgrade"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="update">🚀 Feature Update</option>
              <option value="alert">⚠️ Important Alert</option>
              <option value="info">ℹ️ General Notice</option>
              <option value="event">🎁 Event / Promo</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Announcement Description / Message</label>
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the message that will be shown across the website header..."
            className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded-md border-slate-700 bg-slate-950 text-indigo-600"
            />
            <span>Pin as top priority announcement bar</span>
          </label>

          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{creating ? 'Publishing...' : 'Publish Announcement'}</span>
          </button>
        </div>
      </form>

      {/* Announcements List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h4 className="font-bold text-sm text-white">Active Announcements ({announcements.length})</h4>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center italic">No active announcements broadcasted.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-400 text-[10px] font-bold border border-indigo-800">
                      {item.type}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{item.title}</span>
                    {item.isPinned && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-md font-semibold">
                        PINNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{item.content}</p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition"
                  title="Remove Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
