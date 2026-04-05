import {
  charFrequencyMap,
  frequencyMap,
  intersectCount,
  unionCount,
  ngrams,
  ngramFrequencyMap,
  intersectCountInt,
  unionCountInt,
  CHAR_FREQ_SIZE,
  buildCharFreqArray,
} from "../utils";

// Reusable buffers to avoid per-call allocation
const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Jaccard similarity between two strings based on character-level multiset.
 *
 * J(A, B) = |A ∩ B| / |A ∪ B|
 *
 * Uses Counter (frequency map) for multiset semantics,
 * matching the textdistance crate behavior.
 *
 * Time: O(m + n)
 *
 * @param a - First string
 * @param b - Second string
 * @returns Jaccard similarity in [0, 1]
 */
export function jaccard(a: string, b: string): number {
  // ASCII fast path: Int32Array instead of Map
  _freqA.fill(0);
  _freqB.fill(0);
  if (buildCharFreqArray(_freqA, a) && buildCharFreqArray(_freqB, b)) {
    let ic = 0;
    let uc = 0;
    for (let i = 0; i < CHAR_FREQ_SIZE; i++) {
      const va = _freqA[i];
      const vb = _freqB[i];
      ic += Math.min(va, vb);
      uc += Math.max(va, vb);
    }
    return uc === 0 ? 1 : ic / uc;
  }

  // Non-ASCII fallback
  const freqAMap = charFrequencyMap(a);
  const freqBMap = charFrequencyMap(b);

  const ic = intersectCount(freqAMap, freqBMap);
  const uc = unionCount(freqAMap, freqBMap);

  if (uc === 0) return 1;
  return ic / uc;
}

/**
 * Jaccard similarity based on character bigrams.
 *
 * @param a - First string
 * @param b - Second string
 * @param n - N-gram size (default: 2)
 * @returns Bigram Jaccard similarity in [0, 1]
 */
export function jaccardNgram(a: string, b: string, n = 2): number {
  // Fast path: integer-encoded bigrams
  const freqAInt = ngramFrequencyMap(a, n);
  const freqBInt = ngramFrequencyMap(b, n);

  if (freqAInt !== null && freqBInt !== null) {
    const ic = intersectCountInt(freqAInt, freqBInt);
    const uc = unionCountInt(freqAInt, freqBInt);
    return uc === 0 ? 1 : ic / uc;
  }

  // Fallback: string-keyed n-grams
  const freqA = frequencyMap(ngrams(a, n));
  const freqB = frequencyMap(ngrams(b, n));

  const ic = intersectCount(freqA, freqB);
  const uc = unionCount(freqA, freqB);

  if (uc === 0) return 1;
  return ic / uc;
}
