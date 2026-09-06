import { Customer, BakiTransaction } from '../types';

export const exportCustomersToCsv = (customers: Customer[]) => {
  const headers = ['আইডি', 'গ্রাহকের নাম', 'ফোন নম্বর', 'ঠিকানা', 'বর্তমান বাকি (৳)', 'পরিশোধিত টাকা (৳)', 'মঙ্গলবার পরিশোধ'];
  const rows = customers.map((c) => [
    c.id,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone || ''}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    c.totalDue,
    c.totalPaid,
    c.settlesOnTuesday ? 'হ্যাঁ' : 'না',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bakir_khata_customers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTransactionsToCsv = (transactions: BakiTransaction[]) => {
  const headers = ['আইডি', 'তারিখ ও সময়', 'গ্রাহকের নাম', 'ধরন', 'বিবরণ', 'ক্যাটাগরি', 'পরিমাণ (৳)', 'পেমেন্ট মেথড'];
  const rows = transactions.map((t) => [
    t.id,
    `"${new Date(t.timestamp).toLocaleString('bn-BD')}"`,
    `"${t.customerName.replace(/"/g, '""')}"`,
    t.type === 'due' ? 'বাকি' : 'জমা',
    `"${(t.itemsSummary || '').replace(/"/g, '""')}"`,
    t.category,
    t.amount,
    t.paymentMethod || 'ক্যাশ',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bakir_khata_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
