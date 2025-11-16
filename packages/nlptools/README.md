# @nlptools/nlptools

![npm version](https://img.shields.io/npm/v/@nlptools/nlptools)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/nlptools)
![npm license](https://img.shields.io/npm/l/@nlptools/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Main NLPTools package - Complete suite of NLP algorithms and utilities

This is the main NLPTools package (`@nlptools/nlptools`) that exports all algorithms and utilities from the entire toolkit. It provides a single entry point to access all string distance, similarity algorithms, and text splitting utilities.

## Features

- 🎯 **All-in-One**: Complete access to all NLPTools algorithms
- 📦 **Convenient**: Single import for all functionality
- ✂️ **Text Splitting**: Document chunking and text processing utilities
- 📏 **Distance & Similarity**: Comprehensive string comparison algorithms
- 🚀 **Performance Optimized**: Automatically uses the fastest implementations available
- 📝 **TypeScript First**: Full type safety with comprehensive API
- 🔧 **Easy to Use**: Consistent API across all algorithms

## Installation

```bash
# Install with npm
npm install @nlptools/nlptools

# Install with yarn
yarn add @nlptools/nlptools

# Install with pnpm
pnpm add @nlptools/nlptools
```

## Usage

### Basic Setup

```typescript
import * as nlptools from "@nlptools/nlptools";

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

### Text Splitting

This package includes text splitters from `@nlptools/splitter`:

```typescript
import { RecursiveCharacterTextSplitter } from "@nlptools/nlptools";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const text = "Your long document text here...";
const chunks = await splitter.splitText(text);
console.log(chunks);
```

### Available Algorithm Categories

This package includes all algorithms from `@nlptools/distance` and `@nlptools/splitter`:

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

#### Text Splitters

- `RecursiveCharacterTextSplitter` - Splits text recursively using different separators
- `CharacterTextSplitter` - Splits text by character count
- `MarkdownTextSplitter` - Specialized splitter for Markdown documents
- `TokenTextSplitter` - Splits text by token count
- `LatexTextSplitter` - Specialized splitter for LaTeX documents

### Universal Compare Function

```typescript
const result = nlptools.compare("hello", "hallo", "jaro");
console.log(result); // 0.8666666666666667
```

## Performance

The package automatically selects the fastest implementation available:

- **WebAssembly algorithms**: 10-100x faster than pure JavaScript
- **High-performance implementations**: Including fastest-levenshtein for optimal speed

## License

- [MIT](../../LICENSE) &copy; [Demo Macro](https://imst.xyz/)
