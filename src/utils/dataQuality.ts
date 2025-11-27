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
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
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

// Calculate similarity ratio (0-1)
const calculateSimilarity = (str1: string, str2: string): number => {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
};

// Detect inconsistency type
const detectInconsistencyType = (variants: string[]): 'case' | 'whitespace' | 'typo' | 'similar' => {
  const normalized = variants.map(v => normalizeString(v));
  const allSameNormalized = normalized.every(n => n === normalized[0]);
  
  if (allSameNormalized) {
    // Check if it's just case difference
    const lowercased = variants.map(v => v.toLowerCase().trim());
    const allSameLowercase = lowercased.every(l => l === lowercased[0]);
    
    if (allSameLowercase) {
      return 'case';
    }
    return 'whitespace';
  }
  
  // Check similarity
  const similarity = calculateSimilarity(normalized[0], normalized[1]);
  if (similarity >= 0.8) {
    return 'typo';
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

  // Group by normalized version first (catches case and whitespace issues)
  const normalizedGroups = new Map<string, string[]>();
  brands.forEach(brand => {
    const normalized = normalizeString(brand);
    if (!normalizedGroups.has(normalized)) {
      normalizedGroups.set(normalized, []);
    }
    normalizedGroups.get(normalized)!.push(brand);
  });

  // Process normalized groups
  normalizedGroups.forEach((variants) => {
    if (variants.length > 1) {
      // Find the most common variant as suggested name
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

  // Second pass: Find similar brands using Levenshtein distance
  const remainingBrands = brands.filter(b => !processedBrands.has(b));
  
  for (let i = 0; i < remainingBrands.length; i++) {
    if (processedBrands.has(remainingBrands[i])) continue;

    const similarGroup: string[] = [remainingBrands[i]];

    for (let j = i + 1; j < remainingBrands.length; j++) {
      if (processedBrands.has(remainingBrands[j])) continue;

      const norm1 = normalizeString(remainingBrands[i]);
      const norm2 = normalizeString(remainingBrands[j]);
      
      // Only consider similar if they're reasonably close in length
      if (Math.abs(norm1.length - norm2.length) <= 3) {
        const similarity = calculateSimilarity(norm1, norm2);
        if (similarity >= 0.85) {
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
        type: 'similar',
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
