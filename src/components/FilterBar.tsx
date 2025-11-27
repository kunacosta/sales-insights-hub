import { FilterState } from '@/types/sales';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  outlets: string[];
  brands: string[];
  salesmen: string[];
}

const FilterBar = ({ filters, onFilterChange, outlets, brands, salesmen }: FilterBarProps) => {
  const clearFilters = () => {
    onFilterChange({ 
      outlet: 'all', 
      brand: 'all', 
      salesman: 'all',
      dateFrom: null,
      dateTo: null,
      brandSort: 'all',
      productSort: 'all'
    });
  };

  const hasActiveFilters = 
    filters.outlet !== 'all' || 
    filters.brand !== 'all' || 
    filters.salesman !== 'all' ||
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.brandSort !== 'all' ||
    filters.productSort !== 'all';

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border p-4 mb-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Select value={filters.outlet} onValueChange={(value) => onFilterChange({ ...filters, outlet: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outlets</SelectItem>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet} value={outlet}>
                    {outlet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={filters.brand} onValueChange={(value) => onFilterChange({ ...filters, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={filters.salesman} onValueChange={(value) => onFilterChange({ ...filters, salesman: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Salesman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Salesmen</SelectItem>
                {salesmen.map((salesman) => (
                  <SelectItem key={salesman} value={salesman}>
                    {salesman}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, 'PPP') : <span>From Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom || undefined}
                  onSelect={(date) => onFilterChange({ ...filters, dateFrom: date || null })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, 'PPP') : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo || undefined}
                  onSelect={(date) => onFilterChange({ ...filters, dateTo: date || null })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={filters.brandSort} onValueChange={(value: 'best' | 'worst' | 'all') => onFilterChange({ ...filters, brandSort: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Brand Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="best">Best Performers</SelectItem>
                <SelectItem value="worst">Worst Performers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={filters.productSort} onValueChange={(value: 'best' | 'worst' | 'all') => onFilterChange({ ...filters, productSort: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Product Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="best">Best Performers</SelectItem>
                <SelectItem value="worst">Worst Performers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
