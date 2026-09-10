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
  updateCustomerInDb,
  deleteCustomerFromDb,
  getLocalData,
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
import { EditCustomerModal } from './components/EditCustomerModal';
import { AddDueModal } from './components/AddDueModal';
import { CollectPaymentModal } from './components/CollectPaymentModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { StoreSyncModal } from './components/StoreSyncModal';
import { BakiMessageModal } from './components/BakiMessageModal';
import { HomeDashboardView } from './components/HomeDashboardView';
import { ShopExpense, ShopSale } from './types';
import { subscribeShopExpenses, addShopExpenseToDb, deleteShopExpenseFromDb, getLocalExpenses } from './services/expenseStorageService';
import { subscribeShopSales, addShopSaleToDb, deleteShopSaleFromDb } from './services/saleStorageService';
import { IncomeExpenseSectionView } from './components/IncomeExpenseSectionView';

interface BakirKhataAppProps {
  onBackToApp?: () => void;
}

export const BakirKhataApp: React.FC<BakirKhataAppProps> = ({ onBackToApp }) => {
  const { currentUser, userProfile, isAdmin, isSeller, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'home' | 'customers' | 'khata' | 'bkash' | 'recharge' | 'income_expense'>('home');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<BakiTransaction[]>([]);
  const [expenses, setExpenses] = useState<ShopExpense[]>([]);
  const [sales, setSales] = useState<ShopSale[]>([]);
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
  const [editCustomerOpen, setEditCustomerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [addDueOpen, setAddDueOpen] = useState(false);
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [storeSyncModalOpen, setStoreSyncModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageCustomer, setMessageCustomer] = useState<Customer | null>(null);
  const [messageInitialType, setMessageInitialType] = useState<'whatsapp' | 'sms'>('whatsapp');

  // Global Bkash Modals
  const [bkashActionModalOpen, setBkashActionModalOpen] = useState(false);
  const [bkashRefillModalOpen, setBkashRefillModalOpen] = useState(false);
  const [bkashActionInitialType, setBkashActionInitialType] = useState<BkashOpType>('send_money');

  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Automatically keep active customer synchronized with latest calculated state
  const resolvedActiveCustomer = useMemo(() => {
    if (!activeCustomer) return null;
    return customers.find((c) => c.id === activeCustomer.id) || activeCustomer;
  }, [activeCustomer, customers]);

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
      const params = new URLSearchParams(window.location.search);
      const storeParam = params.get('store');
      if (storeParam) {
        try {
          localStorage.setItem('bakikhata_store_address', storeParam.trim());
        } catch {}
      }

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

  // Real-time synchronization for Shop Expenses
  useEffect(() => {
    const unsubscribeExpenses = subscribeShopExpenses(currentUser?.uid, (exps) => {
      setExpenses(exps);
    });
    return () => {
      unsubscribeExpenses();
    };
  }, [currentUser?.uid]);

  // Real-time synchronization for Shop Sales
  useEffect(() => {
    const unsubscribeSales = subscribeShopSales(currentUser?.uid, (sls) => {
      setSales(sls);
    });
    return () => {
      unsubscribeSales();
    };
  }, [currentUser?.uid]);

  const handleAddExpense = async (expenseData: Omit<ShopExpense, 'id' | 'timestamp'>) => {
    try {
      const newExp = await addShopExpenseToDb(currentUser?.uid, expenseData);
      setExpenses((prev) => [newExp, ...prev.filter((e) => e.id !== newExp.id)]);
      showToast('নতুন খরচ যোগ করা হয়েছে', 'success');
    } catch {
      showToast('Failed to add expense', 'error');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      // Immediate optimistic update
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      const updated = await deleteShopExpenseFromDb(currentUser?.uid, id);
      setExpenses([...updated]);
      showToast('খরচের হিসাব মুছে ফেলা হয়েছে', 'success');
    } catch {
      showToast('Failed to delete expense', 'error');
    }
  };

  const handleAddSale = async (saleData: Omit<ShopSale, 'id' | 'timestamp'>) => {
    try {
      const newSale = await addShopSaleToDb(currentUser?.uid, saleData);
      setSales((prev) => [newSale, ...prev.filter((s) => s.id !== newSale.id)]);
      showToast('নতুন বিক্রি / সেলস যোগ করা হয়েছে', 'success');
    } catch {
      showToast('Failed to add sale', 'error');
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      // Immediate optimistic update
      setSales((prev) => prev.filter((s) => s.id !== id));
      const updated = await deleteShopSaleFromDb(currentUser?.uid, id);
      setSales([...updated]);
      showToast('বিক্রির হিসাব মুছে ফেলা হয়েছে', 'success');
    } catch {
      showToast('Failed to delete sale', 'error');
    }
  };

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
      const currentDue = Number(c.totalDue) || 0;
      totalDue += currentDue;
      totalPaid += Number(c.totalPaid) || 0;
      if (c.settlesOnTuesday && currentDue > 0) {
        tuesdayDue += currentDue;
        tuesdayCustCount += 1;
      }

      // Allocate outstanding dues to categories from customer's latest due transactions
      if (currentDue > 0) {
        const custDueTx = transactions
          .filter((t) => t.customerId === c.id && t.type === 'due')
          .sort((a, b) => b.timestamp - a.timestamp);

        let unallocated = currentDue;
        for (const t of custDueTx) {
          if (unallocated <= 0) break;
          const amt = Math.min(unallocated, Number(t.amount) || 0);
          if (t.category === 'bkash') bkashDue += amt;
          else if (t.category === 'cha_pan') chaPanDue += amt;
          else if (t.category === 'mudi') mudiDue += amt;
          unallocated -= amt;
        }
        if (unallocated > 0) {
          mudiDue += unallocated; // remaining balance from initial grocery/general ledger
        }
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
  const refreshState = () => {
    const { customers: cl, transactions: tl } = getLocalData();
    setCustomers([...cl]);
    setTransactions([...tl]);
  };

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
      refreshState();
      showToast(`${created.name}'s ledger created successfully`, 'success');
    } catch {
      showToast('Error saving customer', 'error');
    }
  };

  const handleUpdateCustomer = async (customer: Customer, data: Partial<Customer>) => {
    try {
      await updateCustomerInDb(currentUser?.uid, customer, data);
      refreshState();
      showToast('Customer updated successfully', 'success');
    } catch {
      showToast('Error updating customer', 'error');
    }
  };

  const handleRequestDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    const customerId = customerToDelete.id;
    try {
      await deleteCustomerFromDb(currentUser?.uid, customerId);
      refreshState();
      if (activeCustomer?.id === customerId) {
        setActiveCustomer(null);
        setDetailModalOpen(false);
      }
      if (customerToEdit?.id === customerId) {
        setCustomerToEdit(null);
        setEditCustomerOpen(false);
      }
      setCustomerToDelete(null);
      showToast('Customer deleted successfully', 'success');
    } catch {
      showToast('Error deleting customer', 'error');
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
            isDue: false, // Due is already recorded in the Khata via addTransactionToDb above
            note: data.note || data.itemsSummary,
          }
        );
      }

      refreshState();
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
      refreshState();
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
        onOpenStoreSync={() => setStoreSyncModalOpen(true)}
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

        {activeTab === 'home' ? (
          <HomeDashboardView
            stats={stats}
            bkashFundBalance={bkashFund.currentBalance || 0}
            totalRechargeProfit={totalRechargeProfit}
            customers={customers}
            transactions={transactions}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddCustomer={() => setAddCustomerOpen(true)}
            onOpenAddDue={() => {
              setActiveCustomer(null);
              setInitialCategory('cha_pan');
              setInitialAmount(0);
              setInitialSummary('');
              setInitialBkashType('none');
              setAddDueOpen(true);
            }}
            onOpenPayment={() => {
              setActiveCustomer(null);
              setCollectPaymentOpen(true);
            }}
            onOpenDailyReport={() => setDailyReportOpen(true)}
            onViewCustomerDetails={handleViewDetailsForCust}
            onOpenIncomeExpense={() => setActiveTab('income_expense')}
          />
        ) : activeTab === 'customers' ? (
          <CustomerListView
            customers={customers}
            searchQuery={searchQuery}
            isTuesdayFilterActive={isTuesdayFilterActive}
            onOpenAddDue={handleOpenAddDueForCust}
            onOpenPayment={handleOpenPaymentForCust}
            onViewDetails={handleViewDetailsForCust}
            onOpenAddCustomer={() => setAddCustomerOpen(true)}
            onEditCustomer={(cust) => {
              setCustomerToEdit(cust);
              setEditCustomerOpen(true);
            }}
            onDeleteCustomer={handleRequestDeleteCustomer}
            onOpenMessage={(cust, type) => {
              setMessageCustomer(cust);
              setMessageInitialType(type || 'whatsapp');
              setMessageModalOpen(true);
            }}
          />
        ) : activeTab === 'khata' ? (
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
              onEditCustomer={(cust) => {
                setCustomerToEdit(cust);
                setEditCustomerOpen(true);
              }}
              onDeleteCustomer={handleRequestDeleteCustomer}
              onOpenMessage={(cust, type) => {
                setMessageCustomer(cust);
                setMessageInitialType(type || 'whatsapp');
                setMessageModalOpen(true);
              }}
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
        ) : activeTab === 'recharge' ? (
          <RechargeSectionView
            transactions={rechargeTransactions}
            customers={customers}
            onExecuteRecharge={handleExecuteRecharge}
          />
        ) : (
          <IncomeExpenseSectionView
            expenses={expenses}
            sales={sales}
            customers={customers}
            rechargeTransactions={rechargeTransactions}
            bkashFundBalance={bkashFund.currentBalance || 0}
            totalRechargeProfit={totalRechargeProfit}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        )}
      </main>

      {/* Modals */}
      <AddCustomerModal
        isOpen={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />

      <CustomerDetailModal
        isOpen={detailModalOpen}
        customer={resolvedActiveCustomer}
        transactions={transactions}
        currentUser={currentUser}
        onClose={() => {
          setDetailModalOpen(false);
          setActiveCustomer(null);
        }}
        onOpenAddDue={handleOpenAddDueForCust}
        onOpenPayment={handleOpenPaymentForCust}
        onEditCustomer={(cust) => {
          setDetailModalOpen(false);
          setCustomerToEdit(cust);
          setEditCustomerOpen(true);
        }}
        onDeleteCustomer={handleRequestDeleteCustomer}
      />

      <AddDueModal
        isOpen={addDueOpen}
        customers={customers}
        preSelectedCustomer={resolvedActiveCustomer}
        initialCategory={initialCategory}
        initialAmount={initialAmount}
        initialSummary={initialSummary}
        initialBkashType={initialBkashType}
        onClose={() => {
          setAddDueOpen(false);
          if (!detailModalOpen) {
            setActiveCustomer(null);
          }
        }}
        onSaveDue={handleSaveDue}
      />

      <CollectPaymentModal
        isOpen={collectPaymentOpen}
        customer={resolvedActiveCustomer}
        onClose={() => {
          setCollectPaymentOpen(false);
          if (!detailModalOpen) {
            setActiveCustomer(null);
          }
        }}
        onSavePayment={handleSavePayment}
      />

      <EditCustomerModal
        isOpen={editCustomerOpen}
        customer={customerToEdit}
        onClose={() => {
          setEditCustomerOpen(false);
          setCustomerToEdit(null);
        }}
        onUpdateCustomer={handleUpdateCustomer}
        onDeleteCustomer={handleRequestDeleteCustomer}
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

      <StoreSyncModal
        isOpen={storeSyncModalOpen}
        onClose={() => setStoreSyncModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Confirmation Modal for deleting customer */}
      <ConfirmDeleteModal
        isOpen={!!customerToDelete}
        customer={customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDeleteCustomer}
      />

      {/* Customer Reminder & Meal Inquiry SMS / WhatsApp Modal */}
      <BakiMessageModal
        isOpen={messageModalOpen}
        customer={messageCustomer}
        transactions={transactions}
        currentUser={currentUser}
        initialType={messageInitialType}
        onClose={() => {
          setMessageModalOpen(false);
          setMessageCustomer(null);
        }}
      />


    </div>
  );
};
