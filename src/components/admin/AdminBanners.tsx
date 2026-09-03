import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
import { BannerItem } from '../../types/banner';
import {
  subscribeToAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../../services/bannerService';
import { AdminBannerModal } from './AdminBannerModal';
import { DeleteConfirmModal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminBanners: React.FC = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<BannerItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToAllBanners((list) => {
      setBanners(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateOrUpdate = async (data: Omit<BannerItem, 'id' | 'createdAt'>) => {
    if (editingBanner) {
      await updateBanner(editingBanner.id, data);
    } else {
      await createBanner(data);
    }
  };

  const handleToggleStatus = async (banner: BannerItem) => {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      showToast(banner.isActive ? 'Banner hidden from public' : 'Banner activated live', 'info');
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    try {
      setDeleteLoading(true);
      await deleteBanner(deletingBanner.id);
      showToast('Banner deleted successfully', 'success');
      setDeletingBanner(null);
    } catch (err: any) {
      showToast('Failed to delete banner', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            <span>Slider Banners</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {banners.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload images, attach links, configure captions, and control ordering for the homepage carousel.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBanner(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid / List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Banners Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click "Add New Banner" to upload an image and add links for the slider.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              {/* Image Preview */}
              <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.isActive !== false
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {b.isActive !== false ? 'Live' : 'Draft'}
                  </span>
                  {b.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/80 text-white">
                      {b.badge}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  Order: {b.order ?? 1}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{b.title}</h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {b.subtitle || 'No description provided'}
                </p>

                {b.linkUrl && (
                  <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 truncate">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{b.linkUrl}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(b)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {b.isActive !== false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingBanner(b);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingBanner(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Create / Edit Modal */}
      <AdminBannerModal
        isOpen={modalOpen}
        banner={editingBanner}
        onClose={() => {
          setModalOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleCreateOrUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingBanner}
        title="Delete Slider Banner"
        itemTitle={deletingBanner?.title}
        message="Are you sure you want to permanently delete this banner from the slider?"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeletingBanner(null)}
      />
    </div>
  );
};
