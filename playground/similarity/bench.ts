/**
 * @nlptools/similarity Benchmark
 * Performance testing for similarity calculation functionality
 */
import { Bench } from "@funish/bench";
import { createSimilarityMeasure } from "../../packages/similarity/src/index";

const bench = new Bench({
  times: 5000,
  unit: "ms",
});

// Example texts
const text1 = "你好，世界！";
const text2 = "你好，朋友！";
const englishText1 = "Hello, World!";
const englishText2 = "hello, world!";

// Create similarity measures
const levenshteinMeasure = createSimilarityMeasure("levenshtein");
const jaccardMeasure = createSimilarityMeasure("jaccard");
const cosineMeasure = createSimilarityMeasure("cosine");

// Benchmark Levenshtein similarity
bench.add("levenshtein similarity - chinese", () => {
  levenshteinMeasure.calculate(text1, text2);
});

bench.add("levenshtein similarity - english", () => {
  levenshteinMeasure.calculate(englishText1, englishText2);
});

// Benchmark Jaccard similarity
bench.add("jaccard similarity - chinese", () => {
  jaccardMeasure.calculate(text1, text2);
});

bench.add("jaccard similarity - english", () => {
  jaccardMeasure.calculate(englishText1, englishText2);
});

// Benchmark Cosine similarity
bench.add("cosine similarity - chinese", () => {
  cosineMeasure.calculate(text1, text2);
});

bench.add("cosine similarity - english", () => {
  cosineMeasure.calculate(englishText1, englishText2);
});

bench.print();
