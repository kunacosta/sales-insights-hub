import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Check, X } from 'lucide-react';
import { BrandInconsistency } from '@/utils/dataQuality';

interface DataQualityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inconsistencies: BrandInconsistency[];
  onFix: (selectedIds: string[]) => void;
  onIgnoreAll: () => void;
}

const getTypeBadge = (type: BrandInconsistency['type']) => {
  const config = {
    case: { label: 'Case', variant: 'secondary' as const },
    whitespace: { label: 'Whitespace', variant: 'secondary' as const },
    typo: { label: 'Typo', variant: 'destructive' as const },
    similar: { label: 'Similar', variant: 'outline' as const },
  };
  return config[type];
};

const DataQualityDialog = ({
  open,
  onOpenChange,
  inconsistencies,
  onFix,
  onIgnoreAll,
}: DataQualityDialogProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(inconsistencies.map(i => i.id))
  );

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleFix = () => {
    onFix(Array.from(selectedIds));
  };

  const totalAffectedTransactions = inconsistencies
    .filter(i => selectedIds.has(i.id))
    .reduce((sum, i) => {
      // Sum all variants except the suggested one
      return sum + i.variants
        .filter(v => v.name !== i.suggestedName)
        .reduce((s, v) => s + v.transactionCount, 0);
    }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Brand Name Inconsistencies Found
          </DialogTitle>
          <DialogDescription>
            We detected {inconsistencies.length} potential brand name inconsistencies in your data.
            Review and select which ones to fix.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 max-h-[50vh] overflow-y-auto">
          <div className="space-y-4 py-4">
            {inconsistencies.map((inconsistency) => {
              const badge = getTypeBadge(inconsistency.type);
              const isSelected = selectedIds.has(inconsistency.id);

              return (
                <div
                  key={inconsistency.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(inconsistency.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">Suggested:</span>
                        <code className="px-2 py-0.5 bg-muted rounded text-sm font-mono">
                          {inconsistency.suggestedName}
                        </code>
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Variants to merge:</span>
                        <div className="flex flex-wrap gap-2">
                          {inconsistency.variants.map((variant) => (
                            <div
                              key={variant.name}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                                variant.name === inconsistency.suggestedName
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {variant.name === inconsistency.suggestedName && (
                                <Check className="w-3 h-3" />
                              )}
                              <span className="font-mono">{variant.name}</span>
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                {variant.transactionCount}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2 border-t pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedIds.size > 0 && (
              <span>
                Will update <strong>{totalAffectedTransactions}</strong> transactions
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onIgnoreAll}>
              <X className="w-4 h-4 mr-2" />
              Ignore All
            </Button>
            <Button onClick={handleFix} disabled={selectedIds.size === 0}>
              <Check className="w-4 h-4 mr-2" />
              Fix Selected ({selectedIds.size})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataQualityDialog;
