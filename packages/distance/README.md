# @nlptools/distance

![npm version](https://img.shields.io/npm/v/@nlptools/distance)
![npm license](https://img.shields.io/npm/l/@nlptools/distance)

> High-performance string distance and similarity algorithms, implemented in pure TypeScript

## Features

- Pure TypeScript implementation, zero native dependencies
- Edit distance: Levenshtein, LCS (Myers O(ND) and DP)
- Token similarity: Jaccard, Cosine, Sorensen-Dice (character multiset and n-gram variants)
- Hash-based deduplication: SimHash, MinHash, LSH
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

### Diff

| Function               | Description                 | Returns          |
| ---------------------- | --------------------------- | ---------------- |
| `diff(a, b, options?)` | Sequence diff (Myers or DP) | `IDiffItem<T>[]` |

### Types

| Type              | Description                              |
| ----------------- | ---------------------------------------- |
| `DiffType`        | Enum: `ADDED`, `REMOVED`, `COMMON`       |
| `IDiffItem<T>`    | Diff result item with type and tokens    |
| `IDiffOptions<T>` | Options for diff (equals, lcs algorithm) |
| `ISimHashOptions` | Options for SimHash (bits, hashFn)       |
| `IMinHashOptions` | Options for MinHash (numHashes, seed)    |
| `ILSHOptions`     | Options for LSH (numBands, numHashes)    |

## Performance

Benchmark: 1000 iterations per pair, same test data across all runtimes.
Unit: microseconds per operation (us/op).

### Edit Distance

| Algorithm       | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| --------------- | --------------- | ----------- | ------------- | ------------- |
| levenshtein     | Short (<10)     | 0.3         | 7.9           | 0.11          |
| levenshtein     | Medium (10-100) | 1.3         | 116.2         | 0.98          |
| levenshtein     | Long (>200)     | 15.2        | 2,877.5       | 39.68         |
| levenshteinNorm | Short           | 0.3         | 7.9           | 0.11          |
| lcs             | Short (<10)     | 1.6         | 16.5          | 0.41          |
| lcs             | Medium (10-100) | 6.8         | 272.6         | 3.22          |
| lcs             | Long (>200)     | 217.8       | 6,574.1       | 122.63        |
| lcsNorm         | Short           | 1.7         | 16.2          | 0.48          |

### Token Similarity (Character Multiset)

| Algorithm | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| --------- | --------------- | ----------- | ------------- | ------------- |
| jaccard   | Short (<10)     | 0.8         | 25.2          | 0.42          |
| jaccard   | Medium (10-100) | 0.8         | 74.3          | 1.55          |
| jaccard   | Long (>200)     | 1.6         | 171.5         | 5.54          |
| cosine    | Short (<10)     | 0.8         | 19.3          | 0.32          |
| cosine    | Medium (10-100) | 0.8         | 61.4          | 1.35          |
| cosine    | Long (>200)     | 1.5         | 158.5         | 4.77          |
| sorensen  | Short (<10)     | 0.7         | 19.3          | 0.33          |
| sorensen  | Medium (10-100) | 0.7         | 61.0          | 1.33          |
| sorensen  | Long (>200)     | 1.5         | 160.0         | 4.46          |

### Bigram Variants

| Algorithm     | Size            | TS (V8 JIT) | WASM (via JS) | Rust (native) |
| ------------- | --------------- | ----------- | ------------- | ------------- |
| jaccardBigram | Short (<10)     | 1.1         | 27.4          | 0.45          |
| jaccardBigram | Medium (10-100) | 7.7         | 160.4         | 3.86          |
| cosineBigram  | Short (<10)     | 0.8         | 21.2          | 0.36          |
| cosineBigram  | Medium (10-100) | 5.9         | 127.0         | 3.12          |

TS implementations use V8 JIT optimization + `Int32Array` ASCII fast path + integer-encoded bigrams, avoiding JS-WASM boundary overhead entirely.

## Dependencies

- `fastest-levenshtein` — fastest JS Levenshtein implementation
- `@algorithm.ts/lcs` — Myers and DP Longest Common Subsequence
- `@algorithm.ts/diff` — Sequence diff built on LCS

## License

[MIT](../../LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
