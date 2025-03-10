/**
 * @nlptools/segmentation - Phrase segmentation algorithm implementation
 */
import { resolveLanguage } from "@nlptools/core";
import type { SegmentationOptions, Segmenter } from "./interfaces";

/**
 * Split text into phrases (English)
 * @param text Text to be segmented
 * @returns Array of segmented phrases
 */
function segmentEnglishPhrases(text: string): string[] {
  return text
    .replace(/([,.;:?!])/gm, "$1\r\n")
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Split text into phrases (Chinese)
 * @param text Text to be segmented
 * @returns Array of segmented phrases
 */
function segmentChinesePhrases(text: string): string[] {
  return text
    .replace(/([，。；：？！])/gm, "$1\r\n")
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Create phrase segmenter
 * @returns Phrase segmenter instance
 */
export function createPhrasesSegmenter(): Segmenter {
  return {
    /**
     * Split text into phrases
     * @param text Text to be segmented
     * @param options Segmentation options
     * @returns Array of segmented phrases
     */
    segment(text: string, options?: SegmentationOptions): string[] {
      const { lang = "auto" } = options || {};

      // Process language options
      const resolvedLang = resolveLanguage(text, lang);

      // Choose segmentation method based on language
      if (resolvedLang === "zh") {
        return segmentChinesePhrases(text);
      }
      return segmentEnglishPhrases(text);
    },
  };
}
