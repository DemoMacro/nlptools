import {
  lcs_size_dp,
  lcs_size_myers_linear_space,
  lcs_myers_linear_space,
  lcs_dp,
} from "@algorithm.ts/lcs";

export type LcsSizeFunc = (
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
) => number;

export type LcsPairsFunc = (
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
) => Array<[number, number]>;

/**
 * Internal helper: create an equals callback using pre-built CharCode arrays.
 * Avoids repeated string indexing inside the hot LCS loop.
 */
export function stringEquals(a: string, b: string): (x: number, y: number) => boolean {
  const ca = new Uint8Array(a.length);
  const cb = new Uint8Array(b.length);
  for (let i = 0; i < a.length; i++) ca[i] = a.charCodeAt(i);
  for (let i = 0; i < b.length; i++) cb[i] = b.charCodeAt(i);
  return (x, y) => ca[x] === cb[y];
}

/**
 * Compute the LCS distance: len(a) + len(b) - 2 * lcsLength.
 *
 * @param a - First string
 * @param b - Second string
 * @param algorithm - 'myers' (default, better for sparse diffs) | 'dp'
 * @returns LCS distance (non-negative integer)
 */
export function lcsDistance(a: string, b: string, algorithm: "myers" | "dp" = "myers"): number {
  const sizeFn: LcsSizeFunc = algorithm === "dp" ? lcs_size_dp : lcs_size_myers_linear_space;
  const lcsLen = sizeFn(a.length, b.length, stringEquals(a, b));
  return a.length + b.length - 2 * lcsLen;
}

/**
 * Compute the normalized LCS similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @param algorithm - 'myers' | 'dp'
 * @returns Similarity score where 1 means identical
 */
export function lcsNormalized(a: string, b: string, algorithm: "myers" | "dp" = "myers"): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return lcsLength(a, b, algorithm) / maxLen;
}

/**
 * Get the length of the Longest Common Subsequence.
 *
 * @param a - First string
 * @param b - Second string
 * @param algorithm - 'myers' | 'dp'
 * @returns LCS length
 */
export function lcsLength(a: string, b: string, algorithm: "myers" | "dp" = "myers"): number {
  const sizeFn: LcsSizeFunc = algorithm === "dp" ? lcs_size_dp : lcs_size_myers_linear_space;
  return sizeFn(a.length, b.length, stringEquals(a, b));
}

/**
 * Get the matching index pairs of the Longest Common Subsequence.
 *
 * @param a - First string
 * @param b - Second string
 * @param algorithm - 'myers' | 'dp'
 * @returns Array of [indexInA, indexInB] pairs
 */
export function lcsPairs(
  a: string,
  b: string,
  algorithm: "myers" | "dp" = "myers",
): Array<[number, number]> {
  const pairsFn: LcsPairsFunc = algorithm === "dp" ? lcs_dp : lcs_myers_linear_space;
  return pairsFn(a.length, b.length, stringEquals(a, b));
}
