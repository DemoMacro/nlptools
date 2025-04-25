/**
 * @nlptools/comparison - Consecutive character matching similarity algorithm implementation
 * This algorithm is designed for plagiarism detection similar to academic paper checking systems
 */
import type {
  ClosestResult,
  SimilarityMeasure,
  SimilarityOptions,
  SimilarityResult,
} from "./interfaces";

/**
 * Extended similarity options for consecutive matching
 */
export interface ConsecutiveMatchingOptions extends SimilarityOptions {
  // minMatchLength is now defined in the base SimilarityOptions interface
}

/**
 * Find all consecutive character matches between two strings
 * @param a First string
 * @param b Second string
 * @param minMatchLength Minimum length of consecutive characters to be considered a match
 * @param caseSensitive Whether to consider case sensitivity
 * @returns Array of matches with their positions
 */
function findConsecutiveMatches(
  a: string,
  b: string,
  minMatchLength = 10,
  caseSensitive = false,
): Array<{ aIndex: number; bIndex: number; length: number }> {
  // Create local variables instead of modifying parameters
  let textA = a;
  let textB = b;

  if (!caseSensitive) {
    textA = textA.toLowerCase();
    textB = textB.toLowerCase();
  }

  const matches: Array<{ aIndex: number; bIndex: number; length: number }> = [];

  // If either string is empty, return empty matches
  if (textA.length === 0 || textB.length === 0) {
    return matches;
  }

  // Create a suffix array-like approach for finding matches
  // This is a simplified implementation of the longest common substring algorithm
  const matrix: number[][] = Array(textA.length + 1)
    .fill(null)
    .map(() => Array(textB.length + 1).fill(0));

  // Fill the matrix
  for (let i = 1; i <= textA.length; i++) {
    for (let j = 1; j <= textB.length; j++) {
      if (textA[i - 1] === textB[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;

        // If we found a match of sufficient length
        if (matrix[i][j] >= minMatchLength) {
          // Check if this is the end of a match
          if (
            i === textA.length ||
            j === textB.length ||
            textA[i] !== textB[j]
          ) {
            // Calculate the start positions and length
            const matchLength = matrix[i][j];
            const aStartIndex = i - matchLength;
            const bStartIndex = j - matchLength;

            // Add to matches
            matches.push({
              aIndex: aStartIndex,
              bIndex: bStartIndex,
              length: matchLength,
            });
          }
        }
      } else {
        matrix[i][j] = 0;
      }
    }
  }

  return matches;
}

/**
 * Calculate similarity based on consecutive character matches
 * @param a First string
 * @param b Second string
 * @param minMatchLength Minimum length of consecutive characters to be considered a match
 * @param caseSensitive Whether to consider case sensitivity
 * @returns Similarity result
 */
function calculateConsecutiveSimilarity(
  a: string,
  b: string,
  minMatchLength = 10,
  caseSensitive = false,
): SimilarityResult {
  // If both strings are empty, consider them completely similar
  if (a.length === 0 && b.length === 0) {
    return { similarity: 1, distance: 0 };
  }

  // If one is empty and the other is not, consider them completely dissimilar
  if (a.length === 0 || b.length === 0) {
    return { similarity: 0, distance: 1 };
  }

  // Find all consecutive matches
  const matches = findConsecutiveMatches(a, b, minMatchLength, caseSensitive);

  // Calculate total matched characters
  const totalMatchedChars = matches.reduce(
    (sum, match) => sum + match.length,
    0,
  );

  // Calculate similarity as the ratio of matched characters to the average length
  const averageLength = (a.length + b.length) / 2;
  const similarity = totalMatchedChars / averageLength;

  // Calculate distance as 1 - similarity
  const distance = 1 - similarity;

  return { similarity, distance };
}

/**
 * Create consecutive matching similarity measure
 * @returns Consecutive matching similarity measure instance
 */
export function createConsecutiveMeasure(): SimilarityMeasure {
  return {
    /**
     * Calculate consecutive matching similarity between two strings
     * @param a First string
     * @param b Second string
     * @param options Calculation options
     * @returns Similarity result
     */
    calculate(
      a: string,
      b: string,
      options?: ConsecutiveMatchingOptions,
    ): SimilarityResult {
      const {
        caseSensitive = false,
        lang = "auto",
        minMatchLength = 10,
      } = options || {};

      // Calculate consecutive matching similarity
      return calculateConsecutiveSimilarity(
        a,
        b,
        minMatchLength,
        caseSensitive,
      );
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
      options?: ConsecutiveMatchingOptions,
    ): ClosestResult {
      const {
        caseSensitive = false,
        lang = "auto",
        minMatchLength = 10,
      } = options || {};

      // If no candidates, return empty result
      if (candidates.length === 0) {
        return {
          closest: "",
          similarity: 0,
          distance: 1,
        };
      }

      // Calculate similarity for each candidate
      let maxSimilarity = -1;
      let minDistance = Number.MAX_VALUE;
      let closestString = candidates[0];

      for (const candidate of candidates) {
        const result = calculateConsecutiveSimilarity(
          query,
          candidate,
          minMatchLength,
          caseSensitive,
        );

        if (result.similarity > maxSimilarity) {
          maxSimilarity = result.similarity;
          minDistance = result.distance;
          closestString = candidate;
        }
      }

      return {
        closest: closestString,
        similarity: maxSimilarity,
        distance: minDistance,
      };
    },
  };
}
