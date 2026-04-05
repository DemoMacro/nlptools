/**
 * SIFT4 simple — fast approximate string distance.
 *
 * A fast algorithm for approximate string matching with O(n) complexity
 * in typical cases. Returns a distance value (lower = more similar).
 *
 * Matches the textdistance.rs implementation exactly.
 *
 * Time: O(n * maxOffset)
 */

import { normalize } from "../utils";

/**
 * Options for SIFT4.
 */
export interface ISift4Options {
  /**
   * Maximum offset for character matching.
   * @default 5
   */
  maxOffset?: number;
}

/**
 * Compute the SIFT4 simple distance between two strings.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Configuration
 * @returns Distance (non-negative integer)
 */
export function sift4(a: string, b: string, options: ISift4Options = {}): number {
  const maxOffset = options.maxOffset ?? 5;

  const aLen = a.length;
  const bLen = b.length;

  let c1 = 0;
  let c2 = 0;
  let lcss = 0;
  let localCs = 0;

  while (c1 < aLen && c2 < bLen) {
    if (a.charCodeAt(c1) === b.charCodeAt(c2)) {
      localCs++;
    } else {
      lcss += localCs;
      localCs = 0;
      if (c1 !== c2) {
        c1 = Math.min(c1, c2);
        c2 = c1;
      }

      for (let offset = 0; offset < maxOffset; offset++) {
        if (!(c1 + 1 < aLen || c2 + offset < bLen)) break;

        if (c1 + offset < aLen && a.charCodeAt(c1 + offset) === b.charCodeAt(c2)) {
          c1 += offset;
          localCs++;
          break;
        }
        if (c2 + offset < bLen && a.charCodeAt(c1) === b.charCodeAt(c2 + offset)) {
          c2 += offset;
          localCs++;
          break;
        }
      }
    }
    c1++;
    c2++;
  }

  return Math.max(aLen, bLen) - lcss - localCs;
}

/**
 * Compute the normalized SIFT4 similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Configuration
 * @returns Similarity score where 1 means identical
 */
export function sift4Normalized(a: string, b: string, options: ISift4Options = {}): number {
  return normalize(sift4(a, b, options), Math.max(a.length, b.length));
}
