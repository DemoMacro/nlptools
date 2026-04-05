import { distance as fastestLevenshtein } from "fastest-levenshtein";
import { normalize } from "../utils";

/**
 * Compute the Levenshtein edit distance between two strings.
 *
 * Time: O(m * n), Space: O(min(m, n))
 *
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance (non-negative integer)
 */
export function levenshtein(a: string, b: string): number {
  return fastestLevenshtein(a, b);
}

/**
 * Compute the normalized Levenshtein similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score where 1 means identical
 */
export function levenshteinNormalized(a: string, b: string): number {
  return normalize(levenshtein(a, b), Math.max(a.length, b.length));
}
