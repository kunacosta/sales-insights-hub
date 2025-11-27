export interface SalesTransaction {
  trx_date: string;
  inv_cd: string;
  trx_no: string;
  trx_amt: number;
  trx_qty: number;
  unit_cost: number;
  line_code: string;
  inv_desc: string;
  com_unit: string;
  saleman_cd: string;
}

export interface ProcessedTransaction extends SalesTransaction {
  revenue: number;
  cost: number;
  netProfit: number;
  quantity: number;
  dayOfWeek: string;
  month: string;
}

export interface KPIMetrics {
  totalRevenue: number;
  totalNetProfit: number;
  totalCost: number;
  avgTransactionValue: number;
  returnRate: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  totalDays: number;
  isMonthly: boolean;
  displayText: string;
}

export interface FilterState {
  outlet: string;
  brand: string;
  salesman: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  brandSort: 'best' | 'worst' | 'all';
  productSort: 'best' | 'worst' | 'all';
}

export interface ChartDataPoint {
  name: string;
  revenue?: number;
  profit?: number;
  value?: number;
}

export interface BrandPerformance {
  brand: string;
  revenue: number;
  profit: number;
  cogs: number;
  profitMargin: number;
  returnRate: number;
  salesCount: number;
}

export interface ModelPerformance {
  model: string;
  brand: string;
  revenue: number;
  cost: number;
  margin: number;
}

export interface SalesmanPerformance {
  salesman: string;
  revenue: number;
  profit: number;
  transactions: number;
}
