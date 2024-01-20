import { segmentParagraphs } from "./paragraphs";
import { segmentPhrases } from "./phrases";
import { segmentSentences } from "./sentences";
import type { SupportedLanguages } from "./types";
import { segmentWords } from "./words";

export function createSegmentation(
  text: string,
  options: {
    lang?: SupportedLanguages;
    segmentation: "paragraphs" | "sentences" | "phrases" | "words";
  }
) {
  const { lang } = options;

  switch (options.segmentation) {
    case "paragraphs":
      return segmentParagraphs(text);
    case "sentences":
      return segmentSentences(text, {
        lang,
      });
    case "phrases":
      return segmentPhrases(text, {
        lang,
      });
    case "words":
      return segmentWords(text, {
        lang,
      });
  }
}

export { segmentParagraphs, segmentSentences, segmentPhrases, segmentWords };
export type { SupportedLanguages };
