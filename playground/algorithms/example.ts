/**
 * @nlptools/comparison/algorithms Example
 * Demonstrates how to use similarity calculation functionality
 */
import { createSimilarityMeasure } from "../../packages/comparison/src/algorithms/index";

// Create Levenshtein similarity measure
const levenshteinMeasure = createSimilarityMeasure("levenshtein");

// Example text
const text1 = "你好，世界！";
const text2 = "你好，朋友！";
const candidates = [
  "你好，世界！",
  "你好，朋友！",
  "你好，地球！",
  "你好，宇宙！",
];

// Basic similarity calculation
console.log("\nBasic similarity calculation example:");
const result = levenshteinMeasure.calculate(text1, text2);
console.log(`Text1: "${text1}"`);
console.log(`Text2: "${text2}"`);
console.log(`Similarity: ${result.similarity.toFixed(4)}`);
console.log(`Distance: ${result.distance}`);

// Case-insensitive similarity calculation
console.log("\nCase-insensitive similarity calculation example:");
const englishText1 = "Hello, World!";
const englishText2 = "hello, world!";

const caseSensitiveResult = levenshteinMeasure.calculate(
  englishText1,
  englishText2,
  {
    caseSensitive: true,
  },
);
const caseInsensitiveResult = levenshteinMeasure.calculate(
  englishText1,
  englishText2,
  {
    caseSensitive: false,
  },
);

console.log(`Text1: "${englishText1}"`);
console.log(`Text2: "${englishText2}"`);
console.log(
  `Case-sensitive similarity: ${caseSensitiveResult.similarity.toFixed(4)}`,
);
console.log(
  `Case-insensitive similarity: ${caseInsensitiveResult.similarity.toFixed(4)}`,
);

// Find the most similar text
console.log("\nFind the most similar text example:");
const queryText = "你好，地球！";
console.log(`Query text: "${queryText}"`);
console.log("Candidate texts:", candidates);

const closestResult = levenshteinMeasure.findClosest(queryText, candidates);
console.log(`Most similar text: "${closestResult.closest}"`);
console.log(`Similarity: ${closestResult.similarity.toFixed(4)}`);
console.log(`Distance: ${closestResult.distance}`);
