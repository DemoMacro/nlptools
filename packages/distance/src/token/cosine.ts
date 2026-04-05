import {
  charFrequencyMap,
  frequencyMap,
  ngrams,
  ngramFrequencyMap,
  CHAR_FREQ_SIZE,
  buildCharFreqArray,
} from "../utils";

// Reusable buffers to avoid per-call allocation
const _freqA = new Int32Array(CHAR_FREQ_SIZE);
const _freqB = new Int32Array(CHAR_FREQ_SIZE);

/**
 * Cosine similarity between two strings based on character-level multiset.
 *
 * cos(A, B) = (A · B) / (|A| * |B|)
 *
 * Uses Counter (frequency map) for multiset semantics,
 * matching the textdistance crate behavior.
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
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < CHAR_FREQ_SIZE; i++) {
      const va = _freqA[i];
      const vb = _freqB[i];
      dot += va * vb;
      normA += va * va;
      normB += vb * vb;
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 1 : dot / denominator;
  }

  // Non-ASCII fallback
  const freqAMap = charFrequencyMap(a);
  const freqBMap = charFrequencyMap(b);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const [smaller, larger] =
    freqAMap.size <= freqBMap.size ? [freqAMap, freqBMap] : [freqBMap, freqAMap];

  for (const [char, countA] of smaller) {
    const countB = larger.get(char) ?? 0;
    dotProduct += countA * countB;
    normA += countA * countA;
  }

  for (const [, count] of larger) {
    normB += count * count;
  }

  // If we swapped, normA came from the smaller map — fix it
  if (freqAMap.size > freqBMap.size) {
    const tmp = normA;
    normA = normB;
    normB = tmp;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 1;
  return dotProduct / denominator;
}

/**
 * Cosine similarity based on character n-grams.
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
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [id, countA] of freqAInt) {
      const countB = freqBInt.get(id) ?? 0;
      dotProduct += countA * countB;
      normA += countA * countA;
    }

    for (const [, count] of freqBInt) {
      normB += count * count;
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 1 : dotProduct / denominator;
  }

  // Fallback: string-keyed n-grams
  const freqA = frequencyMap(ngrams(a, n));
  const freqB = frequencyMap(ngrams(b, n));

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [token, countA] of freqA) {
    const countB = freqB.get(token) ?? 0;
    dotProduct += countA * countB;
    normA += countA * countA;
  }

  for (const [, count] of freqB) {
    normB += count * count;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 1;
  return dotProduct / denominator;
}
