import { ref, onValue, set } from 'firebase/database';
import { database } from '../../../services/firebase';
import { ShopSale } from '../types';
import { getStoreAddress } from './bakiStorageService';

const LOCAL_SALES_KEY = 'bakikhata_sales_cache';
const LOCAL_DELETED_SALES_KEY = 'bakikhata_deleted_sale_ids';

const SAMPLE_SALES: ShopSale[] = [
  {
    id: 'sale_1',
    category: 'cash_sale',
    title: 'আজকের সাধারণ নগদ বিক্রি (Daily Cash Sale)',
    amount: 3500,
    note: 'দোকানের ক্যাশ কাউন্টার বিক্রি',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'sale_2',
    category: 'grocery',
    title: 'মুদি মালামাল নগদ বিক্রি (Grocery Sale)',
    amount: 1850,
    note: 'চাল, ডাল ও তেল বিক্রি',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];

export function getDeletedSaleIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_SALES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function recordDeletedSaleId(id: string) {
  try {
    const set = getDeletedSaleIds();
    set.add(id);
    localStorage.setItem(LOCAL_DELETED_SALES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function getLocalSales(): ShopSale[] {
  const deletedIds = getDeletedSaleIds();
  try {
    const raw = localStorage.getItem(LOCAL_SALES_KEY);
    const list: ShopSale[] = raw ? JSON.parse(raw) : SAMPLE_SALES;
    return list.filter((s) => !deletedIds.has(s.id));
  } catch {
    return SAMPLE_SALES.filter((s) => !deletedIds.has(s.id));
  }
}

export function saveLocalSales(sales: ShopSale[]) {
  const deletedIds = getDeletedSaleIds();
  const cleanList = sales.filter((s) => !deletedIds.has(s.id));
  try {
    localStorage.setItem(LOCAL_SALES_KEY, JSON.stringify(cleanList));
  } catch {}
}

function getSalePath(userId?: string): string {
  const address = getStoreAddress(userId);
  return `apps/bakikhata/stores/${address}/sales`;
}

export function subscribeShopSales(userId: string | undefined, callback: (sales: ShopSale[]) => void) {
  const local = getLocalSales();
  callback(local);

  const salePath = getSalePath(userId);
  const salesRef = ref(database, salePath);

  const unsubscribe = onValue(
    salesRef,
    (snapshot) => {
      const deletedIds = getDeletedSaleIds();
      if (!snapshot.exists()) {
        const initial = getLocalSales();
        if (initial.length > 0) {
          const initialMap = initial.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
          set(salesRef, initialMap).catch(() => {});
        }
        callback(initial);
      } else {
        const val = snapshot.val();
        if (val) {
          const list: ShopSale[] = Object.values(val);
          const filtered = list.filter((s) => !deletedIds.has(s.id));
          filtered.sort((a, b) => b.timestamp - a.timestamp);
          saveLocalSales(filtered);
          callback(filtered);
        } else {
          callback([]);
          saveLocalSales([]);
        }
      }
    },
    (err) => {
      console.warn('Firebase sales subscribe notice:', err);
      callback(getLocalSales());
    }
  );

  return () => {
    unsubscribe();
  };
}

export async function addShopSaleToDb(
  userId: string | undefined,
  saleData: Omit<ShopSale, 'id' | 'timestamp'> & { timestamp?: number }
): Promise<ShopSale> {
  const newId = `sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newSale: ShopSale = {
    ...saleData,
    id: newId,
    timestamp: saleData.timestamp || Date.now(),
  };

  const current = getLocalSales();
  const updated = [newSale, ...current];
  saveLocalSales(updated);

  try {
    const salePath = getSalePath(userId);
    const saleRef = ref(database, `${salePath}/${newId}`);
    set(saleRef, newSale).catch((err) => console.warn('Firebase sale add background notice:', err));
  } catch (err) {
    console.warn('Firebase sale save background error:', err);
  }

  return newSale;
}

export async function deleteShopSaleFromDb(userId: string | undefined, saleId: string): Promise<ShopSale[]> {
  // Permanently record as deleted so it never resurrects
  recordDeletedSaleId(saleId);

  const current = getLocalSales();
  const updated = current.filter((s) => s.id !== saleId);
  saveLocalSales(updated);

  try {
    const salePath = getSalePath(userId);
    const saleRef = ref(database, `${salePath}/${saleId}`);
    set(saleRef, null).catch((err) => console.warn('Firebase sale delete background notice:', err));
  } catch (err) {
    console.warn('Firebase sale delete background error:', err);
  }

  return updated;
}
