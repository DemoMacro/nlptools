# @nlptools/similarity

![npm version](https://img.shields.io/npm/v/@nlptools/similarity)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/similarity)
![npm license](https://img.shields.io/npm/l/@nlptools/similarity)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Multiple algorithms for similarity, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/similarity

# yarn
$ yarn add @nlptools/similarity

# pnpm
$ pnpm add @nlptools/similarity
```

## Usage

```ts
// Using the createSimilarityMeasure function
import {
  createSimilarityMeasure,
  SimilarityAlgorithm,
} from "@nlptools/similarity";

// Create a similarity measure with your preferred algorithm
const levenshteinMeasure = createSimilarityMeasure("levenshtein");
const jaccardMeasure = createSimilarityMeasure("jaccard");
const cosineMeasure = createSimilarityMeasure("cosine");

// Calculate similarity between two strings
const result = levenshteinMeasure.calculate("Hello, world!", "Hello, world?");
console.log(`Similarity: ${result.similarity}, Distance: ${result.distance}`);

// Find the closest match from a list of candidates
const closest = levenshteinMeasure.findClosest("apple", [
  "apples",
  "banana",
  "orange",
]);
console.log(
  `Closest match: ${closest.closest}, Similarity: ${closest.similarity}`,
);

// With options
const resultWithOptions = jaccardMeasure.calculate(
  "Hello, World",
  "hello, world",
  {
    caseSensitive: false, // default is false
    lang: "en", // default is "auto"
  },
);
```

## API Reference

### Types

#### `SimilarityAlgorithm`

Available similarity algorithms: `"levenshtein"` | `"jaccard"` | `"cosine"`

#### `SimilarityOptions`

Options for similarity calculations:

```ts
interface SimilarityOptions {
  caseSensitive?: boolean; // Whether to be case-sensitive (default: false)
  lang?: "en" | "zh" | "auto"; // Language setting (default: "auto")
}
```

#### `SimilarityResult`

Result of similarity calculation:

```ts
interface SimilarityResult {
  similarity: number; // Range 0-1, higher value indicates greater similarity
  distance: number; // Smaller value indicates greater similarity
}
```

#### `ClosestResult`

Result of finding the closest match:

```ts
interface ClosestResult extends SimilarityResult {
  closest: string; // The closest matching string
}
```

### Functions and Classes

#### `createSimilarityMeasure(algorithm: SimilarityAlgorithm): SimilarityMeasure`

Creates a similarity measure instance using the specified algorithm.

#### `SimilarityMeasure` Interface

```ts
interface SimilarityMeasure {
  calculate(
    a: string,
    b: string,
    options?: SimilarityOptions,
  ): SimilarityResult;
  findClosest(
    query: string,
    candidates: string[],
    options?: SimilarityOptions,
  ): ClosestResult;
}
```

### Algorithms

#### Levenshtein Distance

Measures the minimum number of single-character edits required to change one string into another.

#### Jaccard Similarity

Measures similarity between finite sample sets by comparing what they have in common with what they have in total.

#### Cosine Similarity

Measures the cosine of the angle between two vectors, representing the strings as frequency vectors.

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
