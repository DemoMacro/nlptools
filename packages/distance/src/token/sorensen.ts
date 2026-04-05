import {
  charFrequencyMap,
  frequencyMap,
  intersectCount,
  totalCount,
  ngrams,
  ngramFrequencyMap,
  intersectCountInt,
  totalCountInt,
  CHAR_FREQ_SIZE,
  buildCharFreqArray,
} from "../utils";

// Reusable buffers to avoid per-call allocation
const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Sørensen-Dice coefficient between two strings based on character-level multiset.
 *
 * DSC(A, B) = 2 * |A ∩ B| / (|A| + |B|)
 *
 * Uses Counter (frequency map) for multiset semantics,
 * matching the textdistance crate behavior.
 *
 * Time: O(m + n)
 *
 * @param a - First string
 * @param b - Second string
 * @returns Sørensen-Dice coefficient in [0, 1]
 */
export function sorensen(a: string, b: string): number {
  // ASCII fast path: Int32Array instead of Map
  _freqA.fill(0);
  _freqB.fill(0);
  if (buildCharFreqArray(_freqA, a) && buildCharFreqArray(_freqB, b)) {
    let ic = 0;
    for (let i = 0; i < CHAR_FREQ_SIZE; i++) {
      ic += Math.min(_freqA[i], _freqB[i]);
    }
    const total = a.length + b.length;
    return total === 0 ? 1 : (2 * ic) / total;
  }

  // Non-ASCII fallback
  const freqAMap = charFrequencyMap(a);
  const freqBMap = charFrequencyMap(b);

  const ic = intersectCount(freqAMap, freqBMap);
  const total = totalCount(freqAMap) + totalCount(freqBMap);

  if (total === 0) return 1;
  return (2 * ic) / total;
}

/**
 * Sørensen-Dice coefficient based on character n-grams.
 *
 * @param a - First string
 * @param b - Second string
 * @param n - N-gram size (default: 2)
 * @returns Bigram Sørensen-Dice coefficient in [0, 1]
 */
export function sorensenNgram(a: string, b: string, n = 2): number {
  // Fast path: integer-encoded bigrams
  const freqAInt = ngramFrequencyMap(a, n);
  const freqBInt = ngramFrequencyMap(b, n);

  if (freqAInt !== null && freqBInt !== null) {
    const ic = intersectCountInt(freqAInt, freqBInt);
    const total = totalCountInt(freqAInt) + totalCountInt(freqBInt);
    return total === 0 ? 1 : (2 * ic) / total;
  }

  // Fallback: string-keyed n-grams
  const freqA = frequencyMap(ngrams(a, n));
  const freqB = frequencyMap(ngrams(b, n));

  const ic = intersectCount(freqA, freqB);
  const total = totalCount(freqA) + totalCount(freqB);

  if (total === 0) return 1;
  return (2 * ic) / total;
}
