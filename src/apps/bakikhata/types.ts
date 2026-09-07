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
  settlesOnTuesday: boolean; // Settles on Tuesday
  preferredSettlementDay?: string; // e.g. 'Tuesday'
  lastActivityAt: number; // timestamp
  createdAt: number; // timestamp
  notes?: string;
}

export interface BakiTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  type: TransactionType; // 'due' (credit/due) or 'payment' (paid)
  category: BakiCategory; // 'cha_pan' | 'mudi' | 'bkash' | 'other'
  bkashType?: BkashType;
  mfsNumber?: string; // MFS or mobile recharge number
  itemsSummary: string; // e.g. "2 Cups Tea, 1 Betel leaf" or "Cash Out ৳1000"
  amount: number;
  paymentMethod?: PaymentMethod;
  note?: string;
  timestamp: number; // exact epoch timestamp
  formattedDate?: string;
  isTuesdaySettlement?: boolean; // Tuesday weekly settlement
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

export type BkashOpType = 'send_money' | 'cash_in' | 'cash_out' | 'fund_load' | 'fund_adjust';

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

export type RechargeOperator = 'gp' | 'bl' | 'robi' | 'airtel' | 'teletalk';

export interface RechargeTransaction {
  id: string;
  operator: RechargeOperator;
  mobileNumber: string;
  rechargeType: 'prepaid' | 'postpaid' | 'skitto';
  amount: number;
  commissionRate: number; // e.g. 3.2%
  profitAmount: number; // amount * commissionRate / 100
  isDue: boolean;
  customerId?: string;
  customerName?: string;
  note?: string;
  timestamp: number;
}
