import { ref, onValue, set } from 'firebase/database';
import { database } from '../../../services/firebase';
import { ShopExpense } from '../types';
import { getStoreAddress } from './bakiStorageService';

const LOCAL_EXPENSES_KEY = 'bakikhata_expenses_cache';
const LOCAL_DELETED_EXPENSES_KEY = 'bakikhata_deleted_expense_ids';

const SAMPLE_EXPENSES: ShopExpense[] = [
  {
    id: 'exp_1',
    category: 'electricity',
    title: 'বিদ্যুৎ বিল (Electricity Bill)',
    amount: 1450,
    note: 'Monthly meter bill',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'exp_2',
    category: 'goods_purchase',
    title: 'চা পাতা ও চিনি কেনা (Tea & Sugar stock)',
    amount: 2200,
    note: 'Wholesale market purchase',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
];

export function getDeletedExpenseIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_EXPENSES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function recordDeletedExpenseId(id: string) {
  try {
    const set = getDeletedExpenseIds();
    set.add(id);
    localStorage.setItem(LOCAL_DELETED_EXPENSES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function getLocalExpenses(): ShopExpense[] {
  const deletedIds = getDeletedExpenseIds();
  try {
    const raw = localStorage.getItem(LOCAL_EXPENSES_KEY);
    const list: ShopExpense[] = raw ? JSON.parse(raw) : SAMPLE_EXPENSES;
    return list.filter((e) => !deletedIds.has(e.id));
  } catch {
    return SAMPLE_EXPENSES.filter((e) => !deletedIds.has(e.id));
  }
}

export function saveLocalExpenses(expenses: ShopExpense[]) {
  const deletedIds = getDeletedExpenseIds();
  const cleanList = expenses.filter((e) => !deletedIds.has(e.id));
  try {
    localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(cleanList));
  } catch {}
}

function getExpensePath(userId?: string): string {
  const address = getStoreAddress(userId);
  return `apps/bakikhata/stores/${address}/expenses`;
}

export function subscribeShopExpenses(userId: string | undefined, callback: (expenses: ShopExpense[]) => void) {
  const local = getLocalExpenses();
  callback(local);

  const expensePath = getExpensePath(userId);
  const expensesRef = ref(database, expensePath);

  const unsubscribe = onValue(
    expensesRef,
    (snapshot) => {
      const deletedIds = getDeletedExpenseIds();
      if (!snapshot.exists()) {
        const initial = getLocalExpenses();
        if (initial.length > 0) {
          const initialMap = initial.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});
          set(expensesRef, initialMap).catch(() => {});
        }
        callback(initial);
      } else {
        const val = snapshot.val();
        if (val) {
          const list: ShopExpense[] = Object.values(val);
          const filtered = list.filter((e) => !deletedIds.has(e.id));
          filtered.sort((a, b) => b.timestamp - a.timestamp);
          saveLocalExpenses(filtered);
          callback(filtered);
        } else {
          callback([]);
          saveLocalExpenses([]);
        }
      }
    },
    (err) => {
      console.warn('Firebase expenses subscribe notice:', err);
      callback(getLocalExpenses());
    }
  );

  return () => {
    unsubscribe();
  };
}

export async function addShopExpenseToDb(
  userId: string | undefined,
  expenseData: Omit<ShopExpense, 'id' | 'timestamp'> & { timestamp?: number }
): Promise<ShopExpense> {
  const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newExpense: ShopExpense = {
    ...expenseData,
    id: newId,
    timestamp: expenseData.timestamp || Date.now(),
  };

  const current = getLocalExpenses();
  const updated = [newExpense, ...current];
  saveLocalExpenses(updated);

  try {
    const expensePath = getExpensePath(userId);
    const expRef = ref(database, `${expensePath}/${newId}`);
    set(expRef, newExpense).catch((err) => console.warn('Firebase expense add background notice:', err));
  } catch (err) {
    console.warn('Firebase expense save background error:', err);
  }

  return newExpense;
}

export async function deleteShopExpenseFromDb(userId: string | undefined, expenseId: string): Promise<ShopExpense[]> {
  // Permanently record as deleted so it never resurrects
  recordDeletedExpenseId(expenseId);

  const current = getLocalExpenses();
  const updated = current.filter((e) => e.id !== expenseId);
  saveLocalExpenses(updated);

  try {
    const expensePath = getExpensePath(userId);
    const expRef = ref(database, `${expensePath}/${expenseId}`);
    set(expRef, null).catch((err) => console.warn('Firebase expense delete background notice:', err));
  } catch (err) {
    console.warn('Firebase expense delete background error:', err);
  }

  return updated;
}

