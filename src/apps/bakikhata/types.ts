export type BakiCategory = 'cha_pan' | 'mudi' | 'bkash' | 'other';

export type BkashType = 'cash_in' | 'cash_out' | 'send_money' | 'payment' | 'recharge' | 'none';

export type TransactionType = 'due' | 'payment';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'other';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalDue: number;
  totalPaid: number;
  settlesOnTuesday: boolean; // মঙ্গলবার পরিশোধ করে কি না
  preferredSettlementDay?: string; // e.g. 'মঙ্গলবার'
  lastActivityAt: number; // timestamp
  createdAt: number; // timestamp
  notes?: string;
}

export interface BakiTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  type: TransactionType; // 'due' (বাকি) or 'payment' (পরিশোধ)
  category: BakiCategory; // 'cha_pan' | 'mudi' | 'bkash' | 'other'
  bkashType?: BkashType;
  mfsNumber?: string; // বিকাশ বা মোবাইল রিচার্জ নম্বর
  itemsSummary: string; // যেমন: "২ কাপ দুধ চা, ১টি পান" অথবা "বিকাশ ক্যাশ আউট ৳১০০০"
  amount: number;
  paymentMethod?: PaymentMethod;
  note?: string;
  timestamp: number; // exact epoch timestamp
  formattedDate?: string;
  isTuesdaySettlement?: boolean; // মঙ্গলবারের বকেয়া পরিশোধ
  createdBy?: string;
}

export interface BakiStats {
  totalCustomers: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  tuesdayDueAmount: number;
  tuesdayCustomerCount: number;
  bkashDueAmount: number;
  chaPanDueAmount: number;
  mudiDueAmount: number;
}

export interface BkashFund {
  currentBalance: number;
  totalCashInSent: number;
  totalCashOutReceived: number;
  totalSendMoneySent: number;
  totalRechargeSent: number;
  lastUpdated: number;
}

export type BkashOpType = 'recharge' | 'send_money' | 'cash_in' | 'cash_out' | 'fund_load' | 'fund_adjust';

export interface BkashTransactionRecord {
  id: string;
  type: BkashOpType;
  amount: number;
  targetNumber?: string;
  simOperator?: string;
  customerId?: string;
  customerName?: string;
  isDue: boolean;
  commission?: number;
  balanceBefore: number;
  balanceAfter: number;
  note?: string;
  timestamp: number;
}
