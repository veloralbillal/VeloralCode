import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { SetupGuideModal } from '../components/docs/SetupGuideModal';
import { UserDashboard } from '../components/user/UserDashboard';
import { OfflineIndicator } from '../components/pwa/OfflineIndicator';
import { SwUpdateNotification } from '../components/pwa/SwUpdateNotification';
import { EventPopupManager } from '../components/events/EventPopupManager';
import { GlobalAnnouncementBar } from '../components/common/GlobalAnnouncementBar';

// Safe dynamic lazy loading with retry resilience to prevent module fetch drops
function safeLazy<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  delay = 500
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await factory();
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isDynamicImportErr =
          msg.includes('Failed to fetch dynamically imported module') ||
          msg.includes('dynamically imported') ||
          msg.includes('Loading chunk') ||
          err?.name === 'TypeError';

        if (attempt < retries && isDynamicImportErr) {
          console.warn(`Dynamic import retry (${attempt + 1}/${retries})...`);
          await new Promise((r) => setTimeout(r, delay * Math.pow(1.5, attempt)));
        } else if (!isDynamicImportErr) {
          throw err;
        }
      }
    }
    throw lastError;
  });
}

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.warn('Route module load error caught by RouteErrorBoundary:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Unable to load module</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              The application module was updated or connection delayed. Please tap retry to load.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Refresh App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-load sub-routes with automatic retry resilience
const AdminRoutes = safeLazy(() => import('./AdminRoutes'));
const SellerRoutes = safeLazy(() => import('./SellerRoutes'));
const CreatorRoutes = safeLazy(() => import('./CreatorRoutes'));
const AuthPage = safeLazy(() => import('../components/auth/AuthPage').then((m) => ({ default: m.AuthPage })));
const CodeDetails = safeLazy(() => import('../components/user/CodeDetails').then((m) => ({ default: m.CodeDetails })));
const UserProfileView = safeLazy(() => import('../components/user/UserProfile').then((m) => ({ default: m.UserProfileView })));
const BakirKhataApp = safeLazy(() => import('../apps/bakikhata/BakirKhataApp').then((m) => ({ default: m.BakirKhataApp })));
const UrlShortenerApp = safeLazy(() => import('../apps/urlshortener/UrlShortenerApp').then((m) => ({ default: m.UrlShortenerApp })));
const LinkRedirectHandler = safeLazy(() => import('../apps/urlshortener/components/LinkRedirectHandler').then((m) => ({ default: m.LinkRedirectHandler })));
const LinkForgeApp = safeLazy(() => import('../apps/linkforge/LinkForgeApp').then((m) => ({ default: m.LinkForgeApp })));
const EventsPage = safeLazy(() => import('../components/events/EventsPage').then((m) => ({ default: m.EventsPage })));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3 text-center">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading module...</p>
  </div>
);

export const AppRouter: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isSeller, isCreator, loading: authLoading } = useAuth();
  
  const getInitialRoute = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      const search = window.location.search || '';
      const hash = window.location.hash || '';

      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');

      // 1. Direct creator route: /creator/:id
      if (path.startsWith('/creator/') && path.length > '/creator/'.length) {
        return `#${path}`;
      }

      // 2. Direct Bakir Khata paths: /app/bakikhata or /bakikhata
      if (path === '/app/bakikhata' || path.startsWith('/app/bakikhata') || path === '/bakikhata') {
        return '#/app/bakikhata';
      }

      // 2b. Direct URL Shortener paths: /app/shortener or /shortener
      if (path === '/app/shortener' || path.startsWith('/app/shortener') || path === '/shortener' || path === '/app/urlshortener') {
        return '#/app/shortener';
      }

      // 2c. Direct LinkForge Bio & Portfolio paths: /app/linkforge or /linkforge
      if (path === '/app/linkforge' || path.startsWith('/app/linkforge') || path === '/linkforge' || path.startsWith('/linkforge')) {
        return '#/app/linkforge';
      }

      // 2d. Direct public bio paths: /bio/:username or /@:username
      if (path.startsWith('/bio/') || path.startsWith('/@')) {
        return `#${path}`;
      }

      // 2e. Direct Short URL redirect paths: /r/:slug or /s/:slug
      if (path.startsWith('/r/') || path.startsWith('/s/')) {
        const slug = path.replace(/^\/(r|s)\//, '').split('?')[0];
        if (slug) return `#/r/${slug}`;
      }

      // 2f. Clean direct domain slug (e.g. domain/random-code)
      if (path && path.length > 1 && path.startsWith('/') && !path.includes('.')) {
        const potentialSlug = path.substring(1).split('/')[0].split('?')[0];
        const reserved = [
          'admin', 'app', 'profile', 'creator', 'events', 'explore', 'codes',
          'seller', 'login', 'register', 'r', 's', 'api', 'bakikhata', 'shortener', 'linkforge', 'bio'
        ];
        if (potentialSlug && !reserved.includes(potentialSlug.toLowerCase())) {
          return `#/r/${potentialSlug}`;
        }
      }

      // 3. PWA query param (e.g., from manifest start_url: /?app=bakikhata)
      if (search.includes('app=bakikhata') || search.includes('pwa=bakikhata')) {
        return '#/app/bakikhata';
      }

      // 4. Standalone installed PWA mode:
      // When opened from Android/iOS/Desktop home screen without an explicit sub-route,
      // it MUST open the installed Bakir Khata app directly!
      if (isStandalone && (!hash || hash === '#/' || hash === '#' || hash === '')) {
        return '#/app/bakikhata';
      }

      // 5. If user previously used Bakir Khata and opens in standalone mode
      try {
        const lastApp = localStorage.getItem('last_active_app');
        if (lastApp === 'bakikhata' && isStandalone && (!hash || hash === '#/')) {
          return '#/app/bakikhata';
        }
      } catch {
        // ignore localStorage access errors
      }

      // 6. Explicit hash navigation
      return hash || '#/';
    }
    return '#/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    // If the resolved route is Bakir Khata (e.g., in installed PWA or via query param)
    // but the address bar hash is empty, sync it for consistent navigation.
    const initial = getInitialRoute();
    if (initial === '#/app/bakikhata' && window.location.hash !== '#/app/bakikhata') {
      window.location.hash = '#/app/bakikhata';
    }

    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const renderContent = () => {
    const hash = currentRoute.split('?')[0];

    // Auth Routes: #/login, #/register, etc.
    if (hash === '#/login') {
      const isRegister = currentRoute.includes('mode=register');
      const isForgot = currentRoute.includes('mode=forgot');
      const initialMode = isRegister ? 'register' : isForgot ? 'forgot' : 'login';
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <AuthPage
            initialMode={initialMode}
            onNavigate={navigate}
            onOpenGuide={() => setGuideModalOpen(true)}
          />
        </Suspense>
      );
    }

    // User Profile Route
    if (hash.startsWith('#/profile')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <UserProfileView 
            currentRoute={hash} 
            onNavigate={navigate} 
            onNavigateToCode={(id) => navigate(`#/code/${id}`)}
          />
        </Suspense>
      );
    }

    // Bakir Khata Sub-App
    if (hash === '#/app/bakikhata' || hash.startsWith('#/app/bakikhata')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <BakirKhataApp onBackToApp={() => navigate('#/profile')} />
        </Suspense>
      );
    }

    // URL Shortener Sub-App
    if (hash === '#/app/shortener' || hash.startsWith('#/app/shortener') || hash === '#/app/urlshortener') {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <UrlShortenerApp onNavigate={navigate} />
        </Suspense>
      );
    }

    // LinkForge Bio & Portfolio SaaS Sub-App & Public Profiles
    if (
      hash === '#/app/linkforge' ||
      hash.startsWith('#/app/linkforge') ||
      hash === '#/linkforge' ||
      hash.startsWith('#/linkforge') ||
      hash.startsWith('#/bio/') ||
      hash.startsWith('#/@')
    ) {
      let initialBioUsername: string | undefined = undefined;
      if (hash.startsWith('#/bio/')) {
        initialBioUsername = hash.replace('#/bio/', '').split('?')[0];
      } else if (hash.startsWith('#/@')) {
        initialBioUsername = hash.replace('#/@', '').split('?')[0];
      }
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <LinkForgeApp onNavigate={navigate} initialBioUsername={initialBioUsername} />
        </Suspense>
      );
    }

    // Short URL Redirect Handler: #/r/:slug or #/s/:slug
    if (hash.startsWith('#/r/') || hash.startsWith('#/s/')) {
      const slug = hash.replace(/^#\/(r|s)\//, '').split('?')[0];
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <LinkRedirectHandler slug={slug} onNavigate={navigate} />
        </Suspense>
      );
    }

    // Direct clean domain slug hash handler (e.g. #/random-code)
    if (hash.startsWith('#/') && hash.length > 2 && !hash.startsWith('#/app') && !hash.startsWith('#/admin') && !hash.startsWith('#/profile') && !hash.startsWith('#/seller') && !hash.startsWith('#/creator') && !hash.startsWith('#/code/')) {
      const candidateSlug = hash.replace(/^#\//, '').split('?')[0].split('/')[0];
      const reserved = [
        'admin', 'app', 'profile', 'creator', 'events', 'explore', 'codes',
        'seller', 'login', 'register', 'code', 'view', 'api', 'bakikhata', 'shortener', 'linkforge', 'bio'
      ];
      if (candidateSlug && !reserved.includes(candidateSlug.toLowerCase())) {
        return (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LinkRedirectHandler slug={candidateSlug} onNavigate={navigate} />
          </Suspense>
        );
      }
    }

    // Code Details Route: #/code/:id
    if (hash.startsWith('#/code/')) {
      const codeId = hash.replace('#/code/', '').trim();
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <CodeDetails
            codeId={codeId}
            onBack={() => navigate('#/')}
            onNavigate={navigate}
          />
        </Suspense>
      );
    }

    // Admin Routes: #/admin/*
    if (hash.startsWith('#/admin')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <AdminRoutes
            currentRoute={currentRoute}
            navigate={navigate}
            currentUser={currentUser}
            isAdmin={isAdmin}
            authLoading={authLoading}
            onOpenGuide={() => setGuideModalOpen(true)}
          />
        </Suspense>
      );
    }

    // Seller Routes: #/seller/*
    if (hash.startsWith('#/seller')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <SellerRoutes
            currentRoute={currentRoute}
            navigate={navigate}
            currentUser={currentUser}
            isSeller={isSeller}
            isAdmin={isAdmin}
            authLoading={authLoading}
          />
        </Suspense>
      );
    }

    // Creator Routes: #/creator/* and #/creator-profile/*
    if (hash.startsWith('#/creator')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <CreatorRoutes
            currentRoute={currentRoute}
            navigate={navigate}
            currentUser={currentUser}
            userProfile={userProfile}
            isCreator={isCreator}
            isAdmin={isAdmin}
            authLoading={authLoading}
          />
        </Suspense>
      );
    }

    // Events Route
    if (hash === '#/events') {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <EventsPage onNavigate={navigate} />
        </Suspense>
      );
    }

    // Explicit Explore / Codes Route
    if (hash === '#/explore' || hash === '#/codes') {
      return <UserDashboard onOpenCode={(id) => navigate(`#/code/${id}`)} onNavigate={navigate} />;
    }

    // For Logged-in Seller Accounts on home route
    if (!authLoading && currentUser && isSeller && !isAdmin && (hash === '#/' || hash === '' || hash === '#')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <SellerRoutes
            currentRoute="#/seller"
            navigate={navigate}
            currentUser={currentUser}
            isSeller={isSeller}
            isAdmin={isAdmin}
            authLoading={authLoading}
          />
        </Suspense>
      );
    }

    // For Logged-in Creator Accounts on home route
    if (!authLoading && currentUser && (isCreator || userProfile?.role === 'creator') && !isAdmin && (hash === '#/' || hash === '' || hash === '#')) {
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <CreatorRoutes
            currentRoute="#/creator"
            navigate={navigate}
            currentUser={currentUser}
            userProfile={userProfile}
            isCreator={isCreator}
            isAdmin={isAdmin}
            authLoading={authLoading}
          />
        </Suspense>
      );
    }

    // Default Home Route: User Dashboard
    return <UserDashboard onOpenCode={(id) => navigate(`#/code/${id}`)} onNavigate={navigate} />;
  };

  const isSellerHome = !authLoading && currentUser && isSeller && !isAdmin && (currentRoute === '#/' || currentRoute === '' || currentRoute === '#');
  const isCreatorHome = !authLoading && currentUser && (isCreator || userProfile?.role === 'creator') && !isAdmin && (currentRoute === '#/' || currentRoute === '' || currentRoute === '#');
  const isAdminRoute = currentRoute.startsWith('#/admin');
  const isSellerRoute = currentRoute.startsWith('#/seller') || isSellerHome;
  const isCreatorRoute = currentRoute.startsWith('#/creator') || isCreatorHome;
  const isToolRunnerRoute = currentRoute.startsWith('#/code/');
  const isUserProfileRoute = currentRoute.startsWith('#/profile');
  const isBakirKhataRoute = currentRoute.startsWith('#/app/bakikhata');
  const isUrlShortenerRoute = currentRoute.startsWith('#/app/shortener') || currentRoute.startsWith('#/app/urlshortener');
  const isLinkRedirectRoute = currentRoute.startsWith('#/r/') || currentRoute.startsWith('#/s/');

  const isLinkForgeRoute =
    currentRoute.startsWith('#/app/linkforge') ||
    currentRoute.startsWith('#/linkforge') ||
    currentRoute.startsWith('#/bio/') ||
    currentRoute.startsWith('#/@');

  const hideGlobalLayout =
    isAdminRoute ||
    isSellerRoute ||
    isCreatorRoute ||
    isToolRunnerRoute ||
    isUserProfileRoute ||
    isBakirKhataRoute ||
    isUrlShortenerRoute ||
    isLinkRedirectRoute ||
    isLinkForgeRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {!hideGlobalLayout && <GlobalAnnouncementBar />}

      {!hideGlobalLayout && (
        <Header
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      )}

      <div className="flex-1">
        <RouteErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
            {renderContent()}
          </Suspense>
        </RouteErrorBoundary>
      </div>

      {!hideGlobalLayout && (
        <Footer
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      )}

      <ToastContainer />
      <OfflineIndicator />
      <SwUpdateNotification />
      {!isAdminRoute && <EventPopupManager onNavigate={navigate} />}

      <SetupGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};
