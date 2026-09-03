import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerItem } from '../../types/banner';
import { subscribeToActiveBanners } from '../../services/bannerService';
import { BannerSlide } from './BannerSlide';

interface SliderBannerProps {
  onNavigate?: (url: string) => void;
}

export const SliderBanner: React.FC<SliderBannerProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsub = subscribeToActiveBanners((items) => {
      setBanners(items);
      if (currentIndex >= items.length) {
        setCurrentIndex(0);
      }
    });

    return () => unsub();
  }, [currentIndex]);

  const total = banners.length;

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (total <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered]);

  if (total === 0) return null;

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current Slide */}
      <BannerSlide banner={currentBanner} onNavigate={onNavigate} />

      {/* Navigation Buttons (shown if > 1 slide) */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-20"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-20"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 sm:right-10 flex items-center gap-1.5 z-20 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {banners.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-indigo-400'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
