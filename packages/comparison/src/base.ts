/**
 * @nlptools/comparison - Base comparison utilities and shared functionality
 */
import { resolveLanguage } from "@nlptools/core";
import { createSegmenter } from "@nlptools/segmentation";
import type { ComparisonOptions, SegmentationLevel } from "./interfaces";

/**
 * Extended base comparison options with common algorithm selection features
 */
export interface ExtendedBaseComparisonOptions extends ComparisonOptions {
  /**
   * Whether to automatically select the best algorithm based on segmentation level
   * @default true
   */
  autoSelectAlgorithm?: boolean;

  /**
   * Whether to include detailed match information
   * @default false
   */
  includeDetails?: boolean;
}

/**
 * Base comparison class with shared functionality
 */
export class BaseComparison {
  /**
   * Process text segments with common preprocessing steps
   * @param source Source text
   * @param target Target text
   * @param options Comparison options
   * @returns Processed segments and resolved language
   */
  public processTextSegments(
    source: string,
    target: string,
    options: ComparisonOptions,
  ) {
    const {
      lang = "auto",
      ignoreCase = false,
      segmentationLevel = "paragraphs",
    } = options;

    // Process language option
    const resolvedLang = resolveLanguage(source + target, lang);

    // Create text segmenter
    const segmenter = createSegmenter(segmentationLevel);

    // Segment source and target texts
    const sourceSegments = segmenter.segment(source, { lang: resolvedLang });
    const targetSegments = segmenter.segment(target, { lang: resolvedLang });

    // If case should be ignored, convert text to lowercase
    if (ignoreCase) {
      sourceSegments.forEach((segment, index) => {
        sourceSegments[index] = segment.toLowerCase();
      });
      targetSegments.forEach((segment, index) => {
        targetSegments[index] = segment.toLowerCase();
      });
    }

    return {
      sourceSegments,
      targetSegments,
      resolvedLang,
    };
  }

  /**
   * Create details object with common fields
   * @param sourceSegments Source segments
   * @param targetSegments Target segments
   * @param algorithm Algorithm used
   * @param segmentationLevel Segmentation level
   * @returns Common details object
   */
  public createCommonDetails(
    sourceSegments: string[],
    targetSegments: string[],
    algorithm: string,
    segmentationLevel: SegmentationLevel,
  ) {
    return {
      sourceSize: sourceSegments.length,
      targetSize: targetSegments.length,
      algorithm,
      segmentationLevel,
    };
  }
}

/**
 * Algorithm selection utility functions
 */
export const AlgorithmSelector = {
  /**
   * Get the most suitable diff algorithm for a given segmentation level
   * @param segmentationLevel Segmentation level
   * @returns Most suitable diff algorithm
   */
  getBestDiffAlgorithm(
    segmentationLevel: SegmentationLevel,
  ): "lcs" | "myers" | "patience" {
    switch (segmentationLevel) {
      case "paragraphs":
        // For paragraphs, patience algorithm works well for structured text
        return "patience";
      case "sentences":
        // For sentences, LCS works well
        return "lcs";
      case "phrases":
      case "words":
        // For smaller units, Myers algorithm is efficient
        return "myers";
      default:
        return "lcs";
    }
  },

  /**
   * Get the most suitable similarity algorithm for a given segmentation level
   * @param segmentationLevel Segmentation level
   * @returns Most suitable similarity algorithm
   */
  getBestSimilarityAlgorithm(
    segmentationLevel: SegmentationLevel,
  ): "levenshtein" | "jaccard" | "cosine" | "consecutive" {
    switch (segmentationLevel) {
      case "paragraphs":
        // For paragraphs, consecutive matching is good for plagiarism detection
        return "consecutive";
      case "sentences":
        // For sentences, Levenshtein works well
        return "levenshtein";
      case "phrases":
        // For phrases, cosine similarity works well
        return "cosine";
      case "words":
        // For words, Jaccard similarity works well
        return "jaccard";
      default:
        return "levenshtein";
    }
  },
};
