import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { ToolReview } from '../../types';
import { fetchToolReviews, submitToolReview } from '../../services/toolInteractionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCreatorName } from '../../utils/userDisplay';

interface ToolReviewsSectionProps {
  codeId: string;
}

export const ToolReviewsSection: React.FC<ToolReviewsSectionProps> = ({ codeId }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchToolReviews(codeId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeId) loadReviews();
  }, [codeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to leave a review', 'info');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a short comment', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await submitToolReview(
        codeId,
        {
          uid: currentUser.uid,
          name: formatCreatorName(currentUser.displayName, currentUser.email, 'Developer'),
          email: currentUser.email || '',
        },
        rating,
        comment.trim()
      );

      showToast('Review submitted!', 'success');
      setComment('');
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Reviews & Community Ratings</h3>
            <p className="text-xs text-slate-400">Feedback from developers using this tool</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-right">
            <p className="text-sm font-black">{avgRating} / 5.0</p>
            <p className="text-[10px] text-slate-500">{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Rate this tool:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-1 hover:scale-110 transition"
              >
                <Star
                  className={`w-5 h-5 ${
                    s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700 hover:text-amber-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={currentUser ? 'Write your thoughts, tips, or report bugs...' : 'Sign in to write a review...'}
            disabled={!currentUser}
            className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !currentUser || !comment.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Posting...' : 'Post Review'}</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-xs text-slate-500 py-6">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-6 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-[10px] font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{rev.userName}</p>
                    <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 pl-8">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
