import React from 'react';
import { CreatorLayout } from '../components/creator/CreatorLayout';
import { CreatorDashboard } from '../components/creator/CreatorDashboard';
import { CreatorUploadTool } from '../components/creator/CreatorUploadTool';
import { CreatorToolsList } from '../components/creator/CreatorToolsList';
import { CreatorWallet } from '../components/creator/CreatorWallet';
import { CreatorPayPerClickReport } from '../components/creator/CreatorPayPerClickReport';
import { CreatorPublicProfile } from '../components/creator/CreatorPublicProfile';
import { CreatorProfileSettings } from '../components/creator/CreatorProfileSettings';
import { CreatorAccessDenied } from '../components/creator/CreatorAccessDenied';

interface CreatorRoutesProps {
  currentRoute: string;
  navigate: (route: string) => void;
  currentUser: any;
  userProfile: any;
  isCreator: boolean;
  isAdmin: boolean;
  authLoading: boolean;
}

export const CreatorRoutes: React.FC<CreatorRoutesProps> = ({
  currentRoute,
  navigate,
  currentUser,
  userProfile,
  isCreator,
  isAdmin,
  authLoading,
}) => {
  const hash = currentRoute.split('?')[0];
  const creatorSubpath = hash.replace(/^#\/creator\/?/, '').trim();
  const isStudioAction = [
    'upload',
    'tools',
    'wallet',
    'reports',
    'profile',
  ].includes(creatorSubpath) || creatorSubpath.startsWith('edit/');

  if (creatorSubpath && !isStudioAction) {
    return (
      <CreatorPublicProfile
        creatorIdentifier={creatorSubpath}
        onNavigate={navigate}
        onOpenCode={(id) => navigate(`#/code/${id}`)}
      />
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying creator studio credentials...</p>
      </div>
    );
  }

  const isAuthorizedCreator = Boolean(
    currentUser && (isCreator || isAdmin || userProfile?.role === 'creator')
  );

  if (!isAuthorizedCreator) {
    return <CreatorAccessDenied onNavigate={navigate} />;
  }

  if (creatorSubpath === 'profile') {
    return (
      <CreatorLayout currentRoute={hash} onNavigate={navigate} title="Creator Profile & KYC Verification" subtitle="Configure your public creator name, bio, social links, and submit verification documents">
        <CreatorProfileSettings onNavigate={navigate} />
      </CreatorLayout>
    );
  }

  if (creatorSubpath === 'upload') {
    return (
      <CreatorLayout currentRoute={hash} onNavigate={navigate} title="Upload New Tool" subtitle="Submit source code or web components for admin review & public distribution">
        <CreatorUploadTool onNavigate={navigate} />
      </CreatorLayout>
    );
  }

  if (creatorSubpath.startsWith('edit/')) {
    const editId = creatorSubpath.replace('edit/', '').trim();
    return (
      <CreatorLayout currentRoute="#/creator/tools" onNavigate={navigate} title="Edit Tool & Source Code" subtitle="Update code markup, categories, or fix review feedback">
        <CreatorUploadTool editCodeId={editId} onNavigate={navigate} />
      </CreatorLayout>
    );
  }

  if (creatorSubpath === 'tools') {
    return (
      <CreatorLayout currentRoute={hash} onNavigate={navigate} title="My Uploaded Tools" subtitle="Review moderation statuses, view counts, and manage live tools">
        <CreatorToolsList onNavigate={navigate} />
      </CreatorLayout>
    );
  }

  if (creatorSubpath === 'wallet') {
    return (
      <CreatorLayout currentRoute={hash} onNavigate={navigate} title="Creator Earnings & Wallet" subtitle="Monitor tool milestone rewards, balance ledger, and request cashouts">
        <CreatorWallet />
      </CreatorLayout>
    );
  }

  if (creatorSubpath === 'reports') {
    return (
      <CreatorLayout currentRoute={hash} onNavigate={navigate} title="Clicks, Copies & Downloads Report" subtitle="Monitor pay-per-click royalties, verified unique actions, and tool performance analytics">
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

  return (
    <CreatorLayout currentRoute="#/creator" onNavigate={navigate} title="Creator Studio Dashboard" subtitle="Real-time tool performance metrics, total views, top tools, and earnings summary">
      <CreatorDashboard onNavigate={navigate} />
    </CreatorLayout>
  );
};

export default CreatorRoutes;
