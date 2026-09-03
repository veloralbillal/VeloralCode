import React, { useState } from 'react';
import { Upload, ShieldCheck, Camera, AlertCircle } from 'lucide-react';
import { KycPhotoUploadBox } from './KycPhotoUploadBox';

interface CreatorKycFormProps {
  initialDocumentType?: 'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license';
  initialLegalFullName?: string;
  initialDocumentNumber?: string;
  initialFrontImage?: string;
  initialBackImage?: string;
  initialFaceImage?: string;
  isUpdateMode?: boolean;
  onSubmit: (data: {
    documentType: 'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license';
    legalFullName: string;
    documentNumber: string;
    frontImageUrl: string;
    backImageUrl: string;
    faceImageUrl: string;
  }) => Promise<void>;
  onCancel?: () => void;
  submitting: boolean;
}

export const CreatorKycForm: React.FC<CreatorKycFormProps> = ({
  initialDocumentType = 'nid',
  initialLegalFullName = '',
  initialDocumentNumber = '',
  initialFrontImage = '',
  initialBackImage = '',
  initialFaceImage = '',
  isUpdateMode = false,
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [documentType, setDocumentType] = useState(initialDocumentType);
  const [legalFullName, setLegalFullName] = useState(initialLegalFullName);
  const [documentNumber, setDocumentNumber] = useState(initialDocumentNumber);
  const [frontImage, setFrontImage] = useState(initialFrontImage);
  const [backImage, setBackImage] = useState(initialBackImage);
  const [faceImage, setFaceImage] = useState(initialFaceImage);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!legalFullName.trim()) {
      setFormError('Please enter your legal full name matching your document.');
      return;
    }
    if (!documentNumber.trim()) {
      setFormError('Please enter your document/NID identification number.');
      return;
    }
    if (!frontImage) {
      setFormError('Please upload the front photo of your NID / ID Document.');
      return;
    }
    if (!faceImage) {
      setFormError('Please upload your Face / Selfie photo for biometric verification.');
      return;
    }

    await onSubmit({
      documentType,
      legalFullName: legalFullName.trim(),
      documentNumber: documentNumber.trim(),
      frontImageUrl: frontImage,
      backImageUrl: backImage,
      faceImageUrl: faceImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Basic Document Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Document Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Document Type (ডকুমেন্ট ধরন) <span className="text-rose-500">*</span>
          </label>
          <select
            value={documentType}
            onChange={(e: any) => setDocumentType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
          >
            <option value="nid">National ID (NID Card) - জাতীয় পরিচয়পত্র</option>
            <option value="passport">Passport - পাসপোর্ট</option>
            <option value="driving_license">Driving License - ড্রাইভিং লাইসেন্স</option>
            <option value="student_id">Student ID - স্টুডেন্ট আইডি</option>
            <option value="trade_license">Trade License - ট্রেড লাইসেন্স</option>
          </select>
        </div>

        {/* Legal Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Full Legal Name (ডকুমেন্টের নাম) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={legalFullName}
            onChange={(e) => setLegalFullName(e.target.value)}
            placeholder="e.g. Billal Hossen"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Document / NID Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Document / NID Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder="e.g. 1994829103841"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
          />
        </div>
      </div>

      {/* 3 Upload Boxes: Front Side, Back Side, and Face / Selfie Photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Front Photo */}
        <KycPhotoUploadBox
          label="1. NID Front Side (সামনের ছবি)"
          sublabel="Required"
          required
          value={frontImage}
          onChange={setFrontImage}
          iconType="document"
        />

        {/* Back Photo */}
        <KycPhotoUploadBox
          label="2. NID Back Side (পেছনের ছবি)"
          sublabel="Optional"
          value={backImage}
          onChange={setBackImage}
          iconType="document"
        />

        {/* Face / Selfie Photo (Critical Requirement from User) */}
        <KycPhotoUploadBox
          label="3. Face / Selfie Photo (মুখমণ্ডলের ছবি)"
          sublabel="Face photo required"
          required
          value={faceImage}
          onChange={setFaceImage}
          iconType="face"
        />
      </div>

      {/* Face & Privacy Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3 text-xs text-indigo-950 dark:text-indigo-200">
        <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Face Verification Guideline (মুখমণ্ডলের ছবির নিয়মাবলী):</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Please capture a clear, well-lit photo of your face (or a selfie holding your NID card). Ensure good lighting, no sunglasses or caps covering your face. Your photo is securely encrypted and used strictly for creator identity verification.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !frontImage || !faceImage}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>
            {submitting
              ? 'Submitting Documents...'
              : isUpdateMode
              ? 'Update Face & KYC Photos'
              : 'Submit NID & Face Photo for Verification'}
          </span>
        </button>
      </div>
    </form>
  );
};
