import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import CSVUploader from '@/components/CSVUploader';
import KPICards from '@/components/KPICards';
import FilterBar from '@/components/FilterBar';
import FinancialTrends from '@/components/FinancialTrends';
import BrandAnalytics from '@/components/BrandAnalytics';
import SalesmanLeaderboard from '@/components/SalesmanLeaderboard';
import { parseCSV, processTransaction } from '@/utils/csvParser';
import {
  calculateKPIs,
  getMonthlyPerformance,
  getDayOfWeekPerformance,
  getBrandPerformance,
  getModelPerformance,
  getSalesmanPerformance,
} from '@/utils/analytics';
import { ProcessedTransaction, FilterState } from '@/types/sales';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    outlet: 'all',
    brand: 'all',
    salesman: 'all',
  });

  const handleFileUpload = async (file: File) => {
    try {
      toast.loading('Parsing CSV file...');
      const rawData = await parseCSV(file);
      const processedData = rawData.map(processTransaction);
      setTransactions(processedData);
      toast.success(`Successfully loaded ${processedData.length} transactions`);
    } catch (error) {
      toast.error('Failed to parse CSV file. Please check the format.');
      console.error(error);
    }
  };

  // Filter data
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.outlet !== 'all' && t.com_unit !== filters.outlet) return false;
      if (filters.brand !== 'all' && t.inv_desc !== filters.brand) return false;
      if (filters.salesman !== 'all' && t.saleman_cd !== filters.salesman) return false;
      return true;
    });
  }, [transactions, filters]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const outlets = [...new Set(transactions.map((t) => t.com_unit))].sort();
    const brands = [...new Set(transactions.map((t) => t.inv_desc))].sort();
    const salesmen = [...new Set(transactions.map((t) => t.saleman_cd))].sort();
    return { outlets, brands, salesmen };
  }, [transactions]);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (filteredTransactions.length === 0) return null;

    return {
      kpis: calculateKPIs(filteredTransactions),
      monthlyData: getMonthlyPerformance(filteredTransactions),
      dayOfWeekData: getDayOfWeekPerformance(filteredTransactions),
      brandData: getBrandPerformance(filteredTransactions),
      modelData: getModelPerformance(filteredTransactions),
      salesmanData: getSalesmanPerformance(filteredTransactions),
    };
  }, [filteredTransactions]);

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Counter Sales Analytics</h1>
            <p className="text-muted-foreground">
              Upload your CSV file to start analyzing your sales data
            </p>
          </div>
          <CSVUploader onFileUpload={handleFileUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-6 mb-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Counter Sales Analytics</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        outlets={filterOptions.outlets}
        brands={filterOptions.brands}
        salesmen={filterOptions.salesmen}
      />

      <main className="max-w-[1600px] mx-auto px-6 pb-12 space-y-8">
        {analytics && (
          <>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Performance Indicators</h2>
              <KPICards metrics={analytics.kpis} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Financial Trends</h2>
              <FinancialTrends
                monthlyData={analytics.monthlyData}
                dayOfWeekData={analytics.dayOfWeekData}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Product & Brand Intelligence</h2>
              <BrandAnalytics brandData={analytics.brandData} modelData={analytics.modelData} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Staff Performance</h2>
              <SalesmanLeaderboard salesmanData={analytics.salesmanData} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
