/**
 * @nlptools/segmentation - Word segmentation algorithm implementation
 */
import { resolveLanguage } from "@nlptools/core";
import type { SegmentationOptions, Segmenter } from "./interfaces";

/**
 * Split text into words (English)
 * @param text Text to be segmented
 * @returns Array of segmented words
 */
function segmentEnglishWords(text: string): string[] {
  return text
    .replace(/([\x20,.;:?!])/gm, "\r\n$1\r\n")
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Forward maximum matching algorithm for word segmentation
 * @param text Text to be segmented
 * @param dictionary Dictionary used for word segmentation
 * @returns Array of segmented words
 */
function forwardMaximumMatching(text: string, dictionary: string[]): string[] {
  const result: string[] = [];
  let start = 0;

  while (start < text.length) {
    let maxLength = 0;
    let maxWord = "";

    // Find the longest match in the dictionary
    for (const word of dictionary) {
      if (
        text.substring(start, start + word.length) === word &&
        word.length > maxLength
      ) {
        maxLength = word.length;
        maxWord = word;
      }
    }

    // If no match is found in the dictionary, treat a single character as a word
    if (maxLength === 0) {
      result.push(text.charAt(start));
      start += 1;
    } else {
      result.push(maxWord);
      start += maxLength;
    }
  }

  return result;
}

/**
 * Split text into words (Chinese)
 * @param text Text to be segmented
 * @param dictionary Dictionary used for word segmentation
 * @returns Array of segmented words
 */
function segmentChineseWords(text: string, dictionary: string[]): string[] {
  // Use self-implemented forward maximum matching algorithm
  return forwardMaximumMatching(text, dictionary);
}

/**
 * Create word segmenter
 * @returns Word segmenter instance
 */
export function createWordsSegmenter(): Segmenter {
  return {
    /**
     * Split text into words
     * @param text Text to be segmented
     * @param options Segmentation options
     * @returns Array of segmented words
     */
    segment(text: string, options?: SegmentationOptions): string[] {
      const { lang = "auto", chineseDictionary = [] } = options || {};

      // Process language option
      const resolvedLang = resolveLanguage(text, lang);

      // Choose segmentation method based on language
      if (resolvedLang === "zh") {
        return segmentChineseWords(text, chineseDictionary);
      }
      return segmentEnglishWords(text);
    },
  };
}
