import { SupportedLanguages, createSegmentation } from "@nlptools/segmentation";
import { Diff } from "diff";

export function createDiffComparison(
  source: string,
  target: string,
  options: {
    ignoreCase?: boolean;
    lang?: SupportedLanguages;
    segmentation: "paragraphs" | "sentences" | "phrases" | "words";
  }
) {
  const { ignoreCase, lang, segmentation } = options;

  const diffComparison = new Diff();

  diffComparison.tokenize = (text) =>
    createSegmentation(text, {
      lang,
      segmentation,
    });

  return diffComparison.diff(source, target, {
    ignoreCase,
  });
}
