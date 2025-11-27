import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import CSVUploader from '@/components/CSVUploader';
import KPICards from '@/components/KPICards';
import FilterBar from '@/components/FilterBar';
import FinancialTrends from '@/components/FinancialTrends';
import BrandAnalytics from '@/components/BrandAnalytics';
import BrandProfitMetrics from '@/components/BrandProfitMetrics';
import SalesmanLeaderboard from '@/components/SalesmanLeaderboard';
import DateRangeBadge from '@/components/DateRangeBadge';
import DataQualityDialog from '@/components/DataQualityDialog';
import { Button } from '@/components/ui/button';
import { parseCSV, processTransaction, detectDateRange, parseDateString } from '@/utils/csvParser';
import {
  calculateKPIs,
  getMonthlyPerformance,
  getDayOfWeekPerformance,
  getBrandPerformance,
  getModelPerformance,
  getSalesmanPerformance,
} from '@/utils/analytics';
import { detectBrandInconsistencies, applyBrandFixes, BrandInconsistency } from '@/utils/dataQuality';
import { ProcessedTransaction, FilterState, DateRange } from '@/types/sales';
import { BarChart3, Home } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<ProcessedTransaction[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [pendingDateRange, setPendingDateRange] = useState<DateRange | null>(null);
  const [inconsistencies, setInconsistencies] = useState<BrandInconsistency[]>([]);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    outlet: 'all',
    brand: 'all',
    salesman: 'all',
    dateFrom: null,
    dateTo: null,
    brandSort: 'all',
    productSort: 'all',
  });

  const handleFileUpload = async (file: File) => {
    try {
      toast.loading('Parsing CSV file...');
      const rawData = await parseCSV(file);
      const processedData = rawData.map(processTransaction);
      const detectedDateRange = detectDateRange(rawData);
      
      // Detect brand inconsistencies
      const detected = detectBrandInconsistencies(processedData);
      
      if (detected.length > 0) {
        // Store pending data and show dialog
        setPendingTransactions(processedData);
        setPendingDateRange(detectedDateRange);
        setInconsistencies(detected);
        setShowQualityDialog(true);
        toast.dismiss();
        toast.info(`Found ${detected.length} brand name inconsistencies`);
      } else {
        // No inconsistencies, proceed directly
        setTransactions(processedData);
        setDateRange(detectedDateRange);
        toast.dismiss();
        toast.success(`Successfully loaded ${processedData.length} transactions`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to parse CSV file. Please check the format.');
      console.error(error);
    }
  };

  const handleFixInconsistencies = (selectedIds: string[]) => {
    // Build a mapping of old names to new names
    const fixes = new Map<string, string>();
    inconsistencies
      .filter(i => selectedIds.includes(i.id))
      .forEach(i => {
        i.variants.forEach(v => {
          if (v.name !== i.suggestedName) {
            fixes.set(v.name, i.suggestedName);
          }
        });
      });

    // Apply fixes to transactions
    const fixedTransactions = applyBrandFixes(pendingTransactions, fixes);
    
    setTransactions(fixedTransactions);
    setDateRange(pendingDateRange);
    setShowQualityDialog(false);
    setPendingTransactions([]);
    setPendingDateRange(null);
    setInconsistencies([]);
    
    const fixedCount = fixes.size;
    toast.success(`Fixed ${fixedCount} brand names. Loaded ${fixedTransactions.length} transactions`);
  };

  const handleIgnoreAll = () => {
    // Use original data without fixes
    setTransactions(pendingTransactions);
    setDateRange(pendingDateRange);
    setShowQualityDialog(false);
    setPendingTransactions([]);
    setPendingDateRange(null);
    setInconsistencies([]);
    toast.success(`Loaded ${pendingTransactions.length} transactions`);
  };

  // Filter data
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.outlet !== 'all' && t.com_unit !== filters.outlet) return false;
      if (filters.brand !== 'all' && t.inv_desc !== filters.brand) return false;
      if (filters.salesman !== 'all' && t.saleman_cd !== filters.salesman) return false;
      
      // Date filtering
      if (filters.dateFrom || filters.dateTo) {
        try {
          const transactionDate = parseDateString(t.trx_date);
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (transactionDate < fromDate) return false;
          }
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (transactionDate > toDate) return false;
          }
        } catch (e) {
          // Skip transactions with invalid dates
          return false;
        }
      }
      
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

    let brandData = getBrandPerformance(filteredTransactions);
    let modelData = getModelPerformance(filteredTransactions);

    // Apply brand sorting
    if (filters.brandSort === 'best') {
      brandData = brandData.slice(0, 10);
    } else if (filters.brandSort === 'worst') {
      brandData = brandData.slice(-10).reverse();
    }

    // Apply product sorting
    if (filters.productSort === 'best') {
      modelData = modelData.slice(0, 10);
    } else if (filters.productSort === 'worst') {
      modelData = [...modelData].sort((a, b) => a.margin - b.margin).slice(0, 10);
    }

    return {
      kpis: calculateKPIs(filteredTransactions),
      monthlyData: getMonthlyPerformance(filteredTransactions),
      dayOfWeekData: getDayOfWeekPerformance(filteredTransactions),
      brandData,
      modelData,
      salesmanData: getSalesmanPerformance(filteredTransactions),
    };
  }, [filteredTransactions, filters.brandSort, filters.productSort]);

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
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
    <>
      <DataQualityDialog
        open={showQualityDialog}
        onOpenChange={setShowQualityDialog}
        inconsistencies={inconsistencies}
        onFix={handleFixInconsistencies}
        onIgnoreAll={handleIgnoreAll}
      />
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 sm:p-6 mb-6">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="mr-1">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <BarChart3 className="w-8 h-8 text-primary flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold">Counter Sales Analytics</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>
          {dateRange && <DateRangeBadge dateRange={dateRange} />}
        </div>
      </header>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        outlets={filterOptions.outlets}
        brands={filterOptions.brands}
        salesmen={filterOptions.salesmen}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-12 space-y-8">
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
              <h2 className="text-2xl font-semibold mb-4">Brand Profitability</h2>
              <BrandProfitMetrics brandData={analytics.brandData} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Staff Performance</h2>
              <SalesmanLeaderboard salesmanData={analytics.salesmanData} />
            </section>
          </>
        )}
      </main>
    </div>
    </>
  );
};

export default Dashboard;
