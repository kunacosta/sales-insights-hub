import { ProcessedTransaction, KPIMetrics, BrandPerformance, ModelPerformance, SalesmanPerformance, ChartDataPoint } from '@/types/sales';

export const calculateKPIs = (transactions: ProcessedTransaction[]): KPIMetrics => {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
  const totalNetProfit = transactions.reduce((sum, t) => sum + t.netProfit, 0);
  const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
  
  const uniqueTransactions = new Set(transactions.map(t => t.trx_no)).size;
  const avgTransactionValue = uniqueTransactions > 0 ? totalRevenue / uniqueTransactions : 0;
  
  const returnQty = Math.abs(transactions.filter(t => t.line_code === 'R').reduce((sum, t) => sum + t.quantity, 0));
  const positiveQty = transactions.filter(t => t.line_code === '1').reduce((sum, t) => sum + t.quantity, 0);
  const returnRate = positiveQty > 0 ? (returnQty / positiveQty) * 100 : 0;
  
  return {
    totalRevenue,
    totalNetProfit,
    totalCost,
    avgTransactionValue,
    returnRate,
  };
};

export const getMonthlyPerformance = (transactions: ProcessedTransaction[]): ChartDataPoint[] => {
  const monthlyData = transactions.reduce((acc, t) => {
    if (!acc[t.month]) {
      acc[t.month] = { revenue: 0, profit: 0 };
    }
    acc[t.month].revenue += t.revenue;
    acc[t.month].profit += t.netProfit;
    return acc;
  }, {} as Record<string, { revenue: number; profit: number }>);
  
  return Object.entries(monthlyData)
    .map(([name, data]) => ({
      name,
      revenue: Math.round(data.revenue),
      profit: Math.round(data.profit),
    }))
    .sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });
};

export const getDayOfWeekPerformance = (transactions: ProcessedTransaction[]): ChartDataPoint[] => {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const dayData = transactions.reduce((acc, t) => {
    if (!acc[t.dayOfWeek]) {
      acc[t.dayOfWeek] = 0;
    }
    acc[t.dayOfWeek] += t.revenue;
    return acc;
  }, {} as Record<string, number>);
  
  return dayOrder.map(day => ({
    name: day,
    value: Math.round(dayData[day] || 0),
  }));
};

export const getBrandPerformance = (transactions: ProcessedTransaction[]): BrandPerformance[] => {
  const brandData = transactions.reduce((acc, t) => {
    if (!acc[t.inv_desc]) {
      acc[t.inv_desc] = { revenue: 0, profit: 0, returns: 0, sales: 0 };
    }
    acc[t.inv_desc].revenue += t.revenue;
    acc[t.inv_desc].profit += t.netProfit;
    if (t.line_code === 'R') {
      acc[t.inv_desc].returns += Math.abs(t.quantity);
    } else if (t.line_code === '1') {
      acc[t.inv_desc].sales += t.quantity;
    }
    return acc;
  }, {} as Record<string, { revenue: number; profit: number; returns: number; sales: number }>);
  
  return Object.entries(brandData)
    .map(([brand, data]) => ({
      brand,
      revenue: data.revenue,
      profit: data.profit,
      returnRate: data.sales > 0 ? (data.returns / data.sales) * 100 : 0,
      salesCount: data.sales,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const getModelPerformance = (transactions: ProcessedTransaction[]): ModelPerformance[] => {
  const modelData = transactions.reduce((acc, t) => {
    if (!acc[t.inv_cd]) {
      acc[t.inv_cd] = { brand: t.inv_desc, revenue: 0, cost: 0 };
    }
    acc[t.inv_cd].revenue += t.revenue;
    acc[t.inv_cd].cost += t.cost;
    return acc;
  }, {} as Record<string, { brand: string; revenue: number; cost: number }>);
  
  return Object.entries(modelData)
    .map(([model, data]) => ({
      model,
      brand: data.brand,
      revenue: data.revenue,
      cost: data.cost,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 10);
};

export const getSalesmanPerformance = (transactions: ProcessedTransaction[]): SalesmanPerformance[] => {
  const salesmanData = transactions.reduce((acc, t) => {
    if (!acc[t.saleman_cd]) {
      acc[t.saleman_cd] = { revenue: 0, profit: 0, transactions: new Set() };
    }
    acc[t.saleman_cd].revenue += t.revenue;
    acc[t.saleman_cd].profit += t.netProfit;
    acc[t.saleman_cd].transactions.add(t.trx_no);
    return acc;
  }, {} as Record<string, { revenue: number; profit: number; transactions: Set<string> }>);
  
  return Object.entries(salesmanData)
    .map(([salesman, data]) => ({
      salesman,
      revenue: data.revenue,
      profit: data.profit,
      transactions: data.transactions.size,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};
