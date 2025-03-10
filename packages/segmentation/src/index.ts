/**
 * @nlptools/segmentation - Text segmentation toolkit
 */
import {
  SegmentationType,
  Segmenter,
  createSegmenter as createSegmenterInterface,
} from "./interfaces";
import { createParagraphsSegmenter } from "./paragraphs";
import { createPhrasesSegmenter } from "./phrases";
import { createSentencesSegmenter } from "./sentences";
import { createWordsSegmenter } from "./words";

// Register segmenter implementations
const segmenterFactories: Record<SegmentationType, () => Segmenter> = {
  paragraphs: createParagraphsSegmenter,
  sentences: createSentencesSegmenter,
  phrases: createPhrasesSegmenter,
  words: createWordsSegmenter,
};

// Override the implementation of createSegmenter function
function createSegmenter(type: SegmentationType): Segmenter {
  const factory = segmenterFactories[type];
  if (!factory) {
    throw new Error(`Unsupported segmentation type: ${type}`);
  }
  return factory();
}

// Export public API
export { Segmenter, SegmentationType, createSegmenter };
export * from "./interfaces";
