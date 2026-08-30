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
import { UserProfileView } from '../components/user/UserProfile';
import { ShieldAlert, LogIn, BookOpen } from 'lucide-react';

export const AppRouter: React.FC = () => {
  const { currentUser, isAdmin, loading: authLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.hash || '#/');
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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

    // User Profile Route: #/profile
    if (hash === '#/profile') {
      return <UserProfileView onNavigate={navigate} />;
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
      // Permission check
      if (!authLoading && (!currentUser || !isAdmin)) {
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

    // Default User Dashboard: #/ or ""
    return <UserDashboard onOpenCode={(id) => navigate(`#/code/${id}`)} onNavigate={navigate} />;
  };

  const isAdminRoute = currentRoute.startsWith('#/admin');
  const isToolRunnerRoute = currentRoute.startsWith('#/code/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header (displayed on public views, omitted on full-screen tool runner) */}
      {!isAdminRoute && !isToolRunnerRoute && (
        <Header
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenGuide={() => setGuideModalOpen(true)}
        />
      )}

      {/* Dynamic Route Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Footer (displayed on public views, omitted on full-screen tool runner) */}
      {!isAdminRoute && !isToolRunnerRoute && (
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
