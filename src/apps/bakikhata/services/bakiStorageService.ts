import { ref, onValue, set, get } from 'firebase/database';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { database, firestoreDb } from '../../../services/firebase';
import { Customer, BakiTransaction, CallingLog, StoreSyncMeta } from '../types';

const withTimeout = <T>(promise: Promise<T>, ms = 6000, fallbackMsg = 'Network timeout'): Promise<T> => {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(fallbackMsg)), ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]);
};

const LOCAL_CUSTOMERS_KEY = 'bakikhata_customers_cache';
const LOCAL_TRANSACTIONS_KEY = 'bakikhata_tx_cache';
const LOCAL_CALLING_LOGS_KEY = 'bakikhata_calling_logs_cache';
const LOCAL_DELETED_CUSTOMERS_KEY = 'bakikhata_deleted_cust_ids';

export function getDeletedCustomerIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_CUSTOMERS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function recordDeletedCustomerId(id: string) {
  try {
    const set = getDeletedCustomerIds();
    set.add(id);
    localStorage.setItem(LOCAL_DELETED_CUSTOMERS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Rafiqul Islam (Tailor)',
    phone: '01711223344',
    address: 'Opposite Shop, 2nd Floor',
    totalDue: 480,
    totalPaid: 1200,
    settlesOnTuesday: true,
    preferredSettlementDay: 'Tuesday',
    lastActivityAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    notes: 'Settles entire balance every Tuesday afternoon',
  },
  {
    id: 'cust_2',
    name: 'Karim Bhai (Transport)',
    phone: '01822334455',
    address: 'Lake Side Garage',
    totalDue: 180,
    totalPaid: 650,
    settlesOnTuesday: true,
    preferredSettlementDay: 'Tuesday',
    lastActivityAt: Date.now() - 1000 * 60 * 120, // 2 hours ago
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    notes: 'Regular tea & paan customer, settles weekly on Tuesdays',
  },
  {
    id: 'cust_3',
    name: 'Master Anwar Hossain',
    phone: '01933445566',
    address: 'Govt Primary School Quarters',
    totalDue: 1250,
    totalPaid: 4500,
    settlesOnTuesday: false,
    preferredSettlementDay: '1st of the month',
    lastActivityAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    notes: 'Monthly grocery credit customer',
  },
];

const SAMPLE_TRANSACTIONS: BakiTransaction[] = [
  // Rafiqul Islam (310 + 50 + 120 = 480)
  {
    id: 'tx_1_init',
    customerId: 'cust_1',
    customerName: 'Rafiqul Islam (Tailor)',
    customerPhone: '01711223344',
    type: 'due',
    category: 'mudi',
    itemsSummary: 'পূর্বের বকেয়া বাকি (Previous Balance)',
    amount: 310,
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'tx_1',
    customerId: 'cust_1',
    customerName: 'Rafiqul Islam (Tailor)',
    customerPhone: '01711223344',
    type: 'due',
    category: 'cha_pan',
    itemsSummary: '2 cups special milk tea, 1 sweet paan',
    amount: 50,
    timestamp: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 'tx_2',
    customerId: 'cust_1',
    customerName: 'Rafiqul Islam (Tailor)',
    customerPhone: '01711223344',
    type: 'due',
    category: 'bkash',
    bkashType: 'recharge',
    mfsNumber: '01711223344',
    itemsSummary: 'Bkash mobile recharge (Robi pack)',
    amount: 120,
    timestamp: Date.now() - 1000 * 60 * 180,
  },
  // Karim Bhai (160 + 20 = 180)
  {
    id: 'tx_2_init',
    customerId: 'cust_2',
    customerName: 'Karim Bhai (Transport)',
    customerPhone: '01822334455',
    type: 'due',
    category: 'cha_pan',
    itemsSummary: 'পূর্বের বকেয়া বাকি (Previous Balance)',
    amount: 160,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'tx_3',
    customerId: 'cust_2',
    customerName: 'Karim Bhai (Transport)',
    customerPhone: '01822334455',
    type: 'due',
    category: 'cha_pan',
    itemsSummary: '1 cup black tea, 1 paan',
    amount: 20,
    timestamp: Date.now() - 1000 * 60 * 120,
  },
  // Master Anwar Hossain (870 + 380 = 1250)
  {
    id: 'tx_3_init',
    customerId: 'cust_3',
    customerName: 'Master Anwar Hossain',
    customerPhone: '01933445566',
    type: 'due',
    category: 'mudi',
    itemsSummary: 'পূর্বের মুদি বকেয়া বাকি (Previous Balance)',
    amount: 870,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'tx_4',
    customerId: 'cust_3',
    customerName: 'Master Anwar Hossain',
    customerPhone: '01933445566',
    type: 'due',
    category: 'mudi',
    itemsSummary: '1L Soybean oil, 1kg Sugar, 4 Eggs',
    amount: 380,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export function reconcileCustomersWithTransactions(
  customers: Customer[],
  transactions: BakiTransaction[]
): Customer[] {
  const deletedIds = getDeletedCustomerIds();
  const nonDeletedCustomers = customers.filter((c) => !deletedIds.has(c.id));
  const nonDeletedTransactions = transactions.filter((t) => !deletedIds.has(t.customerId));

  // Map customer balances calculated directly from all transactions
  const txByCust = new Map<
    string,
    { dueSum: number; paidSum: number; hasTx: boolean; lastActivity: number }
  >();

  nonDeletedTransactions.forEach((t) => {
    if (!t.customerId) return;
    const existing = txByCust.get(t.customerId) || {
      dueSum: 0,
      paidSum: 0,
      hasTx: false,
      lastActivity: 0,
    };
    existing.hasTx = true;
    const amt = Number(t.amount) || 0;
    if (t.type === 'due') {
      existing.dueSum += amt;
    } else if (t.type === 'payment') {
      existing.paidSum += amt;
    }
    if (t.timestamp && t.timestamp > existing.lastActivity) {
      existing.lastActivity = t.timestamp;
    }
    txByCust.set(t.customerId, existing);
  });

  return nonDeletedCustomers.map((c) => {
    const txInfo = txByCust.get(c.id);
    if (txInfo && txInfo.hasTx) {
      const netDue = Math.max(0, txInfo.dueSum - txInfo.paidSum);
      // Retain customer's recorded totalPaid if greater (e.g. from previous accounting cycles)
      const netPaid = Math.max(c.totalPaid || 0, txInfo.paidSum);
      return {
        ...c,
        totalDue: netDue,
        totalPaid: netPaid,
        lastActivityAt: Math.max(c.lastActivityAt || 0, txInfo.lastActivity || 0),
      };
    }
    return c;
  });
}

export function getLocalData(): { customers: Customer[]; transactions: BakiTransaction[] } {
  try {
    const deletedIds = getDeletedCustomerIds();
    const rawCust = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    const rawTx = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
    const rawCustList: Customer[] = rawCust ? JSON.parse(rawCust) : SAMPLE_CUSTOMERS;
    const rawTxList: BakiTransaction[] = rawTx ? JSON.parse(rawTx) : SAMPLE_TRANSACTIONS;
    
    const customers = rawCustList.filter((c) => !deletedIds.has(c.id));
    const transactions = rawTxList.filter((t) => !deletedIds.has(t.customerId));
    const reconciledCusts = reconcileCustomersWithTransactions(customers, transactions);
    return { customers: reconciledCusts, transactions };
  } catch {
    const deletedIds = getDeletedCustomerIds();
    const custs = SAMPLE_CUSTOMERS.filter((c) => !deletedIds.has(c.id));
    const txs = SAMPLE_TRANSACTIONS.filter((t) => !deletedIds.has(t.customerId));
    return { customers: custs, transactions: txs };
  }
}

export function saveLocalData(customers: Customer[], transactions: BakiTransaction[]) {
  try {
    const deletedIds = getDeletedCustomerIds();
    const filteredCusts = customers.filter((c) => !deletedIds.has(c.id));
    const filteredTx = transactions.filter((t) => !deletedIds.has(t.customerId));
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(filteredCusts));
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(filteredTx));
  } catch (err) {
    console.error('Local save error:', err);
  }
}

export function generateRandomDeviceId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `BK-${num}`;
}

export function generateRandomPin(): string {
  const pin = Math.floor(1000 + Math.random() * 9000);
  return String(pin);
}

export function getStoreDeviceId(userId?: string): string {
  try {
    const existing = localStorage.getItem('bakikhata_device_id') || localStorage.getItem('bakikhata_store_address');
    if (existing && existing.trim() && !existing.startsWith('default_') && existing.trim().length >= 3) {
      return existing.trim().toUpperCase();
    }
  } catch {}
  const newId = generateRandomDeviceId();
  try {
    localStorage.setItem('bakikhata_device_id', newId);
    localStorage.setItem('bakikhata_store_address', newId);
  } catch {}
  return newId;
}

export function getStorePin(): string {
  try {
    const existingPin = localStorage.getItem('bakikhata_store_pin');
    if (existingPin && existingPin.trim() && existingPin.trim().length >= 4) {
      return existingPin.trim();
    }
  } catch {}
  const newPin = generateRandomPin();
  try {
    localStorage.setItem('bakikhata_store_pin', newPin);
  } catch {}
  return newPin;
}

export function setStoreDeviceCredentials(deviceId: string, pin: string) {
  const cleanId = deviceId.trim().toUpperCase();
  const cleanPin = pin.trim();
  try {
    localStorage.setItem('bakikhata_device_id', cleanId);
    localStorage.setItem('bakikhata_store_address', cleanId);
    localStorage.setItem('bakikhata_store_pin', cleanPin);
  } catch (e) {
    console.error('Error saving store credentials:', e);
  }
}

export function getLocalCallingLogs(): CallingLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_CALLING_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCallingLogs(logs: CallingLog[]) {
  try {
    localStorage.setItem(LOCAL_CALLING_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving calling logs:', err);
  }
}

export async function recordCallingLog(
  userId: string | undefined,
  logData: Omit<CallingLog, 'id' | 'timestamp'>
): Promise<CallingLog> {
  const newLog: CallingLog = {
    ...logData,
    id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  };

  const logs = getLocalCallingLogs();
  saveLocalCallingLogs([newLog, ...logs]);

  try {
    const deviceId = getStoreDeviceId(userId);
    // Sync to RTDB non-blocking
    const basePath = getBasePath(userId);
    const callRef = ref(database, `${basePath}/callingLogs/${newLog.id}`);
    set(callRef, newLog).catch(() => {});

    // Sync to Firestore non-blocking
    const fsDocRef = doc(firestoreDb, 'bakikhata_stores', deviceId);
    getDoc(fsDocRef)
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (d && d.jsonPayload) {
            try {
              const parsed = JSON.parse(d.jsonPayload);
              parsed.callingLogs = parsed.callingLogs || {};
              parsed.callingLogs[newLog.id] = newLog;
              setDoc(fsDocRef, { ...d, jsonPayload: JSON.stringify(parsed), lastSyncAt: Date.now() }).catch(() => {});
            } catch {}
          }
        }
      })
      .catch(() => {});
  } catch (err) {
    console.warn('Calling log sync notice:', err);
  }

  return newLog;
}

export function getStoreAddress(userId?: string): string {
  return getStoreDeviceId(userId);
}

function getBasePath(userId?: string): string {
  const address = getStoreAddress(userId);
  return `apps/bakikhata/stores/${address}`;
}

export async function pushStoreDataToCloud(userId?: string): Promise<{ success: boolean; count: number }> {
  const deviceId = getStoreDeviceId(userId);
  const pin = getStorePin();
  const basePath = `apps/bakikhata/stores/${deviceId}`;

  const { customers, transactions } = getLocalData();
  const callingLogs = getLocalCallingLogs();

  let bkashData: any = null;
  try {
    const rawFund = localStorage.getItem('bakikhata_bkash_fund_cache');
    const rawTx = localStorage.getItem('bakikhata_bkash_tx_cache');
    if (rawFund || rawTx) {
      bkashData = {
        fund: rawFund ? JSON.parse(rawFund) : null,
        transactions: rawTx ? JSON.parse(rawTx).reduce((acc: any, t: any) => ({ ...acc, [t.id]: t }), {}) : null,
      };
    }
  } catch {}

  let rechargesData: any = null;
  try {
    const rawRecharge = localStorage.getItem('bakikhata_recharge_tx_cache');
    if (rawRecharge) {
      const parsed = JSON.parse(rawRecharge);
      rechargesData = parsed.reduce((acc: any, r: any) => ({ ...acc, [r.id]: r }), {});
    }
  } catch {}

  const meta: StoreSyncMeta = {
    deviceId,
    pin,
    createdAt: Date.now(),
    lastSyncAt: Date.now(),
  };

  const payload: any = {
    meta,
    customers: customers.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
    transactions: transactions.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}),
    callingLogs: callingLogs.reduce((acc, l) => ({ ...acc, [l.id]: l }), {}),
  };

  if (bkashData) payload.bkash = bkashData;
  if (rechargesData) payload.recharges = rechargesData;

  // Background RTDB attempt (non-blocking so it never hangs in Brave or offline)
  try {
    const storeRef = ref(database, basePath);
    set(storeRef, payload).catch((err) => console.warn('RTDB backup notice:', err));
  } catch {}

  // Primary: Firestore with strict timeout
  try {
    const fsDocRef = doc(firestoreDb, 'bakikhata_stores', deviceId);
    await withTimeout(
      setDoc(fsDocRef, {
        deviceId,
        pin,
        lastSyncAt: Date.now(),
        customerCount: customers.length,
        jsonPayload: JSON.stringify(payload),
      }),
      6000,
      'ক্লাউড রেসপন্স টাইমআউট'
    );
  } catch (fsErr) {
    console.warn('Firestore primary sync warning:', fsErr);
    // If timeout occurred, ensure local timestamp is updated since RTDB might still finish
  }

  localStorage.setItem('bakikhata_last_cloud_sync', String(Date.now()));
  return { success: true, count: customers.length };
}

export async function connectAndSyncFromCloud(
  deviceIdInput: string,
  pinInput: string
): Promise<{ success: boolean; message: string; customerCount?: number }> {
  const cleanId = deviceIdInput.trim().toUpperCase();
  const cleanPin = pinInput.trim();

  if (!cleanId || !cleanPin) {
    return { success: false, message: 'অনুগ্রহ করে Device ID এবং ৪-ডিজিট পিন দুটোই প্রদান করুন।' };
  }

  try {
    let rawStorePayload: any = null;

    // 1. Try Firestore first
    try {
      const fsSnap = await withTimeout(
        getDoc(doc(firestoreDb, 'bakikhata_stores', cleanId)),
        6000,
        'Firestore read timeout'
      );
      if (fsSnap && fsSnap.exists()) {
        const fsData = fsSnap.data();
        if (fsData && fsData.jsonPayload) {
          rawStorePayload = JSON.parse(fsData.jsonPayload);
        }
      }
    } catch (fsErr) {
      console.warn('Firestore lookup warning, attempting RTDB fallback:', fsErr);
    }

    // 2. Fallback to RTDB if not found in Firestore
    if (!rawStorePayload) {
      try {
        const storeRef = ref(database, `apps/bakikhata/stores/${cleanId}`);
        const rtdbSnap = await withTimeout(get(storeRef), 6000, 'RTDB read timeout');
        if (rtdbSnap && rtdbSnap.exists()) {
          rawStorePayload = rtdbSnap.val();
        }
      } catch (rtdbErr) {
        console.warn('RTDB lookup warning:', rtdbErr);
      }
    }

    if (!rawStorePayload) {
      return {
        success: false,
        message: `এই Device ID (${cleanId}) দিয়ে ক্লাউডে কোনো খাতা পাওয়া যায়নি! মূল মোবাইলে "ক্লাউডে সব ডাটা সেভ / ব্যাকআপ করুন" এ ক্লিক করে ব্যাকআপ নিশ্চিত করুন।`,
      };
    }

    const meta = rawStorePayload.meta || {};

    if (meta.pin && String(meta.pin).trim() !== cleanPin) {
      return {
        success: false,
        message: 'ভুল পিন নম্বর (Incorrect PIN)! অনুগ্রহ করে সঠিক ৪-ডিজিট পিন দিয়ে আবার চেষ্টা করুন।',
      };
    }

    setStoreDeviceCredentials(cleanId, cleanPin);

    const custList: Customer[] = rawStorePayload.customers ? Object.values(rawStorePayload.customers) : [];
    const txList: BakiTransaction[] = rawStorePayload.transactions ? Object.values(rawStorePayload.transactions) : [];
    const callList: CallingLog[] = rawStorePayload.callingLogs ? Object.values(rawStorePayload.callingLogs) : [];

    saveLocalData(custList, txList);
    saveLocalCallingLogs(callList);

    if (rawStorePayload.bkash) {
      const fund = rawStorePayload.bkash.fund;
      const bkashTx = rawStorePayload.bkash.transactions ? Object.values(rawStorePayload.bkash.transactions) : [];
      if (fund) {
        localStorage.setItem('bakikhata_bkash_fund_cache', JSON.stringify(fund));
      }
      localStorage.setItem('bakikhata_bkash_tx_cache', JSON.stringify(bkashTx));
    }

    if (rawStorePayload.recharges) {
      const rechargesList = Object.values(rawStorePayload.recharges);
      localStorage.setItem('bakikhata_recharge_tx_cache', JSON.stringify(rechargesList));
    }

    return {
      success: true,
      message: `কানেকশন সফল! ${custList.length} জন কাস্টমার এবং সমস্ত হিসাব অন্য মোবাইল থেকে লোড হয়েছে।`,
      customerCount: custList.length,
    };
  } catch (err: any) {
    console.error('Connect and sync cloud error:', err);
    return {
      success: false,
      message: err?.message || 'ক্লাউড থেকে ডাটা লোড করতে সমস্যা হয়েছে। ইন্টারনেট চেক করুন।',
    };
  }
}

export function subscribeBakirKhata(
  userId: string | undefined,
  callback: (data: { customers: Customer[]; transactions: BakiTransaction[] }) => void
): () => void {
  // First emit local cache immediately
  const local = getLocalData();
  callback(local);

  const basePath = getBasePath(userId);
  const dataRef = ref(database, basePath);

  const unsubscribe = onValue(
    dataRef,
    async (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        const deviceId = getStoreDeviceId(userId);
        const pin = getStorePin();
        const initial = {
          meta: {
            deviceId,
            pin,
            createdAt: Date.now(),
            lastSyncAt: Date.now(),
          },
          customers: SAMPLE_CUSTOMERS.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
          transactions: SAMPLE_TRANSACTIONS.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}),
        };
        try {
          await set(dataRef, initial);
        } catch {
          // Ignored
        }
        callback({ customers: SAMPLE_CUSTOMERS, transactions: SAMPLE_TRANSACTIONS });
        saveLocalData(SAMPLE_CUSTOMERS, SAMPLE_TRANSACTIONS);
      } else {
        if (!val.meta?.pin) {
          const pin = getStorePin();
          const deviceId = getStoreDeviceId(userId);
          set(ref(database, `${basePath}/meta`), {
            deviceId,
            pin,
            lastSyncAt: Date.now(),
          }).catch(() => {});
        }

        const rawCustList: Customer[] = val.customers ? Object.values(val.customers) : [];
        const txList: BakiTransaction[] = val.transactions ? Object.values(val.transactions) : [];
        // Sort transactions latest first
        txList.sort((a, b) => b.timestamp - a.timestamp);
        const custList = reconcileCustomersWithTransactions(rawCustList, txList);
        callback({ customers: custList, transactions: txList });
        saveLocalData(custList, txList);

        if (val.callingLogs) {
          const callList: CallingLog[] = Object.values(val.callingLogs);
          saveLocalCallingLogs(callList);
        }
      }
    },
    (err) => {
      console.warn('Firebase sync offline, keeping local cache:', err);
    }
  );

  return () => {
    unsubscribe();
  };
}

export async function addCustomerToDb(
  userId: string | undefined,
  customerData: Omit<Customer, 'id' | 'createdAt' | 'lastActivityAt' | 'totalDue' | 'totalPaid'>
): Promise<Customer> {
  const newId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newCustomer: Customer = {
    ...customerData,
    id: newId,
    totalDue: 0,
    totalPaid: 0,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
  };

  // Update local first
  const { customers, transactions } = getLocalData();
  saveLocalData([newCustomer, ...customers], transactions);

  // Try Firebase sync in background (non-blocking)
  try {
    const basePath = getBasePath(userId);
    const custRef = ref(database, `${basePath}/customers/${newId}`);
    set(custRef, newCustomer).catch((err) => console.warn('Firebase customer background sync error:', err));
  } catch (err) {
    console.warn('Firebase customer sync error (saved locally):', err);
  }

  return newCustomer;
}

export async function addTransactionToDb(
  userId: string | undefined,
  customer: Customer,
  txData: Omit<BakiTransaction, 'id' | 'timestamp'> & { timestamp?: number }
): Promise<BakiTransaction> {
  const newId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const exactTime = txData.timestamp || Date.now();

  const newTx: BakiTransaction = {
    ...txData,
    id: newId,
    timestamp: exactTime,
  };

  // Update local with reconciled accurate balances
  const { customers, transactions } = getLocalData();
  const allTransactions = [newTx, ...transactions];
  const reconciledCusts = reconcileCustomersWithTransactions(customers, allTransactions);
  saveLocalData(reconciledCusts, allTransactions);

  const updatedCustomer = reconciledCusts.find((c) => c.id === customer.id) || {
    ...customer,
    totalDue: newTx.type === 'due' ? (customer.totalDue || 0) + newTx.amount : Math.max(0, (customer.totalDue || 0) - newTx.amount),
    totalPaid: newTx.type === 'payment' ? (customer.totalPaid || 0) + newTx.amount : (customer.totalPaid || 0),
    lastActivityAt: exactTime,
  };

  // Try Firebase sync in background (non-blocking)
  try {
    const basePath = getBasePath(userId);
    const txRef = ref(database, `${basePath}/transactions/${newId}`);
    const custRef = ref(database, `${basePath}/customers/${customer.id}`);
    Promise.all([set(txRef, newTx), set(custRef, updatedCustomer)]).catch((err) =>
      console.warn('Firebase transaction background sync error:', err)
    );
  } catch (err) {
    console.warn('Firebase transaction sync error (saved locally):', err);
  }

  return newTx;
}

export async function deleteCustomerFromDb(
  userId: string | undefined,
  customerId: string
): Promise<void> {
  // Mark as permanently deleted so it will never resurrect
  recordDeletedCustomerId(customerId);

  // Update local first
  const { customers, transactions } = getLocalData();
  const custTxToDelete = transactions.filter((t) => t.customerId === customerId);
  const filteredCusts = customers.filter((c) => c.id !== customerId);
  const filteredTx = transactions.filter((t) => t.customerId !== customerId);
  saveLocalData(filteredCusts, filteredTx);

  // Try Firebase sync in background (non-blocking)
  try {
    const basePath = getBasePath(userId);
    const custRef = ref(database, `${basePath}/customers/${customerId}`);
    const deletePromises: Promise<any>[] = [set(custRef, null)];
    custTxToDelete.forEach((t) => {
      deletePromises.push(set(ref(database, `${basePath}/transactions/${t.id}`), null));
    });
    Promise.all(deletePromises).catch((err) => console.warn('Firebase customer delete background error:', err));
  } catch (err) {
    console.warn('Firebase customer delete error (deleted locally):', err);
  }

  // Also trigger cloud push in background to keep Firestore in sync
  try {
    pushStoreDataToCloud(userId).catch(() => {});
  } catch {}
}

export async function updateCustomerInDb(
  userId: string | undefined,
  customer: Customer,
  updatedData: Partial<Customer>
): Promise<Customer> {
  const updatedCustomer: Customer = {
    ...customer,
    ...updatedData,
    lastActivityAt: Date.now(),
  };

  const { customers, transactions } = getLocalData();
  const updatedCusts = customers.map((c) => (c.id === customer.id ? updatedCustomer : c));
  saveLocalData(updatedCusts, transactions);

  try {
    const basePath = getBasePath(userId);
    const custRef = ref(database, `${basePath}/customers/${customer.id}`);
    set(custRef, updatedCustomer).catch((err) => console.warn('Firebase customer update error:', err));
  } catch (err) {
    console.warn('Firebase customer update error (saved locally):', err);
  }

  return updatedCustomer;
}

