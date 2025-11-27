import { KPIMetrics } from '@/types/sales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Package, CreditCard, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  metrics: KPIMetrics;
}

const KPICards = ({ metrics }: KPICardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const kpiData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'text-revenue',
      bgColor: 'bg-revenue/10',
    },
    {
      title: 'Total Net Profit',
      value: formatCurrency(metrics.totalNetProfit),
      icon: TrendingUp,
      color: 'text-profit',
      bgColor: 'bg-profit/10',
    },
    {
      title: 'Total Cost (COGS)',
      value: formatCurrency(metrics.totalCost),
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Avg Transaction Value',
      value: formatCurrency(metrics.avgTransactionValue),
      icon: CreditCard,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Return Rate',
      value: `${metrics.returnRate.toFixed(2)}%`,
      icon: AlertTriangle,
      color: 'text-alert',
      bgColor: 'bg-alert/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${kpi.color} break-words`}>{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
