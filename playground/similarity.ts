import {
  levenshteinClosest,
  levenshteinDistance,
  levenshteinSimilarity,
} from "../packages/similarity/src/index";

const str = "hello";
const arr = ["hello", "world", "foo", "bar", "baz"];

console.log(`Closest: ${levenshteinClosest(str, arr)}`);
console.log(
  `Distance: ${levenshteinDistance(
    "hello",
    levenshteinClosest(str, arr)?.closest,
  )}`,
);
console.log(
  `Similarity: ${levenshteinSimilarity(
    "hello",
    levenshteinClosest(str, arr)?.closest,
  )}`,
);
