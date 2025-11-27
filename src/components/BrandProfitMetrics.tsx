import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrandPerformance } from '@/types/sales';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BrandProfitMetricsProps {
  brandData: BrandPerformance[];
}

const BrandProfitMetrics = ({ brandData }: BrandProfitMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const top10Brands = brandData.slice(0, 10);

  const chartData = top10Brands.map(brand => ({
    name: brand.brand.length > 15 ? brand.brand.substring(0, 15) + '...' : brand.brand,
    fullName: brand.brand,
    profit: Math.round(brand.profit),
    cogs: Math.round(brand.cogs),
    profitMargin: brand.profitMargin,
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Brand Profit Analysis</CardTitle>
          <CardDescription>Profit and COGS comparison for top brands</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))" 
                    tickFormatter={formatCurrency}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'profitMargin') {
                        return [`${value.toFixed(2)}%`, 'Profit Margin'];
                      }
                      return [formatCurrency(value), name === 'profit' ? 'Net Profit' : 'COGS'];
                    }}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="profit" fill="hsl(var(--chart-2))" name="Net Profit" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cogs" fill="hsl(var(--chart-5))" name="COGS" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Detailed Brand Metrics</CardTitle>
          <CardDescription>Complete profit breakdown by brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">COGS</TableHead>
                  <TableHead className="text-right">Profit Margin</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandData.map((brand) => (
                  <TableRow key={brand.brand}>
                    <TableCell className="font-medium">{brand.brand}</TableCell>
                    <TableCell className="text-right text-profit font-semibold">
                      {formatCurrency(brand.profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(brand.cogs)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <span className={brand.profitMargin > 30 ? 'text-profit' : brand.profitMargin < 10 ? 'text-alert' : ''}>
                        {brand.profitMargin.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(brand.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandProfitMetrics;
