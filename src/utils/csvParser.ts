import Papa from 'papaparse';
import { SalesTransaction, ProcessedTransaction } from '@/types/sales';

export const parseCSV = (file: File): Promise<SalesTransaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transactions = results.data.map((row: any) => ({
          trx_date: row.trx_date || '',
          inv_cd: row.inv_cd || '',
          trx_no: row.trx_no || '',
          trx_amt: parseFloat(row.trx_amt) || 0,
          trx_qty: parseFloat(row.trx_qty) || 0,
          unit_cost: parseFloat(row.unit_cost) || 0,
          line_code: row.line_code || '',
          inv_desc: row.inv_desc || '',
          com_unit: row.com_unit || '',
          saleman_cd: row.saleman_cd || '',
        }));
        resolve(transactions);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const parseDateString = (dateStr: string): Date => {
  // Format: dd/mm/yyyy
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const getDayOfWeek = (dateStr: string): string => {
  const date = parseDateString(dateStr);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const getMonth = (dateStr: string): string => {
  const date = parseDateString(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const detectDateRange = (transactions: SalesTransaction[]) => {
  if (transactions.length === 0) {
    return {
      startDate: '',
      endDate: '',
      totalDays: 0,
      isMonthly: false,
      displayText: 'No data',
    };
  }

  const dates = transactions
    .map(t => parseDateString(t.trx_date))
    .sort((a, b) => a.getTime() - b.getTime());
  
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Check if it's monthly data (all transactions within same month)
  const isMonthly = startDate.getMonth() === endDate.getMonth() && 
                    startDate.getFullYear() === endDate.getFullYear();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const displayText = isMonthly
    ? `${startDate.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}`
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    totalDays: totalDays + 1,
    isMonthly,
    displayText,
  };
};

export const processTransaction = (transaction: SalesTransaction): ProcessedTransaction => {
  let revenue = transaction.trx_amt;
  let quantity = transaction.trx_qty;
  let cost = transaction.unit_cost * transaction.trx_qty;
  
  // Apply business logic based on line_code
  switch (transaction.line_code) {
    case '0': // Free of Charge
      revenue = 0;
      cost = transaction.unit_cost * Math.abs(transaction.trx_qty);
      break;
    case 'R': // Return/Refund
      revenue = -Math.abs(transaction.trx_amt);
      quantity = -Math.abs(transaction.trx_qty);
      cost = -(transaction.unit_cost * Math.abs(transaction.trx_qty));
      break;
    case '1': // Normal Sale
    default:
      revenue = Math.abs(transaction.trx_amt);
      quantity = Math.abs(transaction.trx_qty);
      cost = transaction.unit_cost * Math.abs(transaction.trx_qty);
      break;
  }
  
  const netProfit = revenue - cost;
  
  return {
    ...transaction,
    revenue,
    cost,
    netProfit,
    quantity,
    dayOfWeek: getDayOfWeek(transaction.trx_date),
    month: getMonth(transaction.trx_date),
  };
};
