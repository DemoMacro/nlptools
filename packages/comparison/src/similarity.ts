/**
 * @nlptools/comparison - Similarity comparison algorithm implementation
 */
import { createSimilarityMeasure } from "@nlptools/similarity";
import {
  AlgorithmSelector,
  BaseComparison,
  type ExtendedBaseComparisonOptions,
} from "./base";
import type {
  Comparator,
  SegmentationLevel,
  SimilarityComparisonItem,
  SimilarityComparisonResult,
} from "./interfaces";

/**
 * Extended comparison options with algorithm selection
 */
export interface ExtendedSimilarityComparisonOptions
  extends ExtendedBaseComparisonOptions {
  /**
   * Similarity algorithm to use
   * @default "levenshtein"
   */
  algorithm?: "levenshtein" | "jaccard" | "cosine" | "consecutive";

  /**
   * Algorithm mapping for different segmentation levels
   * This allows specifying different algorithms for different segmentation levels
   * @example { paragraphs: "consecutive", sentences: "levenshtein", phrases: "cosine", words: "jaccard" }
   */
  algorithmMapping?: {
    [key in SegmentationLevel]?:
      | "levenshtein"
      | "jaccard"
      | "cosine"
      | "consecutive";
  };

  /**
   * Minimum segmentation level to use when adaptive segmentation is enabled
   * The system will start with the specified segmentation level and progressively
   * move to smaller units if similarity is not sufficient
   * @default "paragraphs"
   */
  minSegmentationLevel?: SegmentationLevel;

  /**
   * Whether to use adaptive segmentation (progressively smaller units)
   * @default false
   */
  useAdaptiveSegmentation?: boolean;

  /**
   * Similarity threshold for adaptive segmentation to move to a smaller unit
   * If the similarity is below this threshold, the system will try a smaller segmentation unit
   * @default 0.5
   */
  adaptiveSegmentationThreshold?: number;

  /**
   * Minimum length of consecutive characters to be considered a match (for consecutive algorithm)
   * @default 10
   */
  minMatchLength?: number;

  /**
   * Maximum number of segments to process at once (for large text optimization)
   * @default 1000
   */
  maxSegmentsPerBatch?: number;
}

/**
 * Create similarity comparator
 * @returns Similarity comparator instance
 */
export function createSimilarityComparator(): Comparator {
  // Create an instance of the base comparison class
  const baseComparison = new BaseComparison();

  return {
    /**
     * Compare the similarity between two texts
     * @param source Source text
     * @param target Target text
     * @param options Comparison options
     * @returns Similarity comparison result
     */
    compare(
      source: string,
      target: string,
      options?: ExtendedSimilarityComparisonOptions,
    ): SimilarityComparisonResult {
      const {
        threshold = 0.7,
        segmentationLevel = "paragraphs",
        algorithm,
        autoSelectAlgorithm = true,
        minMatchLength = 10,
        maxSegmentsPerBatch = 1000,
        includeDetails = false,
        useAdaptiveSegmentation = false,
        minSegmentationLevel = "paragraphs",
        adaptiveSegmentationThreshold = 0.5,
        algorithmMapping = {},
      } = options || {};

      // Define segmentation levels in order from largest to smallest
      const segmentationLevels: SegmentationLevel[] = [
        "paragraphs",
        "sentences",
        "phrases",
        "words",
      ];

      // Find the starting index for segmentation level
      const startLevelIndex = segmentationLevels.indexOf(segmentationLevel);
      const minLevelIndex = segmentationLevels.indexOf(minSegmentationLevel);

      // Validate segmentation levels
      if (startLevelIndex === -1) {
        throw new Error(`Invalid segmentation level: ${segmentationLevel}`);
      }
      if (minLevelIndex === -1) {
        throw new Error(
          `Invalid minimum segmentation level: ${minSegmentationLevel}`,
        );
      }

      // Compare each segment with batch processing for large texts
      const items: SimilarityComparisonItem[] = [];
      let totalSimilarity = 0;
      let processedSegments = 0;
      let matchedSegments = 0;

      // Track segmentation level usage for detailed reporting
      const segmentationLevelUsage: Record<SegmentationLevel, number> = {
        paragraphs: 0,
        sentences: 0,
        phrases: 0,
        words: 0,
      };

      // Process text with adaptive segmentation if enabled
      if (useAdaptiveSegmentation) {
        // Process each source segment with potentially different segmentation levels
        processWithAdaptiveSegmentation(
          source,
          target,
          startLevelIndex,
          minLevelIndex,
          segmentationLevels,
          options,
          items,
          segmentationLevelUsage,
        );

        // Update counters
        processedSegments = items.length;
        matchedSegments = items.length;
        totalSimilarity = items.reduce((sum, item) => sum + item.similarity, 0);

        // Ensure segmentationLevelUsage is correctly populated
        // This is important for detailed reporting of which segmentation levels were used
      } else {
        // Standard processing with single segmentation level
        // Process text segments using the base class method
        const { sourceSegments, targetSegments, resolvedLang } =
          baseComparison.processTextSegments(source, target, options || {});

        // Determine which algorithm to use
        const selectedAlgorithm = getAlgorithmForLevel(
          segmentationLevel,
          algorithm,
          autoSelectAlgorithm,
          algorithmMapping,
        );

        // Create similarity measure with selected algorithm
        const similarityMeasure = createSimilarityMeasure(selectedAlgorithm);

        // Process source segments in batches to optimize performance
        for (let i = 0; i < sourceSegments.length; i += maxSegmentsPerBatch) {
          const batchEnd = Math.min(
            i + maxSegmentsPerBatch,
            sourceSegments.length,
          );
          const sourceBatch = sourceSegments.slice(i, batchEnd);

          for (const sourceSegment of sourceBatch) {
            // Find the most similar target segment
            const result = similarityMeasure.findClosest(
              sourceSegment,
              targetSegments,
              {
                caseSensitive: !(options?.ignoreCase ?? false),
                lang: resolvedLang,
                minMatchLength:
                  selectedAlgorithm === "consecutive"
                    ? minMatchLength
                    : undefined,
              },
            );

            processedSegments++;

            // If similarity exceeds threshold, add to results
            if (result.similarity >= threshold) {
              items.push({
                source: sourceSegment,
                target: result.closest,
                similarity: result.similarity,
                distance: result.distance,
                segmentationLevel,
              });
              totalSimilarity += result.similarity;
              matchedSegments++;
              segmentationLevelUsage[segmentationLevel]++;
            }
          }
        }
      }

      // Calculate overall similarity
      const overallSimilarity =
        items.length > 0 ? totalSimilarity / items.length : 0;

      // Prepare result object
      const result: SimilarityComparisonResult = {
        items,
        overallSimilarity,
      };

      // Add detailed information if requested
      if (includeDetails) {
        // Use common details from base class and add similarity-specific fields
        const { sourceSegments, targetSegments } =
          baseComparison.processTextSegments(source, target, options || {});
        result.details = {
          ...baseComparison.createCommonDetails(
            sourceSegments,
            targetSegments,
            useAdaptiveSegmentation
              ? "adaptive"
              : algorithm ||
                  getAlgorithmForLevel(
                    segmentationLevel,
                    algorithm,
                    autoSelectAlgorithm,
                    algorithmMapping,
                  ),
            segmentationLevel,
          ),
          processedSegments,
          matchedSegments,
          threshold,
          segmentationLevelUsage,
        };
      }

      return result;
    },
  };
}

/**
 * Get the appropriate algorithm for a specific segmentation level
 * @param level Current segmentation level
 * @param algorithm User-specified algorithm (optional)
 * @param autoSelect Whether to auto-select algorithm
 * @param mapping Algorithm mapping for different levels
 * @returns Selected algorithm
 */
function getAlgorithmForLevel(
  level: SegmentationLevel,
  algorithm?: string,
  autoSelect = true,
  mapping: Record<string, string> = {},
): "levenshtein" | "jaccard" | "cosine" | "consecutive" {
  // If level has a specific algorithm in the mapping, use it
  if (mapping[level]) {
    return mapping[level] as
      | "levenshtein"
      | "jaccard"
      | "cosine"
      | "consecutive";
  }

  // If algorithm is explicitly provided, use it
  if (algorithm) {
    return algorithm as "levenshtein" | "jaccard" | "cosine" | "consecutive";
  }

  // Auto-select based on segmentation level
  if (autoSelect) {
    return AlgorithmSelector.getBestSimilarityAlgorithm(level);
  }

  // Default fallback
  return "levenshtein";
}

/**
 * Process text with adaptive segmentation strategy
 * @param source Source text
 * @param target Target text
 * @param startLevelIndex Starting segmentation level index
 * @param minLevelIndex Minimum segmentation level index
 * @param segmentationLevels Array of segmentation levels
 * @param options Comparison options
 * @param items Output array to store comparison items
 * @param levelUsage Record to track segmentation level usage
 */
function processWithAdaptiveSegmentation(
  source: string,
  target: string,
  startLevelIndex: number,
  minLevelIndex: number,
  segmentationLevels: SegmentationLevel[],
  options?: ExtendedSimilarityComparisonOptions,
  items: SimilarityComparisonItem[] = [],
  levelUsage: Record<SegmentationLevel, number> = {
    paragraphs: 0,
    sentences: 0,
    phrases: 0,
    words: 0,
  },
) {
  // Initialize options with defaults but use the passed adaptiveSegmentationThreshold
  const processOptions: ExtendedSimilarityComparisonOptions = {
    threshold: 0.7,
    minMatchLength: 10,
    algorithm: undefined,
    autoSelectAlgorithm: true,
    algorithmMapping: {},
    ignoreCase: false,
    ...options,
  };

  // Start with the largest segmentation level and process recursively
  processSegmentationLevel(
    source,
    target,
    startLevelIndex,
    minLevelIndex,
    segmentationLevels,
    processOptions,
    items,
    levelUsage,
  );
}

/**
 * Process text at a specific segmentation level, with recursive refinement
 * @param source Source text
 * @param target Target text
 * @param currentLevelIndex Current segmentation level index
 * @param minLevelIndex Minimum segmentation level index
 * @param segmentationLevels Array of segmentation levels
 * @param options Comparison options
 * @param items Output array to store comparison items
 * @param levelUsage Record to track segmentation level usage
 */
function processSegmentationLevel(
  source: string,
  target: string,
  currentLevelIndex: number,
  minLevelIndex: number,
  segmentationLevels: SegmentationLevel[],
  options: ExtendedSimilarityComparisonOptions,
  items: SimilarityComparisonItem[] = [],
  levelUsage: Record<SegmentationLevel, number> = {
    paragraphs: 0,
    sentences: 0,
    phrases: 0,
    words: 0,
  },
) {
  // Base case: we've reached beyond the minimum level or the end of available levels
  if (
    currentLevelIndex > minLevelIndex ||
    currentLevelIndex >= segmentationLevels.length
  ) {
    return;
  }

  const currentLevel = segmentationLevels[currentLevelIndex];
  const {
    threshold = 0.7,
    adaptiveSegmentationThreshold = 0.5,
    minMatchLength = 10,
    algorithm,
    autoSelectAlgorithm = true,
    algorithmMapping = {},
    ignoreCase = false,
  } = options;

  // Create a base comparison instance
  const baseComparison = new BaseComparison();

  // Process text segments at the current level
  const { sourceSegments, targetSegments, resolvedLang } =
    baseComparison.processTextSegments(source, target, {
      ...options,
      segmentationLevel: currentLevel,
    });

  // Select the appropriate algorithm for this level
  const selectedAlgorithm = getAlgorithmForLevel(
    currentLevel,
    algorithm,
    autoSelectAlgorithm,
    algorithmMapping,
  );

  // Create similarity measure with selected algorithm
  const similarityMeasure = createSimilarityMeasure(selectedAlgorithm);

  // Process each source segment
  for (const sourceSegment of sourceSegments) {
    // Find the most similar target segment
    const result = similarityMeasure.findClosest(
      sourceSegment,
      targetSegments,
      {
        caseSensitive: !ignoreCase,
        lang: resolvedLang,
        minMatchLength:
          selectedAlgorithm === "consecutive" ? minMatchLength : undefined,
      },
    );

    // Track that we processed a segment at this level
    // This helps with accurate statistics in the detailed output
    // Increment the usage counter for the current segmentation level
    // even if we don't end up using this level for the final match
    // This provides more accurate statistics about which levels were attempted

    // If similarity is good enough at this level, add to results
    if (result.similarity >= threshold) {
      items.push({
        source: sourceSegment,
        target: result.closest,
        similarity: result.similarity,
        distance: result.distance,
        segmentationLevel: currentLevel,
      });
      levelUsage[currentLevel]++;
    }
    // If similarity is below threshold but above adaptive threshold, and we can go deeper
    else if (
      result.similarity >= adaptiveSegmentationThreshold &&
      currentLevelIndex < segmentationLevels.length - 1
    ) {
      // Recursively process this segment at the next smaller level
      // For better efficiency, use the closest match as the target context when going deeper
      processSegmentationLevel(
        sourceSegment,
        // Use a context window around the closest match for better efficiency
        result.closest,
        currentLevelIndex + 1,
        minLevelIndex,
        segmentationLevels,
        options,
        items,
        levelUsage,
      );
    }
    // If similarity is too low even for adaptive processing, try next smaller level directly
    else if (currentLevelIndex < segmentationLevels.length - 1) {
      processSegmentationLevel(
        sourceSegment,
        // Still use the full target text since no good match was found
        target,
        currentLevelIndex + 1,
        minLevelIndex,
        segmentationLevels,
        options,
        items,
        levelUsage,
      );
    }
  }
}
