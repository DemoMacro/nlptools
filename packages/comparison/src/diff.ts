import {
  createSegmentation,
  segmentWords,
  SupportedLanguages,
} from "@nlptools/segmentation";
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
    if (segmentation === "sentences") {
      return createSegmentation(text, {
        lang,
        segmentation: "sentences",
      });
    } else if (segmentation === "words") {
      return segmentWords(text, {
        lang,
      });
    }
  };

  return diffComparison.diff(source, target, {
    ignoreCase,
  });
}
