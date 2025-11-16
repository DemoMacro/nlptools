# @nlptools/distance

![npm version](https://img.shields.io/npm/v/@nlptools/distance)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/distance)
![npm license](https://img.shields.io/npm/l/@nlptools/distance)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Complete string distance and similarity algorithms package with WebAssembly and JavaScript implementations

This package provides comprehensive text similarity and distance algorithms, combining the high-performance WebAssembly implementation from `@nlptools/distance-wasm` with additional JavaScript-based algorithms for maximum compatibility and performance.

## Features

- ⚡ **Dual Implementation**: WebAssembly for performance + JavaScript for compatibility
- 🧮 **Comprehensive Algorithms**: 30+ string similarity and distance algorithms
- 🎯 **Multiple Categories**: Edit-based, sequence-based, token-based, and naive algorithms
- 📝 **TypeScript First**: Full type safety with comprehensive API
- 🔧 **Universal Interface**: Single compare function for all algorithms
- 📊 **Normalized Results**: Consistent 0-1 similarity scores across algorithms
- 🚀 **Auto-optimization**: Automatically chooses the fastest implementation available

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

### Basic Setup

```typescript
import * as distance from "@nlptools/distance";

// All algorithms are available as named functions
console.log(distance.levenshtein("kitten", "sitting")); // 3
console.log(distance.jaro("hello", "hallo")); // 0.8666666666666667
console.log(distance.cosine("abc", "bcd")); // 0.6666666666666666
```

### Distance vs Similarity

Most algorithms have both distance and normalized versions:

```typescript
// Distance algorithms (lower is more similar)
const dist = distance.levenshtein("cat", "bat"); // 1

// Similarity algorithms (higher is more similar, 0-1 range)
const sim = distance.levenshtein_normalized("cat", "bat"); // 0.6666666666666666
```

### Available Algorithms

This package includes all algorithms from `@nlptools/distance-wasm` plus additional JavaScript implementations:

#### Edit Distance Algorithms

- `levenshtein` - Classic edit distance
- `fastest_levenshtein` - High-performance Levenshtein distance (fastest-levenshtein)
- `damerau_levenshtein` - Edit distance with transpositions
- `myers_levenshtein` - Myers bit-parallel algorithm for edit distance
- `jaro` - Jaro similarity
- `jarowinkler` - Jaro-Winkler similarity
- `hamming` - Hamming distance for equal-length strings
- `sift4_simple` - SIFT4 algorithm

#### Sequence-based Algorithms

- `lcs_seq` - Longest common subsequence
- `lcs_str` - Longest common substring
- `ratcliff_obershelp` - Gestalt pattern matching
- `smith_waterman` - Local sequence alignment

#### Token-based Algorithms

- `jaccard` - Jaccard similarity
- `cosine` - Cosine similarity
- `sorensen` - Sørensen-Dice coefficient
- `tversky` - Tversky index
- `overlap` - Overlap coefficient

#### Bigram Algorithms

- `jaccard_bigram` - Jaccard similarity on character bigrams
- `cosine_bigram` - Cosine similarity on character bigrams

#### Naive Algorithms

- `prefix` - Prefix similarity
- `suffix` - Suffix similarity
- `length` - Length-based similarity

### Universal Compare Function

```typescript
const result = distance.compare("hello", "hallo", "jaro");
console.log(result); // 0.8666666666666667

// Use fastest-levenshtein for optimal performance
console.log(distance.fastest_levenshtein("fast", "faster")); // 2
```

## Performance

The package automatically selects the fastest implementation available:

- **WebAssembly algorithms**: 10-100x faster than pure JavaScript
- **JavaScript fallbacks**: Ensure compatibility across all environments
- **Auto-detection**: Seamlessly switches between WASM and JS implementations

## References

This package incorporates and builds upon the following excellent open source projects:

- [textdistance.rs](https://github.com/life4/textdistance.rs) - Core Rust implementation via @nlptools/distance-wasm
- [fastest-levenshtein](https://github.com/ka-weihe/fastest-levenshtein) - High-performance Levenshtein implementation

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
