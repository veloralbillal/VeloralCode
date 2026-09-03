import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Eye,
  AlertCircle,
  Trash2,
  Tag,
} from 'lucide-react';
import { SupportedLanguage, CodeItem } from '../../types';
import {
  getCodeItemById,
  updateExistingCode,
  deleteExistingCode,
  subscribeToAllCodes,
} from '../../services/codeService';
import { useToast } from '../../context/ToastContext';
import { parseFirebaseError } from '../../utils/helpers';
import { CodeViewer } from '../common/CodeViewer';
import { DeleteConfirmModal } from '../common/Modal';

interface AdminEditCodeProps {
  codeId: string;
  onNavigate: (route: string) => void;
}

const ALL_LANGUAGES: SupportedLanguage[] = [
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Python',
  'PHP',
  'Java',
  'C',
  'C++',
  'SQL',
  'Bash',
  'JSON',
  'XML',
  'Markdown',
];

export const AdminEditCode: React.FC<AdminEditCodeProps> = ({ codeId, onNavigate }) => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('JavaScript');
  const [category, setCategory] = useState('');
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [version, setVersion] = useState('1.0.0');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'pending_approval' | 'rejected'>('published');

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAllCodes(
      (items) => {
        const cats = new Set<string>();
        items.forEach((item) => {
          if (item.category && item.category.trim()) {
            cats.add(item.category.trim());
          }
        });
        setExistingCategories(Array.from(cats).sort());
      },
      () => {}
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setInitialLoading(true);
      try {
        const item = await getCodeItemById(codeId);
        if (!isMounted) return;
        if (!item) {
          setErrorMsg('Code entry not found.');
        } else {
          setTitle(item.title || '');
          setDescription(item.description || '');
          setCode(item.code || '');
          setLanguage(item.language || 'JavaScript');
          setCategory(item.category || '');
          setVersion(item.version || '1.0.0');
          setTagsInput(item.tags ? item.tags.join(', ') : '');
          setStatus(item.status || 'published');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMsg(err.message || 'Failed to load code entry.');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [codeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please provide a snippet title.');
      return;
    }
    if (!category.trim()) {
      setErrorMsg('Please enter or select a category.');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('Please enter code content.');
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await updateExistingCode(codeId, {
        title: title.trim(),
        description: description.trim(),
        code,
        language,
        category: category.trim(),
        version: version.trim() || '1.0.0',
        tags,
        status,
      });

      showToast('Code updated successfully in Realtime Database!', 'success');
      onNavigate('#/admin/manage');
    } catch (err: any) {
      setErrorMsg(parseFirebaseError(err));
      showToast('Failed to update code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteExistingCode(codeId);
      showToast('Code deleted successfully.', 'info');
      setDeleteModalOpen(false);
      onNavigate('#/admin/manage');
    } catch (err: any) {
      showToast(parseFirebaseError(err), 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('#/admin/manage')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Codes
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Code Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Language & Category & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {ALL_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="edit-category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter or choose category (e.g. Utilities, Hooks, Auth)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <datalist id="edit-category-suggestions">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              {existingCategories.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 items-center text-[11px]">
                  <span className="text-slate-400">Suggestions:</span>
                  {existingCategories.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700 transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    status === 'published'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    status === 'draft'
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          {/* Code Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Code Content <span className="text-rose-500">*</span>
            </label>
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950">
              <textarea
                required
                rows={14}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none selection:bg-indigo-600"
                spellCheck={false}
              />
            </div>
          </div>

          {showPreview && code.trim() && (
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Live Preview
              </h4>
              <CodeViewer
                code={code}
                language={language}
                title={title}
                maxHeight="350px"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('#/admin/manage')}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Code Entry"
        itemTitle={title}
        loading={deleteLoading}
      />
    </div>
  );
};
