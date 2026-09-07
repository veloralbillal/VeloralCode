import React from 'react';
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
import { AdminAnnouncements } from '../components/admin/AdminAnnouncements';
import { AdminCreatorVerifications } from '../components/admin/AdminCreatorVerifications';
import { AdminBanners } from '../components/admin/AdminBanners';
import { AdminEvents } from '../components/admin/AdminEvents';
import { AdminSeoSettings } from '../components/admin/AdminSeoSettings';
import { AdminConnectionPoolManager } from '../components/admin/AdminConnectionPoolManager';
import { AdminPwaManager } from '../components/admin/pwa/AdminPwaManager';
import { AdminShortenerManager } from '../components/admin/AdminShortenerManager';
import { ShieldAlert, LogIn, BookOpen } from 'lucide-react';

interface AdminRoutesProps {
  currentRoute: string;
  navigate: (route: string) => void;
  currentUser: any;
  isAdmin: boolean;
  authLoading: boolean;
  onOpenGuide: () => void;
}

export const AdminRoutes: React.FC<AdminRoutesProps> = ({
  currentRoute,
  navigate,
  currentUser,
  isAdmin,
  authLoading,
  onOpenGuide,
}) => {
  const hash = currentRoute.split('?')[0];

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-10 h-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Privileges Required</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You must be authenticated with an authorized Admin account in Firebase Authentication to access this panel.
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
            onClick={onOpenGuide}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>View Admin Setup Guide</span>
          </button>
        </div>
      </div>
    );
  }

  if (hash === '#/admin/add') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Create Code Entry" subtitle="Add and publish new source code snippets to Firebase Realtime Database">
        <AdminAddCode onNavigate={navigate} />
      </AdminLayout>
    );
  }

  if (hash.startsWith('#/admin/edit/')) {
    const codeId = hash.replace('#/admin/edit/', '').trim();
    return (
      <AdminLayout currentRoute="#/admin/manage" onNavigate={navigate} title="Edit Code Entry" subtitle="Update existing snippet and synchronize changes live">
        <AdminEditCode codeId={codeId} onNavigate={navigate} />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/manage') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Manage Code Library" subtitle="Search, filter, update status, and manage all database entries">
        <AdminManageCodes onNavigate={navigate} />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/creator-tools') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Creator Tools & Review Submissions" subtitle="Moderate, preview, approve, and reward custom tools submitted by creators">
        <AdminCreatorTools onNavigate={navigate} />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/verifications') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Creator Identity & KYC Verifications" subtitle="Inspect national ID cards, passports, student IDs, and grant Verified Creator badges">
        <AdminCreatorVerifications />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/withdrawals') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Creator Money Withdrawal Requests" subtitle="Review pending payout requests, record transaction references, and process payments">
        <AdminWithdrawals />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/licenses') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="License Key Management" subtitle="Generate, monitor, and revoke Premium activation license keys">
        <AdminLicenses />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/sellers') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Sellers & Points Management" subtitle="Create seller accounts, allocate generator points, and set key point costs">
        <AdminSellers />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/creators') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Creators & Tool Contributors" subtitle="Create and manage verified creator accounts, reward balances, and specialty tags">
        <AdminCreators />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/banners') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Slider Banners Management" subtitle="Upload hero banners, set display order, and configure redirection links">
        <AdminBanners />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/shortener') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="URL Shortener & Ads Control Zone" subtitle="Manage short links, monitor real-time visitor clicks, and configure ad monetization zones">
        <AdminShortenerManager onNavigate={navigate} />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/events') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Events & Down Pricing" subtitle="Manage developer workshops, masterclasses, regular prices, and special down prices">
        <AdminEvents />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/announcements') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Global Site Announcements" subtitle="Broadcast real-time alerts, updates, and promotions to all visitors">
        <AdminAnnouncements />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/users') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="User Management" subtitle="View registered developer accounts and security status">
        <AdminUsers />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/seo') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="SEO & Robots.txt Manager" subtitle="Search engine indexing rules, robots.txt, and meta tags">
        <AdminSeoSettings />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/pool') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Connection Pooling & Database Indexes" subtitle="High-concurrency cluster management, wire socket multiplexing, and query indexing">
        <AdminConnectionPoolManager />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/pwa') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="PWA & Service Worker Controls" subtitle="Manage caching policies, client cache busting, and progressive web app settings">
        <AdminPwaManager />
      </AdminLayout>
    );
  }

  if (hash === '#/admin/settings') {
    return (
      <AdminLayout currentRoute={hash} onNavigate={navigate} title="Database & Environment Settings" subtitle="Firebase RTDB parameters, starter seeders, and configuration">
        <AdminSettings />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="#/admin" onNavigate={navigate} title="Admin Dashboard" subtitle="Real-time metrics, quick publishing tools, and library overview">
      <AdminDashboard onNavigate={navigate} />
    </AdminLayout>
  );
};

export default AdminRoutes;
