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
      <div className="space-y-5">
        <div className="text-center pb-4 border-b border-border/50">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-1">Financial Summary</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Revenue */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/40 cursor-default animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/15">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(revenue)}</p>
          </div>

          {/* COGS */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10 hover:scale-[1.02] hover:border-destructive/40 cursor-default animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Cost of Goods Sold</span>
              <span className="text-xs font-semibold text-destructive/80 bg-destructive/10 px-2 py-1 rounded-full">{formatPercent(cogsPercent)}</span>
            </div>
            <p className="text-xl font-bold text-destructive/90">{formatCurrency(cogs)}</p>
            <div className="mt-3 h-2 bg-background/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-destructive/60 to-destructive/80 transition-all duration-500 rounded-full"
                style={{ width: `${cogsPercent}%` }}
              />
            </div>
          </div>

          {/* Profit */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-profit/5 to-profit/15 border border-profit/25 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-profit/10 hover:scale-[1.02] hover:border-profit/40 cursor-default animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-profit/15">
                  <TrendingUp className="w-4 h-4 text-profit" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Net Profit</span>
              </div>
              <div className="flex items-center gap-1 text-profit bg-profit/10 px-2 py-1 rounded-full">
                <Percent className="w-3 h-3" />
                <span className="text-xs font-semibold">{formatPercent(profitMargin)}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-profit">{formatCurrency(profit)}</p>
            <div className="mt-3 h-2 bg-background/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-profit/70 to-profit transition-all duration-500 rounded-full"
                style={{ width: `${profitMargin}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visual breakdown */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-3">Revenue Composition</p>
          <div className="h-10 rounded-xl overflow-hidden flex shadow-inner bg-muted/30">
            <div 
              className="bg-gradient-to-r from-destructive/50 to-destructive/70 flex items-center justify-center text-xs font-semibold text-destructive-foreground transition-all duration-500"
              style={{ width: `${cogsPercent}%` }}
            >
              {cogsPercent > 15 && 'COGS'}
            </div>
            <div 
              className="bg-gradient-to-r from-profit/80 to-profit flex items-center justify-center text-xs font-semibold text-profit-foreground transition-all duration-500"
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
