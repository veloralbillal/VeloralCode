import React, { useState } from 'react';
import {
  User,
  Sparkles,
  CheckCircle2,
  Share2,
  Globe,
  Palette,
  Search,
  FileCode2,
  Check,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import { Profile, ThemePreset } from '../types';

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updated: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>(profile);
  const [savedBadge, setSavedBadge] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);

  const themeOptions: { id: ThemePreset; name: string; previewColor: string; desc: string }[] = [
    { id: 'dark_glass', name: 'Dark Glassmorphism', previewColor: 'bg-indigo-600', desc: 'Sleek frosted blur with ambient lighting' },
    { id: 'midnight_velvet', name: 'Midnight Velvet', previewColor: 'bg-purple-600', desc: 'Deep violet gradient for creators' },
    { id: 'cyber_neon', name: 'Cyber Neon Emerald', previewColor: 'bg-emerald-500', desc: 'High-contrast hacker/tech terminal aesthetic' },
    { id: 'rose_gold', name: 'Rose Sunset', previewColor: 'bg-rose-500', desc: 'Warm luxury aesthetic for designers' },
    { id: 'clean_minimal', name: 'Clean Minimal', previewColor: 'bg-slate-500', desc: 'Distraction-free grayscale focus' },
  ];

  const handleUpdate = (field: keyof Profile, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onSave(updated);
    triggerSaved();
  };

  const handleSocialUpdate = (network: string, val: string) => {
    const updated = {
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [network]: val,
      },
    };
    setFormData(updated);
    onSave(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Auto-Save status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            <span>Profile & Appearance</span>
          </h2>
          <p className="text-xs text-slate-500">
            Customize your bio header, avatar, theme aesthetics, and social networks
          </p>
        </div>

        {savedBadge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      {/* Account Security & Credentials */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Security & Account Credentials</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {formData.isGuest ? 'Running as 5-Digit Guest Account. Publish your bio to convert into a main account.' : 'Your permanent registered account credentials.'}
            </p>
          </div>
          {formData.isGuest ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200">
              Guest Account (Unpublished)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200">
              Verified Main Account
            </span>
          )}
        </div>

        {!formData.isGuest && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username Handle</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">@{formData.username}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Account Password</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{formData.accountPassword || '••••••••'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Basic Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Identity & Details
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <img
              src={formData.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username}`}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
            />
            <button
              onClick={() => {
                const randomSeed = Math.random().toString(36).substring(7);
                handleUpdate('avatarUrl', `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`);
              }}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer"
              title="Generate new avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleUpdate('displayName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Billal Hossen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subdomain & Username (Unique Handle)
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs rounded-l-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-r-0 border-slate-200 dark:border-slate-700">
                  linkforge.app/@
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUpdate('username', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full px-3.5 py-2 text-xs rounded-r-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Bio Description
          </label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => handleUpdate('bio', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
            placeholder="Introduce yourself, your stack, or your business..."
          />
        </div>

        {/* Verified Badge Checkbox */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Verified Creator Badge
              </span>
              <p className="text-[11px] text-slate-500">
                Display official verification checkmark next to your name
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVerified}
              onChange={(e) => handleUpdate('isVerified', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600" />
          </label>
        </div>
      </div>

      {/* Theme & Visual Presets */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-500" />
            <span>Theme & Visual Styling</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
            Live Switch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {themeOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleUpdate('themePreset', opt.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                formData.themePreset === opt.id
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${opt.previewColor} shrink-0 shadow-xs flex items-center justify-center text-white`}>
                {formData.themePreset === opt.id && <Check className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{opt.name}</p>
                <p className="text-[10px] text-slate-500">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Accent Color */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Accent Highlight Color
            </span>
            <p className="text-[11px] text-slate-500">Sets the glow and active button rings</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.accentColor || '#6366f1'}
              onChange={(e) => handleUpdate('accentColor', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-xs text-slate-500 uppercase">
              {formData.accentColor || '#6366f1'}
            </span>
          </div>
        </div>
      </div>

      {/* Social Network Links */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Social Networks & Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              placeholder="https://github.com/yourhandle"
              value={formData.socialLinks?.github || ''}
              onChange={(e) => handleSocialUpdate('github', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Twitter / X
            </label>
            <input
              type="url"
              placeholder="https://twitter.com/yourhandle"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => handleSocialUpdate('twitter', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              YouTube Channel
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/@channel"
              value={formData.socialLinks?.youtube || ''}
              onChange={(e) => handleSocialUpdate('youtube', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourhandle"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => handleSocialUpdate('linkedin', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="youremail@domain.com"
              value={formData.socialLinks?.email || ''}
              onChange={(e) => handleSocialUpdate('email', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Portfolio / Website
            </label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={formData.socialLinks?.website || ''}
              onChange={(e) => handleSocialUpdate('website', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* SEO & OpenGraph Settings */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>SEO & OpenGraph Meta</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Customize how your profile appears on Google search and social media shares
            </p>
          </div>
          <button
            onClick={() => setShowSeoModal(!showSeoModal)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {showSeoModal ? 'Hide Config' : 'Configure Meta'}
          </button>
        </div>

        {showSeoModal && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Custom SEO Page Title
              </label>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => handleUpdate('seoTitle', e.target.value)}
                placeholder={`${formData.displayName} | Official Links & Portfolio`}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription || ''}
                onChange={(e) => handleUpdate('seoDescription', e.target.value)}
                placeholder="Brief summary for search engine snippet..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Simulated Google Search Result Preview */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                Google Search Preview
              </span>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {formData.seoTitle || `${formData.displayName} (@${formData.username}) | LinkForge`}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                https://{formData.customDomain || `${formData.username}.linkforge.app`}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {formData.seoDescription || formData.bio || 'Explore official links, media embeds, and projects.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
