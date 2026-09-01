import React, { useState, useEffect } from 'react';
import {
  Code2,
  Upload,
  Sparkles,
  Layers,
  FileCode,
  Tag,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SupportedLanguage } from '../../types';
import { uploadCreatorCode, updateCreatorCode } from '../../services/creatorService';
import { getCodeItemById } from '../../services/codeService';

interface CreatorUploadToolProps {
  editCodeId?: string;
  onNavigate: (route: string) => void;
}

const LANGUAGES: SupportedLanguage[] = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'JSON',
  'XML',
  'PHP',
  'Python',
  'Java',
  'C',
  'C++',
  'SQL',
  'Bash',
  'Markdown',
];

const CATEGORIES = [
  'UI Components',
  'Utility Tools',
  'Calculators & Converters',
  'Web Apps & Games',
  'Animation & Canvas',
  'Security & Auth',
  'APIs & Integration',
  'Algorithms',
  'Themes & Templates',
];

export const CreatorUploadTool: React.FC<CreatorUploadToolProps> = ({
  editCodeId,
  onNavigate,
}) => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('HTML');
  const [category, setCategory] = useState<string>('UI Components');
  const [version, setVersion] = useState('1.0.0');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editCodeId);

  useEffect(() => {
    if (editCodeId) {
      setInitialLoading(true);
      getCodeItemById(editCodeId)
        .then((data) => {
          if (data) {
            setTitle(data.title || '');
            setDescription(data.description || '');
            setCode(data.code || '');
            setLanguage(data.language || 'HTML');
            setCategory(data.category || 'UI Components');
            setVersion(data.version || '1.0.0');
            setTags(data.tags || []);
            setRejectionReason(data.rejectionReason || '');
          }
        })
        .finally(() => setInitialLoading(false));
    }
  }, [editCodeId]);

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^,+|,+$/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !code.trim()) {
      showToast('Please fill in title, description and code content.', 'warning');
      return;
    }

    if (!currentUser) {
      showToast('You must be logged in as a Creator.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editCodeId) {
        // Update existing code
        await updateCreatorCode(
          editCodeId,
          {
            title: title.trim(),
            description: description.trim(),
            code,
            language,
            category,
            version: version.trim() || '1.0.0',
            tags,
          },
          true // isCreator flag: re-submits for approval if rejected
        );

        showToast(
          'Tool changes saved successfully! It will be reviewed by the administrator.',
          'success'
        );
      } else {
        // Upload new code
        await uploadCreatorCode(
          {
            title: title.trim(),
            description: description.trim(),
            code,
            language,
            category,
            version: version.trim() || '1.0.0',
            tags,
          },
          currentUser.uid,
          currentUser.email || '',
          isAdmin
        );

        showToast(
          isAdmin
            ? 'Tool published directly by administrator!'
            : 'Tool submitted for admin review! You will receive points when approved.',
          'success'
        );
      }

      onNavigate('#/creator/tools');
    } catch (err: any) {
      showToast('Failed to save tool: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading tool editor data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('#/creator/tools')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editCodeId ? 'Edit Tool / Code' : 'Upload Tool for Admin Approval'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {editCodeId
                ? 'Update your source code or documentation.'
                : 'Share your web components, scripts, or full apps with the community.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Admin Review Process Active</span>
        </div>
      </div>

      {/* Rejection Notice if applicable */}
      {rejectionReason && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3 text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Admin Feedback on Previous Submission</h4>
            <p className="text-xs mt-1 leading-relaxed">{rejectionReason}</p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
              Update your code or description below and save to resubmit for approval.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          {/* Title & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tool Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Responsive Glassmorphic Card or Markdown Live Previewer"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Primary Language / Format <span className="text-rose-500">*</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Description & Features <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how the tool works, key features, and any instructions for users..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Source Code Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tool Source Code / Markup <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {language} format
              </span>
            </div>
            <div className="relative">
              <textarea
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={
                  language === 'HTML'
                    ? '<!DOCTYPE html>\n<html>\n  <head><title>My Tool</title></head>\n  <body>\n    <!-- Write code here -->\n  </body>\n</html>'
                    : '// Write or paste your clean code snippet here...'
                }
                required
                className="w-full p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-slate-800 leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Search Tags (Press Enter or comma)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-12">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-100 font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? 'Type tag and press enter...' : 'Add more...'}
                className="flex-1 min-w-[120px] bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none px-2"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('#/creator/tools')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{editCodeId ? 'Save & Resubmit Tool' : 'Submit Tool For Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
