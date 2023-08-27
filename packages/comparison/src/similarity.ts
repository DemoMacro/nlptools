import { createSegmentation, SupportedLanguages } from "@nlptools/segmentation";
import { levenshteinSimilarity } from "@nlptools/similarity";

function filterText(text: string) {
  return text.replace(/[\s\d\p{P}]+/g, "");
}

function useFirstClosest(str: string, arr: readonly string[], threshold = 13) {
  let max_similarity = -Infinity;
  let min_index = 0;
  let loop_break = false;

  const tolerance = Math.abs(1 - threshold / Math.max(str.length, arr.length));

  for (let i = 0; i < arr.length; i++) {
    const dist = levenshteinSimilarity(filterText(str), filterText(arr[i]));
    if (dist > max_similarity) {
      max_similarity = dist;
      min_index = i;
    }

    if (max_similarity > tolerance) {
      loop_break = true;
      break;
    }
  }

  return {
    similarity: max_similarity,
    closest: arr[min_index],
    break: loop_break,
  };
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
      const targetParagraph = useFirstClosest(
        sourceParagraph,
        targetParagraphs,
        threshold,
      );

      if (targetParagraph.break) {
        similarityComparison.push({
          source: sourceParagraph,
          target: targetParagraph.closest,
          similarity: targetParagraph.similarity,
          segmentation: "paragraphs",
          segment: true,
          break: true,
        });
      } else {
        const sourceSentences = createSegmentation(sourceParagraph, {
          lang,
          segmentation: "sentences",
        });

        // const targetSentences = createSegmentation(targetParagraph.closest, {
        //   lang,
        //   segmentation: "sentences",
        // });
        const targetSentences = targetParagraphs;

        if (sourceSentences && targetParagraphs) {
          for (let j = 0; j < sourceSentences.length; j++) {
            const sourceSentence = sourceSentences[j];
            const targetSentence = useFirstClosest(
              sourceSentence,
              targetSentences,
              threshold,
            );

            if (targetSentence.break) {
              similarityComparison.push({
                source: sourceSentence,
                target: targetSentence.closest,
                similarity: targetSentence.similarity,
                segmentation: "sentences",
                segment: j === sourceSentences.length - 1,
                break: true,
              });
            } else {
              const sourcePhrases = createSegmentation(sourceSentence, {
                lang,
                segmentation: "phrases",
              });

              const targetPhrases = createSegmentation(targetSentence.closest, {
                lang,
                segmentation: "phrases",
              });

              if (sourcePhrases && targetPhrases) {
                for (let k = 0; k < sourcePhrases.length; k++) {
                  const sourcePhrase = sourcePhrases[k];
                  const targetPhrase = useFirstClosest(
                    sourcePhrase,
                    targetPhrases,
                    threshold,
                  );
                  similarityComparison.push({
                    source: sourcePhrase,
                    target: targetPhrase.closest,
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
