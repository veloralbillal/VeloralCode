import React, { useState } from 'react';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Youtube,
  Music,
  Calendar,
  Calculator,
  Mail,
  Edit2,
  Check,
  X,
  Sparkles,
  Code2,
  Newspaper,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { Block, BlockType, Profile } from '../types';
import { linkForgeService } from '../services/linkForgeService';

interface BlockManagerProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
}

export const BlockManager: React.FC<BlockManagerProps> = ({ profile, onUpdate }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BlockType>('LINK');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Editing state
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const blockTypeOptions: { type: BlockType; label: string; icon: any; desc: string; color: string }[] = [
    {
      type: 'LINK',
      label: 'Standard Link',
      icon: ExternalLink,
      desc: 'Redirect visitors to any website, store, or article',
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    },
    {
      type: 'EMBED_YOUTUBE',
      label: 'YouTube Video',
      icon: Youtube,
      desc: 'Play video directly on your bio page without leaving',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    },
    {
      type: 'EMBED_SPOTIFY',
      label: 'Spotify Music',
      icon: Music,
      desc: 'Embed your favorite track, playlist, or podcast',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      type: 'EMBED_CALCOM',
      label: 'Cal.com Booking',
      icon: Calendar,
      desc: 'Let clients book appointments directly on your bio',
      color: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    },
    {
      type: 'CALCULATOR_ROI',
      label: 'Interactive ROI Widget',
      icon: Calculator,
      desc: 'Engage leads with a real-time slider calculator',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    {
      type: 'CONTACT_FORM',
      label: 'Lead Contact Form',
      icon: Mail,
      desc: 'Capture user inquiries and consulting leads',
      color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    },
    {
      type: 'EMBED_GITHUB',
      label: 'GitHub Repository Card',
      icon: Code2,
      desc: 'Showcase open source code repo, stars & forks',
      color: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    },
    {
      type: 'NEWSLETTER',
      label: 'Newsletter Signup',
      icon: Newspaper,
      desc: 'Grow your subscriber list with email collection',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
    {
      type: 'PRODUCT_CARD',
      label: 'Digital Product / Item',
      icon: ShoppingBag,
      desc: 'Sell digital downloads, code packages, or templates',
      color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    },
    {
      type: 'COUNTDOWN',
      label: 'Launch Countdown Timer',
      icon: Clock,
      desc: 'Urgency countdown timer for product drops & events',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    },
  ];

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const updated = linkForgeService.addBlock(profile.username, {
      type: selectedType,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      url: newUrl.trim() || undefined,
    });

    if (updated) {
      onUpdate(updated);
    }

    // Reset Form
    setNewTitle('');
    setNewSubtitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  const handleToggleActive = (block: Block) => {
    const updated = linkForgeService.updateBlock(profile.username, block.id, {
      isActive: !block.isActive,
    });
    if (updated) onUpdate(updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updated = linkForgeService.deleteBlock(profile.username, blockId);
    if (updated) onUpdate(updated);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...profile.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    // Swap elements
    const temp = blocks[index];
    blocks[index] = blocks[targetIndex];
    blocks[targetIndex] = temp;

    const blockIds = blocks.map((b) => b.id);
    const updated = linkForgeService.reorderBlocks(profile.username, blockIds);
    if (updated) onUpdate(updated);
  };

  const startEditing = (block: Block) => {
    setEditingBlockId(block.id);
    setEditTitle(block.title);
    setEditSubtitle(block.subtitle || '');
    setEditUrl(block.url || '');
  };

  const saveEditing = (blockId: string) => {
    const updated = linkForgeService.updateBlock(profile.username, blockId, {
      title: editTitle,
      subtitle: editSubtitle,
      url: editUrl,
    });
    if (updated) onUpdate(updated);
    setEditingBlockId(null);
  };

  const getBlockBadge = (type: BlockType) => {
    switch (type) {
      case 'EMBED_YOUTUBE':
        return { label: 'YouTube Video', color: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' };
      case 'EMBED_SPOTIFY':
        return { label: 'Spotify Embed', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' };
      case 'EMBED_CALCOM':
        return { label: 'Cal.com Booking', color: 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400' };
      case 'CALCULATOR_ROI':
        return { label: 'Interactive ROI', color: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' };
      case 'CONTACT_FORM':
        return { label: 'Contact Lead Form', color: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400' };
      case 'LINK':
      default:
        return { label: 'Direct Link', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Links & Dynamic Widgets</span>
          </h2>
          <p className="text-xs text-slate-500">
            Drag, toggle, and build rich embeds (YouTube, Spotify, ROI Calculators, Lead forms)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer shrink-0 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Block / Widget</span>
        </button>
      </div>

      {/* Add New Block Modal / Expander */}
      {isAddModalOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-indigo-500/50 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Choose Widget / Block Type</span>
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {blockTypeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => {
                    setSelectedType(opt.type);
                    if (opt.type === 'EMBED_YOUTUBE' && !newTitle) setNewTitle('Featured YouTube Video');
                    if (opt.type === 'EMBED_SPOTIFY' && !newTitle) setNewTitle('My Spotify Playlist');
                    if (opt.type === 'EMBED_CALCOM' && !newTitle) setNewTitle('Schedule a 1:1 Call');
                    if (opt.type === 'CALCULATOR_ROI' && !newTitle) setNewTitle('Interactive ROI Calculator');
                    if (opt.type === 'CONTACT_FORM' && !newTitle) setNewTitle('Send Me a Message');
                  }}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedType === opt.type
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-2 ${opt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddBlock} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Title / Heading *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. My Open-Source GitHub Repository"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle / Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 500+ stars on GitHub, ready for deployment"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {selectedType !== 'CALCULATOR_ROI' && selectedType !== 'CONTACT_FORM' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    selectedType === 'EMBED_YOUTUBE'
                      ? 'https://youtube.com/watch?v=...'
                      : selectedType === 'EMBED_SPOTIFY'
                      ? 'https://open.spotify.com/track/...'
                      : 'https://...'
                  }
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer"
              >
                Create Block
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blocks List */}
      <div className="space-y-3">
        {profile.blocks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">
              No blocks created yet. Click "Add New Block / Widget" above to build your bio.
            </p>
          </div>
        ) : (
          profile.blocks.map((block, index) => {
            const badge = getBlockBadge(block.type);
            const isEditing = editingBlockId === block.id;

            return (
              <div
                key={block.id}
                className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border transition-all ${
                  block.isActive
                    ? 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'border-slate-200/50 dark:border-slate-800/50 opacity-60 bg-slate-50/50 dark:bg-slate-950/50'
                } shadow-xs space-y-3`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Left: Reorder buttons & Type Badge */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => handleMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(index, 'down')}
                        disabled={index === profile.blocks.length - 1}
                        className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                      {badge.label}
                    </span>

                    <span className="text-[11px] font-bold text-slate-500">
                      {block.clickCount || 0} clicks
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(block)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={block.isActive ? 'Hide on bio' : 'Show on bio'}
                    >
                      {block.isActive ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>

                    <button
                      onClick={() => (isEditing ? saveEditing(block.id) : startEditing(block))}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Block"
                    >
                      {isEditing ? <Check className="w-4 h-4 text-emerald-500" /> : <Edit2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content body / Inline editing */}
                {isEditing ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      placeholder="Subtitle"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    {block.type !== 'CALCULATOR_ROI' && block.type !== 'CONTACT_FORM' && (
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Target URL"
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    )}
                    <button
                      onClick={() => saveEditing(block.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{block.title}</span>
                    </h4>
                    {block.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5">{block.subtitle}</p>
                    )}
                    {block.url && (
                      <a
                        href={block.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-flex items-center gap-1 truncate max-w-full"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{block.url}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
