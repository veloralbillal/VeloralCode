import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'manual_guide' | 'error';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if inside an iframe (like AI Studio preview)
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    // Detect standalone mode (already installed app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    setIsInstalled(isStandalone);

    // Detect device type
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const isAndroidDevice = /android/.test(userAgent);
    setIsAndroid(isAndroidDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar so we control the prompt
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallGuide(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<InstallOutcome> => {
    // If native install prompt was captured, trigger it immediately
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          setShowInstallGuide(false);
          return 'accepted';
        }
        return 'dismissed';
      } catch (err) {
        console.error('PWA prompt execution error:', err);
        setShowInstallGuide(true);
        return 'error';
      }
    }

    // In an iframe or without beforeinstallprompt (iOS, browser restrictions),
    // show the helpful install guide modal immediately!
    setShowInstallGuide(true);
    return 'manual_guide';
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    showInstallGuide,
    setShowInstallGuide,
    install,
  };
}
