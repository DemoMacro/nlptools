/**
 * @nlptools/similarity - Jaccard similarity algorithm implementation
 */
import { resolveLanguage } from "@nlptools/core";
import type {
  ClosestResult,
  SimilarityMeasure,
  SimilarityOptions,
  SimilarityResult,
} from "./interfaces";

/**
 * Calculate Jaccard similarity between two strings
 * Jaccard similarity = size of intersection / size of union
 * @param a First string
 * @param b Second string
 * @param caseSensitive Whether to consider case sensitivity
 * @returns Jaccard similarity and distance
 */
function calculateJaccardSimilarity(
  a: string,
  b: string,
  caseSensitive = false,
): SimilarityResult {
  // Create local variables instead of modifying parameters
  let textA = a;
  let textB = b;

  if (!caseSensitive) {
    textA = textA.toLowerCase();
    textB = textB.toLowerCase();
  }

  // If both strings are empty, consider them completely similar
  if (textA.length === 0 && textB.length === 0) {
    return { similarity: 1, distance: 0 };
  }

  // If one is empty and the other is not, consider them completely dissimilar
  if (textA.length === 0 || textB.length === 0) {
    return { similarity: 0, distance: 1 };
  }

  // Convert strings to character sets
  const setA = new Set(a);
  const setB = new Set(b);

  // Calculate intersection size
  const intersection = new Set([...setA].filter((x) => setB.has(x)));

  // Calculate union size
  const union = new Set([...setA, ...setB]);

  // Calculate Jaccard similarity
  const similarity = intersection.size / union.size;

  // Jaccard distance = 1 - Jaccard similarity
  const distance = 1 - similarity;

  return { similarity, distance };
}

/**
 * Create Jaccard similarity measure
 * @returns Jaccard similarity measure instance
 */
export function createJaccardMeasure(): SimilarityMeasure {
  return {
    /**
     * Calculate Jaccard similarity between two strings
     * @param a First string
     * @param b Second string
     * @param options Calculation options
     * @returns Similarity result
     */
    calculate(
      a: string,
      b: string,
      options?: SimilarityOptions,
    ): SimilarityResult {
      const { caseSensitive = false, lang = "auto" } = options || {};

      // Process language options
      const resolvedLang = resolveLanguage(a + b, lang);

      // Calculate Jaccard similarity
      return calculateJaccardSimilarity(a, b, caseSensitive);
    },

    /**
     * Find the closest string to the query string from candidates
     * @param query Query string
     * @param candidates Candidate strings array
     * @param options Calculation options
     * @returns Closest result
     */
    findClosest(
      query: string,
      candidates: readonly string[],
      options?: SimilarityOptions,
    ): ClosestResult {
      if (!candidates.length) {
        return {
          closest: "",
          similarity: 0,
          distance: 1,
        };
      }

      let maxSimilarity = -1;
      let minDistance = Number.MAX_VALUE;
      let closest = candidates[0];

      for (const candidate of candidates) {
        const result = this.calculate(query, candidate, options);

        if (result.similarity > maxSimilarity) {
          maxSimilarity = result.similarity;
          minDistance = result.distance;
          closest = candidate;
        }
      }

      return {
        closest,
        similarity: maxSimilarity,
        distance: minDistance,
      };
    },
  };
}
