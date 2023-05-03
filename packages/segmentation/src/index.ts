import { SupportedLanguages } from "./types";
import { splitParagraphs } from "./paragraphs";
import { splitSentences } from "./sentences";
import { splitPhrases } from "./phrases";
import { splitWord } from "./words";

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
      return splitParagraphs(text);
    case "sentences":
      return splitSentences(text, {
        lang,
      });
    case "phrases":
      return splitPhrases(text, {
        lang,
      });
    case "words":
      return splitWord(text, {
        lang,
      });
  }
}

export { splitParagraphs, splitSentences, splitWord, SupportedLanguages };
