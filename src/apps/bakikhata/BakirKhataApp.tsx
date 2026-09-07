import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Customer,
  BakiTransaction,
  BakiStats,
  BakiCategory,
  BkashType,
  BkashFund,
  BkashTransactionRecord,
  BkashOpType,
  RechargeTransaction,
} from './types';
import {
  subscribeBakirKhata,
  addCustomerToDb,
  addTransactionToDb,
} from './services/bakiStorageService';
import {
  subscribeBkashData,
  executeBkashOperation,
  updateBkashFundBalance,
} from './services/bkashStorageService';
import {
  subscribeRechargeData,
  addRechargeTransactionToDb,
} from './services/rechargeStorageService';
import { BakiHeader } from './components/BakiHeader';
import { BakiSidebarDrawer } from './components/BakiSidebarDrawer';
import { BakiNavTabs } from './components/BakiNavTabs';
import { BkashSectionView, BkashActionModal, BkashFundRefillModal } from './components/bkash';
import { RechargeSectionView } from './components/recharge/RechargeSectionView';
import { DailyReportModal } from './components/DailyReportModal';
import { exportCustomersToCsv } from './utils/bakiExportUtils';
import { BakiStatsCards } from './components/BakiStatsCards';
import { TuesdaySettlementBanner } from './components/TuesdaySettlementBanner';
import { QuickAddBar } from './components/QuickAddBar';
import { CustomerListView } from './components/CustomerListView';
import { AddCustomerModal } from './components/AddCustomerModal';
import { AddDueModal } from './components/AddDueModal';
import { CollectPaymentModal } from './components/CollectPaymentModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { usePWAInstall } from '../../utils/pwa/usePWAInstall';
import { PwaInstallModal } from './components/PwaInstallModal';

interface BakirKhataAppProps {
  onBackToApp?: () => void;
}

export const BakirKhataApp: React.FC<BakirKhataAppProps> = ({ onBackToApp }) => {
  const { currentUser, userProfile, isAdmin, isSeller, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    showInstallGuide,
    setShowInstallGuide,
    install: triggerPwaInstall,
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'khata' | 'bkash' | 'recharge'>('khata');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<BakiTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTuesdayFilterActive, setIsTuesdayFilterActive] = useState(false);

  // Bkash Fund & Transactions State
  const [bkashFund, setBkashFund] = useState<BkashFund>({
    currentBalance: 25000,
    totalCashInSent: 0,
    totalCashOutReceived: 0,
    totalSendMoneySent: 0,
    totalRechargeSent: 0,
    lastUpdated: Date.now(),
  });
  const [bkashTransactions, setBkashTransactions] = useState<BkashTransactionRecord[]>([]);

  // Mobile Recharge State
  const [rechargeTransactions, setRechargeTransactions] = useState<RechargeTransaction[]>([]);

  // Modals & Drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyReportOpen, setDailyReportOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addDueOpen, setAddDueOpen] = useState(false);
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Global Bkash Modals
  const [bkashActionModalOpen, setBkashActionModalOpen] = useState(false);
  const [bkashRefillModalOpen, setBkashRefillModalOpen] = useState(false);
  const [bkashActionInitialType, setBkashActionInitialType] = useState<BkashOpType>('send_money');

  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Quick preset data for AddDueModal
  const [initialCategory, setInitialCategory] = useState<BakiCategory>('cha_pan');
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [initialSummary, setInitialSummary] = useState<string>('');
  const [initialBkashType, setInitialBkashType] = useState<BkashType>('none');

  // Real-time synchronization for Baki Khata
  useEffect(() => {
    try {
      localStorage.setItem('last_active_app', 'bakikhata');
      localStorage.setItem('pwa_default_app', 'bakikhata');
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const search = window.location.search || '';
      if (search.includes('tab=bkash')) {
        setActiveTab('bkash');
      } else if (search.includes('tab=recharge')) {
        setActiveTab('recharge');
      } else if (search.includes('action=add_due')) {
        setAddDueOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeBakirKhata(currentUser?.uid, ({ customers, transactions }) => {
      setCustomers(customers);
      setTransactions(transactions);
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  // Real-time synchronization for Bkash Fund
  useEffect(() => {
    const unsubscribeBkash = subscribeBkashData(currentUser?.uid, ({ fund, transactions }) => {
      setBkashFund(fund);
      setBkashTransactions(transactions);
    });
    return () => {
      unsubscribeBkash();
    };
  }, [currentUser?.uid]);

  // Real-time synchronization for Mobile Recharge
  useEffect(() => {
    const unsubscribeRecharge = subscribeRechargeData(currentUser?.uid, (recharges) => {
      setRechargeTransactions(recharges);
    });
    return () => {
      unsubscribeRecharge();
    };
  }, [currentUser?.uid]);

  const handleExecuteRecharge = async (payload: any) => {
    try {
      await addRechargeTransactionToDb(currentUser?.uid, payload);
      showToast('Mobile recharge completed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to complete mobile recharge', 'error');
    }
  };

  const totalRechargeProfit = useMemo(() => {
    return rechargeTransactions.reduce((sum, t) => sum + (t.profitAmount || 0), 0);
  }, [rechargeTransactions]);

  // Derived Stats
  const stats: BakiStats = useMemo(() => {
    let totalDue = 0;
    let totalPaid = 0;
    let tuesdayDue = 0;
    let tuesdayCustCount = 0;
    let bkashDue = 0;
    let chaPanDue = 0;
    let mudiDue = 0;

    customers.forEach((c) => {
      totalDue += c.totalDue || 0;
      totalPaid += c.totalPaid || 0;
      if (c.settlesOnTuesday && c.totalDue > 0) {
        tuesdayDue += c.totalDue;
        tuesdayCustCount += 1;
      }
    });

    transactions.forEach((t) => {
      if (t.type === 'due') {
        if (t.category === 'bkash') bkashDue += t.amount || 0;
        else if (t.category === 'cha_pan') chaPanDue += t.amount || 0;
        else if (t.category === 'mudi') mudiDue += t.amount || 0;
      }
    });

    return {
      totalCustomers: customers.length,
      totalDueAmount: totalDue,
      totalPaidAmount: totalPaid,
      tuesdayDueAmount: tuesdayDue,
      tuesdayCustomerCount: tuesdayCustCount,
      bkashDueAmount: bkashDue,
      chaPanDueAmount: chaPanDue,
      mudiDueAmount: mudiDue,
    };
  }, [customers, transactions]);

  // Handlers
  const handleSaveCustomer = async (
    custData: Omit<Customer, 'id' | 'createdAt' | 'lastActivityAt' | 'totalDue' | 'totalPaid'> & {
      initialDue?: number;
    }
  ) => {
    try {
      const created = await addCustomerToDb(currentUser?.uid, custData);
      if (custData.initialDue && custData.initialDue > 0) {
        await addTransactionToDb(currentUser?.uid, created, {
          customerId: created.id,
          customerName: created.name,
          customerPhone: created.phone,
          type: 'due',
          category: 'other',
          itemsSummary: 'Initial Credit Balance',
          amount: custData.initialDue,
          timestamp: Date.now(),
        });
      }
      showToast(`${created.name}'s ledger created successfully`, 'success');
    } catch {
      showToast('Error saving customer', 'error');
    }
  };

  const handleSaveDue = async (
    customer: Customer,
    data: {
      category: BakiCategory;
      bkashType?: BkashType;
      mfsNumber?: string;
      itemsSummary: string;
      amount: number;
      timestamp: number;
      note?: string;
    }
  ) => {
    try {
      await addTransactionToDb(currentUser?.uid, customer, {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        type: 'due',
        category: data.category,
        bkashType: data.bkashType,
        mfsNumber: data.mfsNumber,
        itemsSummary: data.itemsSummary,
        amount: data.amount,
        timestamp: data.timestamp,
        note: data.note,
      });

      // If category is bkash, also reflect in Bkash Fund
      if (data.category === 'bkash') {
        const opType: BkashOpType =
          data.bkashType === 'cash_out'
            ? 'cash_out'
            : data.bkashType === 'cash_in'
            ? 'cash_in'
            : 'send_money';

        await executeBkashOperation(
          currentUser?.uid,
          {
            type: opType,
            amount: data.amount,
            targetNumber: data.mfsNumber,
            customerId: customer.id,
            customerName: customer.name,
            isDue: true,
            note: data.note || data.itemsSummary,
          }
        );
      }

      showToast(`৳${data.amount} credit added successfully`, 'success');
    } catch {
      showToast('Error saving credit record', 'error');
    }
  };

  const handleExecuteBkashOperation = async (payload: any, customer?: Customer) => {
    try {
      const result = await executeBkashOperation(currentUser?.uid, payload, customer);
      const isDeduction =
        payload.type === 'send_money' || payload.type === 'cash_in';
      showToast(
        `Transaction successful! Fund ${isDeduction ? 'deducted' : 'added'}. Current balance: ৳${result.fund.currentBalance}`,
        'success'
      );
      return result;
    } catch {
      showToast('Bkash transaction failed', 'error');
      throw new Error('Bkash operation failed');
    }
  };

  const handleUpdateBkashFund = async (amount: number, mode: 'add' | 'set', note?: string) => {
    try {
      const updated = await updateBkashFundBalance(currentUser?.uid, amount, mode, note);
      showToast(`Fund balance updated successfully! Current balance: ৳${updated.currentBalance}`, 'success');
      return updated;
    } catch {
      showToast('Failed to update fund balance', 'error');
      throw new Error('Fund update failed');
    }
  };

  const handleSavePayment = async (
    customer: Customer,
    data: {
      amount: number;
      paymentMethod: any;
      isTuesdaySettlement: boolean;
      timestamp: number;
      note?: string;
    }
  ) => {
    try {
      await addTransactionToDb(currentUser?.uid, customer, {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        type: 'payment',
        category: 'other',
        itemsSummary: data.note || 'Due payment',
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        isTuesdaySettlement: data.isTuesdaySettlement,
        timestamp: data.timestamp,
      });
      showToast(`৳${data.amount} payment collected and ledger updated`, 'success');
    } catch {
      showToast('Error saving payment record', 'error');
    }
  };

  const handleOpenAddDueForCust = (cust: Customer) => {
    setActiveCustomer(cust);
    setInitialCategory('cha_pan');
    setInitialAmount(0);
    setInitialSummary('');
    setInitialBkashType('none');
    setAddDueOpen(true);
  };

  const handleOpenPaymentForCust = (cust: Customer) => {
    setActiveCustomer(cust);
    setCollectPaymentOpen(true);
  };

  const handleViewDetailsForCust = (cust: Customer) => {
    setActiveCustomer(cust);
    setDetailModalOpen(true);
  };

  const handleSelectPreset = (preset: any) => {
    setInitialCategory(preset.category);
    setInitialAmount(preset.amount);
    setInitialSummary(preset.itemsSummary);
    setInitialBkashType(preset.bkashType || 'none');
    setActiveCustomer(null);
    setAddDueOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* Top Header */}
      <BakiHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenAddCustomer={() => setAddCustomerOpen(true)}
        onOpenAddDue={() => {
          setActiveCustomer(null);
          setInitialCategory('cha_pan');
          setInitialAmount(0);
          setInitialSummary('');
          setInitialBkashType('none');
          setAddDueOpen(true);
        }}
        onBackToApp={onBackToApp}
        onOpenInstall={() => triggerPwaInstall()}
        isInstalled={isInstalled}
      />

      {/* Sidebar Drawer */}
      <BakiSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
        currentUser={currentUser}
        userProfile={userProfile}
        isAdmin={isAdmin}
        isSeller={isSeller}
        theme={theme}
        bkashFundBalance={bkashFund.currentBalance || 0}
        onToggleTheme={toggleTheme}
        onSelectTuesdayFilter={() => {
          setActiveTab('khata');
          setIsTuesdayFilterActive(true);
          showToast('Tuesday collection filter activated', 'info');
        }}
        onSelectAllCustomers={() => {
          setActiveTab('khata');
          setIsTuesdayFilterActive(false);
          showToast('Showing all customers', 'info');
        }}
        onSelectKhataTab={() => {
          setActiveTab('khata');
        }}
        onSelectBkashTab={() => {
          setActiveTab('bkash');
          showToast('Switched to Bkash & MFS Fund Counter', 'info');
        }}
        onOpenBkashAction={(type) => {
          setBkashActionInitialType(type || 'recharge');
          setBkashActionModalOpen(true);
        }}
        onOpenBkashRefill={() => {
          setBkashRefillModalOpen(true);
        }}
        onOpenAddCustomer={() => setAddCustomerOpen(true)}
        onOpenAddDue={(category) => {
          setActiveCustomer(null);
          setInitialCategory(category || 'cha_pan');
          setInitialAmount(0);
          setInitialSummary('');
          setInitialBkashType(category === 'bkash' ? 'send_money' : 'none');
          setAddDueOpen(true);
        }}
        onOpenDailyReport={() => setDailyReportOpen(true)}
        onExportCsv={() => {
          if (customers.length === 0) {
            showToast('No customer data found', 'warning');
            return;
          }
          exportCustomersToCsv(customers);
          showToast('Customer data exported as CSV', 'success');
        }}
        onPrintLedger={() => {
          window.print();
        }}
        onNavigate={(route) => {
          window.location.hash = route;
        }}
        onLogout={async () => {
          try {
            await logout();
            showToast('Logged out successfully', 'info');
          } catch (e: any) {
            showToast(e.message || 'Logout failed', 'error');
          }
        }}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 flex-1 w-full">
        {/* Navigation Tabs between Baki Khata and Bkash MFS Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <BakiNavTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            totalCustomers={customers.length}
            bkashFundBalance={bkashFund.currentBalance || 0}
            totalRechargeProfit={totalRechargeProfit}
          />
        </div>

        {activeTab === 'khata' ? (
          <>
            {/* Tuesday Settlement Banner */}
            <TuesdaySettlementBanner
              tuesdayDueAmount={stats.tuesdayDueAmount}
              tuesdayCustomerCount={stats.tuesdayCustomerCount}
              isFilterActive={isTuesdayFilterActive}
              onToggleFilter={() => setIsTuesdayFilterActive(!isTuesdayFilterActive)}
            />

            {/* Quick Add Presets Bar for fast shopkeeper entries */}
            <QuickAddBar onSelectPreset={handleSelectPreset} />

            {/* Stats Summary Cards */}
            <BakiStatsCards stats={stats} />

            {/* Customers Ledger View */}
            <CustomerListView
              customers={customers}
              searchQuery={searchQuery}
              isTuesdayFilterActive={isTuesdayFilterActive}
              onOpenAddDue={handleOpenAddDueForCust}
              onOpenPayment={handleOpenPaymentForCust}
              onViewDetails={handleViewDetailsForCust}
              onOpenAddCustomer={() => setAddCustomerOpen(true)}
            />
          </>
        ) : activeTab === 'bkash' ? (
          <BkashSectionView
            fund={bkashFund}
            transactions={bkashTransactions}
            customers={customers}
            onExecuteOperation={handleExecuteBkashOperation}
            onUpdateFund={handleUpdateBkashFund}
          />
        ) : (
          <RechargeSectionView
            transactions={rechargeTransactions}
            customers={customers}
            onExecuteRecharge={handleExecuteRecharge}
          />
        )}
      </main>

      {/* Modals */}
      <AddCustomerModal
        isOpen={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />

      <AddDueModal
        isOpen={addDueOpen}
        customers={customers}
        preSelectedCustomer={activeCustomer}
        initialCategory={initialCategory}
        initialAmount={initialAmount}
        initialSummary={initialSummary}
        initialBkashType={initialBkashType}
        onClose={() => {
          setAddDueOpen(false);
          setActiveCustomer(null);
        }}
        onSaveDue={handleSaveDue}
      />

      <CollectPaymentModal
        isOpen={collectPaymentOpen}
        customer={activeCustomer}
        onClose={() => {
          setCollectPaymentOpen(false);
          setActiveCustomer(null);
        }}
        onSavePayment={handleSavePayment}
      />

      <CustomerDetailModal
        isOpen={detailModalOpen}
        customer={activeCustomer}
        transactions={transactions}
        onClose={() => {
          setDetailModalOpen(false);
          setActiveCustomer(null);
        }}
        onOpenAddDue={handleOpenAddDueForCust}
        onOpenPayment={handleOpenPaymentForCust}
      />

      <DailyReportModal
        isOpen={dailyReportOpen}
        onClose={() => setDailyReportOpen(false)}
        transactions={transactions}
      />

      {/* Global triggered Bkash Modals */}
      <BkashActionModal
        isOpen={bkashActionModalOpen}
        onClose={() => setBkashActionModalOpen(false)}
        currentFundBalance={bkashFund.currentBalance || 0}
        customers={customers}
        initialType={bkashActionInitialType}
        onExecute={async (payload) => {
          const cust = customers.find((c) => c.id === payload.customerId);
          await handleExecuteBkashOperation(payload, cust);
        }}
      />

      <BkashFundRefillModal
        isOpen={bkashRefillModalOpen}
        onClose={() => setBkashRefillModalOpen(false)}
        currentBalance={bkashFund.currentBalance || 0}
        initialMode="add"
        onSave={async (amount, mode, note) => {
          await handleUpdateBkashFund(amount, mode, note);
        }}
      />

      {/* PWA App Install Modal */}
      <PwaInstallModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isInIframe={isInIframe}
        onNativeInstall={triggerPwaInstall}
      />
    </div>
  );
};
