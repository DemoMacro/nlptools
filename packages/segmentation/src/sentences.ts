/**
 * @nlptools/segmentation - Sentence segmentation algorithm implementation
 */
import { resolveLanguage } from "@nlptools/core";
import type { SegmentationOptions, Segmenter } from "./interfaces";

/**
 * Split text into sentences (English)
 * @param text Text to be segmented
 * @returns Array of segmented sentences
 */
function segmentEnglishSentences(text: string): string[] {
  return text
    .replace(/([.;?!])/gm, "$1\r\n")
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Split text into sentences (Chinese)
 * @param text Text to be segmented
 * @returns Array of segmented sentences
 */
function segmentChineseSentences(text: string): string[] {
  return text
    .replace(/([。；？！])/gm, "$1\r\n")
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Create sentence segmenter
 * @returns Sentence segmenter instance
 */
export function createSentencesSegmenter(): Segmenter {
  return {
    /**
     * Split text into sentences
     * @param text Text to be segmented
     * @param options Segmentation options
     * @returns Array of segmented sentences
     */
    segment(text: string, options?: SegmentationOptions): string[] {
      const { lang = "auto" } = options || {};

      // Process language option
      const resolvedLang = resolveLanguage(text, lang);

      // Choose segmentation method based on language
      if (resolvedLang === "zh") {
        return segmentChineseSentences(text);
      }
      return segmentEnglishSentences(text);
    },
  };
}
