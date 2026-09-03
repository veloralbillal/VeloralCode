import React, { useState } from 'react';
import { ShieldCheck, Clock, ShieldAlert, FileText, Camera } from 'lucide-react';
import { UserProfile } from '../../../types';
import { submitCreatorKyc } from '../../../services/creatorProfileService';
import { useToast } from '../../../context/ToastContext';
import { CreatorKycStatusCard } from './CreatorKycStatusCard';
import { CreatorKycForm } from './CreatorKycForm';

interface CreatorKycSectionProps {
  userProfile: UserProfile | null;
  userId: string;
}

export const CreatorKycSection: React.FC<CreatorKycSectionProps> = ({ userProfile, userId }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const kycStatus =
    userProfile?.creatorVerificationStatus ||
    userProfile?.creatorKyc?.status ||
    'not_submitted';

  const hasFacePhoto = Boolean(userProfile?.creatorKyc?.faceImageUrl);

  // If already approved but missing face photo, default to showing photo form
  const [showForm, setShowForm] = useState<boolean>(() => {
    if (kycStatus === 'not_submitted' || kycStatus === 'rejected') return true;
    if (kycStatus === 'verified' && !hasFacePhoto) return true;
    return false;
  });

  const handleSubmit = async (data: {
    documentType: 'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license';
    legalFullName: string;
    documentNumber: string;
    frontImageUrl: string;
    backImageUrl: string;
    faceImageUrl: string;
  }) => {
    try {
      setSubmitting(true);
      await submitCreatorKyc(userId, data);
      showToast(
        kycStatus === 'verified'
          ? 'Face photo & document updated for verification review!'
          : 'NID & Face Photo submitted successfully for verification!',
        'success'
      );
      setShowForm(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit verification', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header with Title and Current Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>NID & Face Photo KYC Verification</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Official
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit official NID card and clear Face/Selfie photo for verified creator badge.
            </p>
          </div>
        </div>

        <div>
          {kycStatus === 'verified' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Creator
            </span>
          )}
          {kycStatus === 'pending' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" /> Under Review
            </span>
          )}
          {kycStatus === 'rejected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Rejected
            </span>
          )}
          {kycStatus === 'not_submitted' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Not Submitted
            </span>
          )}
        </div>
      </div>

      {/* Current Status Card */}
      <CreatorKycStatusCard
        kycStatus={kycStatus}
        creatorKyc={userProfile?.creatorKyc}
        showForm={showForm}
        onToggleForm={() => setShowForm(!showForm)}
      />

      {/* Form Area */}
      {showForm && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <CreatorKycForm
            initialDocumentType={userProfile?.creatorKyc?.documentType || 'nid'}
            initialLegalFullName={userProfile?.creatorKyc?.legalFullName || userProfile?.name || ''}
            initialDocumentNumber={userProfile?.creatorKyc?.documentNumber || ''}
            initialFrontImage={userProfile?.creatorKyc?.frontImageUrl || ''}
            initialBackImage={userProfile?.creatorKyc?.backImageUrl || ''}
            initialFaceImage={userProfile?.creatorKyc?.faceImageUrl || ''}
            isUpdateMode={kycStatus === 'verified'}
            onSubmit={handleSubmit}
            onCancel={
              kycStatus === 'verified' || kycStatus === 'pending'
                ? () => setShowForm(false)
                : undefined
            }
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
};
