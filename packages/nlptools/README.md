# NLPTools

![npm version](https://img.shields.io/npm/v/nlptools)
![npm downloads](https://img.shields.io/npm/dw/nlptools)
![npm license](https://img.shields.io/npm/l/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Main NLPTools package - Complete suite of NLP algorithms and utilities

This is the main NLPTools package that exports all algorithms and utilities from the entire toolkit. It provides a single entry point to access all string distance and similarity algorithms.

## Features

- 🎯 **All-in-One**: Complete access to all NLPTools algorithms
- 📦 **Convenient**: Single import for all functionality
- 🚀 **Performance Optimized**: Automatically uses the fastest implementations available
- 📝 **TypeScript First**: Full type safety with comprehensive API
- 🔧 **Easy to Use**: Consistent API across all algorithms

## Installation

```bash
# Install with npm
npm install nlptools

# Install with yarn
yarn add nlptools

# Install with pnpm
pnpm add nlptools
```

## Usage

### Basic Setup

```typescript
import * as nlptools from "nlptools";

// All algorithms are available as named functions
console.log(nlptools.levenshtein("kitten", "sitting")); // 3
console.log(nlptools.jaro("hello", "hallo")); // 0.8666666666666667
console.log(nlptools.cosine("abc", "bcd")); // 0.6666666666666666
```

### Distance vs Similarity

Most algorithms have both distance and normalized versions:

```typescript
// Distance algorithms (lower is more similar)
const distance = nlptools.levenshtein("cat", "bat"); // 1

// Similarity algorithms (higher is more similar, 0-1 range)
const similarity = nlptools.levenshtein_normalized("cat", "bat"); // 0.6666666666666666
```

### Available Algorithm Categories

This package includes all algorithms from `@nlptools/distance`:

#### Edit Distance Algorithms

- `levenshtein` - Classic edit distance
- `fastest_levenshtein` - High-performance Levenshtein distance
- `damerau_levenshtein` - Edit distance with transpositions
- `myers_levenshtein` - Myers bit-parallel algorithm
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
const result = nlptools.compare("hello", "hallo", "jaro");
console.log(result); // 0.8666666666666667
```

## Performance

The package automatically selects the fastest implementation available:

- **WebAssembly algorithms**: 10-100x faster than pure JavaScript
- **JavaScript fallbacks**: Ensure compatibility across all environments
- **High-performance implementations**: Including fastest-levenshtein for optimal speed

## Dependencies

This package re-exports functionality from:

- `@nlptools/distance` - Complete distance algorithms package
- `fastest-levenshtein` - High-performance JavaScript implementation

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
