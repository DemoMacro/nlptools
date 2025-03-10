/**
 * @nlptools/segmentation - Text segmentation interface definitions
 */
import type { BaseOptions, SupportedLanguages } from "@nlptools/core";

/**
 * Supported language types
 */
export type SupportedLanguage = SupportedLanguages;

/**
 * Segmentation types
 */
export type SegmentationType = "paragraphs" | "sentences" | "phrases" | "words";

/**
 * Segmentation options
 */
export interface SegmentationOptions extends BaseOptions {
  /**
   * Language
   * @default "auto"
   */
  lang?: SupportedLanguage;

  /**
   * Chinese dictionary (only for words segmentation type)
   */
  chineseDictionary?: string[];
}

/**
 * Segmenter interface
 */
export interface Segmenter {
  /**
   * Segment text into fragments
   * @param text Text to be segmented
   * @param options Segmentation options
   * @returns Array of segmented text fragments
   */
  segment(text: string, options?: SegmentationOptions): string[];
}

/**
 * Create segmenter
 * @param type Segmentation type
 * @returns Segmenter instance
 */
export function createSegmenter(type: SegmentationType): Segmenter {
  switch (type) {
    case "paragraphs":
      // This will be imported in the implementation file
      throw new Error("Not implemented yet");
    case "sentences":
      throw new Error("Not implemented yet");
    case "phrases":
      throw new Error("Not implemented yet");
    case "words":
      throw new Error("Not implemented yet");
    default:
      throw new Error(`Unsupported segmentation type: ${type}`);
  }
}
