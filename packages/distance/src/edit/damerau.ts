/**
 * Damerau-Levenshtein distance (unrestricted variant).
 *
 * Extension of Levenshtein that allows transpositions of adjacent characters,
 * even when substrings are edited multiple times.
 *
 * Matches the default behavior of textdistance.rs (restricted = false).
 *
 * Time: O(m * n), Space: O(m * n)
 */

import { normalize } from "../utils";

/**
 * Compute the Damerau-Levenshtein distance between two strings.
 *
 * Allows insertions, deletions, substitutions, and transpositions of
 * adjacent characters. This is the unrestricted variant, which correctly
 * handles cases where a substring is edited more than once.
 *
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance (non-negative integer)
 */
export function damerauLevenshtein(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const maxDist = aLen + bLen;

  // Matrix dimensions: (aLen + 2) x (bLen + 2)
  const w = bLen + 2;
  const mat = new Uint32Array((aLen + 2) * w);

  // Initialize borders
  mat[0] = maxDist;
  for (let i = 0; i <= aLen; i++) {
    mat[(i + 1) * w] = maxDist;
    mat[(i + 1) * w + 1] = i;
  }
  for (let j = 0; j <= bLen; j++) {
    mat[j + 1] = maxDist;
    mat[w + j + 1] = j;
  }

  // Track last row where each character was seen in a
  const lastSeen = new Map<number, number>();

  for (let i = 0; i < aLen; i++) {
    let db = 0;
    const aChar = a.charCodeAt(i);
    const i1 = i + 1; // 1-based

    for (let j = 0; j < bLen; j++) {
      const j1 = j + 1; // 1-based
      const bChar = b.charCodeAt(j);
      const last = lastSeen.get(bChar) ?? 0;

      const subCost = aChar === bChar ? 0 : 1;
      const base = (i1 + 1) * w + j1 + 1;

      // Substitution, deletion, insertion, transposition
      const sub = mat[i1 * w + j1] + subCost;
      const del = mat[(i1 + 1) * w + j1] + 1;
      const ins = mat[i1 * w + j1 + 1] + 1;
      const trans = mat[last * w + db] + i1 + j1 - 2 + 1 - last - db;

      mat[base] = Math.min(sub, del, ins, trans);

      if (aChar === bChar) {
        db = j1;
      }
    }

    lastSeen.set(aChar, i1);
  }

  return mat[(aLen + 1) * w + bLen + 1];
}

/**
 * Compute the normalized Damerau-Levenshtein similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score where 1 means identical
 */
export function damerauLevenshteinNormalized(a: string, b: string): number {
  return normalize(damerauLevenshtein(a, b), Math.max(a.length, b.length));
}
