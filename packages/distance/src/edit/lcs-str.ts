/**
 * Longest Common Substring (contiguous) algorithms.
 *
 * Unlike LCS (subsequence), this requires the matching characters to be contiguous.
 *
 * Time: O(m * n), Space: O(min(m, n))
 */

/**
 * Compute the length of the Longest Common Substring.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Length of the longest common substring
 */
export function lcsSubstringLength(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0 || bLen === 0) return 0;

  let maxLen = 0;
  const dp = new Uint32Array(bLen + 1);

  for (let i = 1; i <= aLen; i++) {
    let prev = 0;
    for (let j = 1; j <= bLen; j++) {
      const temp = dp[j];
      if (a.charCodeAt(i - 1) === b.charCodeAt(j - 1)) {
        dp[j] = prev + 1;
        if (dp[j] > maxLen) maxLen = dp[j];
      } else {
        dp[j] = 0;
      }
      prev = temp;
    }
  }

  return maxLen;
}

/**
 * Compute the LCS substring distance: len(a) + len(b) - 2 * lcsSubstringLength.
 *
 * @param a - First string
 * @param b - Second string
 * @returns LCS substring distance (non-negative integer)
 */
export function lcsSubstringDistance(a: string, b: string): number {
  return a.length + b.length - 2 * lcsSubstringLength(a, b);
}

/**
 * Compute the normalized LCS substring similarity in [0, 1].
 *
 * Normalized by max(len(a), len(b)) to match textdistance.rs convention.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score where 1 means identical
 */
export function lcsSubstringNormalized(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return lcsSubstringLength(a, b) / maxLen;
}
