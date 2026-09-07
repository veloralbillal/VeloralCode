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

// Lazy-load sub-routes to avoid downloading hundreds of files on initial home page load
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const SellerRoutes = lazy(() => import('./SellerRoutes'));
const CreatorRoutes = lazy(() => import('./CreatorRoutes'));
const AuthPage = lazy(() => import('../components/auth/AuthPage').then((m) => ({ default: m.AuthPage })));
const CodeDetails = lazy(() => import('../components/user/CodeDetails').then((m) => ({ default: m.CodeDetails })));
const UserProfileView = lazy(() => import('../components/user/UserProfile').then((m) => ({ default: m.UserProfileView })));
const BakirKhataApp = lazy(() => import('../apps/bakikhata').then((m) => ({ default: m.BakirKhataApp })));
const UrlShortenerApp = lazy(() => import('../apps/urlshortener').then((m) => ({ default: m.UrlShortenerApp })));
const LinkRedirectHandler = lazy(() => import('../apps/urlshortener').then((m) => ({ default: m.LinkRedirectHandler })));
const EventsPage = lazy(() => import('../components/events/EventsPage').then((m) => ({ default: m.EventsPage })));

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

      // 2c. Direct Short URL redirect paths: /r/:slug or /s/:slug
      if (path.startsWith('/r/') || path.startsWith('/s/')) {
        const slug = path.replace(/^\/(r|s)\//, '').split('?')[0];
        if (slug) return `#/r/${slug}`;
      }

      // 2d. Clean direct domain slug (e.g. domain/random-code)
      if (path && path.length > 1 && path.startsWith('/') && !path.includes('.')) {
        const potentialSlug = path.substring(1).split('/')[0].split('?')[0];
        const reserved = [
          'admin', 'app', 'profile', 'creator', 'events', 'explore', 'codes',
          'seller', 'login', 'register', 'r', 's', 'api', 'bakikhata', 'shortener'
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
        'seller', 'login', 'register', 'code', 'view', 'api', 'bakikhata', 'shortener'
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

  const hideGlobalLayout = isAdminRoute || isSellerRoute || isCreatorRoute || isToolRunnerRoute || isUserProfileRoute || isBakirKhataRoute || isUrlShortenerRoute || isLinkRedirectRoute;

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

      <div className="flex-1">{renderContent()}</div>

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
