import React from 'react';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { BannerItem } from '../../types/banner';

interface BannerSlideProps {
  banner: BannerItem;
  onNavigate?: (url: string) => void;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ banner, onNavigate }) => {
  const handleClick = () => {
    if (!banner.linkUrl) return;
    if (banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://')) {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(banner.linkUrl);
    } else {
      window.location.hash = banner.linkUrl.replace(/^#\/?/, '');
    }
  };

  const isExternal = banner.linkUrl?.startsWith('http://') || banner.linkUrl?.startsWith('https://');

  return (
    <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800/80 group">
      {/* Background Image */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent sm:w-3/4" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent sm:hidden" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end sm:justify-center p-6 sm:p-10 max-w-2xl space-y-3 sm:space-y-4">
        {banner.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-400/40 text-indigo-300 text-[11px] font-bold tracking-wider uppercase w-fit">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{banner.badge}</span>
          </div>
        )}

        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
          {banner.title}
        </h2>

        {banner.subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm font-normal">
            {banner.subtitle}
          </p>
        )}

        {banner.linkUrl && (
          <div className="pt-2">
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/40 transition-all cursor-pointer"
            >
              <span>{banner.buttonText || 'Learn More'}</span>
              {isExternal ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
