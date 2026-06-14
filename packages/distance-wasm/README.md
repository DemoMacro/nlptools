# @nlptools/distance-wasm

![npm version](https://img.shields.io/npm/v/@nlptools/distance-wasm)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/distance-wasm)
![npm license](https://img.shields.io/npm/l/@nlptools/distance-wasm)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> High-performance string distance and similarity algorithms powered by WebAssembly

## Features

- **WebAssembly Performance**: Native Rust implementation compiled to WASM
- **25+ algorithms**: Edit distance, sequence alignment, token similarity, and fuzzy search
- **Myers bit-parallel**: Levenshtein uses 32-bit block-based Myers for all string lengths
- **FuzzySearch engine**: `FuzzySearch`, `MultiKeyFuzzySearch`, and `find_best_match` for object array search
- **Universal compare**: Single `compare()` function accepting algorithm name strings
- **Normalized results**: Consistent 0-1 similarity scores across algorithms

## Installation

```bash
npm install @nlptools/distance-wasm
```

## Usage

```typescript
import * as wasm from "@nlptools/distance-wasm";

// Edit distance
wasm.levenshtein("kitten", "sitting"); // 3
wasm.levenshtein_normalized("kitten", "sitting"); // 0.571

// Similarity
wasm.jaro("martha", "marhta"); // 0.961
wasm.jarowinkler("martha", "marhta"); // 0.961

// Token-based
wasm.jaccard("hello", "hallo"); // 0.667
wasm.cosine("hello", "hallo"); // 0.8

// Universal compare
wasm.compare("hello", "hallo", "jaro"); // 0.961
```

### Fuzzy Search

```typescript
import { FuzzySearch, Algorithm, findBestMatch } from "@nlptools/distance-wasm";

// String array search
const search = new FuzzySearch(["apple", "banana", "cherry"], Algorithm.Levenshtein, 0.3, false);
search.search("aple"); // [{ index: 0, score: 0.8 }]

// Multi-key weighted search for object arrays
const keyValues = ["Old Man's War", "John Scalzi", "Harry Potter", "J.K. Rowling"];
const mkSearch = new MultiKeyFuzzySearch(
  keyValues,
  2,
  [0.7, 0.3],
  Algorithm.Levenshtein,
  0.3,
  false,
);
mkSearch.search("old man"); // [{ index: 0, score: 0.54, key_scores: [0.57, 0.50] }]

// One-shot convenience
findBestMatch("kitten", ["sitting", "kit", "mitten"], Algorithm.Levenshtein, 0.3, false);
// { index: 1, score: 0.5 }
```

## API Reference

### Edit Distance

| Function                                 | Description                                    | Returns     |
| ---------------------------------------- | ---------------------------------------------- | ----------- |
| `levenshtein(s1, s2)`                    | Levenshtein edit distance (Myers bit-parallel) | `u32`       |
| `levenshtein_normalized(s1, s2)`         | Normalized similarity                          | `f64` (0-1) |
| `damerau_levenshtein(s1, s2)`            | Damerau-Levenshtein (unrestricted)             | `u32`       |
| `damerau_levenshtein_normalized(s1, s2)` | Normalized similarity                          | `f64` (0-1) |
| `jaro(s1, s2)`                           | Jaro similarity                                | `f64` (0-1) |
| `jarowinkler(s1, s2)`                    | Jaro-Winkler similarity                        | `f64` (0-1) |
| `hamming(s1, s2)`                        | Hamming distance                               | `u32`       |
| `hamming_normalized(s1, s2)`             | Normalized similarity                          | `f64` (0-1) |
| `sift4_simple(s1, s2)`                   | SIFT4 approximate distance                     | `u32`       |
| `sift4_simple_normalized(s1, s2)`        | Normalized similarity                          | `f64` (0-1) |

### Sequence-based

| Function                              | Description                                | Returns     |
| ------------------------------------- | ------------------------------------------ | ----------- |
| `lcs_seq(s1, s2)`                     | Longest common subsequence length          | `u32`       |
| `lcs_seq_normalized(s1, s2)`          | Normalized similarity                      | `f64` (0-1) |
| `lcs_str(s1, s2)`                     | Longest common substring length            | `u32`       |
| `lcs_str_normalized(s1, s2)`          | Normalized similarity                      | `f64` (0-1) |
| `ratcliff_obershelp(s1, s2)`          | Ratcliff-Obershelp similarity              | `f64` (0-1) |
| `smith_waterman(s1, s2)`              | Smith-Waterman local alignment score       | `u32`       |
| `smith_waterman_normalized(s1, s2)`   | Normalized similarity                      | `f64` (0-1) |
| `needleman_wunsch(s1, s2)`            | Needleman-Wunsch global alignment score    | `i32`       |
| `needleman_wunsch_normalized(s1, s2)` | Normalized similarity                      | `f64` (0-1) |
| `gotoh(s1, s2)`                       | Gotoh affine gap alignment score           | `f64`       |
| `gotoh_normalized(s1, s2)`            | Normalized similarity                      | `f64` (0-1) |
| `monge_elkan(s1, s2)`                 | Monge-Elkan asymmetric similarity          | `f64` (0-1) |
| `monge_elkan_symmetric(s1, s2)`       | Symmetric variant                          | `f64` (0-1) |
| `bag_distance(s1, s2)`                | Bag distance (edit distance approximation) | `u32`       |
| `bag_distance_normalized(s1, s2)`     | Normalized similarity                      | `f64` (0-1) |
| `mra(s1, s2)`                         | Match Rating Algorithm score               | `u32`       |
| `mra_normalized(s1, s2)`              | Normalized similarity                      | `f64` (0-1) |

### Token Similarity

| Function                 | Description                             | Returns     |
| ------------------------ | --------------------------------------- | ----------- |
| `jaccard(s1, s2)`        | Jaccard similarity (character multiset) | `f64` (0-1) |
| `cosine(s1, s2)`         | Cosine similarity (character multiset)  | `f64` (0-1) |
| `sorensen(s1, s2)`       | Sorensen-Dice coefficient               | `f64` (0-1) |
| `tversky(s1, s2)`        | Tversky index (asymmetric)              | `f64` (0-1) |
| `overlap(s1, s2)`        | Overlap coefficient                     | `f64` (0-1) |
| `jaccard_bigram(s1, s2)` | Jaccard on character bigrams            | `f64` (0-1) |
| `cosine_bigram(s1, s2)`  | Cosine on character bigrams             | `f64` (0-1) |
| `prefix(s1, s2)`         | Prefix similarity                       | `f64` (0-1) |
| `suffix(s1, s2)`         | Suffix similarity                       | `f64` (0-1) |
| `length(s1, s2)`         | Length-based similarity                 | `f64` (0-1) |

### Fuzzy Search

| Function / Class                                                                   | Description                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FuzzySearch(items, algo, threshold, caseSensitive)`                               | Search engine for string arrays                                                                                                                                                                                                                           |
| `FuzzySearch.search(query, limit?)`                                                | Returns `SearchResult[]` sorted by score                                                                                                                                                                                                                  |
| `MultiKeyFuzzySearch(keyValues, numKeys, weights, algo, threshold, caseSensitive)` | Multi-key weighted search for object arrays                                                                                                                                                                                                               |
| `MultiKeyFuzzySearch.search(query, limit?)`                                        | Returns `MultiKeySearchResult[]` with per-key scores                                                                                                                                                                                                      |
| `findBestMatch(query, items, algo, threshold, caseSensitive)`                      | One-shot best match                                                                                                                                                                                                                                       |
| `Algorithm`                                                                        | Enum: `Levenshtein`, `Jaro`, `JaroWinkler`, `Hamming`, `Sift4`, `LcsSeq`, `LcsStr`, `Ratcliff`, `SmithWaterman`, `NeedlemanWunsch`, `Gotoh`, `BagDistance`, `Mra`, `Jaccard`, `Cosine`, `Sorensen`, `Tversky`, `Overlap`, `JaccardBigram`, `CosineBigram` |

### Universal Compare

`compare(s1, s2, algorithm)` accepts algorithm names: `"levenshtein"`, `"damerau-levenshtein"`, `"jaro"`, `"jaro-winkler"`, `"hamming"`, `"sift4"`, `"lcs-seq"`, `"lcs-str"`, `"ratcliff-obershelp"`, `"smith-waterman"`, `"needleman-wunsch"`, `"gotoh"`, `"monge-elkan"`, `"bag-distance"`, `"mra"`, `"jaccard"`, `"cosine"`, `"sorensen"`, `"tversky"`, `"overlap"`, `"prefix"`, `"suffix"`, `"length"`, `"jaccard-bigram"`, `"cosine-bigram"`.

## Architecture

All algorithms are implemented natively in Rust, operating directly on `&[u8]` bytes for maximum performance. The WASM module is built with `wasm-pack` and uses `wasm-bindgen` for JavaScript interop.

- `src/edit/` — Edit distance algorithms (levenshtein with Myers bit-parallel, damerau, jaro, hamming, sift4, lcs, smith-waterman, needleman-wunsch, gotoh, monge-elkan, bag, mra)
- `src/token/` — Token similarity algorithms (jaccard, cosine, sorensen, tversky, overlap, naive)
- `src/search.rs` — FuzzySearch engine with multi-key weighted support
- `src/utils.rs` — Shared utilities (frequency arrays, intersection, normalization)

## References

- [fastest-levenshtein](https://github.com/ka-weihe/fastest-levenshtein) — Myers bit-parallel algorithm reference

## License

- [MIT](../../LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
