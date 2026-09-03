import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Search,
  ExternalLink,
  UserCheck,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchAllKycSubmissions,
  reviewCreatorKyc,
} from '../../services/creatorProfileService';
import { formatDate } from '../../utils/helpers';
import { formatCreatorName } from '../../utils/userDisplay';

export const AdminCreatorVerifications: React.FC = () => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await fetchAllKycSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load KYC submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (sub: any) => {
    try {
      setProcessing(true);
      await reviewCreatorKyc(sub.uid, 'verified', '', userProfile?.name || 'Admin');
      showToast(`Identity verified for ${sub.legalFullName || 'Creator'}!`, 'success');
      setSelectedDoc(null);
      loadSubmissions();
    } catch (err: any) {
      showToast(err.message || 'Approval failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoc) return;
    try {
      setProcessing(true);
      await reviewCreatorKyc(
        selectedDoc.uid,
        'rejected',
        rejectionReason.trim() || 'Document image was unreadable or details mismatched',
        userProfile?.name || 'Admin'
      );
      showToast('Document submission rejected', 'info');
      setRejectModalOpen(false);
      setSelectedDoc(null);
      setRejectionReason('');
      loadSubmissions();
    } catch (err: any) {
      showToast(err.message || 'Rejection failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = submissions.filter((s) => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (s.legalFullName || '').toLowerCase().includes(q) ||
        (s.documentNumber || '').toLowerCase().includes(q) ||
        (s.documentType || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['all', 'pending', 'verified', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab === 'all' ? 'All Submissions' : tab}
              <span className="ml-1.5 text-[10px] opacity-80 px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                {tab === 'all' ? submissions.length : submissions.filter((s) => s.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents, name, NID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading document submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
          <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No document submissions found</p>
          <p className="text-xs text-slate-400">Creators who submit KYC documents will appear here for review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.uid}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                      {item.documentType?.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {item.legalFullName}
                    </h4>
                  </div>

                  <div>
                    {item.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" /> Under Review
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                        <ShieldAlert className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Doc Number:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{item.documentNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Submitted:</span>
                    <span className="text-slate-600 dark:text-slate-300">{formatDate(item.submittedAt)}</span>
                  </div>
                  {item.rejectionReason && (
                    <div className="pt-1 text-rose-500 text-[11px]">
                      Reason: {item.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Preview Thumbnail */}
                {(item.frontImageUrl || item.faceImageUrl) && (
                  <div className="flex items-center gap-2 pt-1">
                    {item.frontImageUrl && (
                      <div
                        onClick={() => setSelectedDoc(item)}
                        className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-16 w-20 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center hover:opacity-80 transition relative"
                        title="Document Front"
                      >
                        <img src={item.frontImageUrl} alt="Doc Front" className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold py-0.5">Front</span>
                      </div>
                    )}
                    {item.backImageUrl && (
                      <div
                        onClick={() => setSelectedDoc(item)}
                        className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-16 w-20 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center hover:opacity-80 transition relative"
                        title="Document Back"
                      >
                        <img src={item.backImageUrl} alt="Doc Back" className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold py-0.5">Back</span>
                      </div>
                    )}
                    {item.faceImageUrl && (
                      <div
                        onClick={() => setSelectedDoc(item)}
                        className="cursor-pointer border-2 border-indigo-500/50 dark:border-indigo-400/50 rounded-xl overflow-hidden h-16 w-20 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center hover:opacity-80 transition relative shadow-xs"
                        title="Face Photo"
                      >
                        <img src={item.faceImageUrl} alt="Face / Selfie" className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-indigo-600/90 text-[9px] text-white text-center font-bold py-0.5">Face</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedDoc(item)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Document
                </button>
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={processing}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoc(item);
                        setRejectModalOpen(true);
                      }}
                      disabled={processing}
                      className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold transition"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Document Modal */}
      {selectedDoc && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Document Inspection: {selectedDoc.legalFullName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDoc.documentType?.toUpperCase()} #{selectedDoc.documentNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Front Side (NID):</p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center p-2">
                  <img
                    src={selectedDoc.frontImageUrl}
                    alt="Front"
                    className="max-h-56 w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
              {selectedDoc.backImageUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Back Side (NID):</p>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center p-2">
                    <img
                      src={selectedDoc.backImageUrl}
                      alt="Back"
                      className="max-h-56 w-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
              {selectedDoc.faceImageUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span>Face / Selfie Photo:</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 font-extrabold">Verified Face</span>
                  </p>
                  <div className="border-2 border-indigo-300 dark:border-indigo-800 rounded-2xl overflow-hidden bg-indigo-50/20 dark:bg-indigo-950/20 flex items-center justify-center p-2">
                    <img
                      src={selectedDoc.faceImageUrl}
                      alt="Face Photo"
                      className="max-h-56 w-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
              {selectedDoc.status === 'pending' && (
                <>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Reject Submission
                  </button>
                  <button
                    onClick={() => handleApprove(selectedDoc)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Verify & Approve Badge
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Reject Document Submission</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please enter the reason for rejection so the creator can re-submit with the correct information:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Document image is blurry, or legal name does not match."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
