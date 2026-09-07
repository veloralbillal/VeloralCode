import { ref, onValue, set } from 'firebase/database';
import { database } from '../../../services/firebase';
import { BkashFund, BkashTransactionRecord, BkashOpType, Customer } from '../types';
import { addTransactionToDb, getLocalData } from './bakiStorageService';

const LOCAL_BKASH_FUND_KEY = 'bakikhata_bkash_fund_cache';
const LOCAL_BKASH_TX_KEY = 'bakikhata_bkash_tx_cache';

const DEFAULT_FUND: BkashFund = {
  currentBalance: 25000,
  totalCashInSent: 0,
  totalCashOutReceived: 0,
  totalSendMoneySent: 0,
  totalRechargeSent: 0,
  lastUpdated: Date.now(),
};

export function getLocalBkashData(): { fund: BkashFund; transactions: BkashTransactionRecord[] } {
  try {
    const rawFund = localStorage.getItem(LOCAL_BKASH_FUND_KEY);
    const rawTx = localStorage.getItem(LOCAL_BKASH_TX_KEY);
    const fund = rawFund ? JSON.parse(rawFund) : DEFAULT_FUND;
    const transactions = rawTx ? JSON.parse(rawTx) : [];
    return { fund, transactions };
  } catch {
    return { fund: DEFAULT_FUND, transactions: [] };
  }
}

export function saveLocalBkashData(fund: BkashFund, transactions: BkashTransactionRecord[]) {
  try {
    localStorage.setItem(LOCAL_BKASH_FUND_KEY, JSON.stringify(fund));
    localStorage.setItem(LOCAL_BKASH_TX_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving local bkash data:', e);
  }
}

function getBkashPath(userId?: string): string {
  return userId ? `apps/bakikhata/${userId}/bkash` : `apps/bakikhata/general/bkash`;
}

export function subscribeBkashData(
  userId: string | undefined,
  callback: (data: { fund: BkashFund; transactions: BkashTransactionRecord[] }) => void
): () => void {
  // Emit local cache immediately
  const local = getLocalBkashData();
  callback(local);

  const bkashPath = getBkashPath(userId);
  const dataRef = ref(database, bkashPath);

  const unsubscribe = onValue(
    dataRef,
    async (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        try {
          await set(dataRef, {
            fund: DEFAULT_FUND,
            transactions: {},
          });
        } catch {
          // ignore
        }
        callback({ fund: DEFAULT_FUND, transactions: [] });
        saveLocalBkashData(DEFAULT_FUND, []);
      } else {
        const fund: BkashFund = val.fund || DEFAULT_FUND;
        const txList: BkashTransactionRecord[] = val.transactions
          ? Object.values(val.transactions)
          : [];
        txList.sort((a, b) => b.timestamp - a.timestamp);
        callback({ fund, transactions: txList });
        saveLocalBkashData(fund, txList);
      }
    },
    (err) => {
      console.warn('Bkash sync offline, using local data:', err);
    }
  );

  return () => {
    unsubscribe();
  };
}

export async function updateBkashFundBalance(
  userId: string | undefined,
  newAmount: number,
  mode: 'set' | 'add',
  note?: string
): Promise<BkashFund> {
  try {
    const { fund, transactions } = getLocalBkashData();
    const balanceBefore = fund.currentBalance || 0;
    const balanceAfter = mode === 'set' ? newAmount : balanceBefore + newAmount;

    const updatedFund: BkashFund = {
      ...fund,
      currentBalance: Math.max(0, balanceAfter),
      lastUpdated: Date.now(),
    };

    const newTx: BkashTransactionRecord = {
      id: `bk_tx_${Date.now()}`,
      type: mode === 'set' ? 'fund_adjust' : 'fund_load',
      amount: mode === 'set' ? Math.abs(balanceAfter - balanceBefore) : newAmount,
      balanceBefore,
      balanceAfter: updatedFund.currentBalance,
      isDue: false,
      note: note || (mode === 'set' ? 'ফান্ড ব্যালেন্স সমন্বয়' : 'নতুন ফান্ড রিফিল/লোড'),
      timestamp: Date.now(),
    };

    try {
      const bkashPath = getBkashPath(userId);
      const fundRef = ref(database, `${bkashPath}/fund`);
      const txRef = ref(database, `${bkashPath}/transactions/${newTx.id}`);

      await Promise.all([
        set(fundRef, updatedFund),
        set(txRef, newTx),
      ]);
    } catch (err) {
      console.warn('Firebase fund update warning:', err);
    }

    const updatedList = [newTx, ...transactions];
    saveLocalBkashData(updatedFund, updatedList);
    return updatedFund;
  } catch (err) {
    console.error('updateBkashFundBalance error:', err);
    return getLocalBkashData().fund;
  }
}

export interface BkashOpPayload {
  type: BkashOpType;
  amount: number;
  targetNumber?: string;
  simOperator?: string;
  customerId?: string;
  customerName?: string;
  isDue: boolean;
  commission?: number;
  note?: string;
}

export async function executeBkashOperation(
  userId: string | undefined,
  payload: BkashOpPayload,
  customer?: Customer
): Promise<{ fund: BkashFund; tx: BkashTransactionRecord }> {
  try {
    const { fund, transactions } = getLocalBkashData();
    const balanceBefore = fund.currentBalance || 0;

    let balanceAfter = balanceBefore;
    let totalRecharge = fund.totalRechargeSent || 0;
    let totalSend = fund.totalSendMoneySent || 0;
    let totalCashIn = fund.totalCashInSent || 0;
    let totalCashOut = fund.totalCashOutReceived || 0;

    // Calculate fund impact
    if (payload.type === 'send_money') {
      balanceAfter = balanceBefore - payload.amount;
      totalSend += payload.amount;
    } else if (payload.type === 'cash_in') {
      balanceAfter = balanceBefore - payload.amount;
      totalCashIn += payload.amount;
    } else if (payload.type === 'cash_out') {
      balanceAfter = balanceBefore + payload.amount;
      totalCashOut += payload.amount;
    } else if (payload.type === 'fund_load') {
      balanceAfter = balanceBefore + payload.amount;
    }

    const updatedFund: BkashFund = {
      ...fund,
      currentBalance: Math.max(0, balanceAfter),
      totalRechargeSent: totalRecharge,
      totalSendMoneySent: totalSend,
      totalCashInSent: totalCashIn,
      totalCashOutReceived: totalCashOut,
      lastUpdated: Date.now(),
    };

    const newTx: BkashTransactionRecord = {
      id: `bk_tx_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type: payload.type,
      amount: payload.amount,
      targetNumber: payload.targetNumber,
      simOperator: payload.simOperator,
      customerId: customer ? customer.id : payload.customerId,
      customerName: customer ? customer.name : payload.customerName,
      isDue: payload.isDue,
      commission: payload.commission || 0,
      balanceBefore,
      balanceAfter: updatedFund.currentBalance,
      note: payload.note,
      timestamp: Date.now(),
    };

    try {
      const bkashPath = getBkashPath(userId);
      const fundRef = ref(database, `${bkashPath}/fund`);
      const txRef = ref(database, `${bkashPath}/transactions/${newTx.id}`);

      await Promise.all([
        set(fundRef, updatedFund),
        set(txRef, newTx),
      ]);

      if (payload.isDue && customer) {
        let summaryDesc = `বিকাশ ${payload.type === 'send_money' ? 'সেন্ড মানি' : payload.type === 'cash_in' ? 'ক্যাশ ইন' : 'লেনদেন'}`;
        if (payload.targetNumber) {
          summaryDesc += ` (${payload.targetNumber})`;
        }

        await addTransactionToDb(userId, customer, {
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          type: 'due',
          category: 'bkash',
          bkashType: payload.type === 'send_money' ? 'send_money' : payload.type === 'cash_in' ? 'cash_in' : 'cash_out',
          mfsNumber: payload.targetNumber,
          itemsSummary: summaryDesc,
          amount: payload.amount,
          paymentMethod: 'bkash',
        });
      }
    } catch (firebaseErr) {
      console.warn('Firebase bkash sync warning:', firebaseErr);
    }

    const updatedTxList = [newTx, ...transactions];
    saveLocalBkashData(updatedFund, updatedTxList);

    return { fund: updatedFund, tx: newTx };
  } catch (err: any) {
    console.error('executeBkashOperation error:', err);
    const { fund } = getLocalBkashData();
    const fallbackTx: BkashTransactionRecord = {
      id: `bk_tx_${Date.now()}`,
      type: payload.type,
      amount: payload.amount,
      balanceBefore: fund.currentBalance,
      balanceAfter: fund.currentBalance,
      isDue: false,
      timestamp: Date.now(),
    };
    return { fund, tx: fallbackTx };
  }
}
