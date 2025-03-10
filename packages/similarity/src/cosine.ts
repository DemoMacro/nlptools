/**
 * @nlptools/similarity - Cosine similarity algorithm implementation
 */
import { resolveLanguage } from "@nlptools/core";
import type {
  ClosestResult,
  SimilarityMeasure,
  SimilarityOptions,
  SimilarityResult,
} from "./interfaces";

/**
 * Calculate Cosine similarity between two strings
 * Cosine similarity = dot product / (magnitude of vector A * magnitude of vector B)
 * @param a First string
 * @param b Second string
 * @param caseSensitive Whether to consider case sensitivity
 * @returns Cosine similarity and distance
 */
function calculateCosineSimilarity(
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

  // Build character frequency vectors
  const vectorA: Record<string, number> = {};
  const vectorB: Record<string, number> = {};

  // Count character frequencies
  for (const char of a) {
    vectorA[char] = (vectorA[char] || 0) + 1;
  }

  for (const char of b) {
    vectorB[char] = (vectorB[char] || 0) + 1;
  }

  // Calculate dot product
  let dotProduct = 0;
  for (const char in vectorA) {
    if (vectorB[char]) {
      dotProduct += vectorA[char] * vectorB[char];
    }
  }

  // Calculate vector magnitudes
  let magnitudeA = 0;
  for (const char in vectorA) {
    magnitudeA += vectorA[char] * vectorA[char];
  }
  magnitudeA = Math.sqrt(magnitudeA);

  let magnitudeB = 0;
  for (const char in vectorB) {
    magnitudeB += vectorB[char] * vectorB[char];
  }
  magnitudeB = Math.sqrt(magnitudeB);

  // Calculate Cosine similarity
  const similarity = dotProduct / (magnitudeA * magnitudeB);

  // Cosine distance = 1 - Cosine similarity
  const distance = 1 - similarity;

  return { similarity, distance };
}

/**
 * Create Cosine similarity measure
 * @returns Cosine similarity measure instance
 */
export function createCosineMeasure(): SimilarityMeasure {
  return {
    /**
     * Calculate Cosine similarity between two strings
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

      // Calculate Cosine similarity
      return calculateCosineSimilarity(a, b, caseSensitive);
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
