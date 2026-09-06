import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface AdminImageUploaderProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export const AdminImageUploader: React.FC<AdminImageUploaderProps> = ({ imageUrl, onChange }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (PNG, JPG, WebP)', 'warning');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image file must be under 2.5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      showToast('Image uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Banner Image <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        {imageUrl && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/... or upload below"
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFile}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {imageUrl && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
