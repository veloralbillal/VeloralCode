import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../services/firebase';
import { RechargeTransaction, RechargeOperator } from '../types';

const LOCAL_RECHARGE_KEY = 'bakikhata_recharge_tx_cache';

const SAMPLE_RECHARGES: RechargeTransaction[] = [
  {
    id: 'rech_1',
    operator: 'gp',
    mobileNumber: '01712345678',
    rechargeType: 'prepaid',
    amount: 200,
    commissionRate: 3.2,
    profitAmount: 6.4,
    isDue: false,
    note: 'সরাসরি ক্যাশ রিচার্জ',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'rech_2',
    operator: 'bl',
    mobileNumber: '01911223344',
    rechargeType: 'prepaid',
    amount: 500,
    commissionRate: 3.5,
    profitAmount: 17.5,
    isDue: false,
    note: 'ইন্টারনেট প্যাক',
    timestamp: Date.now() - 1000 * 60 * 120,
  },
];

export function getLocalRecharges(): RechargeTransaction[] {
  try {
    const raw = localStorage.getItem(LOCAL_RECHARGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_RECHARGES;
  } catch {
    return SAMPLE_RECHARGES;
  }
}

export function saveLocalRecharges(recharges: RechargeTransaction[]) {
  try {
    localStorage.setItem(LOCAL_RECHARGE_KEY, JSON.stringify(recharges));
  } catch (err) {
    console.error('Local recharge save error:', err);
  }
}

export function subscribeRechargeData(
  userId: string | undefined,
  callback: (recharges: RechargeTransaction[]) => void
) {
  const local = getLocalRecharges();
  callback(local);

  if (!userId) {
    return () => {};
  }

  const dbRef = ref(database, `bakikhata_recharges/${userId}`);
  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, RechargeTransaction>;
        const recharges = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        saveLocalRecharges(recharges);
        callback(recharges);
      } else {
        const initial = getLocalRecharges();
        const obj: Record<string, RechargeTransaction> = {};
        initial.forEach((r) => {
          obj[r.id] = r;
        });
        set(dbRef, obj).catch(() => {});
        callback(initial);
      }
    },
    (error) => {
      console.warn('Recharge Firebase sync warning:', error);
      callback(getLocalRecharges());
    }
  );

  return () => {
    unsubscribe();
  };
}

export async function addRechargeTransactionToDb(
  userId: string | undefined,
  payload: Omit<RechargeTransaction, 'id' | 'timestamp'>
): Promise<RechargeTransaction> {
  const newTx: RechargeTransaction = {
    ...payload,
    id: 'rech_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
  };

  const current = getLocalRecharges();
  const updated = [newTx, ...current];
  saveLocalRecharges(updated);

  if (userId) {
    try {
      const dbRef = ref(database, `bakikhata_recharges/${userId}/${newTx.id}`);
      await set(dbRef, newTx);
    } catch (err) {
      console.warn('Firebase recharge save error:', err);
    }
  }

  return newTx;
}
