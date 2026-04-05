/**
 * Overlap coefficient — set similarity normalized by the smaller set.
 *
 * overlap(A, B) = |A ∩ B| / min(|A|, |B|)
 *
 * Time: O(m + n)
 */

import { charFrequencyMap, intersectCount, totalCount } from "../utils";

/**
 * Compute the overlap coefficient between two strings based on character multiset.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Overlap coefficient in [0, 1]
 */
export function overlap(a: string, b: string): number {
  const freqA = charFrequencyMap(a);
  const freqB = charFrequencyMap(b);

  const intersection = intersectCount(freqA, freqB);
  const totalA = totalCount(freqA);
  const totalB = totalCount(freqB);

  const minTotal = Math.min(totalA, totalB);
  if (totalA === 0 && totalB === 0) return 1;
  if (totalA === 0 || totalB === 0) return 0;

  return intersection / minTotal;
}
