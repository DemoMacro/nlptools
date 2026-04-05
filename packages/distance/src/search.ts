import { levenshteinNormalized } from "./edit/levenshtein";
import { lcsNormalized } from "./edit/lcs";
import { jaccard, jaccardNgram } from "./token/jaccard";
import { cosine, cosineNgram } from "./token/cosine";
import { sorensen, sorensenNgram } from "./token/sorensen";
import { MinHash } from "./hash/minhash";
import { LSH } from "./hash/lsh";
import { ngrams } from "./utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A function that computes similarity between two strings, returning a value
 * in [0, 1] where 1 means identical.
 */
export type SimilarityFn = (a: string, b: string) => number;

/**
 * Built-in similarity algorithms. Each maps to a normalized similarity
 * function from @nlptools/distance.
 */
export type BuiltinAlgorithm =
  | "levenshtein"
  | "lcs"
  | "jaccard"
  | "jaccardNgram"
  | "cosine"
  | "cosineNgram"
  | "sorensen"
  | "sorensenNgram";

/**
 * Configuration for a searchable key on an object item.
 *
 * @example
 * ```ts
 * const keys = [
 *   { name: "title", weight: 0.7 },
 *   { name: "author", weight: 0.3 },
 * ];
 * ```
 */
export interface ISearchKey {
  /** Property name to search on. */
  name: string;

  /**
   * Weight of this key in the final score.
   * Weights are normalized to sum to 1.0 internally.
   * @default 1
   */
  weight?: number;

  /**
   * Optional custom getter function. If provided, used instead of
   * reading `item[name]`. Must return a string.
   */
  getter?: (item: any) => string;
}

/**
 * A single search result, containing the matched item, its score, and
 * its position in the original collection.
 *
 * Results are sorted by score descending (best match first).
 */
export interface ISearchResult<T> {
  /** The matched item from the collection. */
  item: T;

  /**
   * Similarity score in [0, 1], where 1 means identical.
   * For multi-key search, this is the weighted sum of per-key scores.
   */
  score: number;

  /** Index of the item in the original collection array. */
  index: number;
}

/**
 * Extended search result including per-key match details.
 * Only produced when `includeMatchDetails` is true.
 */
export interface ISearchResultWithDetails<T> extends ISearchResult<T> {
  /**
   * Per-key similarity scores.
   * Keys are the key names from the ISearchKey configuration.
   * Values are individual similarity scores in [0, 1].
   */
  matches: Record<string, number>;
}

/**
 * Options for the {@link FuzzySearch} constructor.
 *
 * @example
 * ```ts
 * // String array
 * const search = new FuzzySearch(["apple", "banana", "cherry"]);
 *
 * // Object array with weighted keys
 * const search = new FuzzySearch(books, {
 *   keys: [
 *     { name: "title", weight: 0.7 },
 *     { name: "author", weight: 0.3 },
 *   ],
 *   algorithm: "cosine",
 *   threshold: 0.4,
 * });
 * ```
 */
export interface IFuzzySearchOptions {
  /**
   * Similarity algorithm to use for comparing strings.
   *
   * - A string from {@link BuiltinAlgorithm} selects a built-in function.
   * - A custom {@link SimilarityFn} can be provided for full control.
   *
   * @default "levenshtein"
   */
  algorithm?: BuiltinAlgorithm | SimilarityFn;

  /**
   * Keys to search on when the collection contains objects.
   * Ignored for string arrays.
   */
  keys?: ISearchKey[];

  /**
   * Minimum similarity score (0-1) for a result to be included.
   * Results scoring below this threshold are excluded.
   * @default 0
   */
  threshold?: number;

  /**
   * Maximum number of results to return.
   * @default Infinity
   */
  limit?: number;

  /**
   * Whether search should be case-sensitive.
   * When false (default), both the query and the item strings are lowercased
   * before comparison (case-insensitive search).
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * Include per-key match details in results.
   * When true, results include a `matches` field with individual
   * similarity scores per key.
   * @default false
   */
  includeMatchDetails?: boolean;

  /**
   * Enable LSH-accelerated search for large collections (>1000 items).
   * Uses MinHash + banding as a candidate filter, then re-scores with
   * the exact algorithm. Provides sub-linear query time at the cost of
   * approximate results (some true matches may be missed).
   */
  lsh?: {
    /** Number of hash functions for MinHash signature size. @default 128 */
    numHashes?: number;
    /**
     * Number of bands for LSH banding.
     * More bands = higher recall, lower precision.
     * @default 16
     */
    numBands?: number;
  };
}

/**
 * Options for the {@link findBestMatch} function.
 *
 * @example
 * ```ts
 * const result = findBestMatch("kitten", ["sitting", "kit", "mitten"], {
 *   algorithm: "levenshtein",
 *   threshold: 0.3,
 * });
 * ```
 */
export interface IFindBestMatchOptions {
  /** Similarity algorithm. @default "levenshtein" */
  algorithm?: BuiltinAlgorithm | SimilarityFn;
  /** Keys for object-array search. */
  keys?: ISearchKey[];
  /** Minimum similarity score. @default 0 */
  threshold?: number;
  /** Whether search is case-insensitive. @default false (case-insensitive) */
  caseSensitive?: boolean;
}

// ---------------------------------------------------------------------------
// Built-in algorithm map
// ---------------------------------------------------------------------------

const BUILTIN_ALGORITHMS: Readonly<Record<BuiltinAlgorithm, SimilarityFn>> = {
  levenshtein: levenshteinNormalized,
  lcs: lcsNormalized,
  jaccard: jaccard,
  jaccardNgram: jaccardNgram,
  cosine: cosine,
  cosineNgram: cosineNgram,
  sorensen: sorensen,
  sorensenNgram: sorensenNgram,
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface ResolvedKey extends ISearchKey {
  normalizedWeight: number;
}

function resolveKeys(rawKeys: ISearchKey[]): ResolvedKey[] {
  if (rawKeys.length === 0) return [];
  const totalWeight = rawKeys.reduce((sum, k) => sum + (k.weight ?? 1), 0);
  return rawKeys.map((k) => ({
    ...k,
    normalizedWeight: totalWeight > 0 ? (k.weight ?? 1) / totalWeight : 1 / rawKeys.length,
  }));
}

function resolveAlgorithm(algo: BuiltinAlgorithm | SimilarityFn | undefined): SimilarityFn {
  if (algo === undefined) return BUILTIN_ALGORITHMS.levenshtein;
  if (typeof algo === "function") return algo;
  return BUILTIN_ALGORITHMS[algo];
}

// ---------------------------------------------------------------------------
// FuzzySearch<T>
// ---------------------------------------------------------------------------

/**
 * Fuzzy search engine for finding similar items in a collection.
 *
 * Supports both string arrays and object arrays with weighted multi-key search.
 * Uses any similarity algorithm from @nlptools/distance, with optional LSH
 * acceleration for large datasets.
 *
 * @example
 * ```ts
 * // String array search
 * const search = new FuzzySearch(["apple", "banana", "cherry"]);
 * const results = search.search("aple"); // [{ item: "apple", score: 0.75, index: 0 }]
 *
 * // Object array with weighted keys
 * const books = [
 *   { title: "Old Man's War", author: "John Scalzi" },
 *   { title: "The Lock Artist", author: "Steve Hamilton" },
 * ];
 * const bookSearch = new FuzzySearch(books, {
 *   keys: [
 *     { name: "title", weight: 0.7 },
 *     { name: "author", weight: 0.3 },
 *   ],
 *   algorithm: "cosine",
 * });
 * const results = bookSearch.search("old man"); // finds "Old Man's War"
 * ```
 */
export class FuzzySearch<T> {
  private readonly similarityFn: SimilarityFn;
  private readonly keys: ReadonlyArray<ResolvedKey>;
  private readonly threshold: number;
  private readonly limit: number;
  private readonly caseSensitive: boolean;
  private readonly includeMatchDetails: boolean;
  private readonly isObjectArray: boolean;

  private collection: T[];

  // LSH state
  private readonly useLSH: boolean;
  private readonly lshNumHashes: number;
  private readonly lshNumBands: number;
  private lshIndex: LSH | null;
  private minHashSignatures: Map<number, Uint32Array>;

  constructor(collection: ReadonlyArray<T>, options: IFuzzySearchOptions = {}) {
    this.similarityFn = resolveAlgorithm(options.algorithm);
    this.keys = resolveKeys(options.keys ?? []);
    this.isObjectArray = this.keys.length > 0;
    this.threshold = options.threshold ?? 0;
    this.limit = options.limit ?? Infinity;
    this.caseSensitive = options.caseSensitive ?? false;
    this.includeMatchDetails = options.includeMatchDetails ?? false;
    this.collection = [...collection];

    // LSH
    const lshOpts = options.lsh;
    this.useLSH = lshOpts !== undefined;
    this.lshNumHashes = lshOpts?.numHashes ?? 128;
    this.lshNumBands = lshOpts?.numBands ?? 16;
    this.lshIndex = null;
    this.minHashSignatures = new Map();

    if (this.useLSH && this.collection.length > 0) {
      this.buildLSHIndex();
    }
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Search the collection for items similar to the query.
   *
   * @param query - The search query string
   * @param limit - Optional per-query limit override
   * @returns Array of results sorted by score descending
   */
  search(query: string, limit?: number): ISearchResult<T>[] {
    const effectiveLimit = limit ?? this.limit;
    if (effectiveLimit === 0 || this.collection.length === 0) return [];

    const normalizedQuery = this.normalizeString(query);

    if (this.useLSH && this.lshIndex !== null) {
      return this.searchWithLSH(normalizedQuery, effectiveLimit);
    }

    return this.searchLinear(normalizedQuery, effectiveLimit);
  }

  /**
   * Add an item to the collection.
   * If LSH is enabled, the index is updated incrementally.
   */
  add(item: T): void {
    const index = this.collection.length;
    this.collection.push(item);

    if (this.useLSH && this.lshIndex !== null) {
      const text = this.extractSearchText(item);
      const sig = this.buildMinHashSignature(text);
      this.minHashSignatures.set(index, sig);
      this.lshIndex.insert(String(index), sig);
    }
  }

  /**
   * Remove an item from the collection by index.
   * If LSH is enabled, the index is rebuilt (O(n)).
   *
   * @returns true if the item was found and removed
   */
  remove(index: number): boolean {
    if (index < 0 || index >= this.collection.length) return false;

    this.collection.splice(index, 1);

    if (this.useLSH) {
      this.buildLSHIndex();
    }

    return true;
  }

  /**
   * Replace the entire collection.
   * If LSH is enabled, the index is rebuilt.
   */
  setCollection(collection: ReadonlyArray<T>): void {
    this.collection = [...collection];

    if (this.useLSH && this.collection.length > 0) {
      this.buildLSHIndex();
    } else if (this.useLSH) {
      this.lshIndex = null;
      this.minHashSignatures.clear();
    }
  }

  /**
   * Get the current collection.
   */
  getCollection(): ReadonlyArray<T> {
    return this.collection;
  }

  /**
   * Get the number of items in the collection.
   */
  get size(): number {
    return this.collection.length;
  }

  /**
   * Clear the collection and any LSH index.
   */
  clear(): void {
    this.collection = [];
    this.lshIndex = null;
    this.minHashSignatures.clear();
  }

  // -----------------------------------------------------------------------
  // Linear scan search
  // -----------------------------------------------------------------------

  private searchLinear(normalizedQuery: string, limit: number): ISearchResult<T>[] {
    const candidates: Array<{
      item: T;
      score: number;
      index: number;
      matches?: Record<string, number>;
    }> = [];

    for (let i = 0; i < this.collection.length; i++) {
      const item = this.collection[i];

      if (this.isObjectArray) {
        if (this.includeMatchDetails) {
          const { score, matches } = this.computeDetailedScore(normalizedQuery, item);
          if (score >= this.threshold) {
            candidates.push({ item, score, index: i, matches });
          }
        } else {
          const score = this.computeItemScore(normalizedQuery, item);
          if (score >= this.threshold) {
            candidates.push({ item, score, index: i });
          }
        }
      } else {
        const itemStr = this.normalizeString(item as unknown as string);
        const score = this.similarityFn(normalizedQuery, itemStr);
        if (score >= this.threshold) {
          candidates.push({ item, score, index: i });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    if (candidates.length <= limit) {
      return candidates as ISearchResult<T>[];
    }

    return candidates.slice(0, limit) as ISearchResult<T>[];
  }

  // -----------------------------------------------------------------------
  // LSH-accelerated search
  // -----------------------------------------------------------------------

  private searchWithLSH(normalizedQuery: string, limit: number): ISearchResult<T>[] {
    const queryText = this.isObjectArray ? normalizedQuery : normalizedQuery;
    const querySig = this.buildMinHashSignature(queryText);

    const candidateIds = this.lshIndex!.query(querySig, this.threshold);

    const candidates: Array<{
      item: T;
      score: number;
      index: number;
      matches?: Record<string, number>;
    }> = [];

    for (const [id] of candidateIds) {
      const idx = parseInt(id, 10);
      if (idx < 0 || idx >= this.collection.length) continue;

      const item = this.collection[idx];

      if (this.isObjectArray) {
        if (this.includeMatchDetails) {
          const { score, matches } = this.computeDetailedScore(normalizedQuery, item);
          if (score >= this.threshold) {
            candidates.push({ item, score, index: idx, matches });
          }
        } else {
          const score = this.computeItemScore(normalizedQuery, item);
          if (score >= this.threshold) {
            candidates.push({ item, score, index: idx });
          }
        }
      } else {
        const itemStr = this.normalizeString(item as unknown as string);
        const score = this.similarityFn(normalizedQuery, itemStr);
        if (score >= this.threshold) {
          candidates.push({ item, score, index: idx });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    if (candidates.length <= limit) {
      return candidates as ISearchResult<T>[];
    }

    return candidates.slice(0, limit) as ISearchResult<T>[];
  }

  // -----------------------------------------------------------------------
  // LSH index management
  // -----------------------------------------------------------------------

  private buildLSHIndex(): void {
    this.lshIndex = new LSH({ numBands: this.lshNumBands, numHashes: this.lshNumHashes });
    this.minHashSignatures.clear();

    for (let i = 0; i < this.collection.length; i++) {
      const text = this.extractSearchText(this.collection[i]);
      const sig = this.buildMinHashSignature(text);
      this.minHashSignatures.set(i, sig);
      this.lshIndex.insert(String(i), sig);
    }
  }

  private buildMinHashSignature(text: string): Uint32Array {
    const mh = new MinHash({ numHashes: this.lshNumHashes });
    const grams = ngrams(text, 2);
    for (const g of grams) {
      mh.update(g);
    }
    return mh.digest();
  }

  // -----------------------------------------------------------------------
  // Scoring helpers
  // -----------------------------------------------------------------------

  private computeItemScore(normalizedQuery: string, item: T): number {
    let score = 0;
    for (const key of this.keys) {
      const value = this.extractKeyValue(item, key);
      const normalizedValue = this.normalizeString(value);
      score += key.normalizedWeight * this.similarityFn(normalizedQuery, normalizedValue);
    }
    return score;
  }

  private computeDetailedScore(
    normalizedQuery: string,
    item: T,
  ): { score: number; matches: Record<string, number> } {
    let score = 0;
    const matches: Record<string, number> = {};

    for (const key of this.keys) {
      const value = this.extractKeyValue(item, key);
      const normalizedValue = this.normalizeString(value);
      const s = this.similarityFn(normalizedQuery, normalizedValue);
      matches[key.name] = s;
      score += key.normalizedWeight * s;
    }

    return { score, matches };
  }

  // -----------------------------------------------------------------------
  // String extraction helpers
  // -----------------------------------------------------------------------

  private extractSearchText(item: T): string {
    if (this.isObjectArray) {
      return this.keys.map((k) => this.extractKeyValue(item, k)).join(" ");
    }
    return this.normalizeString(item as unknown as string);
  }

  private extractKeyValue(item: T, key: ISearchKey): string {
    if (key.getter) {
      const value = key.getter(item);
      return typeof value === "string" ? value : "";
    }
    const value = (item as any)[key.name];
    return typeof value === "string" ? value : "";
  }

  private normalizeString(str: string): string {
    return this.caseSensitive ? str : str.toLowerCase();
  }
}

// ---------------------------------------------------------------------------
// findBestMatch convenience function
// ---------------------------------------------------------------------------

/**
 * Find the single best match for a query against a collection.
 *
 * This is a convenience wrapper around {@link FuzzySearch} for one-shot queries.
 * For repeated searches against the same collection, prefer creating a
 * {@link FuzzySearch} instance directly.
 *
 * Time: O(n * k) where n = collection size, k = number of keys
 *
 * @param query - The search query string
 * @param collection - Array of strings or objects to search
 * @param options - Search configuration
 * @returns The best matching result, or null if nothing meets the threshold
 *
 * @example
 * ```ts
 * // String array
 * const result = findBestMatch("kitten", ["sitting", "kit", "mitten"]);
 * console.log(result?.item); // "kit"
 * console.log(result?.score); // 0.5
 *
 * // Object array with weighted keys
 * const books = [
 *   { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
 *   { title: "Great Expectations", author: "Charles Dickens" },
 * ];
 * const result = findBestMatch("grate gatsbi", books, {
 *   keys: [
 *     { name: "title", weight: 0.7 },
 *     { name: "author", weight: 0.3 },
 *   ],
 * });
 * ```
 */
export function findBestMatch<T>(
  query: string,
  collection: ReadonlyArray<T>,
  options: IFindBestMatchOptions = {},
): ISearchResult<T> | null {
  const search = new FuzzySearch<T>(collection, {
    algorithm: options.algorithm,
    keys: options.keys,
    threshold: options.threshold,
    caseSensitive: options.caseSensitive,
  });

  const results = search.search(query, 1);
  return results.length > 0 ? results[0] : null;
}
