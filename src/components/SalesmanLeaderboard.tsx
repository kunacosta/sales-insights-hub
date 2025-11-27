import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SalesmanPerformance } from '@/types/sales';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SalesmanLeaderboardProps {
  salesmanData: SalesmanPerformance[];
}

const SalesmanLeaderboard = ({ salesmanData }: SalesmanLeaderboardProps) => {
  const [sortBy, setSortBy] = useState<'revenue' | 'profit'>('revenue');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const sortedData = [...salesmanData].sort((a, b) => {
    if (sortBy === 'revenue') {
      return b.revenue - a.revenue;
    }
    return b.profit - a.profit;
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Salesman Leaderboard</CardTitle>
        <CardDescription>Performance ranking by revenue and profit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={sortBy === 'revenue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('revenue')}
          >
            Sort by Revenue
          </Button>
          <Button
            variant={sortBy === 'profit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('profit')}
          >
            Sort by Profit
          </Button>
        </div>
        <div className="overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Salesman</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSortBy('revenue')}>
                    Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSortBy('profit')}>
                    Profit <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((salesman, index) => (
                <TableRow key={salesman.salesman}>
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell className="font-medium">{salesman.salesman}</TableCell>
                  <TableCell className="text-right text-revenue font-semibold">
                    {formatCurrency(salesman.revenue)}
                  </TableCell>
                  <TableCell className="text-right text-profit font-semibold">
                    {formatCurrency(salesman.profit)}
                  </TableCell>
                  <TableCell className="text-right">{salesman.transactions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesmanLeaderboard;
