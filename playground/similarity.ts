import {
  editDistance,
  findClosest,
  calcSimilarity,
} from "@nlptools/similarity";

const str = "hello";
const arr = ["hello", "world", "foo", "bar", "baz"];

console.log(`Closest: ${findClosest(str, arr)}`);
console.log(`Distance: ${editDistance("hello", findClosest(str, arr))}`);
console.log(`Similarity: ${calcSimilarity("hello", findClosest(str, arr))}`);
