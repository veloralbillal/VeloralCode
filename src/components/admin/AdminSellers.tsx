import React, { useState, useEffect } from 'react';
import {
  Users,
  Coins,
  Key,
  UserPlus,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  MoreVertical,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, SellerCoinTransaction, LicenseKey } from '../../types';
import { fetchAllSellers, fetchSellerTransactions } from '../../services/sellerService';
import { fetchLicenseKeys } from '../../services/licenseService';
import { updateUserStatus } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { SellerPricingConfigCard } from './SellerPricingConfigCard';
import { AddSellerModal } from './AddSellerModal';
import { ManageSellerCoinsModal } from './ManageSellerCoinsModal';
import { formatDate } from '../../utils/helpers';

export const AdminSellers: React.FC = () => {
  const { showToast } = useToast();
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<SellerCoinTransaction[]>([]);
  const [sellerKeys, setSellerKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<UserProfile | null>(null);
  const [coinsModalOpen, setCoinsModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sellersData, txData, keysData] = await Promise.all([
        fetchAllSellers(),
        fetchSellerTransactions(),
        fetchLicenseKeys(),
      ]);
      setSellers(sellersData);
      setTransactions(txData);
      setSellerKeys(keysData.filter((k) => k.creatorRole === 'seller'));
    } catch (err: any) {
      showToast('Error loading seller data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (seller: UserProfile) => {
    const newStatus = seller.status === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatus(seller.userId, newStatus);
      showToast(`Seller ${seller.name} is now ${newStatus}`, 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Filter sellers
  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.numericUid && s.numericUid.includes(searchQuery))
  );

  // Aggregated Stats
  const totalCoinsInWallets = sellers.reduce((acc, s) => acc + (s.coinsBalance || 0), 0);
  const totalCoinsSpentBySellers = sellers.reduce((acc, s) => acc + (s.totalCoinsSpent || 0), 0);
  const totalKeysBySellers = sellerKeys.length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Seller & Reseller Point Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
              {sellers.length} Active Sellers
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create reseller accounts, allocate generator points, and monitor key sales & generation volume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Seller</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sellers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Sellers
            </span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{sellers.length}</p>
          <p className="text-[11px] text-slate-400">Registered reseller accounts</p>
        </div>

        {/* Coins In Circulation */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Points in Wallets
            </span>
            <Coins className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalCoinsInWallets} <span className="text-xs font-semibold">Coins</span>
          </p>
          <p className="text-[11px] text-slate-400">Available seller balance</p>
        </div>

        {/* Keys Generated by Sellers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Keys Generated
            </span>
            <Key className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalKeysBySellers}</p>
          <p className="text-[11px] text-slate-400">Created by reseller network</p>
        </div>

        {/* Points Spent */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-violet-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Points Burned
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">
            {totalCoinsSpentBySellers} <span className="text-xs font-semibold">Spent</span>
          </p>
          <p className="text-[11px] text-slate-400">Total coin redemption volume</p>
        </div>
      </div>

      {/* Point / Coin Rate Pricing Config */}
      <SellerPricingConfigCard />

      {/* Sellers List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorized Sellers Directory</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Seller Info</th>
                <th className="py-3.5 px-4">Points Wallet</th>
                <th className="py-3.5 px-4">Keys Generated</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No sellers found</p>
                    <p className="text-[11px]">Click "Add New Seller" to register your first reseller account.</p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => {
                  const generatedCount = sellerKeys.filter((k) => k.createdBy === seller.userId).length;
                  return (
                    <tr key={seller.userId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{seller.name}</span>
                            {seller.numericUid && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                #{seller.numericUid}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{seller.email}</p>
                          {seller.sellerNotes && (
                            <p className="text-[10px] text-indigo-500 italic mt-0.5">{seller.sellerNotes}</p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-bold text-amber-700 dark:text-amber-300 text-xs">
                            {seller.coinsBalance || 0} Pts
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{generatedCount}</span>
                          <span className="text-[10px] text-slate-400">keys</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            seller.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${seller.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {seller.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {formatDate(seller.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedSeller(seller);
                              setCoinsModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px] transition"
                            title="Add / Deduct Points"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span>Add / Deduct Pts</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(seller)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition ${
                              seller.status === 'active'
                                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {seller.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Point Transactions History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Points Audit Log</h3>
          </div>
          <span className="text-[11px] text-slate-400">{transactions.length} Total Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Seller</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Balance After</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{formatDate(tx.createdAt)}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {tx.sellerEmail}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'credit'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'credit' ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {tx.type === 'credit' ? 'Credited' : 'Spent (Key Gen)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {tx.type === 'credit' ? '+' : '-'}
                    {tx.amount} Pts
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{tx.balanceAfter} Pts</td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddSellerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadAllData}
      />

      <ManageSellerCoinsModal
        seller={selectedSeller}
        isOpen={coinsModalOpen}
        onClose={() => {
          setCoinsModalOpen(false);
          setSelectedSeller(null);
        }}
        onSuccess={loadAllData}
      />
    </div>
  );
};
