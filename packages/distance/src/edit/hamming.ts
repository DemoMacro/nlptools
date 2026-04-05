/**
 * Hamming distance — counts character mismatches between equal-length strings.
 *
 * Time: O(min(m, n))
 */

/**
 * Compute the Hamming distance between two strings.
 *
 * If strings have different lengths, only compares up to the shorter length
 * and adds the length difference as additional mismatches.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Number of mismatching characters
 */
export function hamming(a: string, b: string): number {
  const minLen = Math.min(a.length, b.length);
  let count = Math.abs(a.length - b.length);

  for (let i = 0; i < minLen; i++) {
    if (a.charCodeAt(i) !== b.charCodeAt(i)) count++;
  }

  return count;
}

/**
 * Compute the normalized Hamming similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score where 1 means identical
 */
export function hammingNormalized(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - hamming(a, b) / maxLen;
}
