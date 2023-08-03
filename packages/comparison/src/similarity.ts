import { createSegmentation, SupportedLanguages } from "@nlptools/segmentation";
import {
  levenshteinClosest,
  levenshteinSimilarity,
} from "@nlptools/similarity";

export function createSimilarityComparison(
  source: string,
  target: string,
  options: {
    lang?: SupportedLanguages;
    threshold?: number;
    filter?: (text: string) => string;
  }
) {
  const { lang, threshold = 13, filter } = options;

  function filterText(text: string) {
    return filter ? filter(text) : text.replace(/[\s\p{P}]+/g, "").trim();
  }

  const similarityComparison = [];

  const sourceParagraphs = createSegmentation(source, {
    lang,
    segmentation: "paragraphs",
  });

  const targetParagraphs = createSegmentation(target, {
    lang,
    segmentation: "paragraphs",
  }).filter((paragraph) => paragraph.length >= threshold);

  for (let i = 0; i < sourceParagraphs.length; i++) {
    const sourceParagraph = sourceParagraphs[i];

    if (sourceParagraph.length < threshold) {
      similarityComparison.push({
        source: sourceParagraph,
        target: "",
        similarity: 0,
        segmentation: "paragraphs",
        segment: true,
      });
    } else {
      const targetParagraph = levenshteinClosest(
        sourceParagraph,
        targetParagraphs
      );

      const sourceParagraphSimilarity = levenshteinSimilarity(
        filterText(sourceParagraph),
        filterText(targetParagraph)
      );

      if (
        sourceParagraphSimilarity >=
        1 - threshold / Math.max(sourceParagraph.length, targetParagraph.length)
      ) {
        similarityComparison.push({
          source: sourceParagraph,
          target: targetParagraph,
          similarity: sourceParagraphSimilarity,
          segmentation: "paragraphs",
          segment: true,
        });
      } else {
        const sourceSentences = createSegmentation(sourceParagraph, {
          lang,
          segmentation: "sentences",
        });

        const targetSentences = createSegmentation(targetParagraph, {
          lang,
          segmentation: "sentences",
        });

        if (sourceSentences && targetSentences) {
          for (let j = 0; j < sourceSentences.length; j++) {
            const sourceSentence = sourceSentences[j];
            const targetSentence = levenshteinClosest(
              sourceSentence,
              targetSentences
            );

            const sourceSentenceSimilarity = levenshteinSimilarity(
              filterText(sourceSentence),
              filterText(targetSentence)
            );

            if (
              sourceSentenceSimilarity >=
              1 -
                threshold /
                  Math.max(sourceSentence.length, targetSentence.length)
            ) {
              similarityComparison.push({
                source: sourceSentence,
                target: targetSentence,
                similarity: sourceSentenceSimilarity,
                segmentation: "sentences",
                segment: j === sourceSentences.length - 1,
              });
            } else {
              const sourcePhrases = createSegmentation(sourceSentence, {
                lang,
                segmentation: "phrases",
              });

              const targetPhrases = createSegmentation(targetSentence, {
                lang,
                segmentation: "phrases",
              });

              if (sourcePhrases && targetPhrases) {
                for (let k = 0; k < sourcePhrases.length; k++) {
                  const sourcePhrase = sourcePhrases[k];
                  const targetPhrase = levenshteinClosest(
                    sourcePhrase,
                    targetPhrases
                  );
                  const sourcePhraseSimilarity = levenshteinSimilarity(
                    filterText(sourcePhrase),
                    filterText(targetPhrase)
                  );

                  similarityComparison.push({
                    source: sourcePhrase,
                    target: targetPhrase,
                    similarity: sourcePhraseSimilarity,
                    segmentation: "phrases",
                    segment:
                      j === sourceSentences.length - 1 &&
                      k === sourcePhrases.length - 1,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  return similarityComparison;
}
