import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Phone,
  Clock,
  PlusCircle,
  CheckCircle,
  Coffee,
  ShoppingBag,
  Smartphone,
  FileText,
  Printer,
  Edit3,
  Trash2,
  PhoneCall,
  MessageSquare,
  History,
} from 'lucide-react';
import { Customer, BakiTransaction, CallingLog } from '../types';
import { formatTaka, formatDateTime } from '../utils/bakiUtils';
import { useToast } from '../../../context/ToastContext';
import { getLocalCallingLogs, recordCallingLog } from '../services/bakiStorageService';
import { BakiMessageModal } from './BakiMessageModal';

interface CustomerDetailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  transactions: BakiTransaction[];
  currentUser?: any;
  onClose: () => void;
  onOpenAddDue: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  customer,
  transactions,
  currentUser,
  onClose,
  onOpenAddDue,
  onOpenPayment,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'transactions' | 'calls'>('transactions');
  const [custCallingLogs, setCustCallingLogs] = useState<CallingLog[]>([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalType, setMessageModalType] = useState<'whatsapp' | 'sms'>('whatsapp');

  useEffect(() => {
    if (isOpen && customer) {
      const allLogs = getLocalCallingLogs();
      const filtered = allLogs.filter((l) => l.customerId === customer.id);
      setCustCallingLogs(filtered);
    }
  }, [isOpen, customer]);

  const custTransactions = useMemo(() => {
    if (!customer) return [];
    return transactions.filter((t) => t.customerId === customer.id);
  }, [transactions, customer]);

  // Live real-time accurate calculation directly from transactions
  const calculatedDue = useMemo(() => {
    if (!customer) return 0;
    if (custTransactions.length > 0) {
      let due = 0;
      custTransactions.forEach((t) => {
        const amt = Number(t.amount) || 0;
        if (t.type === 'due') due += amt;
        else if (t.type === 'payment') due -= amt;
      });
      return Math.max(0, due);
    }
    return customer.totalDue || 0;
  }, [custTransactions, customer]);

  const calculatedPaid = useMemo(() => {
    if (!customer) return 0;
    if (custTransactions.length > 0) {
      return custTransactions.reduce(
        (sum, t) => (t.type === 'payment' ? sum + (Number(t.amount) || 0) : sum),
        0
      );
    }
    return customer.totalPaid || 0;
  }, [custTransactions, customer]);

  const liveCustomer = useMemo(() => {
    if (!customer) return null;
    return {
      ...customer,
      totalDue: calculatedDue,
      totalPaid: calculatedPaid,
    };
  }, [customer, calculatedDue, calculatedPaid]);

  if (!isOpen || !customer || !liveCustomer) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cha_pan':
        return <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'mudi':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'bkash':
        return <Smartphone className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDirectCall = async () => {
    if (!customer.phone) {
      showToast('এই কাস্টমারের কোনো ফোন নম্বর সেভ করা নেই!', 'warning');
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');

    try {
      const newLog = await recordCallingLog(currentUser?.uid, {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        actionType: 'direct_call',
        message: `বাকি (${formatTaka(customer.totalDue)}) পরিশোধের জন্য ডায়রেক্ট কল`,
      });
      setCustCallingLogs((prev) => [newLog, ...prev]);
      showToast('কল ডাটাবেজে সংরক্ষণ করা হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
    }

    window.location.href = `tel:${cleanPhone}`;
  };

  const handleDailyMealInquiry = () => {
    if (!customer.phone) {
      showToast('এই কাস্টমারের কোনো ফোন নম্বর সেভ করা নেই!', 'warning');
      return;
    }
    setMessageModalType('whatsapp');
    setMessageModalOpen(true);
  };

  const handleDirectSms = () => {
    if (!customer.phone) {
      showToast('এই কাস্টমারের কোনো ফোন নম্বর সেভ করা নেই!', 'warning');
      return;
    }
    setMessageModalType('sms');
    setMessageModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center shadow-md shadow-emerald-600/20 text-base">
                {customer.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {customer.name}
                  </h3>
                  {customer.settlesOnTuesday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      Tuesday Settlement
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {customer.phone || 'No phone number'} {customer.address ? `• ${customer.address}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close modal (বন্ধ করুন / ক্রস)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-bold text-xs shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4 text-rose-500" />
              <span>বন্ধ করুন</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              {customer.phone && (
                <button
                  onClick={handleDirectCall}
                  title="Direct Call"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </button>
              )}
              {customer.phone && (
                <button
                  onClick={handleDailyMealInquiry}
                  title="WhatsApp"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition border border-emerald-200/60 dark:border-emerald-800 cursor-pointer"
                >
                  <span>🍽️</span>
                  <span>WhatsApp</span>
                </button>
              )}
              {customer.phone && (
                <button
                  onClick={handleDirectSms}
                  title="SMS"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 transition border border-sky-200/60 dark:border-sky-800 cursor-pointer"
                >
                  <span>📱</span>
                  <span>SMS</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEditCustomer(customer)}
                title="Edit Customer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 transition border border-amber-200/60 dark:border-amber-800 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDeleteCustomer(customer)}
                title="Delete Customer (কাস্টমার মুছুন)"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition border border-rose-200/60 dark:border-rose-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>কাস্টমার মুছুন</span>
              </button>

              <button
                onClick={handlePrint}
                title="Print Statement"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Balance Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-500 block font-bold">Total Current Due</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                {formatTaka(liveCustomer.totalDue)}
              </span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
              <span className="text-[11px] text-slate-500 block font-bold">Total Paid Balance</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatTaka(liveCustomer.totalPaid)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddDue(liveCustomer)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition border border-rose-200/60 dark:border-rose-800 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Due</span>
            </button>
            <button
              onClick={() => onOpenPayment(liveCustomer)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition border border-emerald-200/60 dark:border-emerald-800 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Collect Payment</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Transactions vs Calling Logs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`pb-2.5 text-xs font-black transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transactions'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>লেনদেন হিস্ট্রি ({custTransactions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calls')}
            className={`pb-2.5 text-xs font-black transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calls'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>কল ও নোটিফিকেশন লগ ({custCallingLogs.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'transactions' ? (
            custTransactions.length > 0 ? (
              <div className="space-y-2.5">
                {custTransactions.map((tx) => {
                  const isDue = tx.type === 'due';
                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDue
                              ? 'bg-rose-50 dark:bg-rose-950/60'
                              : 'bg-emerald-50 dark:bg-emerald-950/60'
                          }`}
                        >
                          {isDue ? getCategoryIcon(tx.category) : <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {tx.itemsSummary}
                            </span>
                            {tx.isTuesdaySettlement && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold">
                                Tuesday Settlement
                              </span>
                            )}
                          </div>

                          {tx.mfsNumber && (
                            <p className="text-[11px] text-slate-500">
                              Number: <span className="font-mono text-pink-600 dark:text-pink-400">{tx.mfsNumber}</span>
                            </p>
                          )}

                          {tx.note && (
                            <p className="text-[11px] text-slate-400 italic">
                              Note: {tx.note}
                            </p>
                          )}

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(tx.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-sm font-black ${
                            isDue
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isDue ? `+ ${formatTaka(tx.amount)}` : `- ${formatTaka(tx.amount)}`}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          {isDue ? 'Due' : 'Payment'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No transactions recorded yet
              </div>
            )
          ) : (
            /* Calling Logs */
            custCallingLogs.length > 0 ? (
              <div className="space-y-2.5">
                {custCallingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {log.actionType === 'direct_call' ? '📞' : log.actionType === 'whatsapp_inquiry' ? '🍽️' : '📱'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {log.actionType === 'direct_call'
                              ? 'সরাসরি ফোন কল'
                              : log.actionType === 'whatsapp_inquiry'
                              ? 'WhatsApp মেসেজ'
                              : 'SMS বার্তা'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {log.customerPhone}
                          </span>
                        </div>
                        {log.message && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            {log.message}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      লগ সংরক্ষিত
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                <PhoneCall className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>এই কাস্টমারকে এখনও কোনো কল বা মেসেজ দেওয়া হয়নি।</p>
                <p className="text-[11px] text-slate-400">
                  উপরে "কল করুন", "WhatsApp" বা "SMS" এ চাপলে স্বয়ংক্রিয়ভাবে ডাটাবেজে রেকর্ড হয়ে যাবে।
                </p>
              </div>
            )
          )}
        </div>
      </div>

      <BakiMessageModal
        isOpen={messageModalOpen}
        customer={liveCustomer}
        transactions={custTransactions}
        currentUser={currentUser}
        initialType={messageModalType}
        onClose={() => setMessageModalOpen(false)}
        onLogSaved={(newLog) => setCustCallingLogs((prev) => [newLog, ...prev])}
      />
    </div>
  );
};
