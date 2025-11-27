import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Check, X, Plus, Trash2, ArrowRight } from 'lucide-react';
import { BrandInconsistency } from '@/utils/dataQuality';

export interface CustomMapping {
  id: string;
  fromBrand: string;
  toBrand: string;
}

interface DataQualityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inconsistencies: BrandInconsistency[];
  availableBrands: string[];
  onFix: (selectedIds: string[], customMappings: CustomMapping[]) => void;
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
  availableBrands,
  onFix,
  onIgnoreAll,
}: DataQualityDialogProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(inconsistencies.map(i => i.id))
  );
  const [customMappings, setCustomMappings] = useState<CustomMapping[]>([]);
  const [newFromBrand, setNewFromBrand] = useState('');
  const [newToBrand, setNewToBrand] = useState('');

  // Reset selections when inconsistencies change
  useEffect(() => {
    setSelectedIds(new Set(inconsistencies.map(i => i.id)));
  }, [inconsistencies]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const addCustomMapping = () => {
    if (newFromBrand.trim() && newToBrand.trim() && newFromBrand !== newToBrand) {
      setCustomMappings([
        ...customMappings,
        {
          id: `custom-${Date.now()}`,
          fromBrand: newFromBrand.trim(),
          toBrand: newToBrand.trim(),
        },
      ]);
      setNewFromBrand('');
      setNewToBrand('');
    }
  };

  const removeCustomMapping = (id: string) => {
    setCustomMappings(customMappings.filter(m => m.id !== id));
  };

  const handleFix = () => {
    onFix(Array.from(selectedIds), customMappings);
  };

  const totalAffectedTransactions = inconsistencies
    .filter(i => selectedIds.has(i.id))
    .reduce((sum, i) => {
      return sum + i.variants
        .filter(v => v.name !== i.suggestedName)
        .reduce((s, v) => s + v.transactionCount, 0);
    }, 0);

  const hasChanges = selectedIds.size > 0 || customMappings.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Brand Name Quality Check
          </DialogTitle>
          <DialogDescription>
            Review detected inconsistencies or add custom brand name mappings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="detected" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detected">
              Detected ({inconsistencies.length})
            </TabsTrigger>
            <TabsTrigger value="custom">
              Custom Mappings ({customMappings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detected" className="flex-1 min-h-0 mt-4">
            {inconsistencies.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIds(new Set(inconsistencies.map(i => i.id)))}
                  disabled={selectedIds.size === inconsistencies.length}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={selectedIds.size === 0}
                >
                  <X className="w-3 h-3 mr-1" />
                  Select None
                </Button>
                <span className="text-xs text-muted-foreground ml-auto">
                  {selectedIds.size} of {inconsistencies.length} selected
                </span>
              </div>
            )}
            <ScrollArea className="h-[36vh]">
              <div className="space-y-4 pr-4">
                {inconsistencies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No inconsistencies detected automatically.
                    <br />
                    Use the Custom Mappings tab to add manual fixes.
                  </div>
                ) : (
                  inconsistencies.map((inconsistency) => {
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
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 min-h-0 mt-4">
            <div className="space-y-4">
              {/* Add new mapping form */}
              <div className="p-4 rounded-lg border border-dashed border-border bg-muted/30">
                <Label className="text-sm font-medium mb-3 block">Add Custom Mapping</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Original brand name"
                      value={newFromBrand}
                      onChange={(e) => setNewFromBrand(e.target.value)}
                      list="brand-suggestions-from"
                    />
                    <datalist id="brand-suggestions-from">
                      {availableBrands.map(brand => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Input
                      placeholder="Correct brand name"
                      value={newToBrand}
                      onChange={(e) => setNewToBrand(e.target.value)}
                      list="brand-suggestions-to"
                    />
                    <datalist id="brand-suggestions-to">
                      {availableBrands.map(brand => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </div>
                  <Button
                    size="sm"
                    onClick={addCustomMapping}
                    disabled={!newFromBrand.trim() || !newToBrand.trim() || newFromBrand === newToBrand}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Type to search existing brands or enter new names
                </p>
              </div>

              {/* Custom mappings list */}
              <ScrollArea className="h-[28vh]">
                <div className="space-y-2 pr-4">
                  {customMappings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No custom mappings added yet.
                      <br />
                      Add mappings above for brands not detected automatically.
                    </div>
                  ) : (
                    customMappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                      >
                        <code className="px-2 py-0.5 bg-muted rounded text-sm font-mono flex-1 truncate">
                          {mapping.fromBrand}
                        </code>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <code className="px-2 py-0.5 bg-primary/10 text-primary rounded text-sm font-mono flex-1 truncate">
                          {mapping.toBrand}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomMapping(mapping.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2 border-t pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {hasChanges && (
              <span>
                {selectedIds.size > 0 && (
                  <>Will fix <strong>{totalAffectedTransactions}</strong> transactions</>
                )}
                {selectedIds.size > 0 && customMappings.length > 0 && ' + '}
                {customMappings.length > 0 && (
                  <><strong>{customMappings.length}</strong> custom mapping{customMappings.length > 1 ? 's' : ''}</>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onIgnoreAll}>
              <X className="w-4 h-4 mr-2" />
              Skip All
            </Button>
            <Button onClick={handleFix} disabled={!hasChanges}>
              <Check className="w-4 h-4 mr-2" />
              Apply Fixes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataQualityDialog;
