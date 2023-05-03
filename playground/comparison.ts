import {
  createDiffComparison,
  createSimilarityComparison,
} from "@nlptools/comparison";

const source = "你好，世界！";

const target = "你好，多莉！";

const diffComparison = createDiffComparison(source, target, {
  lang: "zh",
  segmentation: "words",
});

const similarityComparison = createSimilarityComparison(source, target, {
  lang: "zh",
});

console.log(diffComparison);

console.log(similarityComparison);
