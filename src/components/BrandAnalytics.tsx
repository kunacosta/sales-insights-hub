import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrandPerformance, ModelPerformance } from '@/types/sales';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BrandAnalyticsProps {
  brandData: BrandPerformance[];
  modelData: ModelPerformance[];
}

const BrandAnalytics = ({ brandData, modelData }: BrandAnalyticsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const top10Brands = brandData.slice(0, 10);
  const highReturnBrands = brandData
    .filter((b) => b.salesCount >= 10)
    .sort((a, b) => b.returnRate - a.returnRate)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Top 10 Brands by Revenue</CardTitle>
          <CardDescription>Best performing brands in the period</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={top10Brands} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--foreground))" 
                    tickFormatter={formatCurrency}
                    fontSize={12}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="brand" 
                    width={120} 
                    stroke="hsl(var(--foreground))"
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Highest Return Rate Brands</CardTitle>
            <CardDescription>Minimum 10 sales to qualify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Return Rate</TableHead>
                    <TableHead className="text-right">Sales Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highReturnBrands.map((brand) => (
                    <TableRow key={brand.brand}>
                      <TableCell className="font-medium">{brand.brand}</TableCell>
                      <TableCell className="text-right text-alert font-semibold">
                        {brand.returnRate.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{brand.salesCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>High Margin Models</CardTitle>
            <CardDescription>Top 10 models by profit margin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelData.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-medium">{model.model}</TableCell>
                      <TableCell>{model.brand}</TableCell>
                      <TableCell className="text-right text-profit font-semibold">
                        {model.margin.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandAnalytics;
