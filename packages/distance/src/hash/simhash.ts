import { fnv1a } from "../utils";

export interface ISimHashOptions {
  /**
   * Bit length of the fingerprint.
   * @default 64
   */
  bits?: number;

  /**
   * Hash function to use for feature hashing.
   * Defaults to a built-in FNV-1a implementation.
   */
  hashFn?: (feature: string) => number;
}

/**
 * Generate a 64-bit fingerprint for a collection of features.
 *
 * SimHash maps a set of features to a fixed-length binary fingerprint such that
 * similar documents produce similar fingerprints. The similarity between two
 * fingerprints is measured by Hamming distance.
 *
 * Algorithm:
 * 1. Initialize a vector V of length `bits` to all zeros
 * 2. For each feature, compute its hash and set the i-th bit
 * 3. For each bit position i: if hash[i] = 1, V[i] += weight; else V[i] -= weight
 * 4. The final fingerprint: bit i = 1 if V[i] > 0, else 0
 *
 * Time: O(features * bits)
 *
 * @param features - Array of feature strings (e.g., words, n-grams, shingles)
 * @param options - Configuration
 * @returns 64-bit fingerprint as a bigint
 */
export function simhash(features: string[], options: ISimHashOptions = {}): bigint {
  const bits = options.bits ?? 64;
  const hashFn = options.hashFn ?? fnv1a;

  // Accumulator: positive = more 1s, negative = more 0s
  const v = new Float64Array(bits);

  for (const feature of features) {
    const h = hashFn(feature);
    for (let i = 0; i < bits; i++) {
      if (h & (1 << i)) {
        v[i] += 1;
      } else {
        v[i] -= 1;
      }
    }
  }

  let fingerprint = 0n;
  for (let i = 0; i < bits; i++) {
    if (v[i] > 0) {
      fingerprint |= 1n << BigInt(i);
    }
  }

  return fingerprint;
}

/**
 * Compute the Hamming distance between two SimHash fingerprints.
 *
 * The Hamming distance is the number of differing bits.
 * For 64-bit fingerprints, a distance ≤ 3 typically indicates near-duplicate content.
 *
 * Time: O(bits)
 *
 * @param a - First fingerprint
 * @param b - Second fingerprint
 * @returns Hamming distance (non-negative integer)
 */
export function hammingDistance(a: bigint, b: bigint): number {
  return bitCount(a ^ b);
}

/**
 * Compute normalized Hamming similarity in [0, 1].
 *
 * @param a - First fingerprint
 * @param b - Second fingerprint
 * @param bits - Bit length of the fingerprints (default: 64)
 */
export function hammingSimilarity(a: bigint, b: bigint, bits = 64): number {
  return 1 - hammingDistance(a, b) / bits;
}

/**
 * Count the number of set bits in a bigint using a lookup table.
 * Processes 8 bits at a time instead of 1, reducing iterations from 64 to 8.
 */
const POPCOUNT_TABLE = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  POPCOUNT_TABLE[i] =
    (i & 1) +
    ((i >> 1) & 1) +
    ((i >> 2) & 1) +
    ((i >> 3) & 1) +
    ((i >> 4) & 1) +
    ((i >> 5) & 1) +
    ((i >> 6) & 1) +
    ((i >> 7) & 1);
}

function bitCount(n: bigint): number {
  let count = 0;
  while (n > 0n) {
    count += POPCOUNT_TABLE[Number(n & 0xffn)];
    n >>= 8n;
  }
  return count;
}

/**
 * SimHasher class for convenient document fingerprinting.
 *
 * @example
 * ```ts
 * const hasher = new SimHasher();
 * const fp1 = hasher.hash(['hello', 'world']);
 * const fp2 = hasher.hash(['hello', 'earth']);
 * console.log(hasher.distance(fp1, fp2)); // small number = similar
 * ```
 */
export class SimHasher {
  private readonly bits: number;
  private readonly hashFn: (feature: string) => number;

  constructor(options: ISimHashOptions = {}) {
    this.bits = options.bits ?? 64;
    this.hashFn = options.hashFn ?? fnv1a;
  }

  /**
   * Generate a fingerprint from features.
   */
  hash(features: string[]): bigint {
    return simhash(features, { bits: this.bits, hashFn: this.hashFn });
  }

  /**
   * Compute Hamming distance between two fingerprints.
   */
  distance(a: bigint, b: bigint): number {
    return hammingDistance(a, b);
  }

  /**
   * Compute similarity between two fingerprints.
   */
  similarity(a: bigint, b: bigint): number {
    return hammingSimilarity(a, b, this.bits);
  }

  /**
   * Check if two fingerprints are likely near-duplicates.
   *
   * @param threshold - Maximum Hamming distance to consider as duplicate (default: 3)
   */
  isDuplicate(a: bigint, b: bigint, threshold = 3): boolean {
    return this.distance(a, b) <= threshold;
  }
}
