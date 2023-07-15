import { segmentParagraphs } from "./paragraphs";
import { segmentSentences } from "./sentences";
import { segmentPhrases } from "./phrases";
import { segmentWords } from "./words";
import type { SupportedLanguages } from "./types";

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
