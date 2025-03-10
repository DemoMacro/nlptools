import { AlgorithmSelector, BaseComparison } from "./base";
/**
 * @nlptools/comparison - Text comparison utilities
 */
import { createDiffComparator } from "./diff";
import type {
  Comparator,
  ComparisonOptions,
  ComparisonType,
  SegmentationLevel,
} from "./interfaces";
import { createSimilarityComparator } from "./similarity";

// Register comparator implementations
const comparatorFactories: Record<ComparisonType, () => Comparator> = {
  similarity: createSimilarityComparator,
  diff: createDiffComparator,
};

// Implement the createComparator function
export function createComparator(type: ComparisonType): Comparator {
  const factory = comparatorFactories[type];
  if (!factory) {
    throw new Error(`Unsupported comparison type: ${type}`);
  }
  return factory();
}

// Export base classes and utilities for extensibility
export { BaseComparison, AlgorithmSelector };

// Export types
export type {
  ComparisonType,
  Comparator,
  ComparisonOptions,
  SegmentationLevel,
};

// Export all interfaces
export * from "./interfaces";

// Export factory functions directly
export { createDiffComparator, createSimilarityComparator };

// Export all interfaces
export * from "./interfaces";
