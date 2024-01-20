import {
  segmentParagraphs,
  segmentSentences,
  segmentPhrases,
  SupportedLanguages,
} from "@nlptools/segmentation";
import { levenshteinClosest } from "@nlptools/similarity";

function filterText(text: string) {
  return text.replace(/[\s\d\p{P}]+/g, "");
}

export function createSimilarityComparison(
  source: string,
  target: string,
  options: {
    lang?: SupportedLanguages;
    threshold?: number;
  },
) {
  const { lang, threshold = 13 } = options;

  const similarityComparison = [];

  const sourceParagraphs = segmentParagraphs(source);

  const targetParagraphs = segmentParagraphs(target).filter(
    (paragraph) => paragraph.length >= threshold,
  );

  for (let i = 0; i < sourceParagraphs.length; i++) {
    const sourceParagraph = sourceParagraphs[i];

    if (filterText(sourceParagraph).length < threshold) {
      similarityComparison.push({
        source: sourceParagraph,
        target: "",
        similarity: 0,
        distance: 0,
        segmentation: "paragraphs",
        segment: true,
      });
    } else {
      const targetParagraph = levenshteinClosest(
        sourceParagraph,
        targetParagraphs,
      );
      if (targetParagraph.distance < threshold / 2) {
        similarityComparison.push({
          source: sourceParagraph,
          target: targetParagraph.closest,
          similarity: targetParagraph.similarity,
          distance: targetParagraph.distance,
          segmentation: "paragraphs",
          segment: true,
        });
      } else {
        const sourceSentences = segmentSentences(sourceParagraph, {
          lang,
        });

        // const targetSentences = createSegmentation(targetParagraph.closest, {
        //   lang,
        //   segmentation: "sentences",
        // });
        for (let j = 0; j < sourceSentences.length; j++) {
          const sourceSentence = sourceSentences[j];

          const targetSentences = targetParagraphs;

          if (filterText(sourceSentence).length < threshold / 2) {
            similarityComparison.push({
              source: sourceSentence,
              target: "",
              similarity: 0,
              distance: 0,
              segmentation: "sentences",
              segment: j === sourceSentences.length - 1,
            });
          } else {
            const targetSentence = levenshteinClosest(
              sourceSentence,
              targetSentences,
            );

            if (targetSentence.distance < threshold / 2) {
              similarityComparison.push({
                source: sourceSentence,
                target: targetSentence.closest,
                similarity: targetSentence.similarity,
                distance: targetSentence.distance,
                segmentation: "sentences",
                segment: j === sourceSentences.length - 1,
              });
            } else {
              const sourcePhrases = segmentPhrases(sourceSentence, {
                lang,
              });

              const targetPhrases = segmentPhrases(targetSentence.closest, {
                lang,
              });

              for (let k = 0; k < sourcePhrases.length; k++) {
                const sourcePhrase = sourcePhrases[k];
                if (filterText(sourcePhrase).length < threshold / 2) {
                  similarityComparison.push({
                    source: sourcePhrase,
                    target: 0,
                    distance: 0,
                    similarity: 0,
                    segmentation: "phrases",
                    segment:
                      j === sourceSentences.length - 1 &&
                      k === sourcePhrases.length - 1,
                  });
                } else {
                  const targetPhrase = levenshteinClosest(
                    sourcePhrase,
                    targetPhrases,
                  );
                  similarityComparison.push({
                    source: sourcePhrase,
                    target: targetPhrase.closest,
                    distance: targetPhrase.distance,
                    similarity: targetPhrase.similarity,
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
