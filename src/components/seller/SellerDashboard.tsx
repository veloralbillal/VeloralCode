import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Coins, Key, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchKeysBySeller, getSellerPricingConfig } from '../../services/sellerService';
import { LicenseKey, SellerPricingConfig } from '../../types';
import { SellerStatCards } from './SellerStatCards';
import { SellerPricingNotice } from './SellerPricingNotice';
import { SellerRecentKeysTable } from './SellerRecentKeysTable';

interface SellerDashboardProps {
  onNavigate: (route: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [pricing, setPricing] = useState<SellerPricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userProfile?.userId]);

  const loadDashboardData = async () => {
    if (!userProfile?.userId) return;
    setLoading(true);
    try {
      const [keysData, pricingData] = await Promise.all([
        fetchKeysBySeller(userProfile.userId),
        getSellerPricingConfig(),
      ]);
      setKeys(keysData);
      setPricing(pricingData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentCoins = userProfile?.coinsBalance !== undefined ? userProfile.coinsBalance : 0;
  const activeKeys = keys.filter((k) => k.status === 'active').length;
  const usedKeys = keys.filter((k) => k.status === 'used').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-xl shadow-amber-600/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reseller Distributor Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Welcome, {userProfile?.name || 'Seller'}!
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 max-w-xl leading-relaxed">
              Manage your license inventory, generate customer activation keys, and track sales performance in real-time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('#/seller/generate')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 text-sm font-bold shadow-lg shadow-black/10 transition"
            >
              <Zap className="w-4 h-4 fill-amber-600 text-amber-600" />
              <span>Generate Keys</span>
            </button>
            <button
              onClick={() => onNavigate('#/seller/active-keys')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-800/60 hover:bg-amber-800/80 border border-amber-400/40 text-white text-sm font-bold transition"
            >
              <Key className="w-4 h-4" />
              <span>Active Keys ({activeKeys})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <SellerStatCards
        currentCoins={currentCoins}
        totalKeys={keys.length}
        activeKeys={activeKeys}
        usedKeys={usedKeys}
        onNavigate={onNavigate}
      />

      {/* Pricing Notice */}
      <SellerPricingNotice pricing={pricing} onNavigate={onNavigate} />

      {/* Recent Keys Activity */}
      <SellerRecentKeysTable keys={keys} onNavigate={onNavigate} />
    </div>
  );
};
