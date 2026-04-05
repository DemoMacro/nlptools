# @nlptools/distance

![npm version](https://img.shields.io/npm/v/@nlptools/distance)
![npm license](https://img.shields.io/npm/l/@nlptools/distance)

> High-performance string distance and similarity algorithms, implemented in pure TypeScript

## Features

- Pure TypeScript implementation, zero native dependencies
- Edit distance: Levenshtein, LCS (Myers O(ND) and DP)
- Token similarity: Jaccard, Cosine, Sorensen-Dice (character multiset and n-gram variants)
- Hash-based deduplication: SimHash, MinHash, LSH
- Fuzzy search: `FuzzySearch` class and `findBestMatch` with multi-algorithm support
- Diff: based on `@algorithm.ts/diff` (Myers and DP backends)
- All distance algorithms include normalized similarity variants (0-1 range)

## Installation

```bash
# Install with npm
npm install @nlptools/distance

# Install with yarn
yarn add @nlptools/distance

# Install with pnpm
pnpm add @nlptools/distance
```

## Usage

### Edit Distance

```typescript
import { levenshtein, levenshteinNormalized } from "@nlptools/distance";

levenshtein("kitten", "sitting"); // 3
levenshteinNormalized("kitten", "sitting"); // 0.571
```

### LCS (Longest Common Subsequence)

```typescript
import { lcsDistance, lcsNormalized, lcsLength, lcsPairs } from "@nlptools/distance";

lcsDistance("abcde", "ace"); // 2  (= 5 + 3 - 2 * 3)
lcsNormalized("abcde", "ace"); // 0.75
lcsLength("abcde", "ace"); // 3
lcsPairs("abcde", "ace"); // [[0,0], [2,1], [4,2]]
```

By default uses Myers O(ND) algorithm. Switch to DP with `algorithm: "dp"`.

### Token Similarity (Character Multiset)

Based on character frequency maps (Counter), matching the `textdistance` crate semantics:

```typescript
import { jaccard, cosine, sorensen } from "@nlptools/distance";

jaccard("abc", "abd"); // 0.667
cosine("hello", "hallo"); // 0.8
sorensen("test", "text"); // 0.75
```

### N-Gram Variants

```typescript
import { jaccardNgram, cosineNgram, sorensenNgram } from "@nlptools/distance";

jaccardNgram("hello", "hallo"); // 0.333  (bigram-based)
cosineNgram("hello", "hallo"); // 0.5     (bigram-based)
```

### SimHash (Document Fingerprinting)

```typescript
import { simhash, hammingDistance, SimHasher } from "@nlptools/distance";

// Function-based
const fp1 = simhash(["hello", "world"]);
const fp2 = simhash(["hello", "earth"]);
hammingDistance(fp1, fp2); // small = similar

// Class-based
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
import { MinHash } from "@nlptools/distance";
import { LSH } from "@nlptools/distance";

const lsh = new LSH({ numBands: 16, numHashes: 128 });

const mh = new MinHash({ numHashes: 128 });
mh.update("hello");
mh.update("world");
lsh.insert("doc1", mh.digest());

// Query for similar documents
const query = lsh.query(mh.digest(), 0.5);
// => [["doc1", 0.67]]
```

### Fuzzy Search

```typescript
import { FuzzySearch, findBestMatch } from "@nlptools/distance";

// String array search
const search = new FuzzySearch(["apple", "banana", "cherry"]);
search.search("aple");
// => [{ item: "apple", score: 0.8, index: 0 }]

// Object array with weighted keys
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
// => [{ item: { title: "Old Man's War", ... }, score: 0.52, index: 0 }]

// One-shot best match
findBestMatch("kitten", ["sitting", "kit", "mitten"]);
// => { item: "kit", score: 0.5, index: 1 }

// With per-key details
const detailed = new FuzzySearch(books, {
  keys: [{ name: "title" }, { name: "author" }],
  includeMatchDetails: true,
});
detailed.search("gatsby");
// => [{ item: ..., score: 0.45, index: 1, matches: { title: 0.6, author: 0.1 } }]
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

| Function                          | Description               | Returns              |
| --------------------------------- | ------------------------- | -------------------- |
| `levenshtein(a, b)`               | Levenshtein edit distance | `number`             |
| `levenshteinNormalized(a, b)`     | Normalized similarity     | `number` (0-1)       |
| `lcsDistance(a, b, algorithm?)`   | LCS distance              | `number`             |
| `lcsNormalized(a, b, algorithm?)` | Normalized LCS similarity | `number` (0-1)       |
| `lcsLength(a, b, algorithm?)`     | LCS length                | `number`             |
| `lcsPairs(a, b, algorithm?)`      | LCS matching pairs        | `[number, number][]` |

### Token Similarity

| Function                  | Description                                    | Returns        |
| ------------------------- | ---------------------------------------------- | -------------- |
| `jaccard(a, b)`           | Jaccard similarity (character multiset)        | `number` (0-1) |
| `jaccardNgram(a, b, n?)`  | Jaccard on character n-grams                   | `number` (0-1) |
| `cosine(a, b)`            | Cosine similarity (character multiset)         | `number` (0-1) |
| `cosineNgram(a, b, n?)`   | Cosine on character n-grams                    | `number` (0-1) |
| `sorensen(a, b)`          | Sorensen-Dice coefficient (character multiset) | `number` (0-1) |
| `sorensenNgram(a, b, n?)` | Sorensen-Dice on character n-grams             | `number` (0-1) |

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

| Type                    | Description                                  |
| ----------------------- | -------------------------------------------- |
| `DiffType`              | Enum: `ADDED`, `REMOVED`, `COMMON`           |
| `IDiffItem<T>`          | Diff result item with type and tokens        |
| `IDiffOptions<T>`       | Options for diff (equals, lcs algorithm)     |
| `ISimHashOptions`       | Options for SimHash (bits, hashFn)           |
| `IMinHashOptions`       | Options for MinHash (numHashes, seed)        |
| `ILSHOptions`           | Options for LSH (numBands, numHashes)        |
| `IFuzzySearchOptions`   | Options for FuzzySearch constructor          |
| `IFindBestMatchOptions` | Options for findBestMatch function           |
| `ISearchKey`            | Searchable key config (name, weight, getter) |
| `ISearchResult<T>`      | Search result with item, score, index        |
| `SimilarityFn`          | `(a: string, b: string) => number` in [0,1]  |

## Performance

Benchmark: same test data across all runtimes. TS/WASM via `vitest bench` (V8 JIT), Rust via `cargo test --release`.
Unit: microseconds per operation (us/op).

### Edit Distance

| Algorithm       | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| --------------- | --------------- | ----------- | ------------- | ------------- |
| levenshtein     | Short (<10)     | 0.3         | 1.0           | 0.24          |
| levenshtein     | Medium (10-100) | 1.3         | 4.8           | 2.00          |
| levenshtein     | Long (>200)     | 13.9        | 102.3         | 61.77         |
| levenshteinNorm | Short           | 0.3         | 1.0           | 0.19          |
| lcs             | Short (<10)     | 1.7         | 1.9           | 0.69          |
| lcs             | Medium (10-100) | 6.8         | 10.1          | 7.70          |
| lcs             | Long (>200)     | 216.0       | 161.8         | 151.84        |
| lcsNorm         | Short           | 1.7         | 1.9           | 0.42          |

### Token Similarity (Character Multiset)

| Algorithm | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| --------- | --------------- | ----------- | ------------- | ------------- |
| jaccard   | Short (<10)     | 0.8         | 3.4           | 0.63          |
| jaccard   | Medium (10-100) | 0.8         | 8.6           | 2.67          |
| jaccard   | Long (>200)     | 1.5         | 18.9          | 7.25          |
| cosine    | Short (<10)     | 1.0         | 2.6           | 0.43          |
| cosine    | Medium (10-100) | 0.8         | 7.0           | 1.56          |
| cosine    | Long (>200)     | 1.7         | 17.2          | 6.23          |
| sorensen  | Short (<10)     | 0.7         | 2.6           | 0.56          |
| sorensen  | Medium (10-100) | 0.7         | 7.0           | 2.27          |
| sorensen  | Long (>200)     | 1.4         | 17.4          | 6.48          |

### Bigram Variants

| Algorithm     | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| ------------- | --------------- | ----------- | ------------- | ------------- |
| jaccardBigram | Short (<10)     | 1.1         | 3.5           | 0.67          |
| jaccardBigram | Medium (10-100) | 7.5         | 18.1          | 4.80          |
| cosineBigram  | Short (<10)     | 0.7         | 2.8           | 0.43          |
| cosineBigram  | Medium (10-100) | 5.4         | 14.0          | 4.04          |

TS implementations use `Int32Array` ASCII fast path + integer-encoded bigrams, avoiding JS-WASM boundary overhead. For compute-heavy algorithms on long strings (e.g. LCS), WASM via JS and Rust native can outperform TS due to native computation advantage outweighing the boundary cost.

### Fuzzy Search: NLPTools vs Fuse.js

Benchmark: 20 items in collection, 6 queries per iteration, 1000 iterations.
Unit: milliseconds per operation (ms/op). Algorithm: levenshtein (default).

| Scenario                | NLPTools | Fuse.js |
| ----------------------- | -------- | ------- |
| Setup (constructor)     | 0.0002   | 0.0050  |
| Search (string array)   | 0.0114   | 0.1077  |
| Search (object, 1 key)  | 0.0176   | 0.3308  |
| Search (object, 2 keys) | 0.0289   | 0.6445  |

Both libraries return identical top-1 results for all test queries. NLPTools scores are normalized similarity (0-1, higher is better); Fuse.js uses Bitap error scores (0 = perfect, lower is better).

## Dependencies

- `fastest-levenshtein` — fastest JS Levenshtein implementation
- `@algorithm.ts/lcs` — Myers and DP Longest Common Subsequence
- `@algorithm.ts/diff` — Sequence diff built on LCS

## License

[MIT](../../LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
