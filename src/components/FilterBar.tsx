import { FilterState } from '@/types/sales';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  outlets: string[];
  brands: string[];
  salesmen: string[];
}

const FilterBar = ({ filters, onFilterChange, outlets, brands, salesmen }: FilterBarProps) => {
  const clearFilters = () => {
    onFilterChange({ outlet: 'all', brand: 'all', salesman: 'all' });
  };

  const hasActiveFilters = filters.outlet !== 'all' || filters.brand !== 'all' || filters.salesman !== 'all';

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border p-4 mb-6">
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

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
