import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDataPoint } from '@/types/sales';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface FinancialTrendsProps {
  monthlyData: ChartDataPoint[];
  dayOfWeekData: ChartDataPoint[];
}

const FinancialTrends = ({ monthlyData, dayOfWeekData }: FinancialTrendsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Single month breakdown view
  const SingleMonthView = () => {
    const data = monthlyData[0];
    const revenue = data.revenue || 0;
    const profit = data.profit || 0;
    const cogs = revenue - profit;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const cogsPercent = revenue > 0 ? (cogs / revenue) * 100 : 0;

    return (
      <div className="space-y-4">
        <div className="text-center pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Period: {data.name}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Revenue */}
          <div className="p-4 rounded-lg bg-revenue/10 border border-revenue/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-revenue" />
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-revenue">{formatCurrency(revenue)}</p>
          </div>

          {/* COGS */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Cost of Goods Sold</span>
              <span className="text-xs font-medium text-muted-foreground">{formatPercent(cogsPercent)} of revenue</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(cogs)}</p>
            <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-muted-foreground/40 transition-all duration-500"
                style={{ width: `${cogsPercent}%` }}
              />
            </div>
          </div>

          {/* Profit */}
          <div className="p-4 rounded-lg bg-profit/10 border border-profit/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                <span className="text-sm font-medium text-muted-foreground">Net Profit</span>
              </div>
              <div className="flex items-center gap-1 text-profit">
                <Percent className="w-4 h-4" />
                <span className="text-sm font-semibold">{formatPercent(profitMargin)}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-profit">{formatCurrency(profit)}</p>
            <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-profit transition-all duration-500"
                style={{ width: `${profitMargin}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visual breakdown */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Revenue Composition</p>
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div 
              className="bg-muted-foreground/40 flex items-center justify-center text-xs font-medium text-foreground transition-all duration-500"
              style={{ width: `${cogsPercent}%` }}
            >
              {cogsPercent > 15 && 'COGS'}
            </div>
            <div 
              className="bg-profit flex items-center justify-center text-xs font-medium text-background transition-all duration-500"
              style={{ width: `${profitMargin}%` }}
            >
              {profitMargin > 15 && 'Profit'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Few months grouped bar view
  const FewMonthsView = () => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--foreground))"
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          stroke="hsl(var(--foreground))" 
          tickFormatter={formatCurrency}
          fontSize={11}
          width={90}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Bar dataKey="revenue" fill="hsl(var(--revenue))" name="Revenue" maxBarSize={60} />
        <Bar dataKey="profit" fill="hsl(var(--profit))" name="Profit" maxBarSize={60} />
      </BarChart>
    </ResponsiveContainer>
  );

  // Multi-month composed chart view
  const MultiMonthView = () => (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--foreground))"
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          stroke="hsl(var(--foreground))" 
          tickFormatter={formatCurrency}
          fontSize={11}
          width={90}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Bar dataKey="revenue" fill="hsl(var(--revenue))" name="Revenue" maxBarSize={80} />
        <Line type="monotone" dataKey="profit" stroke="hsl(var(--profit))" strokeWidth={2} name="Profit" />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const dataPointCount = monthlyData.length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>
            {dataPointCount === 1 
              ? 'Financial breakdown for selected period'
              : 'Revenue vs Profit trends over time'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              {dataPointCount === 1 ? (
                <SingleMonthView />
              ) : dataPointCount <= 3 ? (
                <FewMonthsView />
              ) : (
                <MultiMonthView />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Day of Week Performance</CardTitle>
          <CardDescription>Revenue distribution across weekdays</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dayOfWeekData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))" 
                    tickFormatter={formatCurrency}
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Revenue" maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTrends;
