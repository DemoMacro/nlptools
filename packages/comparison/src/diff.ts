import { createSegmentation, SupportedLanguages } from "@nlptools/segmentation";
import { Diff } from "diff";

export function createDiffComparison(
  source: string,
  target: string,
  options: {
    ignoreCase?: boolean;
    lang?: SupportedLanguages;
    segmentation: "sentences" | "words";
  }
) {
  const { ignoreCase, lang, segmentation } = options;

  const diffComparison = new Diff();

  diffComparison.tokenize = function (text) {
    return createSegmentation(text, {
      lang,
      segmentation,
    });
  };

  return diffComparison.diff(source, target, {
    ignoreCase,
  });
}
