import { segmentParagraphs } from "./paragraphs";
import { segmentSentences } from "./sentences";
import { segmentPhrases } from "./phrases";
import { segmentWords } from "./words";
import { SupportedLanguages } from "./types";

export function createSegmentation(
  text: string,
  options: {
    lang?: SupportedLanguages;
    segmentation: "paragraphs" | "sentences" | "phrases";
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
  }
}

export { segmentParagraphs, segmentSentences, segmentPhrases, segmentWords };
export type { SupportedLanguages };
