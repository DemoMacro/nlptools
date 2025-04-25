/**
 * @nlptools/comparison - Text comparison interface definitions
 */
import type { BaseOptions, SupportedLanguages } from "@nlptools/core";
import type { TokenizationType } from "@nlptools/tokenization";
import type { SimilarityResult } from "./algorithms";

/**
 * Comparison type
 */
export type ComparisonType = "similarity" | "diff";

/**
 * Segmentation level
 */
export type SegmentationLevel =
  | "paragraphs"
  | "sentences"
  | "phrases"
  | "words";

/**
 * Comparison options
 */
export interface ComparisonOptions extends BaseOptions {
  /**
   * Language
   * @default "auto"
   */
  lang?: SupportedLanguages;

  /**
   * Whether to be case-sensitive
   * @default false
   */
  ignoreCase?: boolean;

  /**
   * Similarity threshold
   * @default 0.7
   */
  threshold?: number;

  /**
   * Segmentation level
   * @default "paragraphs"
   */
  segmentationLevel?: SegmentationLevel;
}

/**
 * Similarity comparison result item
 */
export interface SimilarityComparisonItem extends SimilarityResult {
  /**
   * Source text
   */
  source: string;

  /**
   * Target text
   */
  target: string;

  /**
   * Segmentation level
   */
  segmentationLevel: SegmentationLevel;
}

/**
 * Similarity comparison result
 */
export interface SimilarityComparisonResult {
  /**
   * List of comparison result items
   */
  items: SimilarityComparisonItem[];

  /**
   * Overall similarity
   */
  overallSimilarity: number;

  /**
   * Detailed comparison information
   * Only available if includeDetails is true
   */
  details?: {
    /**
     * Number of segments in source text
     */
    sourceSize: number;

    /**
     * Number of segments in target text
     */
    targetSize: number;

    /**
     * Number of processed segments
     */
    processedSegments: number;

    /**
     * Number of matched segments
     */
    matchedSegments: number;

    /**
     * Algorithm used for comparison
     */
    algorithm: string;

    /**
     * Segmentation level used for comparison
     */
    segmentationLevel: SegmentationLevel;

    /**
     * Similarity threshold used
     */
    threshold: number;

    /**
     * Segmentation level usage statistics
     * Shows how many segments were matched at each level
     * Only available when useAdaptiveSegmentation is true
     */
    segmentationLevelUsage?: Record<SegmentationLevel, number>;
  };
}

/**
 * Difference comparison result
 */
export interface DiffComparisonResult {
  /**
   * List of difference items
   */
  changes: Array<{
    /**
     * Change type: added, removed, or unchanged
     */
    type: "added" | "removed" | "unchanged";

    /**
     * Text content
     */
    value: string;
  }>;

  /**
   * Similarity ratio between source and target (0-1)
   * Only available if calculateSimilarity is true
   */
  similarityRatio?: number;

  /**
   * Detailed comparison information
   * Only available if includeDetails is true
   */
  details?: {
    /**
     * Number of segments in source text
     */
    sourceSize: number;

    /**
     * Number of segments in target text
     */
    targetSize: number;

    /**
     * Number of added segments
     */
    addedCount: number;

    /**
     * Number of removed segments
     */
    removedCount: number;

    /**
     * Number of unchanged segments
     */
    unchangedCount: number;

    /**
     * Algorithm used for comparison
     */
    algorithm: string;

    /**
     * Segmentation level used for comparison
     */
    segmentationLevel: SegmentationLevel;

    /**
     * Segmentation level usage statistics
     * Shows how many segments were processed at each level
     * Only available when useAdaptiveSegmentation is true
     */
    segmentationLevelUsage?: Record<SegmentationLevel, number>;
  };
}

/**
 * Comparator interface
 */
export interface Comparator {
  /**
   * Compare two texts
   * @param source Source text
   * @param target Target text
   * @param options Comparison options
   * @returns Comparison result
   */
  compare(
    source: string,
    target: string,
    options?: ComparisonOptions,
  ): SimilarityComparisonResult | DiffComparisonResult;
}
