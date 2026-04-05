import {
  charFrequencyMap,
  frequencyMap,
  ngrams,
  ngramFrequencyMap,
  CHAR_FREQ_SIZE,
  buildCharFreqArray,
  intersectCountInt,
  totalCountInt,
} from "../utils";

// Reusable buffers to avoid per-call allocation
const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Cosine similarity between two strings based on character-level multiset.
 *
 * Uses textdistance.rs convention:
 *   cosine(A, B) = intersect_count(A, B) / sqrt(count(A) * count(B))
 *
 * Where intersect_count = sum(min(freqA[c], freqB[c])) and count = sum of frequencies.
 *
 * Time: O(m + n)
 *
 * @param a - First string
 * @param b - Second string
 * @returns Cosine similarity in [0, 1]
 */
export function cosine(a: string, b: string): number {
  // ASCII fast path: Int32Array instead of Map
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
    return intersection / Math.sqrt(totalA * totalB);
  }

  // Non-ASCII fallback
  const freqAMap = charFrequencyMap(a);
  const freqBMap = charFrequencyMap(b);

  const intersection = intersectCount(freqAMap, freqBMap);
  const totalA = totalCount(freqAMap);
  const totalB = totalCount(freqBMap);

  if (totalA === 0 && totalB === 0) return 1;
  if (totalA === 0 || totalB === 0) return 0;
  return intersection / Math.sqrt(totalA * totalB);
}

function intersectCount(a: Map<string, number>, b: Map<string, number>): number {
  let count = 0;
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  for (const [key, countA] of smaller) {
    const countB = larger.get(key);
    if (countB !== undefined) {
      count += countA < countB ? countA : countB;
    }
  }
  return count;
}

function totalCount(map: Map<string, number>): number {
  let count = 0;
  for (const c of map.values()) count += c;
  return count;
}

/**
 * Cosine similarity based on character n-grams.
 *
 * Uses textdistance.rs convention (same as character-level cosine but on n-grams):
 *   cosine_ngram(A, B) = intersect_count(A, B) / sqrt(count(A) * count(B))
 *
 * @param a - First string
 * @param b - Second string
 * @param n - N-gram size (default: 2)
 * @returns N-gram Cosine similarity in [0, 1]
 */
export function cosineNgram(a: string, b: string, n = 2): number {
  // Fast path: integer-encoded bigrams
  const freqAInt = ngramFrequencyMap(a, n);
  const freqBInt = ngramFrequencyMap(b, n);

  if (freqAInt !== null && freqBInt !== null) {
    const intersection = intersectCountInt(freqAInt, freqBInt);
    const totalA = totalCountInt(freqAInt);
    const totalB = totalCountInt(freqBInt);

    if (totalA === 0 && totalB === 0) return 1;
    if (totalA === 0 || totalB === 0) return 0;
    return intersection / Math.sqrt(totalA * totalB);
  }

  // Fallback: string-keyed n-grams
  const freqA = frequencyMap(ngrams(a, n));
  const freqB = frequencyMap(ngrams(b, n));

  const intersection = intersectCount(freqA, freqB);
  const totalA = totalCount(freqA);
  const totalB = totalCount(freqB);

  if (totalA === 0 && totalB === 0) return 1;
  if (totalA === 0 || totalB === 0) return 0;
  return intersection / Math.sqrt(totalA * totalB);
}
