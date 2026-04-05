import { MinHash } from "./minhash";

export interface ILSHOptions {
  /**
   * Number of bands (rows per band = numHashes / numBands).
   * More bands → higher recall, lower precision.
   * @default 16
   */
  numBands?: number;

  /**
   * Number of hash functions (must match MinHash signature size).
   * @default 128
   */
  numHashes?: number;
}

/**
 * LSH (Locality-Sensitive Hashing) index for fast approximate nearest neighbor search.
 *
 * Uses the MinHash + banding technique:
 * 1. Divide each MinHash signature into `numBands` bands
 * 2. Hash each band to a bucket
 * 3. Items sharing at least one bucket are candidates for similarity
 *
 * The probability of two items with Jaccard similarity `s` being compared is:
 *   P = 1 - (1 - s^r)^b
 * where r = rows per band, b = numBands.
 *
 * @example
 * ```ts
 * const lsh = new LSH({ numBands: 16, numHashes: 128 });
 *
 * // Index documents
 * const mh1 = new MinHash({ numHashes: 128 });
 * mh1.update('hello');
 * mh1.update('world');
 * lsh.insert('doc1', mh1.digest());
 *
 * const mh2 = new MinHash({ numHashes: 128 });
 * mh2.update('hello');
 * mh2.update('earth');
 * lsh.insert('doc2', mh2.digest());
 *
 * // Query for similar documents
 * const mh3 = new MinHash({ numHashes: 128 });
 * mh3.update('hello');
 * mh3.update('earth');
 * const candidates = lsh.query(mh3.digest());
 * ```
 */
export class LSH {
  private readonly numBands: number;
  private readonly rowsPerBand: number;
  private readonly numHashes: number;

  /**
   * Map from band index → bucket hash → set of document IDs
   */
  private readonly bands: Array<Map<string, Set<string>>>;

  /**
   * All indexed document signatures for exact similarity estimation.
   */
  private readonly signatures: Map<string, Uint32Array>;

  constructor(options: ILSHOptions = {}) {
    this.numHashes = options.numHashes ?? 128;
    this.numBands = options.numBands ?? 16;
    this.rowsPerBand = Math.floor(this.numHashes / this.numBands);

    if (this.numBands > this.numHashes) {
      throw new Error("numBands must be <= numHashes");
    }

    this.bands = [];
    for (let i = 0; i < this.numBands; i++) {
      this.bands.push(new Map());
    }

    this.signatures = new Map();
  }

  /**
   * Insert a document into the index.
   *
   * @param id - Document identifier
   * @param signature - MinHash signature (from MinHash.digest())
   */
  insert(id: string, signature: Uint32Array): void {
    if (signature.length !== this.numHashes) {
      throw new Error(
        `Signature length ${signature.length} does not match numHashes ${this.numHashes}`,
      );
    }

    this.signatures.set(id, signature);

    for (let band = 0; band < this.numBands; band++) {
      const start = band * this.rowsPerBand;
      const end = start + this.rowsPerBand;
      const bandSlice = signature.slice(start, end);
      const bucketKey = bandHash(bandSlice);

      let bucket = this.bands[band].get(bucketKey);
      if (!bucket) {
        bucket = new Set();
        this.bands[band].set(bucketKey, bucket);
      }
      bucket.add(id);
    }
  }

  /**
   * Query for candidate documents similar to the given signature.
   *
   * @param signature - Query MinHash signature
   * @param threshold - Optional: minimum Jaccard similarity to return (default: return all candidates)
   * @returns Array of [docId, estimatedJaccard] pairs, sorted by similarity descending
   */
  query(signature: Uint32Array, threshold?: number): Array<[string, number]> {
    if (signature.length !== this.numHashes) {
      throw new Error(
        `Signature length ${signature.length} does not match numHashes ${this.numHashes}`,
      );
    }

    const candidates = new Set<string>();

    for (let band = 0; band < this.numBands; band++) {
      const start = band * this.rowsPerBand;
      const end = start + this.rowsPerBand;
      const bandSlice = signature.slice(start, end);
      const bucketKey = bandHash(bandSlice);

      const bucket = this.bands[band].get(bucketKey);
      if (bucket) {
        for (const id of bucket) {
          candidates.add(id);
        }
      }
    }

    const results: Array<[string, number]> = [];
    for (const id of candidates) {
      const sig = this.signatures.get(id)!;
      const similarity = MinHash.estimate(signature, sig);
      if (threshold === undefined || similarity >= threshold) {
        results.push([id, similarity]);
      }
    }

    results.sort((a, b) => b[1] - a[1]);
    return results;
  }

  /**
   * Remove a document from the index.
   */
  remove(id: string): boolean {
    const sig = this.signatures.get(id);
    if (!sig) return false;

    this.signatures.delete(id);

    for (let band = 0; band < this.numBands; band++) {
      const start = band * this.rowsPerBand;
      const end = start + this.rowsPerBand;
      const bandSlice = sig.slice(start, end);
      const bucketKey = bandHash(bandSlice);

      const bucket = this.bands[band].get(bucketKey);
      if (bucket) {
        bucket.delete(id);
        if (bucket.size === 0) {
          this.bands[band].delete(bucketKey);
        }
      }
    }

    return true;
  }

  /**
   * Get the number of indexed documents.
   */
  get size(): number {
    return this.signatures.size;
  }
}

/**
 * Hash a band slice to a bucket key string.
 * Uses a simple but effective hash combining approach.
 */
function bandHash(slice: Uint32Array): string {
  let hash = 0;
  for (let i = 0; i < slice.length; i++) {
    hash = (hash * 31 + slice[i]) | 0;
  }
  return hash.toString(36);
}
