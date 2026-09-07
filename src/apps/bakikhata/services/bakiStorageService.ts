import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../services/firebase';
import { Customer, BakiTransaction } from '../types';

const LOCAL_CUSTOMERS_KEY = 'bakikhata_customers_cache';
const LOCAL_TRANSACTIONS_KEY = 'bakikhata_tx_cache';

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

export function getLocalData(): { customers: Customer[]; transactions: BakiTransaction[] } {
  try {
    const rawCust = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    const rawTx = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
    const customers = rawCust ? JSON.parse(rawCust) : SAMPLE_CUSTOMERS;
    const transactions = rawTx ? JSON.parse(rawTx) : SAMPLE_TRANSACTIONS;
    return { customers, transactions };
  } catch {
    return { customers: SAMPLE_CUSTOMERS, transactions: SAMPLE_TRANSACTIONS };
  }
}

export function saveLocalData(customers: Customer[], transactions: BakiTransaction[]) {
  try {
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Local save error:', err);
  }
}

function getBasePath(userId?: string): string {
  return userId ? `apps/bakikhata/${userId}` : `apps/bakikhata/general`;
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
        // Seed default sample data into Firebase for this user if first time
        const initial = {
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
        const custList: Customer[] = val.customers ? Object.values(val.customers) : [];
        const txList: BakiTransaction[] = val.transactions ? Object.values(val.transactions) : [];
        // Sort transactions latest first
        txList.sort((a, b) => b.timestamp - a.timestamp);
        callback({ customers: custList, transactions: txList });
        saveLocalData(custList, txList);
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

  const basePath = getBasePath(userId);
  const custRef = ref(database, `${basePath}/customers/${newId}`);
  await set(custRef, newCustomer);

  // Update local
  const { customers, transactions } = getLocalData();
  saveLocalData([newCustomer, ...customers], transactions);

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

  const isDue = newTx.type === 'due';
  const updatedTotalDue = isDue
    ? Math.max(0, (customer.totalDue || 0) + newTx.amount)
    : Math.max(0, (customer.totalDue || 0) - newTx.amount);

  const updatedTotalPaid = !isDue
    ? (customer.totalPaid || 0) + newTx.amount
    : (customer.totalPaid || 0);

  const updatedCustomer: Customer = {
    ...customer,
    totalDue: updatedTotalDue,
    totalPaid: updatedTotalPaid,
    lastActivityAt: exactTime,
  };

  const basePath = getBasePath(userId);
  const txRef = ref(database, `${basePath}/transactions/${newId}`);
  const custRef = ref(database, `${basePath}/customers/${customer.id}`);

  await Promise.all([set(txRef, newTx), set(custRef, updatedCustomer)]);

  // Update local
  const { customers, transactions } = getLocalData();
  const updatedCusts = customers.map((c) => (c.id === customer.id ? updatedCustomer : c));
  saveLocalData(updatedCusts, [newTx, ...transactions]);

  return newTx;
}

export async function deleteCustomerFromDb(
  userId: string | undefined,
  customerId: string
): Promise<void> {
  const basePath = getBasePath(userId);
  const custRef = ref(database, `${basePath}/customers/${customerId}`);
  await set(custRef, null);

  const { customers, transactions } = getLocalData();
  const filteredCusts = customers.filter((c) => c.id !== customerId);
  saveLocalData(filteredCusts, transactions);
}
