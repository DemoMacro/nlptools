import {
  levenshteinDistance,
  levenshteinClosest,
  levenshteinSimilarity,
} from "@nlptools/similarity";

const str = "hello";
const arr = ["hello", "world", "foo", "bar", "baz"];

console.log(`Closest: ${levenshteinClosest(str, arr)}`);
console.log(
  `Distance: ${levenshteinDistance("hello", levenshteinClosest(str, arr))}`
);
console.log(
  `Similarity: ${levenshteinSimilarity("hello", levenshteinClosest(str, arr))}`
);
