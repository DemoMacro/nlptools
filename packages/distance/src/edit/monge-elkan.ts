/**
 * Monge-Elkan similarity — asymmetric token-based similarity.
 *
 * For each token in string A, finds the best matching token in string B
 * using an inner similarity function, then averages those best scores.
 *
 * This is asymmetric: mongeElkan(a, b) may differ from mongeElkan(b, a).
 * The symmetric variant averages both directions.
 *
 * Time: O(n * m * k) where n, m = token counts, k = inner algorithm cost
 */

import { levenshteinNormalized } from "./levenshtein";

export type InnerSimilarityFn = (a: string, b: string) => number;

export interface IMongeElkanOptions {
  /**
   * Inner similarity function used to compare individual tokens.
   * @default levenshteinNormalized
   */
  innerFn?: InnerSimilarityFn;

  /**
   * Tokenizer function to split strings into tokens.
   * @default splits on whitespace
   */
  tokenizer?: (s: string) => string[];
}

const defaultTokenizer = (s: string): string[] => s.split(/\s+/).filter(Boolean);

/**
 * Compute Monge-Elkan similarity (asymmetric: A → B).
 *
 * For each token in A, finds the max similarity to any token in B,
 * then returns the average of those maxima.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Configuration
 * @returns Similarity in [0, 1]
 */
export function mongeElkan(a: string, b: string, options: IMongeElkanOptions = {}): number {
  const innerFn = options.innerFn ?? levenshteinNormalized;
  const tokenizer = options.tokenizer ?? defaultTokenizer;

  const tokensA = tokenizer(a);
  const tokensB = tokenizer(b);

  if (tokensA.length === 0 && tokensB.length === 0) return 1;
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  let sum = 0;
  for (const tA of tokensA) {
    let best = 0;
    for (const tB of tokensB) {
      const sim = innerFn(tA, tB);
      if (sim > best) best = sim;
    }
    sum += best;
  }

  return sum / tokensA.length;
}

/**
 * Compute symmetric Monge-Elkan similarity.
 *
 * Averages mongeElkan(a, b) and mongeElkan(b, a).
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Configuration
 * @returns Symmetric similarity in [0, 1]
 */
export function mongeElkanSymmetric(
  a: string,
  b: string,
  options: IMongeElkanOptions = {},
): number {
  return (mongeElkan(a, b, options) + mongeElkan(b, a, options)) / 2;
}
