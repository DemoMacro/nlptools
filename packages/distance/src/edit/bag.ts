/**
 * Bag distance — fast approximation of edit distance.
 *
 * bag(a, b) = max(|a|, |b|) - |a ∩ b|
 * where |a ∩ b| is the multiset intersection size.
 *
 * This is a lower bound on Levenshtein distance and is much faster to compute.
 *
 * Time: O(m + n)
 */

import {
  normalize,
  buildCharFreqArray,
  CHAR_FREQ_SIZE,
  charFrequencyMap,
  intersectCount,
} from "../utils";

const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Compute the bag distance between two strings.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Bag distance (non-negative integer)
 */
export function bagDistance(a: string, b: string): number {
  let intersection: number;

  // ASCII fast path
  _freqA.fill(0);
  _freqB.fill(0);
  if (buildCharFreqArray(_freqA, a) && buildCharFreqArray(_freqB, b)) {
    intersection = 0;
    for (let i = 0; i < CHAR_FREQ_SIZE; i++) {
      intersection += Math.min(_freqA[i], _freqB[i]);
    }
  } else {
    intersection = intersectCount(charFrequencyMap(a), charFrequencyMap(b));
  }

  return Math.max(a.length, b.length) - intersection;
}

/**
 * Compute the normalized bag distance similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score where 1 means identical
 */
export function bagDistanceNormalized(a: string, b: string): number {
  return normalize(bagDistance(a, b), Math.max(a.length, b.length));
}
