import { Customer, BakiTransaction } from '../types';

export const exportCustomersToCsv = (customers: Customer[]) => {
  const headers = ['ID', 'Customer Name', 'Phone Number', 'Address', 'Current Due (৳)', 'Total Paid (৳)', 'Tuesday Settlement'];
  const rows = customers.map((c) => [
    c.id,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone || ''}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    c.totalDue,
    c.totalPaid,
    c.settlesOnTuesday ? 'Yes' : 'No',
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
  const headers = ['ID', 'Date & Time', 'Customer Name', 'Type', 'Description', 'Category', 'Amount (৳)', 'Payment Method'];
  const rows = transactions.map((t) => [
    t.id,
    `"${new Date(t.timestamp).toLocaleString('bn-BD')}"`,
    `"${t.customerName.replace(/"/g, '""')}"`,
    t.type === 'due' ? 'Due' : 'Payment',
    `"${(t.itemsSummary || '').replace(/"/g, '""')}"`,
    t.category,
    t.amount,
    t.paymentMethod || 'Cash',
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
