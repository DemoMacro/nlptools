/**
 * @nlptools/segmentation - Paragraph segmentation algorithm implementation
 */
import type { SegmentationOptions, Segmenter } from "./interfaces";

/**
 * Split text into paragraphs
 * @param text Text to be segmented
 * @returns Array of segmented paragraphs
 */
function segmentParagraphsText(text: string): string[] {
  return text
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}

/**
 * Create paragraph segmenter
 * @returns Paragraph segmenter instance
 */
export function createParagraphsSegmenter(): Segmenter {
  return {
    /**
     * Split text into paragraphs
     * @param text Text to be segmented
     * @param options Segmentation options
     * @returns Array of segmented paragraphs
     */
    segment(text: string, options?: SegmentationOptions): string[] {
      // Paragraph segmentation doesn't need to consider language
      return segmentParagraphsText(text);
    },
  };
}
