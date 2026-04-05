/**
 * Jaro and Jaro-Winkler similarity algorithms.
 *
 * Jaro measures similarity between two strings by considering matching characters
 * and transpositions. Jaro-Winkler extends Jaro with a prefix bonus.
 *
 * Time: O(m * n)
 */

/**
 * Compute Jaro similarity between two strings.
 *
 * J(S1, S2) = (1/3) * (m/|S1| + m/|S2| + (m - t/2) / m)
 *
 * where m = number of matching characters (within window),
 *       t = number of transpositions among matching characters.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Jaro similarity in [0, 1]
 */
export function jaro(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0 && bLen === 0) return 1;
  if (aLen === 0 || bLen === 0) return 0;

  const matchDistance = Math.floor(Math.max(aLen, bLen) / 2) - 1;
  if (matchDistance < 0) return 0;

  const aMatches = new Uint8Array(aLen);
  const bMatches = new Uint8Array(bLen);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < aLen; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, bLen);

    for (let j = start; j < end; j++) {
      if (bMatches[j] || a.charCodeAt(i) !== b.charCodeAt(j)) continue;
      aMatches[i] = 1;
      bMatches[j] = 1;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < aLen; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a.charCodeAt(i) !== b.charCodeAt(k)) transpositions++;
    k++;
  }

  return (matches / aLen + matches / bLen + (matches - transpositions / 2) / matches) / 3;
}

/**
 * Options for Jaro-Winkler similarity.
 */
export interface IJaroWinklerOptions {
  /**
   * Weight applied to the common prefix bonus.
   * @default 0.1
   */
  prefixWeight?: number;

  /**
   * Maximum length of common prefix to consider.
   * @default 4
   */
  maxPrefix?: number;
}

/**
 * Compute Jaro-Winkler similarity between two strings.
 *
 * JW(S1, S2) = Jaro(S1, S2) + l * p * (1 - Jaro(S1, S2))
 *
 * where l = length of common prefix (up to maxPrefix),
 *       p = prefixWeight.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Configuration
 * @returns Jaro-Winkler similarity in [0, 1]
 */
export function jaroWinkler(a: string, b: string, options: IJaroWinklerOptions = {}): number {
  const p = options.prefixWeight ?? 0.1;
  const maxPrefix = options.maxPrefix ?? 4;

  const jaroScore = jaro(a, b);

  let l = 0;
  const minLen = Math.min(a.length, b.length, maxPrefix);
  while (l < minLen && a.charCodeAt(l) === b.charCodeAt(l)) l++;

  return jaroScore + l * p * (1 - jaroScore);
}
