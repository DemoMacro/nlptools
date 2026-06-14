# @nlptools/distance

![npm version](https://img.shields.io/npm/v/@nlptools/distance)
![npm license](https://img.shields.io/npm/l/@nlptools/distance)

> High-performance string distance and similarity algorithms, implemented in pure TypeScript

## Features

- Pure TypeScript implementation, zero native dependencies
- **25+ algorithms** across 4 categories: edit distance, token similarity, hash-based, and fuzzy search
- Edit distance: Levenshtein, LCS, Jaro-Winkler, Damerau-Levenshtein, Hamming, SIFT4, Ratcliff-Obershelp, Smith-Waterman, Needleman-Wunsch, Gotoh, Monge-Elkan, Bag Distance, MRA
- Token similarity: Jaccard, Cosine, Sorensen-Dice, Tversky, Overlap (character multiset and n-gram variants)
- Hash-based deduplication: SimHash, MinHash, LSH
- Fuzzy search: `FuzzySearch` class and `findBestMatch` with multi-algorithm support
- Diff: based on `@algorithm.ts/diff` (Myers and DP backends)
- All distance algorithms include normalized similarity variants (0-1 range)
- ASCII fast path optimizations for token-based algorithms

## Installation

```bash
npm install @nlptools/distance
```

## Usage

### Edit Distance

#### Levenshtein

```typescript
import { levenshtein, levenshteinNormalized } from "@nlptools/distance";

levenshtein("kitten", "sitting"); // 3
levenshteinNormalized("kitten", "sitting"); // 0.571
```

#### LCS (Longest Common Subsequence)

```typescript
import { lcsDistance, lcsNormalized, lcsLength, lcsPairs } from "@nlptools/distance";

lcsDistance("abcde", "ace"); // 2  (= 5 + 3 - 2 * 3)
lcsNormalized("abcde", "ace"); // 0.75
lcsLength("abcde", "ace"); // 3
lcsPairs("abcde", "ace"); // [[0,0], [2,1], [4,2]]
```

By default uses Myers O(ND) algorithm. Switch to DP with `algorithm: "dp"`.

#### Jaro & Jaro-Winkler

```typescript
import { jaro, jaroWinkler } from "@nlptools/distance";

jaro("kitten", "sitting"); // 0.746
jaroWinkler("kitten", "sitting"); // 0.746
jaroWinkler("dwayne", "duane"); // 0.84 (prefix bonus)
```

#### Damerau-Levenshtein

Extension of Levenshtein that also allows transpositions of adjacent characters.

```typescript
import { damerauLevenshtein, damerauLevenshteinNormalized } from "@nlptools/distance";

damerauLevenshtein("abc", "acb"); // 1 (one transposition)
levenshtein("abc", "acb"); // 2 (two edits)
```

#### Hamming

Counts character mismatches between strings.

```typescript
import { hamming, hammingNormalized } from "@nlptools/distance";

hamming("karolin", "kathrin"); // 3
hammingNormalized("karolin", "kathrin"); // 0.571
```

#### LCS Substring (Longest Common Substring)

Unlike LCS (subsequence), requires matching characters to be contiguous.

```typescript
import { lcsSubstringLength, lcsSubstringNormalized } from "@nlptools/distance";

lcsSubstringLength("abcde", "abfde"); // 2 ("ab" or "de")
lcsSubstringNormalized("abcde", "abfde"); // 0.4
```

#### SIFT4

Fast approximate string distance. O(n \* maxOffset) complexity.

```typescript
import { sift4, sift4Normalized } from "@nlptools/distance";

sift4("kitten", "sitting"); // 3
sift4Normalized("kitten", "sitting"); // 0.571
sift4("abc", "xyz", { maxOffset: 10 }); // with custom maxOffset
```

#### Ratcliff-Obershelp

Gestalt pattern matching — iteratively finds longest common substrings.

```typescript
import { ratcliff } from "@nlptools/distance";

ratcliff("hello", "hallo"); // 0.8
```

#### Smith-Waterman

Local sequence alignment (bioinformatics).

```typescript
import { smithWaterman, smithWatermanNormalized } from "@nlptools/distance";

smithWaterman("ACGT", "AGGT"); // raw alignment score
smithWatermanNormalized("ACGT", "AGGT"); // 0-1 similarity
```

#### Needleman-Wunsch

Global sequence alignment (bioinformatics).

```typescript
import { needlemanWunsch, needlemanWunschNormalized } from "@nlptools/distance";

needlemanWunsch("ACGT", "AGGT"); // global alignment score
needlemanWunschNormalized("ACGT", "AGGT"); // 0-1 similarity
```

#### Gotoh

Global alignment with affine gap penalties (more realistic for biological sequences).

```typescript
import { gotoh, gotohNormalized } from "@nlptools/distance";

gotoh("ACGT", "A--T", { gapOpen: -2, gapExtend: -0.5 });
gotohNormalized("ACGT", "AGGT"); // 0-1 similarity
```

#### Monge-Elkan

Asymmetric token-based similarity using best-match pairing.

```typescript
import { mongeElkan, mongeElkanSymmetric } from "@nlptools/distance";

mongeElkan("hello world", "helo word"); // asymmetric: 0.83
mongeElkanSymmetric("hello world", "helo word"); // symmetric: 0.81
```

#### Bag Distance

Fast approximation of Levenshtein distance. O(m + n) complexity.

```typescript
import { bagDistance, bagDistanceNormalized } from "@nlptools/distance";

bagDistance("kitten", "sitting"); // 3
bagDistanceNormalized("kitten", "sitting"); // 0.571
```

#### MRA (Match Rating Algorithm)

Phonetic matching algorithm for English names.

```typescript
import { mra, mraNormalized } from "@nlptools/distance";

mra("Smith", "Smyth"); // 4 (out of 6)
mraNormalized("Smith", "Smyth"); // 0.667
```

### Token Similarity (Character Multiset)

Based on character frequency maps (Counter), matching the `textdistance` crate semantics:

```typescript
import { jaccard, cosine, sorensen, tversky, overlap } from "@nlptools/distance";

jaccard("abc", "abd"); // 0.667
cosine("hello", "hallo"); // 0.8
sorensen("test", "text"); // 0.75
tversky("abc", "abd", { alpha: 0.5, beta: 0.5 }); // same as jaccard
overlap("abc", "abcd"); // 1.0 (smaller set is subset)
```

### N-Gram Variants

```typescript
import { jaccardNgram, cosineNgram, sorensenNgram } from "@nlptools/distance";

jaccardNgram("hello", "hallo"); // 0.333  (bigram-based)
cosineNgram("hello", "hallo"); // 0.5     (bigram-based)
```

### Naive Similarity

Simple prefix, suffix, and length-based similarity:

```typescript
import { prefix, suffix, length } from "@nlptools/distance";

prefix("hello", "help"); // 0.75 (common prefix "hel" / max 5)
suffix("hello", "jello"); // 0.8 (common suffix "ello" / max 5)
length("abc", "abcdef"); // 0.5
```

### SimHash (Document Fingerprinting)

```typescript
import { simhash, hammingDistance, SimHasher } from "@nlptools/distance";

const fp1 = simhash(["hello", "world"]);
const fp2 = simhash(["hello", "earth"]);
hammingDistance(fp1, fp2); // small = similar

const hasher = new SimHasher();
const a = hasher.hash(["hello", "world"]);
const b = hasher.hash(["hello", "earth"]);
hasher.isDuplicate(a, b); // true if hamming distance <= 3
```

### MinHash (Jaccard Similarity Estimation)

```typescript
import { MinHash } from "@nlptools/distance";

const mh1 = new MinHash({ numHashes: 128 });
mh1.update("hello");
mh1.update("world");

const mh2 = new MinHash({ numHashes: 128 });
mh2.update("hello");
mh2.update("earth");

MinHash.estimate(mh1.digest(), mh2.digest()); // ~0.67
```

### LSH (Approximate Nearest Neighbor Search)

```typescript
import { MinHash, LSH } from "@nlptools/distance";

const lsh = new LSH({ numBands: 16, numHashes: 128 });

const mh = new MinHash({ numHashes: 128 });
mh.update("hello");
mh.update("world");
lsh.insert("doc1", mh.digest());

const query = lsh.query(mh.digest(), 0.5);
// => [["doc1", 0.67]]
```

### Fuzzy Search

```typescript
import { FuzzySearch, findBestMatch } from "@nlptools/distance";

const search = new FuzzySearch(["apple", "banana", "cherry"]);
search.search("aple");
// => [{ item: "apple", score: 0.8, index: 0 }]

const books = [
  { title: "Old Man's War", author: "John Scalzi" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
];
const bookSearch = new FuzzySearch(books, {
  keys: [
    { name: "title", weight: 0.7 },
    { name: "author", weight: 0.3 },
  ],
  algorithm: "cosine",
  threshold: 0.3,
});
bookSearch.search("old man");

findBestMatch("kitten", ["sitting", "kit", "mitten"]);
// => { item: "kit", score: 0.5, index: 1 }
```

### Diff

```typescript
import { diff, DiffType } from "@nlptools/distance";

const result = diff("abc", "ac");
// => [
//   { type: DiffType.COMMON, tokens: "a" },
//   { type: DiffType.REMOVED, tokens: "b" },
//   { type: DiffType.COMMON, tokens: "c" },
// ]
```

## API Reference

### Edit Distance

| Function                                    | Description                          | Returns              |
| ------------------------------------------- | ------------------------------------ | -------------------- |
| `levenshtein(a, b)`                         | Levenshtein edit distance            | `number`             |
| `levenshteinNormalized(a, b)`               | Normalized similarity                | `number` (0-1)       |
| `lcsDistance(a, b, algorithm?)`             | LCS distance                         | `number`             |
| `lcsNormalized(a, b, algorithm?)`           | Normalized LCS similarity            | `number` (0-1)       |
| `lcsLength(a, b, algorithm?)`               | LCS length                           | `number`             |
| `lcsPairs(a, b, algorithm?)`                | LCS matching pairs                   | `[number, number][]` |
| `jaro(a, b)`                                | Jaro similarity                      | `number` (0-1)       |
| `jaroWinkler(a, b, options?)`               | Jaro-Winkler similarity              | `number` (0-1)       |
| `damerauLevenshtein(a, b)`                  | Damerau-Levenshtein distance         | `number`             |
| `damerauLevenshteinNormalized(a, b)`        | Normalized similarity                | `number` (0-1)       |
| `hamming(a, b)`                             | Hamming distance                     | `number`             |
| `hammingNormalized(a, b)`                   | Normalized Hamming similarity        | `number` (0-1)       |
| `lcsSubstringLength(a, b)`                  | Longest common substring length      | `number`             |
| `lcsSubstringNormalized(a, b)`              | Normalized LCS substring similarity  | `number` (0-1)       |
| `sift4(a, b, options?)`                     | SIFT4 approximate distance           | `number`             |
| `sift4Normalized(a, b, options?)`           | Normalized SIFT4 similarity          | `number` (0-1)       |
| `ratcliff(a, b)`                            | Ratcliff-Obershelp similarity        | `number` (0-1)       |
| `smithWaterman(a, b, options?)`             | Smith-Waterman local alignment score | `number`             |
| `smithWatermanNormalized(a, b, options?)`   | Normalized similarity                | `number` (0-1)       |
| `needlemanWunsch(a, b, options?)`           | Needleman-Wunsch global alignment    | `number`             |
| `needlemanWunschNormalized(a, b, options?)` | Normalized similarity                | `number` (0-1)       |
| `gotoh(a, b, options?)`                     | Gotoh affine gap alignment           | `number`             |
| `gotohNormalized(a, b, options?)`           | Normalized similarity                | `number` (0-1)       |
| `mongeElkan(a, b, options?)`                | Monge-Elkan asymmetric similarity    | `number` (0-1)       |
| `mongeElkanSymmetric(a, b, options?)`       | Symmetric variant                    | `number` (0-1)       |
| `bagDistance(a, b)`                         | Bag distance                         | `number`             |
| `bagDistanceNormalized(a, b)`               | Normalized bag distance similarity   | `number` (0-1)       |
| `mra(a, b)`                                 | MRA similarity (0-6 scale)           | `number` (0-6)       |
| `mraNormalized(a, b)`                       | Normalized MRA similarity            | `number` (0-1)       |

### Token Similarity

| Function                  | Description                                    | Returns        |
| ------------------------- | ---------------------------------------------- | -------------- |
| `jaccard(a, b)`           | Jaccard similarity (character multiset)        | `number` (0-1) |
| `jaccardNgram(a, b, n?)`  | Jaccard on character n-grams                   | `number` (0-1) |
| `cosine(a, b)`            | Cosine similarity (character multiset)         | `number` (0-1) |
| `cosineNgram(a, b, n?)`   | Cosine on character n-grams                    | `number` (0-1) |
| `sorensen(a, b)`          | Sorensen-Dice coefficient (character multiset) | `number` (0-1) |
| `sorensenNgram(a, b, n?)` | Sorensen-Dice on character n-grams             | `number` (0-1) |
| `tversky(a, b, options?)` | Tversky index (generalized Jaccard/Dice)       | `number` (0-1) |
| `overlap(a, b)`           | Overlap coefficient                            | `number` (0-1) |
| `prefix(a, b)`            | Prefix similarity                              | `number` (0-1) |
| `suffix(a, b)`            | Suffix similarity                              | `number` (0-1) |
| `length(a, b)`            | Length-based similarity                        | `number` (0-1) |

### Hash-Based Deduplication

| Function / Class                 | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `simhash(features, options?)`    | Generate 64-bit fingerprint as `bigint`                            |
| `hammingDistance(a, b)`          | Hamming distance between two fingerprints                          |
| `hammingSimilarity(a, b, bits?)` | Normalized Hamming similarity                                      |
| `SimHasher`                      | Class with `hash()`, `distance()`, `similarity()`, `isDuplicate()` |
| `MinHash`                        | Class with `update()`, `digest()`, `estimate()`                    |
| `MinHash.estimate(sig1, sig2)`   | Static: estimate Jaccard from signatures                           |
| `LSH`                            | Class with `insert()`, `query()`, `remove()`                       |

### Fuzzy Search

| Function / Class                             | Description                                        |
| -------------------------------------------- | -------------------------------------------------- |
| `FuzzySearch<T>(collection, options?)`       | Search engine with dynamic collection management   |
| `findBestMatch(query, collection, options?)` | One-shot convenience: returns best match or `null` |

**FuzzySearch options:**

| Option                | Type                               | Default         | Description                   |
| --------------------- | ---------------------------------- | --------------- | ----------------------------- |
| `algorithm`           | `BuiltinAlgorithm \| SimilarityFn` | `"levenshtein"` | Similarity algorithm to use   |
| `keys`                | `ISearchKey[]`                     | `[]`            | Object fields to search on    |
| `threshold`           | `number`                           | `0`             | Min similarity score (0-1)    |
| `limit`               | `number`                           | `Infinity`      | Max results to return         |
| `caseSensitive`       | `boolean`                          | `false`         | Case-insensitive by default   |
| `includeMatchDetails` | `boolean`                          | `false`         | Include per-key scores        |
| `lsh`                 | `{ numHashes?, numBands? }`        | —               | Enable LSH for large datasets |

**Built-in algorithms:** `"levenshtein"`, `"lcs"`, `"jaccard"`, `"jaccardNgram"`, `"cosine"`, `"cosineNgram"`, `"sorensen"`, `"sorensenNgram"`

### Diff

| Function               | Description                 | Returns          |
| ---------------------- | --------------------------- | ---------------- |
| `diff(a, b, options?)` | Sequence diff (Myers or DP) | `IDiffItem<T>[]` |

### Types

| Type                      | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `DiffType`                | Enum: `ADDED`, `REMOVED`, `COMMON`                   |
| `IDiffItem<T>`            | Diff result item with type and tokens                |
| `IDiffOptions<T>`         | Options for diff (equals, lcs algorithm)             |
| `ISimHashOptions`         | Options for SimHash (bits, hashFn)                   |
| `IMinHashOptions`         | Options for MinHash (numHashes, seed)                |
| `ILSHOptions`             | Options for LSH (numBands, numHashes)                |
| `IFuzzySearchOptions`     | Options for FuzzySearch constructor                  |
| `IFindBestMatchOptions`   | Options for findBestMatch function                   |
| `ISearchKey`              | Searchable key config (name, weight, getter)         |
| `ISearchResult<T>`        | Search result with item, score, index                |
| `SimilarityFn`            | `(a: string, b: string) => number` in [0,1]          |
| `IJaroWinklerOptions`     | Options for Jaro-Winkler (prefixWeight, maxPrefix)   |
| `ISift4Options`           | Options for SIFT4 (maxOffset)                        |
| `ISmithWatermanOptions`   | Options for Smith-Waterman (match/mismatch/gap)      |
| `INeedlemanWunschOptions` | Options for Needleman-Wunsch (match/mismatch/gap)    |
| `IGotohOptions`           | Options for Gotoh (match/mismatch/gapOpen/gapExtend) |
| `IMongeElkanOptions`      | Options for Monge-Elkan (innerFn, tokenizer)         |
| `ITverskyOptions`         | Options for Tversky (alpha, beta)                    |

## Performance

Benchmark via `vitest bench` (V8 JIT), same test data across runtimes.
Unit: microseconds per operation (us/op).

### Edit Distance

| Algorithm   | Size            | TS (V8 JIT) | WASM (via JS) |
| ----------- | --------------- | ----------- | ------------- |
| levenshtein | Short (<10)     | 0.28        | 1.00          |
| levenshtein | Medium (10-100) | 1.30        | 4.75          |
| levenshtein | Long (>200)     | 14.05       | 105.01        |
| lcs         | Short (<10)     | 1.66        | 1.87          |
| lcs         | Medium (10-100) | 6.71        | 9.93          |
| lcs         | Long (>200)     | 217.53      | 163.45        |

### Token Similarity (Character Multiset)

| Algorithm | Size            | TS (V8 JIT) | WASM (via JS) |
| --------- | --------------- | ----------- | ------------- |
| jaccard   | Short (<10)     | 0.80        | 3.39          |
| jaccard   | Medium (10-100) | 0.80        | 8.51          |
| jaccard   | Long (>200)     | 1.85        | 33.04         |
| cosine    | Short (<10)     | 1.70        | 4.20          |
| cosine    | Medium (10-100) | 1.41        | 10.74         |
| cosine    | Long (>200)     | 2.98        | 27.30         |
| sorensen  | Short (<10)     | 1.26        | 4.15          |
| sorensen  | Medium (10-100) | 1.14        | 11.18         |
| sorensen  | Long (>200)     | 2.22        | 26.17         |

### Bigram Variants

| Algorithm     | Size            | TS (V8 JIT) | WASM (via JS) |
| ------------- | --------------- | ----------- | ------------- |
| jaccardBigram | Short (<10)     | 1.88        | 5.61          |
| jaccardBigram | Medium (10-100) | 12.31       | 28.87         |
| cosineBigram  | Short (<10)     | 1.20        | 4.49          |
| cosineBigram  | Medium (10-100) | 5.57        | 14.10         |

TS implementations use `Int32Array` ASCII fast path + integer-encoded bigrams, avoiding JS-WASM boundary overhead. For compute-heavy algorithms on long strings (e.g. LCS), WASM via JS can outperform TS due to native computation advantage outweighing the boundary cost.

### Fuzzy Search: NLPTools vs Fuse.js

Benchmark: 20 items in collection, 6 queries per iteration.
Unit: milliseconds per operation (ms/op). Algorithm: levenshtein (default).

| Scenario                | NLPTools | Fuse.js |
| ----------------------- | -------- | ------- |
| Setup (constructor)     | 0.0001   | 0.0008  |
| Search (string array)   | 0.0118   | 0.1040  |
| Search (object, 1 key)  | 0.0170   | 0.3241  |
| Search (object, 2 keys) | 0.0284   | 0.6618  |

Both libraries return identical top-1 results for all test queries. NLPTools scores are normalized similarity (0-1, higher is better); Fuse.js uses Bitap error scores (0 = perfect, lower is better).

## Dependencies

- `fastest-levenshtein` — fastest JS Levenshtein implementation
- `@algorithm.ts/lcs` — Myers and DP Longest Common Subsequence
- `@algorithm.ts/diff` — Sequence diff built on LCS

## License

[MIT](../../LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
