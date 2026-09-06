import React from 'react';
import { SellerLayout } from '../components/seller/SellerLayout';
import { SellerDashboard } from '../components/seller/SellerDashboard';
import { SellerGenerateKey } from '../components/seller/SellerGenerateKey';
import { SellerActiveKeys } from '../components/seller/SellerActiveKeys';
import { SellerKeysList } from '../components/seller/SellerKeysList';
import { SellerReports } from '../components/seller/SellerReports';
import { SellerWallet } from '../components/seller/SellerWallet';
import { Coins, LogIn } from 'lucide-react';

interface SellerRoutesProps {
  currentRoute: string;
  navigate: (route: string) => void;
  currentUser: any;
  isSeller: boolean;
  isAdmin: boolean;
  authLoading: boolean;
}

export const SellerRoutes: React.FC<SellerRoutesProps> = ({
  currentRoute,
  navigate,
  currentUser,
  isSeller,
  isAdmin,
  authLoading,
}) => {
  const hash = currentRoute.split('?')[0];

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-10 h-10 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying seller distributor credentials...</p>
      </div>
    );
  }

  if (!currentUser || (!isSeller && !isAdmin)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Coins className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Seller Portal Access Required</h2>
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
      <SellerLayout currentRoute={hash} onNavigate={navigate} title="Generate License Keys" subtitle="Burn point coins from your reseller wallet to generate premium client activation keys">
        <SellerGenerateKey onNavigate={navigate} />
      </SellerLayout>
    );
  }

  if (hash === '#/seller/active-keys') {
    return (
      <SellerLayout currentRoute={hash} onNavigate={navigate} title="Active & Ready License Keys" subtitle="Unused license keys ready for customer dispatch, copy client instructions, and export">
        <SellerActiveKeys onNavigate={navigate} />
      </SellerLayout>
    );
  }

  if (hash === '#/seller/keys') {
    return (
      <SellerLayout currentRoute={hash} onNavigate={navigate} title="My Generated License Keys" subtitle="View, copy, export, and check client redemption status for your generated keys">
        <SellerKeysList onNavigate={navigate} />
      </SellerLayout>
    );
  }

  if (hash === '#/seller/reports') {
    return (
      <SellerLayout currentRoute={hash} onNavigate={navigate} title="Sales, Income & Performance Reports" subtitle="Detailed analysis of your generated license keys, user activations, and revenue breakdown">
        <SellerReports />
      </SellerLayout>
    );
  }

  if (hash === '#/seller/wallet') {
    return (
      <SellerLayout currentRoute={hash} onNavigate={navigate} title="Seller Points Wallet" subtitle="View point balance, recharge history, and key generation debit logs">
        <SellerWallet />
      </SellerLayout>
    );
  }

  return (
    <SellerLayout currentRoute="#/seller" onNavigate={navigate} title="Seller Distributor Dashboard" subtitle="Real-time key statistics, point wallet overview, and quick activation tools">
      <SellerDashboard onNavigate={navigate} />
    </SellerLayout>
  );
};

export default SellerRoutes;
