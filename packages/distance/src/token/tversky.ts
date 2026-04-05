/**
 * Tversky index — asymmetric set similarity measure.
 *
 * Reduces to Jaccard when alpha = beta = 1.
 * Reduces to Sorensen-Dice when alpha = beta = 0.5.
 *
 * Time: O(m + n)
 */

import { charFrequencyMap, intersectCount, totalCount } from "../utils";

/**
 * Options for Tversky index.
 */
export interface ITverskyOptions {
  /**
   * Weight for elements unique to the first set (a).
   * @default 1
   */
  alpha?: number;

  /**
   * Weight for elements unique to the second set (b).
   * @default 1
   */
  beta?: number;
}

/**
 * Compute the Tversky index between two strings based on character multiset.
 *
 * T(A, B; α, β) = |A ∩ B| / (|A ∩ B| + α|A \ B| + β|B \ A|)
 *
 * @param a - First string
 * @param b - Second string
 * @param options - alpha and beta weights
 * @returns Tversky index in [0, 1]
 */
export function tversky(a: string, b: string, options: ITverskyOptions = {}): number {
  const alpha = options.alpha ?? 1;
  const beta = options.beta ?? 1;

  const freqA = charFrequencyMap(a);
  const freqB = charFrequencyMap(b);

  const intersection = intersectCount(freqA, freqB);
  const totalA = totalCount(freqA);
  const totalB = totalCount(freqB);

  const onlyA = totalA - intersection;
  const onlyB = totalB - intersection;

  const denominator = intersection + alpha * onlyA + beta * onlyB;
  if (denominator === 0) return 1;

  return intersection / denominator;
}
