import React from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';

interface KycPhotoUploadBoxProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  value: string;
  onChange: (base64: string) => void;
  iconType?: 'document' | 'face';
}

export const KycPhotoUploadBox: React.FC<KycPhotoUploadBoxProps> = ({
  label,
  sublabel,
  required = false,
  value,
  onChange,
  iconType = 'document',
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {sublabel && (
          <span className="text-[10px] text-slate-400 font-medium">
            {sublabel}
          </span>
        )}
      </div>

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-4 text-center transition relative bg-slate-50/50 dark:bg-slate-800/40 min-h-[150px] flex flex-col items-center justify-center">
        {value ? (
          <div className="space-y-2.5 w-full flex flex-col items-center">
            <div className="relative group max-h-36 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
              <img
                src={value}
                alt={label}
                className="max-h-36 w-auto object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition active:scale-95"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              Change / Remove photo
            </button>
          </div>
        ) : (
          <label className="cursor-pointer space-y-2 block w-full py-2">
            {iconType === 'face' ? (
              <div className="w-11 h-11 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-11 h-11 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {iconType === 'face' ? 'Upload Face / Selfie Photo' : 'Upload Document Photo'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                PNG, JPG or JPEG (Max 5MB)
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
