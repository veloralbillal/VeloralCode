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
          {/* Large floating buttons on desktop */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-950/90 text-white backdrop-blur-md items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-950/90 text-white backdrop-blur-md items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator & Mobile Arrow Controls */}
          <div className="absolute bottom-3 right-4 sm:right-8 flex items-center gap-2 z-20 bg-slate-950/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 shadow-lg">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="sm:hidden p-1 text-white/70 hover:text-white active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-1">
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

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="sm:hidden p-1 text-white/70 hover:text-white active:scale-90 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
