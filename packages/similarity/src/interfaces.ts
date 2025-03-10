/**
 * @nlptools/similarity - Similarity calculation interface definitions
 */
import { type BaseOptions, TextProcessingResult } from "@nlptools/core";

/**
 * Similarity calculation result
 */
export interface SimilarityResult {
  /**
   * Similarity value, range 0-1, higher value indicates greater similarity
   */
  similarity: number;

  /**
   * Distance value, smaller value indicates greater similarity
   */
  distance: number;
}

/**
 * Closest match result
 */
export interface ClosestResult extends SimilarityResult {
  /**
   * The closest matching string
   */
  closest: string;
}

/**
 * Similarity calculation options
 */
export interface SimilarityOptions extends BaseOptions {
  /**
   * Whether to be case-sensitive
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * Minimum length of consecutive characters to be considered a match (for consecutive algorithm)
   * @default 10
   */
  minMatchLength?: number;
}

/**
 * Similarity measure interface
 */
export interface SimilarityMeasure {
  /**
   * Calculate the similarity between two strings
   * @param a First string
   * @param b Second string
   * @param options Calculation options
   * @returns Similarity result
   */
  calculate(
    a: string,
    b: string,
    options?: SimilarityOptions,
  ): SimilarityResult;

  /**
   * Find the most similar string to the query string from an array of candidates
   * @param query Query string
   * @param candidates Array of candidate strings
   * @param options Calculation options
   * @returns Closest match result
   */
  findClosest(
    query: string,
    candidates: readonly string[],
    options?: SimilarityOptions,
  ): ClosestResult;
}

/**
 * Similarity algorithm type
 */
export type SimilarityAlgorithm =
  | "levenshtein"
  | "jaccard"
  | "cosine"
  | "consecutive";

/**
 * Create similarity measure
 * @param algorithm Algorithm type
 * @returns Similarity measure instance
 */
export function createSimilarityMeasure(
  algorithm: SimilarityAlgorithm,
): SimilarityMeasure {
  switch (algorithm) {
    case "levenshtein":
      // This will be imported in the implementation file
      throw new Error("Not implemented yet");
    case "jaccard":
      throw new Error("Not implemented yet");
    case "cosine":
      throw new Error("Not implemented yet");
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}
