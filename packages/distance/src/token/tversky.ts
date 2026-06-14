/**
 * Tversky index — asymmetric set similarity measure.
 *
 * Reduces to Jaccard when alpha = beta = 1.
 * Reduces to Sorensen-Dice when alpha = beta = 0.5.
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
    const onlyA = totalA - intersection;
    const onlyB = totalB - intersection;
    const denominator = intersection + alpha * onlyA + beta * onlyB;
    return denominator === 0 ? 1 : intersection / denominator;
  }

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
