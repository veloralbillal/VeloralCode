import React from 'react';
import { ShieldCheck, Clock, ShieldAlert, Camera, RefreshCw } from 'lucide-react';
import { CreatorDocumentSubmission } from '../../../types';

interface CreatorKycStatusCardProps {
  kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  creatorKyc?: CreatorDocumentSubmission;
  showForm: boolean;
  onToggleForm: () => void;
}

export const CreatorKycStatusCard: React.FC<CreatorKycStatusCardProps> = ({
  kycStatus,
  creatorKyc,
  showForm,
  onToggleForm,
}) => {
  const hasFacePhoto = Boolean(creatorKyc?.faceImageUrl);

  return (
    <div className="space-y-4">
      {/* 1. Verified Status State */}
      {kycStatus === 'verified' && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Identity Verified & Approved</span>
            </div>

            <button
              onClick={onToggleForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{showForm ? 'Hide Photo Form' : 'Update Face & NID Photo'}</span>
            </button>
          </div>

          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            Your official identification ({creatorKyc?.documentType?.toUpperCase()} #{creatorKyc?.documentNumber}) has been approved.
          </p>

          {/* Prompt if Face Photo is missing or required update */}
          {!hasFacePhoto ? (
            <div className="mt-2 p-3 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Camera className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Face Photo Required (মুখমণ্ডলের ছবি আবশ্যক):</strong>
                <span>
                  Your account is approved, but the latest platform policy requires a clear Face / Selfie photo. Please submit your face photo below to keep your verification fully compliant.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Face Photo & NID Verified. You can update or re-upload your photo anytime by clicking above.</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Pending Review */}
      {kycStatus === 'pending' && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
              <span>Document & Face Photo Submitted for Review</span>
            </div>
            <button
              onClick={onToggleForm}
              className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline"
            >
              {showForm ? 'Hide Form' : 'Edit & Re-submit'}
            </button>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            You submitted <strong>{creatorKyc?.legalFullName}</strong> ({creatorKyc?.documentType?.toUpperCase()}: {creatorKyc?.documentNumber}) along with your Face Photo. Administration is verifying your identity (usually within 12-24 hours).
          </p>
        </div>
      )}

      {/* 3. Rejected State */}
      {kycStatus === 'rejected' && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Verification Could Not Be Approved</span>
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
            Reason: {creatorKyc?.rejectionReason || 'Document or Face photo was unreadable or details did not match.'}
          </p>
          <button
            onClick={onToggleForm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
          >
            Re-submit NID & Face Photo
          </button>
        </div>
      )}
    </div>
  );
};
