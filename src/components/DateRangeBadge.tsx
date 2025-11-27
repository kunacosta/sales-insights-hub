import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DateRange } from '@/types/sales';

interface DateRangeBadgeProps {
  dateRange: DateRange;
}

const DateRangeBadge = ({ dateRange }: DateRangeBadgeProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-accent/50 rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Data Period</p>
          <p className="font-semibold text-foreground">{dateRange.displayText}</p>
        </div>
      </div>
      
      <div className="h-8 w-px bg-border" />
      
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-semibold text-foreground">{dateRange.totalDays} days</p>
        </div>
      </div>
      
      <Badge variant={dateRange.isMonthly ? "default" : "secondary"} className="ml-auto">
        {dateRange.isMonthly ? "Monthly Report" : "Multi-Period Report"}
      </Badge>
    </div>
  );
};

export default DateRangeBadge;
