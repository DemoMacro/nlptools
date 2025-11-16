// TypeScript example for Distance-Wasm
import * as wasm from "@nlptools/distance";

console.log("🧪 Testing Distance WASM Functions");
console.log("=".repeat(50));

// Basic algorithm examples
console.log("\n--- Basic Algorithm Examples ---");

// Levenshtein distance
const levDistance = wasm.levenshtein("kitten", "sitting");
console.log(`levenshtein("kitten", "sitting") = ${levDistance}`);

const levNormalized = wasm.levenshtein_normalized("kitten", "sitting");
console.log(`levenshtein_normalized("kitten", "sitting") = ${levNormalized}`);

// Jaro similarity
const jaroResult = wasm.jaro("hello", "hallo");
console.log(`jaro("hello", "hallo") = ${jaroResult}`);

const jaroWinklerResult = wasm.jarowinkler("martha", "marhta");
console.log(`jarowinkler("martha", "marhta") = ${jaroWinklerResult}`);

// Cosine similarity
const cosineResult = wasm.cosine("abc", "bcd");
console.log(`cosine("abc", "bcd") = ${cosineResult}`);

// Universal compare function
const compareResult = wasm.compare("apple", "apply", "levenshtein");
console.log(`compare("apple", "apply", "levenshtein") = ${compareResult}`);

console.log("\n--- Algorithm Categories ---");

// Edit Distance Algorithms
console.log("\nEdit Distance Algorithms:");
console.log(
  `hamming("karolin", "kathrin") = ${wasm.hamming("karolin", "kathrin")}`,
);
console.log(
  `damerau_levenshtein("ca", "abc") = ${wasm.damerau_levenshtein("ca", "abc")}`,
);
console.log(`sift4_simple("abc", "axc") = ${wasm.sift4_simple("abc", "axc")}`);

// Sequence-based Algorithms
console.log("\nSequence-based Algorithms:");
console.log(`lcs_seq("ABCD", "ACBAD") = ${wasm.lcs_seq("ABCD", "ACBAD")}`);
console.log(`lcs_str("ABCD", "ACBAD") = ${wasm.lcs_str("ABCD", "ACBAD")}`);
console.log(
  `ratcliff_obershelp("hello", "hallo") = ${wasm.ratcliff_obershelp("hello", "hallo")}`,
);
console.log(
  `smith_waterman("ACGT", "ACGT") = ${wasm.smith_waterman("ACGT", "ACGT")}`,
);

// Token-based Algorithms
console.log("\nToken-based Algorithms:");
console.log(
  `jaccard("hello world", "world hello") = ${wasm.jaccard("hello world", "world hello")}`,
);
console.log(
  `sorensen("hello world", "world hello") = ${wasm.sorensen("hello world", "world hello")}`,
);
console.log(
  `overlap("hello", "hello world") = ${wasm.overlap("hello", "hello world")}`,
);
console.log(`tversky("abc", "bcd") = ${wasm.tversky("abc", "bcd")}`);

// Bigram Algorithms
console.log("\nBigram Algorithms:");
console.log(
  `jaccard_bigram("night", "nacht") = ${wasm.jaccard_bigram("night", "nacht")}`,
);
console.log(
  `cosine_bigram("night", "nacht") = ${wasm.cosine_bigram("night", "nacht")}`,
);

// Naive Algorithms
console.log("\nNaive Algorithms:");
console.log(`prefix("hello", "help") = ${wasm.prefix("hello", "help")}`);
console.log(`suffix("hello", "ello") = ${wasm.suffix("hello", "ello")}`);
console.log(`length("hello", "hallo") = ${wasm.length("hello", "hallo")}`);

console.log("\n--- Algorithm Information ---");
console.log("Available algorithms include:");
console.log(
  "Edit Distance: levenshtein, damerau_levenshtein, jaro, jarowinkler, hamming, sift4_simple, myers_levenshtein",
);
console.log(
  "Sequence-based: lcs_seq, lcs_str, ratcliff_obershelp, smith_waterman",
);
console.log("Token-based: jaccard, cosine, sorensen, tversky, overlap");
console.log("Bigram: jaccard_bigram, cosine_bigram");
console.log("Naive: prefix, suffix, length");
console.log("Plus JavaScript implementations: fastest_levenshtein");

console.log("\n✅ All tests completed!");
