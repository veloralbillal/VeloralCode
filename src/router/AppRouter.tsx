import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { SetupGuideModal } from '../components/docs/SetupGuideModal';
import { UserDashboard } from '../components/user/UserDashboard';
import { CodeDetails } from '../components/user/CodeDetails';
import { AuthPage } from '../components/auth/AuthPage';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminAddCode } from '../components/admin/AdminAddCode';
import { AdminEditCode } from '../components/admin/AdminEditCode';
import { AdminManageCodes } from '../components/admin/AdminManageCodes';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminLicenses } from '../components/admin/AdminLicenses';
import { AdminSellers } from '../components/admin/AdminSellers';
import { AdminCreators } from '../components/admin/AdminCreators';
import { AdminCreatorTools } from '../components/admin/AdminCreatorTools';
import { AdminWithdrawals } from '../components/admin/AdminWithdrawals';
import { SellerLayout } from '../components/seller/SellerLayout';
import { SellerDashboard } from '../components/seller/SellerDashboard';
import { SellerGenerateKey } from '../components/seller/SellerGenerateKey';
import { SellerActiveKeys } from '../components/seller/SellerActiveKeys';
import { SellerKeysList } from '../components/seller/SellerKeysList';
import { SellerReports } from '../components/seller/SellerReports';
import { SellerWallet } from '../components/seller/SellerWallet';
import { CreatorLayout } from '../components/creator/CreatorLayout';
import { CreatorDashboard } from '../components/creator/CreatorDashboard';
import { CreatorUploadTool } from '../components/creator/CreatorUploadTool';
import { CreatorToolsList } from '../components/creator/CreatorToolsList';
import { CreatorWallet } from '../components/creator/CreatorWallet';
import { CreatorPayPerClickReport } from '../components/creator/CreatorPayPerClickReport';
import { CreatorPublicProfile } from '../components/creator/CreatorPublicProfile';
import { CreatorProfileSettings } from '../components/creator/CreatorProfileSettings';
import { CreatorAccessDenied } from '../components/creator/CreatorAccessDenied';
import { AdminAnnouncements } from '../components/admin/AdminAnnouncements';
import { AdminCreatorVerifications } from '../components/admin/AdminCreatorVerifications';
import { AdminBanners } from '../components/admin/AdminBanners';
import { AdminEvents } from '../components/admin/AdminEvents';
import { AdminSeoSettings } from '../components/admin/AdminSeoSettings';
import { EventsPage } from '../components/events/EventsPage';
import { GlobalAnnouncementBar } from '../components/common/GlobalAnnouncementBar';
import { UserProfileView } from '../components/user/UserProfile';
import { ShieldAlert, LogIn, BookOpen, Coins, Sparkles } from 'lucide-react';

export const AppRouter: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isSeller, isCreator, loading: authLoading } = useAuth();
  
  // Resolve initial route from hash or pathname (e.g. /creator/veloralbillal)
  const getInitialRoute = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path && path !== '/' && !window.location.hash) {
        return '#' + path;
      }
    }
    return window.location.hash || '#/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname;
      if (path && path !== '/' && !window.location.hash) {
        setCurrentRoute('#' + path);
      } else {
        setCurrentRoute(window.location.hash || '#/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // If initial URL has clean pathname like /creator/... without hash, sync hash for SPA stability
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/' && !window.location.hash) {
      window.location.hash = '#' + window.location.pathname;
    }

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const navigate = (newRoute: string) => {
    window.location.hash = newRoute;
    setCurrentRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route parser
  const renderContent = () => {
    const hash = currentRoute.split('?')[0];

    // Auth Routes
    if (hash === '#/login') {
      const isRegister = currentRoute.includes('mode=register');
      const isForgot = currentRoute.includes('mode=forgot');
      const initialMode = isRegister ? 'register' : isForgot ? 'forgot' : 'login';
      return (
        <AuthPage
          initialMode={initialMode}
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      );
    }

    // User Profile Route: #/profile and subroutes
    if (hash.startsWith('#/profile')) {
      return (
        <UserProfileView 
          currentRoute={hash} 
          onNavigate={navigate} 
          onNavigateToCode={(id) => navigate(`#/code/${id}`)}
        />
      );
    }

    // Creator Public Profile Route: #/creator-profile/:uid
    if (hash.startsWith('#/creator-profile/')) {
      const creatorUid = hash.replace('#/creator-profile/', '').trim();
      return (
        <CreatorPublicProfile
          creatorUid={creatorUid}
          onNavigate={navigate}
          onOpenCode={(id) => navigate(`#/code/${id}`)}
        />
      );
    }

    // Code Details Route: #/code/:id
    if (hash.startsWith('#/code/')) {
      const codeId = hash.replace('#/code/', '').trim();
      return (
        <CodeDetails
          codeId={codeId}
          onBack={() => navigate('#/')}
          onNavigate={navigate}
        />
      );
    }

    // Admin Routes
    if (hash.startsWith('#/admin')) {
      if (authLoading) {
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying administrative credentials...</p>
          </div>
        );
      }

      // Permission check
      if (!currentUser || !isAdmin) {
        return (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Admin Privileges Required
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                You must be authenticated with an authorized Admin account in Firebase Authentication and registered in Realtime Database under <code className="text-indigo-500 font-mono">admins/&#123;uid&#125;</code> to access the administrative dashboard.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('#/login')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
              <button
                onClick={() => setGuideModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>View Admin Setup Guide</span>
              </button>
            </div>
          </div>
        );
      }

      // Render Admin sub-routes
      if (hash === '#/admin/add') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Create Code Entry"
            subtitle="Add and publish new source code snippets to Firebase Realtime Database"
          >
            <AdminAddCode onNavigate={navigate} />
          </AdminLayout>
        );
      }

      if (hash.startsWith('#/admin/edit/')) {
        const codeId = hash.replace('#/admin/edit/', '').trim();
        return (
          <AdminLayout
            currentRoute="#/admin/manage"
            onNavigate={navigate}
            title="Edit Code Entry"
            subtitle="Update existing snippet and synchronize changes live"
          >
            <AdminEditCode codeId={codeId} onNavigate={navigate} />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/manage') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Manage Code Library"
            subtitle="Search, filter, update status, and manage all database entries"
          >
            <AdminManageCodes onNavigate={navigate} />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/creator-tools') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Tool Submissions"
            subtitle="Review, test, inspect code, approve with reward bonuses, or reject creator tools"
          >
            <AdminCreatorTools onNavigate={navigate} />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/withdrawals') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Withdrawal Requests"
            subtitle="Review, approve, and process creator payout balance requests"
          >
            <AdminWithdrawals />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/licenses') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="License Key Management"
            subtitle="Generate, monitor, and revoke Premium activation license keys"
          >
            <AdminLicenses />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/sellers') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Sellers & Points Management"
            subtitle="Create seller accounts, allocate generator points, and set key point costs"
          >
            <AdminSellers />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/creator-tools') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Tools & Review Submissions"
            subtitle="Moderate, preview, approve, and reward custom tools submitted by creators"
          >
            <AdminCreatorTools onNavigate={navigate} />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/verifications') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Identity & KYC Verifications"
            subtitle="Inspect national ID cards, passports, student IDs, and grant Verified Creator badges"
          >
            <AdminCreatorVerifications />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/withdrawals') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Money Withdrawal Requests"
            subtitle="Review pending payout requests, record transaction references, and process payments"
          >
            <AdminWithdrawals />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/creators') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creators & Tool Contributors"
            subtitle="Create and manage verified creator accounts, reward balances, and specialty tags"
          >
            <AdminCreators />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/banners') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Slider Banners Management"
            subtitle="Upload hero banners, set display order, and configure redirection links"
          >
            <AdminBanners />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/events') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Events & Down Pricing"
            subtitle="Manage developer workshops, masterclasses, regular prices, and special down prices"
          >
            <AdminEvents />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/announcements') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Global Site Announcements"
            subtitle="Broadcast real-time alerts, updates, and promotions to all visitors"
          >
            <AdminAnnouncements />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/users') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="User Management"
            subtitle="View registered developer accounts and security status"
          >
            <AdminUsers />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/seo') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="SEO & Robots.txt Manager"
            subtitle="Search engine indexing rules, robots.txt, and meta tags"
          >
            <AdminSeoSettings />
          </AdminLayout>
        );
      }

      if (hash === '#/admin/settings') {
        return (
          <AdminLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Database & Environment Settings"
            subtitle="Firebase RTDB parameters, starter seeders, and configuration"
          >
            <AdminSettings />
          </AdminLayout>
        );
      }

      // Default Admin Route: #/admin
      return (
        <AdminLayout
          currentRoute="#/admin"
          onNavigate={navigate}
          title="Admin Dashboard"
          subtitle="Real-time metrics, quick publishing tools, and library overview"
        >
          <AdminDashboard onNavigate={navigate} />
        </AdminLayout>
      );
    }

    // Seller Routes: #/seller, #/seller/generate, #/seller/keys, #/seller/reports, #/seller/wallet
    if (hash.startsWith('#/seller')) {
      if (authLoading) {
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying seller distributor credentials...</p>
          </div>
        );
      }

      // Permission check: Must be authenticated and either seller or admin
      if (!currentUser || (!isSeller && !isAdmin)) {
        return (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Coins className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Seller Portal Access Required
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                You must be logged in with an authorized Seller account to access the license key generation suite and reseller reports.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('#/login')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Seller Login</span>
              </button>
              <button
                onClick={() => navigate('#/')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        );
      }

      if (hash === '#/seller/generate') {
        return (
          <SellerLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Generate License Keys"
            subtitle="Burn point coins from your reseller wallet to generate premium client activation keys"
          >
            <SellerGenerateKey onNavigate={navigate} />
          </SellerLayout>
        );
      }

      if (hash === '#/seller/active-keys') {
        return (
          <SellerLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Active & Ready License Keys"
            subtitle="Unused license keys ready for customer dispatch, copy client instructions, and export"
          >
            <SellerActiveKeys onNavigate={navigate} />
          </SellerLayout>
        );
      }

      if (hash === '#/seller/keys') {
        return (
          <SellerLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="My Generated License Keys"
            subtitle="View, copy, export, and check client redemption status for your generated keys"
          >
            <SellerKeysList onNavigate={navigate} />
          </SellerLayout>
        );
      }

      if (hash === '#/seller/reports') {
        return (
          <SellerLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Sales, Income & Performance Reports"
            subtitle="Detailed analysis of your generated license keys, user activations, and revenue breakdown"
          >
            <SellerReports />
          </SellerLayout>
        );
      }

      if (hash === '#/seller/wallet') {
        return (
          <SellerLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Seller Points Wallet"
            subtitle="View point balance, recharge history, and key generation debit logs"
          >
            <SellerWallet />
          </SellerLayout>
        );
      }

      // Default Seller Route: #/seller
      return (
        <SellerLayout
          currentRoute="#/seller"
          onNavigate={navigate}
          title="Seller Distributor Dashboard"
          subtitle="Real-time key statistics, point wallet overview, and quick activation tools"
        >
          <SellerDashboard onNavigate={navigate} />
        </SellerLayout>
      );
    }

    // Creator Routes:
    // 1. Specific creator public page: #/creator/:username (e.g. veloralbillal.top/creator/veloralbillal) -> Separate Public Page
    // 2. Generic directory: #/creator or #/creator/ -> Blocked with Access Denied for unauthorized visitors
    // 3. Creator Studio: #/creator/upload, #/creator/tools, #/creator/wallet, #/creator/reports, #/creator/profile
    if (hash.startsWith('#/creator')) {
      const creatorSubpath = hash.replace(/^#\/creator\/?/, '').trim();
      const isStudioAction = [
        'upload',
        'tools',
        'wallet',
        'reports',
        'profile',
      ].includes(creatorSubpath) || creatorSubpath.startsWith('edit/');

      // If this is a personalized creator handle/slug (e.g. #/creator/veloralbillal)
      if (creatorSubpath && !isStudioAction) {
        return (
          <CreatorPublicProfile
            creatorIdentifier={creatorSubpath}
            onNavigate={navigate}
            onOpenCode={(id) => navigate(`#/code/${id}`)}
          />
        );
      }

      // If checking auth state for studio or generic /creator access
      if (authLoading) {
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying creator studio credentials...</p>
          </div>
        );
      }

      // Restrict Generic /creator route or Studio actions for unauthorized visitors
      const isAuthorizedCreator = Boolean(
        currentUser && (isCreator || isAdmin || userProfile?.role === 'creator')
      );

      if (!isAuthorizedCreator) {
        // Direct access to generic /creator or protected studio routes is blocked
        return <CreatorAccessDenied onNavigate={navigate} />;
      }

      if (creatorSubpath === 'profile') {
        return (
          <CreatorLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Profile & KYC Verification"
            subtitle="Configure your public creator name, bio, social links, and submit verification documents"
          >
            <CreatorProfileSettings onNavigate={navigate} />
          </CreatorLayout>
        );
      }

      if (creatorSubpath === 'upload') {
        return (
          <CreatorLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Upload New Tool"
            subtitle="Submit source code or web components for admin review & public distribution"
          >
            <CreatorUploadTool onNavigate={navigate} />
          </CreatorLayout>
        );
      }

      if (creatorSubpath.startsWith('edit/')) {
        const editId = creatorSubpath.replace('edit/', '').trim();
        return (
          <CreatorLayout
            currentRoute="#/creator/tools"
            onNavigate={navigate}
            title="Edit Tool & Source Code"
            subtitle="Update code markup, categories, or fix review feedback"
          >
            <CreatorUploadTool editCodeId={editId} onNavigate={navigate} />
          </CreatorLayout>
        );
      }

      if (creatorSubpath === 'tools') {
        return (
          <CreatorLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="My Uploaded Tools"
            subtitle="Review moderation statuses, view counts, and manage live tools"
          >
            <CreatorToolsList onNavigate={navigate} />
          </CreatorLayout>
        );
      }

      if (creatorSubpath === 'wallet') {
        return (
          <CreatorLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Creator Earnings & Wallet"
            subtitle="Monitor tool milestone rewards, balance ledger, and request cashouts"
          >
            <CreatorWallet />
          </CreatorLayout>
        );
      }

      if (creatorSubpath === 'reports') {
        return (
          <CreatorLayout
            currentRoute={hash}
            onNavigate={navigate}
            title="Clicks, Copies & Downloads Report"
            subtitle="Monitor pay-per-click royalties, verified unique actions, and tool performance analytics"
          >
            <div className="space-y-6">
              <CreatorPayPerClickReport
                userProfile={userProfile}
                creatorUid={currentUser?.uid || userProfile?.userId || ''}
                creatorEmail={currentUser?.email || userProfile?.email || ''}
              />
            </div>
          </CreatorLayout>
        );
      }

      // Default Creator Route: #/creator (only accessible by authorized creators)
      return (
        <CreatorLayout
          currentRoute="#/creator"
          onNavigate={navigate}
          title="Creator Studio Dashboard"
          subtitle="Real-time tool performance metrics, total views, top tools, and earnings summary"
        >
          <CreatorDashboard onNavigate={navigate} />
        </CreatorLayout>
      );
    }

    // Events route (Community bootcamps, workshops, down pricing)
    if (hash === '#/events') {
      return <EventsPage onNavigate={navigate} />;
    }

    // Explicit Explore / Codes Route (e.g. when seller or user browses code snippets)
    if (hash === '#/explore' || hash === '#/codes') {
      return <UserDashboard onOpenCode={(id) => navigate(`#/code/${id}`)} onNavigate={navigate} />;
    }

    // For Logged-in Seller Accounts, default home route (#/ or "") renders Seller Portal
    if (!authLoading && currentUser && isSeller && !isAdmin && (hash === '#/' || hash === '' || hash === '#')) {
      return (
        <SellerLayout
          currentRoute="#/seller"
          onNavigate={navigate}
          title="Seller Distributor Dashboard"
          subtitle="Real-time key statistics, point wallet overview, and quick activation tools"
        >
          <SellerDashboard onNavigate={navigate} />
        </SellerLayout>
      );
    }

    // For Logged-in Creator Accounts, default home route (#/ or "") renders Creator Studio
    if (!authLoading && currentUser && (isCreator || userProfile?.role === 'creator') && !isAdmin && (hash === '#/' || hash === '' || hash === '#')) {
      return (
        <CreatorLayout
          currentRoute="#/creator"
          onNavigate={navigate}
          title="Creator Studio Dashboard"
          subtitle="Real-time tool performance metrics, total views, top tools, and earnings summary"
        >
          <CreatorDashboard onNavigate={navigate} />
        </CreatorLayout>
      );
    }

    // Default User Dashboard: #/ or ""
    return <UserDashboard onOpenCode={(id) => navigate(`#/code/${id}`)} onNavigate={navigate} />;
  };

  const isSellerHome = !authLoading && currentUser && isSeller && !isAdmin && (currentRoute === '#/' || currentRoute === '' || currentRoute === '#');
  const isCreatorHome = !authLoading && currentUser && (isCreator || userProfile?.role === 'creator') && !isAdmin && (currentRoute === '#/' || currentRoute === '' || currentRoute === '#');
  const isAdminRoute = currentRoute.startsWith('#/admin');
  const isSellerRoute = currentRoute.startsWith('#/seller') || isSellerHome;
  const isCreatorRoute = currentRoute.startsWith('#/creator') || isCreatorHome;
  const isToolRunnerRoute = currentRoute.startsWith('#/code/');
  const isUserProfileRoute = currentRoute.startsWith('#/profile');

  const hideGlobalLayout = isAdminRoute || isSellerRoute || isCreatorRoute || isToolRunnerRoute || isUserProfileRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Global Announcement Banner */}
      {!hideGlobalLayout && <GlobalAnnouncementBar />}

      {/* Header (displayed on public views, omitted on full-screen tool runner and dashboard layouts) */}
      {!hideGlobalLayout && (
        <Header
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      )}

      {/* Dynamic Route Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Footer (displayed on public views, omitted on full-screen tool runner and dashboard layouts) */}
      {!hideGlobalLayout && (
        <Footer
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      )}

      {/* Global Toast Notification Container */}
      <ToastContainer />

      {/* Documentation & Demo Admin Setup Modal */}
      <SetupGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};
