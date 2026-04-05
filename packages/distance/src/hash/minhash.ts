import { fnv1a } from "../utils";

export interface IMinHashOptions {
  /**
   * Number of hash functions / signature size.
   * Larger values give more accurate Jaccard estimates.
   * @default 128
   */
  numHashes?: number;

  /**
   * Seed for the random number generator.
   * @default 42
   */
  seed?: number;
}

/**
 * MinHash estimator for Jaccard similarity.
 *
 * Instead of computing the exact Jaccard index (which requires set intersection/union
 * on potentially large sets), MinHash generates a fixed-size signature for each set.
 * The Jaccard similarity is then estimated by comparing the fraction of matching
 * positions in the signatures.
 *
 * Time:
 * - Update: O(k) per element, where k = numHashes
 * - Estimate: O(k)
 *
 * @example
 * ```ts
 * const mh = new MinHash({ numHashes: 128 });
 * mh.update('hello');
 * mh.update('world');
 * const sig1 = mh.digest();
 *
 * const mh2 = new MinHash({ numHashes: 128 });
 * mh2.update('hello');
 * mh2.update('earth');
 * const sig2 = mh2.digest();
 *
 * console.log(MinHash.estimate(sig1, sig2)); // ~0.67
 * ```
 */
export class MinHash {
  private readonly numHashes: number;
  private readonly hashParams: Array<{ a: number; b: number; p: number }>;
  private readonly maxHash: number;
  private signature: Uint32Array;
  private dirty: boolean;

  constructor(options: IMinHashOptions = {}) {
    this.numHashes = options.numHashes ?? 128;
    const seed = options.seed ?? 42;

    // Use a large prime for the hash function
    const p = 4294967311;
    this.maxHash = p - 1;

    // Generate k independent hash parameters: h(x) = (a * x + b) % p
    this.hashParams = [];
    let rng = seed;
    for (let i = 0; i < this.numHashes; i++) {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      const a = (rng % (p - 1)) + 1;
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      const b = rng % p;
      this.hashParams.push({ a, b, p });
    }

    this.signature = new Uint32Array(this.numHashes).fill(0xffffffff);
    this.dirty = false;
  }

  /**
   * Add a feature to the set.
   */
  update(feature: string): void {
    const h = fnv1a(feature);
    for (let i = 0; i < this.numHashes; i++) {
      const { a, b, p } = this.hashParams[i];
      const hash = (((a * h + b) % p) + p) % p;
      if (hash < this.signature[i]) {
        this.signature[i] = hash;
      }
    }
    this.dirty = true;
  }

  /**
   * Get the MinHash signature.
   * The signature is a fixed-size array that represents the set.
   */
  digest(): Uint32Array {
    // Return a copy to prevent external mutation
    return new Uint32Array(this.signature);
  }

  /**
   * Estimate Jaccard similarity between two MinHash signatures.
   *
   * @param sig1 - First MinHash signature
   * @param sig2 - Second MinHash signature
   * @returns Estimated Jaccard similarity in [0, 1]
   */
  static estimate(sig1: Uint32Array, sig2: Uint32Array): number {
    if (sig1.length !== sig2.length) {
      throw new Error("Signature lengths must match");
    }

    let matches = 0;
    for (let i = 0; i < sig1.length; i++) {
      if (sig1[i] === sig2[i]) matches++;
    }

    return matches / sig1.length;
  }

  /**
   * Estimate Jaccard similarity between this and another MinHash instance.
   */
  estimate(other: MinHash): number {
    return MinHash.estimate(this.digest(), other.digest());
  }
}
