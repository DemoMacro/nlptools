# @nlptools/nlptools

![npm version](https://img.shields.io/npm/v/@nlptools/nlptools)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/nlptools)
![npm license](https://img.shields.io/npm/l/@nlptools/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Main NLPTools package - Complete suite of NLP algorithms and utilities

This is the main NLPTools package (`@nlptools/nlptools`) that exports all algorithms and utilities from the entire toolkit. It provides a single entry point to access all string distance, similarity algorithms, text splitting, and tokenization utilities.

## Features

- **All-in-One**: Complete access to all NLPTools algorithms
- **Convenient**: Single import for all functionality
- **Text Splitting**: Document chunking and text processing utilities
- **Tokenization**: Fast text encoding and decoding for LLM models
- **Distance & Similarity**: Comprehensive string comparison algorithms
- **Locality-Sensitive Hashing**: Fast approximate nearest neighbor search
- **TypeScript First**: Full type safety with comprehensive API
- **Easy to Use**: Consistent API across all algorithms

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

// Edit distance
console.log(nlptools.levenshtein("kitten", "sitting")); // 3
console.log(nlptools.levenshteinNormalized("cat", "bat")); // 0.6666666666666666

// Token-based similarity
console.log(nlptools.jaccard("abc", "bcd")); // 0.3333333333333333
console.log(nlptools.cosine("hello", "hallo")); // 0.8
console.log(nlptools.sorensen("abc", "bcd")); // 0.5
```

### Distance vs Similarity

Most algorithms have both distance and normalized versions:

```typescript
// Distance algorithms (lower is more similar)
const distance = nlptools.levenshtein("cat", "bat"); // 1

// Similarity algorithms (higher is more similar, 0-1 range)
const similarity = nlptools.levenshteinNormalized("cat", "bat"); // 0.6666666666666666
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

### Tokenization

This package includes tokenization utilities from `@nlptools/tokenizer`:

```typescript
import { Tokenizer } from "@nlptools/nlptools";

// Load tokenizer from HuggingFace Hub
const modelId = "HuggingFaceTB/SmolLM3-3B";
const tokenizerJson = await fetch(
  `https://huggingface.co/${modelId}/resolve/main/tokenizer.json`,
).then((res) => res.json());
const tokenizerConfig = await fetch(
  `https://huggingface.co/${modelId}/resolve/main/tokenizer_config.json`,
).then((res) => res.json());

const tokenizer = new Tokenizer(tokenizerJson, tokenizerConfig);

// Encode text
const encoded = tokenizer.encode("Hello World");
console.log(encoded.ids); // [9906, 4435]
console.log(encoded.tokens); // ['Hello', 'ĠWorld']

// Get token count
const tokenCount = tokenizer.encode("This is a sentence.").ids.length;
console.log(`Token count: ${tokenCount}`);
```

### Available Algorithm Categories

This package includes all algorithms from `@nlptools/distance`, `@nlptools/splitter`, and `@nlptools/tokenizer`:

#### Edit Distance

- `levenshtein` / `levenshteinNormalized` - Classic Levenshtein edit distance
- `lcsDistance` / `lcsNormalized` - Longest Common Subsequence distance
- `lcsLength` - LCS length
- `lcsPairs` - LCS matching index pairs

#### Token-based Similarity

- `jaccard` / `jaccardNgram` - Jaccard similarity (character / n-gram)
- `cosine` / `cosineNgram` - Cosine similarity (character / n-gram)
- `sorensen` / `sorensenNgram` - Sorensen-Dice coefficient (character / n-gram)

#### Hash-based Algorithms

- `simhash` / `SimHasher` - Locality-sensitive document fingerprinting
- `hammingDistance` / `hammingSimilarity` - Hamming distance for fingerprint comparison
- `MinHash` - MinHash estimator for approximate Jaccard similarity
- `LSH` - Locality-Sensitive Hashing index for fast approximate nearest neighbor search

#### Diff

- `diff` - Compute the difference between two sequences

#### Text Splitters

- `RecursiveCharacterTextSplitter` - Splits text recursively using different separators
- `CharacterTextSplitter` - Splits text by character count
- `MarkdownTextSplitter` - Specialized splitter for Markdown documents
- `TokenTextSplitter` - Splits text by token count
- `LatexTextSplitter` - Specialized splitter for LaTeX documents

#### Tokenization Utilities

- `Tokenizer` - Main tokenizer class for encoding and decoding text
- `encode()` - Convert text to token IDs and tokens
- `decode()` - Convert token IDs back to text
- `tokenize()` - Split text into token strings
- `AddedToken` - Custom token configuration class

## License

- [MIT](../../LICENSE) &copy; [Demo Macro](https://www.demomacro.com/)
