import { ProcessedTransaction } from '@/types/sales';

export interface BrandInconsistency {
  id: string;
  suggestedName: string;
  type: 'case' | 'whitespace' | 'typo' | 'similar';
  variants: {
    name: string;
    transactionCount: number;
  }[];
}

// Normalize string for comparison
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[`'"]/g, '');
};

// Normalize string without any spaces (for catching NAVI FORCE vs NAVIFORCE)
const normalizeNoSpaces = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, '').replace(/[`'"]/g, '');
};

// Calculate Levenshtein distance between two strings
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Calculate Damerau-Levenshtein distance (handles transpositions like CAISO/CASIO)
const damerauLevenshteinDistance = (a: string, b: string): number => {
  const lenA = a.length;
  const lenB = b.length;
  const d: number[][] = [];

  for (let i = 0; i <= lenA; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= lenB; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      
      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  return d[lenA][lenB];
};

// Calculate similarity ratio (0-1) using Damerau-Levenshtein
const calculateSimilarity = (str1: string, str2: string): number => {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = damerauLevenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
};

// Detect inconsistency type
const detectInconsistencyType = (variants: string[]): 'case' | 'whitespace' | 'typo' | 'similar' => {
  const normalized = variants.map(v => normalizeString(v));
  const noSpaces = variants.map(v => normalizeNoSpaces(v));
  
  // Check if all are same when spaces removed
  const allSameNoSpaces = noSpaces.every(n => n === noSpaces[0]);
  
  if (allSameNoSpaces) {
    const lowercased = variants.map(v => v.toLowerCase().trim());
    const allSameLowercase = lowercased.every(l => l === lowercased[0]);
    
    if (allSameLowercase) {
      return 'case';
    }
    return 'whitespace';
  }
  
  // Check if it's a typo (high similarity)
  if (normalized.length >= 2) {
    const similarity = calculateSimilarity(normalized[0], normalized[1]);
    if (similarity >= 0.7) {
      return 'typo';
    }
  }
  
  return 'similar';
};

export const detectBrandInconsistencies = (
  transactions: ProcessedTransaction[]
): BrandInconsistency[] => {
  // Get all unique brand names with their counts
  const brandCounts = new Map<string, number>();
  transactions.forEach(t => {
    const brand = t.inv_desc;
    brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
  });

  const brands = Array.from(brandCounts.keys());
  const inconsistencies: BrandInconsistency[] = [];
  const processedBrands = new Set<string>();

  // PASS 1: Group by normalized version (catches case differences)
  const normalizedGroups = new Map<string, string[]>();
  brands.forEach(brand => {
    const normalized = normalizeString(brand);
    if (!normalizedGroups.has(normalized)) {
      normalizedGroups.set(normalized, []);
    }
    normalizedGroups.get(normalized)!.push(brand);
  });

  normalizedGroups.forEach((variants) => {
    if (variants.length > 1) {
      const sortedVariants = variants
        .map(v => ({ name: v, transactionCount: brandCounts.get(v) || 0 }))
        .sort((a, b) => b.transactionCount - a.transactionCount);

      inconsistencies.push({
        id: `norm-${inconsistencies.length}`,
        suggestedName: sortedVariants[0].name,
        type: detectInconsistencyType(variants),
        variants: sortedVariants,
      });

      variants.forEach(v => processedBrands.add(v));
    }
  });

  // PASS 2: Group by no-spaces version (catches NAVI FORCE vs NAVIFORCE)
  const noSpacesGroups = new Map<string, string[]>();
  brands.forEach(brand => {
    if (processedBrands.has(brand)) return;
    const noSpaces = normalizeNoSpaces(brand);
    if (!noSpacesGroups.has(noSpaces)) {
      noSpacesGroups.set(noSpaces, []);
    }
    noSpacesGroups.get(noSpaces)!.push(brand);
  });

  noSpacesGroups.forEach((variants) => {
    if (variants.length > 1) {
      const sortedVariants = variants
        .map(v => ({ name: v, transactionCount: brandCounts.get(v) || 0 }))
        .sort((a, b) => b.transactionCount - a.transactionCount);

      inconsistencies.push({
        id: `space-${inconsistencies.length}`,
        suggestedName: sortedVariants[0].name,
        type: 'whitespace',
        variants: sortedVariants,
      });

      variants.forEach(v => processedBrands.add(v));
    }
  });

  // PASS 3: Find similar brands using Damerau-Levenshtein (catches typos like CAISO/CASIO)
  const remainingBrands = brands.filter(b => !processedBrands.has(b));
  
  for (let i = 0; i < remainingBrands.length; i++) {
    if (processedBrands.has(remainingBrands[i])) continue;

    const similarGroup: string[] = [remainingBrands[i]];
    const norm1 = normalizeNoSpaces(remainingBrands[i]);

    for (let j = i + 1; j < remainingBrands.length; j++) {
      if (processedBrands.has(remainingBrands[j])) continue;

      const norm2 = normalizeNoSpaces(remainingBrands[j]);
      
      // Only consider similar if they're reasonably close in length
      if (Math.abs(norm1.length - norm2.length) <= 3) {
        const similarity = calculateSimilarity(norm1, norm2);
        // Lower threshold to catch more typos (like CAISO vs CASIO which is ~0.8)
        if (similarity >= 0.75) {
          similarGroup.push(remainingBrands[j]);
        }
      }
    }

    if (similarGroup.length > 1) {
      const sortedVariants = similarGroup
        .map(v => ({ name: v, transactionCount: brandCounts.get(v) || 0 }))
        .sort((a, b) => b.transactionCount - a.transactionCount);

      inconsistencies.push({
        id: `sim-${inconsistencies.length}`,
        suggestedName: sortedVariants[0].name,
        type: 'typo',
        variants: sortedVariants,
      });

      similarGroup.forEach(v => processedBrands.add(v));
    }
  }

  return inconsistencies;
};

export const applyBrandFixes = (
  transactions: ProcessedTransaction[],
  fixes: Map<string, string>
): ProcessedTransaction[] => {
  return transactions.map(t => {
    const newBrand = fixes.get(t.inv_desc);
    if (newBrand) {
      return { ...t, inv_desc: newBrand };
    }
    return t;
  });
};
