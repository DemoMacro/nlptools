/**
 * Overlap coefficient — set similarity normalized by the smaller set.
 *
 * overlap(A, B) = |A ∩ B| / min(|A|, |B|)
 *
 * Time: O(m + n)
 */

import {
  charFrequencyMap,
  intersectCount,
  totalCount,
  CHAR_FREQ_SIZE,
  buildCharFreqArray,
} from "../utils";

const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Compute the overlap coefficient between two strings based on character multiset.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Overlap coefficient in [0, 1]
 */
export function overlap(a: string, b: string): number {
  // ASCII fast path
  _freqA.fill(0);
  _freqB.fill(0);
  if (buildCharFreqArray(_freqA, a) && buildCharFreqArray(_freqB, b)) {
    let intersection = 0;
    let totalA = 0;
    let totalB = 0;
    for (let i = 0; i < CHAR_FREQ_SIZE; i++) {
      const va = _freqA[i];
      const vb = _freqB[i];
      intersection += va < vb ? va : vb;
      totalA += va;
      totalB += vb;
    }
    if (totalA === 0 && totalB === 0) return 1;
    if (totalA === 0 || totalB === 0) return 0;
    return intersection / Math.min(totalA, totalB);
  }

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
