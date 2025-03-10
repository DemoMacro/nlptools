# @nlptools/comparison

![npm version](https://img.shields.io/npm/v/@nlptools/comparison)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/comparison)
![npm license](https://img.shields.io/npm/l/@nlptools/comparison)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Programmatically create text comparisons, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/comparison

# yarn
$ yarn add @nlptools/comparison

# pnpm
$ pnpm add @nlptools/comparison
```

## Usage

### Basic Usage

```ts
// Import the comparison creator function
import { createComparator, ComparisonType } from "@nlptools/comparison";

// Create a diff comparator
const diffComparator = createComparator("diff");

// Generate diff comparison between two texts
const diffResult = diffComparator.compare("Hello, world!", "Hello, world?", {
  ignoreCase: false, // default is false
  lang: "en", // default is "auto"
  segmentationLevel: "words", // default is "paragraphs"
});

console.log(diffResult.changes); // Array of differences

// Create a similarity comparator
const similarityComparator = createComparator("similarity");

// Generate similarity comparison
const similarityResult = similarityComparator.compare(
  "Hello, world!",
  "Hello, world?",
  {
    lang: "en", // default is "auto"
    threshold: 0.8, // default is 0.7
  },
);

console.log(similarityResult.overallSimilarity); // Overall similarity score
console.log(similarityResult.items); // Matching segments
```

### Advanced Usage with Algorithm Selection

```ts
import { createComparator, AlgorithmSelector } from "@nlptools/comparison";

// Create a diff comparator with specific algorithm
const diffComparator = createComparator("diff");

// Use specific algorithm for different segmentation levels
const diffResult = diffComparator.compare("Hello, world!", "Hello, world?", {
  algorithm: "myers", // Use Myers algorithm
  calculateSimilarity: true, // Calculate similarity ratio
  includeDetails: true, // Include detailed information
});

// Use algorithm mapping for different segmentation levels
const similarityComparator = createComparator("similarity");
const similarityResult = similarityComparator.compare(
  "This is a long paragraph with multiple sentences. It contains various phrases and words.",
  "This is a lengthy paragraph with several sentences. It has different phrases and terms.",
  {
    algorithmMapping: {
      paragraphs: "consecutive",
      sentences: "levenshtein",
      phrases: "cosine",
      words: "jaccard",
    },
    includeDetails: true,
  },
);
```

### Adaptive Segmentation

```ts
import { createComparator } from "@nlptools/comparison";

// Create a similarity comparator with adaptive segmentation
const similarityComparator = createComparator("similarity");

// Use adaptive segmentation to automatically adjust segmentation level
const result = similarityComparator.compare(
  "This is a long paragraph with multiple sentences. It contains various phrases and words.",
  "This is a lengthy paragraph with several sentences. It has different phrases and terms.",
  {
    useAdaptiveSegmentation: true,
    adaptiveSegmentationThreshold: 0.6, // Try smaller units if similarity is below 0.6
    minSegmentationLevel: "words", // Don't go smaller than words
    includeDetails: true, // Include segmentation level usage statistics
  },
);

console.log(result.overallSimilarity);
console.log(result.details?.segmentationLevelUsage); // See which levels were used
```

## API Reference

### Types

#### `ComparisonType`

Available comparison types: `"diff"` | `"similarity"`

#### `SegmentationLevel`

Available segmentation levels: `"paragraphs"` | `"sentences"` | `"phrases"` | `"words"`

#### `ExtendedDiffComparisonOptions`

Options for diff comparison:

```ts
interface ExtendedDiffComparisonOptions extends ExtendedBaseComparisonOptions {
  // Diff algorithm to use
  // @default "lcs"
  algorithm?: "lcs" | "myers" | "patience";

  // Whether to calculate similarity ratio
  // @default false
  calculateSimilarity?: boolean;

  // Algorithm mapping for different segmentation levels
  // This allows specifying different algorithms for different segmentation levels
  // @example { paragraphs: "patience", sentences: "lcs", phrases: "myers", words: "myers" }
  algorithmMapping?: {
    [key in SegmentationLevel]?: "lcs" | "myers" | "patience";
  };

  // Minimum segmentation level to use when adaptive segmentation is enabled
  // @default "paragraphs"
  minSegmentationLevel?: SegmentationLevel;

  // Whether to use adaptive segmentation (progressively smaller units)
  // @default false
  useAdaptiveSegmentation?: boolean;

  // Similarity threshold for adaptive segmentation to move to a smaller unit
  // @default 0.5
  adaptiveSegmentationThreshold?: number;
}
```

#### `ExtendedSimilarityComparisonOptions`

Options for similarity comparison:

```ts
interface ExtendedSimilarityComparisonOptions
  extends ExtendedBaseComparisonOptions {
  // Similarity algorithm to use
  // @default "levenshtein"
  algorithm?: "levenshtein" | "jaccard" | "cosine" | "consecutive";

  // Algorithm mapping for different segmentation levels
  // This allows specifying different algorithms for different segmentation levels
  // @example { paragraphs: "consecutive", sentences: "levenshtein", phrases: "cosine", words: "jaccard" }
  algorithmMapping?: {
    [key in SegmentationLevel]?:
      | "levenshtein"
      | "jaccard"
      | "cosine"
      | "consecutive";
  };

  // Minimum segmentation level to use when adaptive segmentation is enabled
  // @default "paragraphs"
  minSegmentationLevel?: SegmentationLevel;

  // Whether to use adaptive segmentation (progressively smaller units)
  // @default false
  useAdaptiveSegmentation?: boolean;

  // Similarity threshold for adaptive segmentation to move to a smaller unit
  // @default 0.5
  adaptiveSegmentationThreshold?: number;

  // Minimum length of consecutive characters to be considered a match (for consecutive algorithm)
  // @default 10
  minMatchLength?: number;

  // Maximum number of segments to process at once (for large text optimization)
  // @default 1000
  maxSegmentsPerBatch?: number;

  // Similarity threshold (minimum similarity to be considered a match)
  // @default 0.7
  threshold?: number;
}
```

#### `DiffComparisonResult`

Result of diff comparison:

```ts
interface DiffComparisonResult {
  // List of difference items
  changes: Array<{
    // Change type: added, removed, or unchanged
    type: "added" | "removed" | "unchanged";
    // Text content
    value: string;
  }>;

  // Similarity ratio between source and target (0-1)
  // Only available if calculateSimilarity is true
  similarityRatio?: number;

  // Detailed comparison information
  // Only available if includeDetails is true
  details?: {
    // Number of segments in source text
    sourceSize: number;
    // Number of segments in target text
    targetSize: number;
    // Number of added segments
    addedCount: number;
    // Number of removed segments
    removedCount: number;
    // Number of unchanged segments
    unchangedCount: number;
    // Algorithm used for comparison
    algorithm: string;
    // Segmentation level used for comparison
    segmentationLevel: SegmentationLevel;
    // Segmentation level usage statistics
    // Shows how many segments were matched at each level
    // Only available when useAdaptiveSegmentation is true
    segmentationLevelUsage?: Record<SegmentationLevel, number>;
  };
}
```

#### `SimilarityComparisonResult`

Result of similarity comparison:

```ts
interface SimilarityComparisonResult {
  // List of comparison result items
  items: SimilarityComparisonItem[];

  // Overall similarity
  overallSimilarity: number;

  // Detailed comparison information
  // Only available if includeDetails is true
  details?: {
    // Number of segments in source text
    sourceSize: number;
    // Number of segments in target text
    targetSize: number;
    // Number of processed segments
    processedSegments: number;
    // Number of matched segments
    matchedSegments: number;
    // Algorithm used for comparison
    algorithm: string;
    // Segmentation level used for comparison
    segmentationLevel: SegmentationLevel;
    // Similarity threshold used
    threshold: number;
    // Segmentation level usage statistics
    // Shows how many segments were matched at each level
    // Only available when useAdaptiveSegmentation is true
    segmentationLevelUsage?: Record<SegmentationLevel, number>;
  };
}
```

### Functions and Classes

#### `createComparator(type: ComparisonType): Comparator`

Creates a comparator instance using the specified comparison type.

#### `Comparator` Interface

```ts
interface Comparator {
  compare(
    source: string,
    target: string,
    options?: ComparisonOptions,
  ): ComparisonResult;
}
```

#### `ExtendedBaseComparisonOptions`

Base options extended with algorithm selection features:

```ts
interface ExtendedBaseComparisonOptions extends ComparisonOptions {
  // Whether to automatically select the best algorithm based on segmentation level
  // @default true
  autoSelectAlgorithm?: boolean;

  // Whether to include detailed match information
  // @default false
  includeDetails?: boolean;
}
```

#### `AlgorithmSelector`

Utility for selecting the most appropriate algorithm based on segmentation level:

```ts
const AlgorithmSelector = {
  // Get the most suitable diff algorithm for a given segmentation level
  getBestDiffAlgorithm(segmentationLevel: SegmentationLevel): "lcs" | "myers" | "patience";

  // Get the most suitable similarity algorithm for a given segmentation level
  getBestSimilarityAlgorithm(segmentationLevel: SegmentationLevel): "levenshtein" | "jaccard" | "cosine" | "consecutive";
};
```

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
