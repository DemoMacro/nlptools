# @nlptools/distance-wasm

![npm version](https://img.shields.io/npm/v/@nlptools/distance-wasm)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/distance-wasm)
![npm license](https://img.shields.io/npm/l/@nlptools/distance-wasm)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> High-performance string distance and similarity algorithms powered by WebAssembly

## Features

- ⚡ **WebAssembly Performance**: Optimized Rust implementation running in WASM
- 🧮 **Comprehensive Algorithms**: 30+ string similarity and distance algorithms
- 🎯 **Multiple Categories**: Edit-based, sequence-based, token-based, and naive algorithms
- 📝 **TypeScript First**: Full type safety with comprehensive API
- 🔧 **Universal Interface**: Single compare function for all algorithms
- 📊 **Normalized Results**: Consistent 0-1 similarity scores across algorithms
- 🚀 **Zero Runtime Dependencies**: Lightweight and fast implementation

## Installation

```bash
# Install with npm
$ npm install @nlptools/distance-wasm

# Install with yarn
$ yarn add @nlptools/distance-wasm

# Install with pnpm
$ pnpm add @nlptools/distance-wasm
```

## Usage

### Basic Setup

```typescript
import * as distanceWasm from "@nlptools/distance-wasm";

// All algorithms are available as named functions
console.log(distanceWasm.levenshtein("kitten", "sitting")); // 3
console.log(distanceWasm.jaro("hello", "hallo")); // 0.8666666666666667
console.log(distanceWasm.cosine("abc", "bcd")); // 0.6666666666666666
```

### Distance vs Similarity

Most algorithms have both distance and normalized versions:

```typescript
// Distance algorithms (lower is more similar)
const distance = distanceWasm.levenshtein("cat", "bat"); // 1

// Similarity algorithms (higher is more similar, 0-1 range)
const similarity = distanceWasm.levenshtein_normalized("cat", "bat"); // 0.6666666666666666
```

### Available Algorithms

#### Edit Distance Algorithms

```typescript
// Classic string edit distance
distanceWasm.levenshtein("saturday", "sunday"); // 3
distanceWasm.damerau_levenshtein("ca", "abc"); // 2

// Phonetic and similarity algorithms
distanceWasm.jaro("martha", "marhta"); // 0.9611111111111111
distanceWasm.jarowinkler("martha", "marhta"); // 0.9611111111111111
distanceWasm.hamming("karolin", "kathrin"); // 3
distanceWasm.sift4_simple("abc", "axc"); // 1
```

#### Sequence-based Algorithms

```typescript
// Longest common subsequence/substring
distanceWasm.lcs_seq("ABCD", "ACBAD"); // 3
distanceWasm.lcs_str("ABCD", "ACBAD"); // 1

// Gestalt pattern matching
distanceWasm.ratcliff_obershelp("hello", "hallo"); // 0.8

// Local sequence alignment
distanceWasm.smith_waterman("ACGT", "ACGT"); // 4
```

#### Token-based Algorithms

```typescript
// Set-based similarity measures
distanceWasm.jaccard("hello world", "world hello"); // 1
distanceWasm.cosine("hello world", "world hello"); // 1
distanceWasm.sorensen("hello world", "world hello"); // 1
distanceWasm.overlap("hello", "hello world"); // 1
distanceWasm.tversky("abc", "bcd"); // 0.5
```

#### Bigram Algorithms

```typescript
// Character pair based similarity
distanceWasm.jaccard_bigram("night", "nacht"); // 0.14285714285714285
distanceWasm.cosine_bigram("night", "nacht"); // 0.25
```

#### Naive Algorithms

```typescript
// Simple comparison methods
distanceWasm.prefix("hello", "help"); // 0.6
distanceWasm.suffix("hello", "ello"); // 0.8
distanceWasm.length("hello", "hallo"); // 0
```

### Universal Compare Function

Use the universal function to access all algorithms by name:

```typescript
const result = distanceWasm.compare("hello", "hallo", "jaro");
console.log(result); // 0.8666666666666667
```

## API Reference

### Distance Functions

#### `levenshtein(s1: string, s2: string): number`

Calculate the Levenshtein distance between two strings.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Edit distance (minimum number of single-character edits)

#### `damerau_levenshtein(s1: string, s2: string): number`

Calculate the Damerau-Levenshtein distance, which includes transposition operations.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Distance with transposition support

#### `hamming(s1: string, s2: string): number`

Calculate the Hamming distance for equal-length strings.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Number of positions where characters differ

### Similarity Functions

#### `jaro(s1: string, s2: string): number`

Calculate Jaro similarity between two strings.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Jaro similarity score (0-1)

#### `jarowinkler(s1: string, s2: string): number`

Calculate Jaro-Winkler similarity, a modified version of Jaro.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Jaro-Winkler similarity score (0-1)

#### `jaccard(s1: string, s2: string): number`

Calculate Jaccard similarity based on character n-grams.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Jaccard similarity score (0-1)

#### `cosine(s1: string, s2: string): number`

Calculate cosine similarity between character n-gram vectors.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string

**Returns:** `number` - Cosine similarity score (0-1)

### Universal Function

#### `compare(s1: string, s2: string, algorithm: string): number`

Compare two strings using any available algorithm by name.

**Parameters:**

- `s1` (string) - First string
- `s2` (string) - Second string
- `algorithm` (string) - Algorithm name (e.g., 'levenshtein', 'jaro', 'jaccard')

**Returns:** `number` - Similarity score (0-1) or distance value

**Available Algorithm Names:**

- Edit Distance: `'levenshtein'`, `'damerau_levenshtein'`, `'jaro'`, `'jarowinkler'`, `'hamming'`, `'sift4_simple'`
- Sequence: `'lcs_seq'`, `'lcs_str'`, `'ratcliff_obershelp'`, `'smith_waterman'`
- Token: `'jaccard'`, `'cosine'`, `'sorensen'`, `'tversky'`, `'overlap'`
- Naive: `'prefix'`, `'suffix'`, `'length'`
- Bigram: `'jaccard_bigram'`, `'cosine_bigram'`

### Normalized Variants

Most distance algorithms have normalized versions that return similarity scores:

- `levenshtein_normalized`, `damerau_levenshtein_normalized`, `hamming_normalized`, `sift4_simple_normalized`
- `lcs_seq_normalized`, `lcs_str_normalized`, `smith_waterman_normalized`

## Performance

The WebAssembly implementation provides significant performance improvements:

- **10-100x faster** than pure JavaScript implementations
- **Consistent performance** across different platforms
- **Memory efficient** with optimized algorithms
- **Zero runtime dependencies** after WASM compilation

## References

This project incorporates and builds upon the following excellent open source projects:

- [textdistance.rs](https://github.com/life4/textdistance.rs) - Core Rust implementation of string similarity algorithms
- [fastest-levenshtein](https://github.com/ka-weihe/fastest-levenshtein) - Myers algorithm implementation referenced in `myers.rs`

## License

- [MIT](../../LICENSE) &copy; [Demo Macro](https://imst.xyz/)
