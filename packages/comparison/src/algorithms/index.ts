import { createConsecutiveMeasure } from "./consecutive";
import { createCosineMeasure } from "./cosine";
import type {
  ClosestResult,
  SimilarityAlgorithm,
  SimilarityMeasure,
  SimilarityOptions,
  SimilarityResult,
} from "./interfaces";
import { createJaccardMeasure } from "./jaccard";
import { createLevenshteinMeasure } from "./levenshtein";

// Register algorithm implementations
const measureFactories: Record<SimilarityAlgorithm, () => SimilarityMeasure> = {
  levenshtein: createLevenshteinMeasure,
  jaccard: createJaccardMeasure,
  cosine: createCosineMeasure,
  consecutive: createConsecutiveMeasure,
};

// Implement the createSimilarityMeasure function
function createSimilarityMeasure(
  algorithm: SimilarityAlgorithm,
): SimilarityMeasure {
  const factory = measureFactories[algorithm];
  if (!factory) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
  return factory();
}

// Export public API
export type {
  SimilarityMeasure,
  SimilarityAlgorithm,
  SimilarityResult,
  ClosestResult,
  SimilarityOptions,
};
export { createSimilarityMeasure };
