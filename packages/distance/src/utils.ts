/**
 * Generate character n-grams from a string.
 *
 * @param str - Input string
 * @param n - N-gram size (default: 2 for bigrams)
 */
export function ngrams(str: string, n = 2): string[] {
  const result: string[] = [];
  for (let i = 0; i <= str.length - n; i++) {
    result.push(str.slice(i, i + n));
  }
  return result;
}

/**
 * Build an n-gram frequency map using integer-encoded keys.
 * Encodes n characters into a single number to avoid string allocation
 * and speed up Map hashing.
 *
 * For ASCII bigrams: key = (c1 << 8) | c2 (fits in 16 bits).
 * For non-ASCII or n > 2: falls back to string keys.
 */
export function ngramFrequencyMap(str: string, n = 2): Map<number, number> | null {
  const len = str.length;
  if (len < n) return new Map();

  // Fast path: ASCII-only bigrams encoded as integers
  if (n === 2) {
    const map = new Map<number, number>();
    for (let i = 0; i <= len - 2; i++) {
      const c1 = str.charCodeAt(i);
      const c2 = str.charCodeAt(i + 1);
      if (c1 >= 128 || c2 >= 128) {
        // Hit non-ASCII — fall back to string keys
        return null;
      }
      const key = (c1 << 8) | c2;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }

  return null;
}

/**
 * Build a frequency map (Counter/multiset) from an iterable of tokens.
 * Matches the behavior of Rust's textdistance Counter.
 */
export function frequencyMap(tokens: Iterable<string>): Map<string, number> {
  const map = new Map<string, number>();
  for (const token of tokens) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }
  return map;
}

/**
 * Build a character-level frequency map from a string.
 * This is the default tokenization strategy used by textdistance.
 */
export function charFrequencyMap(str: string): Map<string, number> {
  return frequencyMap(str);
}

// ---------------------------------------------------------------------------
// ASCII fast path: Int32Array(128) instead of Map<string, number>
// ---------------------------------------------------------------------------

/** Size of the ASCII frequency array (covers charCode 0-127). */
const CHAR_FREQ_SIZE = 128;

/**
 * Build a character frequency array from a string.
 * Returns false if any character is non-ASCII (charCode >= 128).
 * The caller must zero the array before use.
 */
export function buildCharFreqArray(arr: Int32Array, str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= CHAR_FREQ_SIZE) return false;
    arr[code]++;
  }
  return true;
}

/** Export for reuse in token modules. */
export { CHAR_FREQ_SIZE };

/**
 * Count intersect size between two frequency maps.
 * For each key, takes the minimum count (multiset intersection).
 */
export function intersectCount(a: Map<string, number>, b: Map<string, number>): number {
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

/**
 * Count union size between two frequency maps.
 * For each key, takes the maximum count (multiset union).
 */
export function unionCount(a: Map<string, number>, b: Map<string, number>): number {
  let count = 0;
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  // Keys only in smaller
  for (const [key, countA] of smaller) {
    const countB = larger.get(key);
    if (countB !== undefined) {
      count += countA > countB ? countA : countB;
    } else {
      count += countA;
    }
  }
  // Keys only in larger
  for (const [key, countB] of larger) {
    if (!smaller.has(key)) {
      count += countB;
    }
  }
  return count;
}

/**
 * Get total token count from a frequency map.
 */
export function totalCount(map: Map<string, number>): number {
  let count = 0;
  for (const c of map.values()) count += c;
  return count;
}

// ---------------------------------------------------------------------------
// Integer-keyed frequency map operations (for n-gram fast path)
// ---------------------------------------------------------------------------

export function intersectCountInt(a: Map<number, number>, b: Map<number, number>): number {
  let count = 0;
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  for (const [key, countA] of smaller) {
    const countB = larger.get(key);
    if (countB !== undefined) {
      count += Math.min(countA, countB);
    }
  }
  return count;
}

export function unionCountInt(a: Map<number, number>, b: Map<number, number>): number {
  let count = 0;
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  for (const [key, countA] of smaller) {
    const countB = larger.get(key);
    if (countB !== undefined) {
      count += Math.max(countA, countB);
    } else {
      count += countA;
    }
  }
  for (const [key, countB] of larger) {
    if (!smaller.has(key)) {
      count += countB;
    }
  }
  return count;
}

export function totalCountInt(map: Map<number, number>): number {
  let count = 0;
  for (const c of map.values()) count += c;
  return count;
}

/**
 * Normalize a raw distance to a similarity score in [0, 1].
 *
 * @param distance - Raw distance value
 * @param maxDistance - Maximum possible distance (usually max(len(a), len(b)))
 */
export function normalize(distance: number, maxDistance: number): number {
  if (maxDistance === 0) return 1;
  return Math.max(0, 1 - distance / maxDistance);
}

/**
 * FNV-1a hash for strings. Fast, good distribution for hash-based algorithms.
 */
export function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Combine two hashes into one (for generating multiple independent hash values).
 */
export function combineHash(a: number, b: number): number {
  a ^= b + 0x9e3779b9 + (a << 6) + (a >>> 2);
  return a >>> 0;
}
