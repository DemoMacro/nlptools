# @nlptools/nlptools

![npm version](https://img.shields.io/npm/v/@nlptools/nlptools)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/nlptools)
![npm license](https://img.shields.io/npm/l/@nlptools/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Natural language processing tools, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/nlptools

# yarn
$ yarn add @nlptools/nlptools

# pnpm
$ pnpm add @nlptools/nlptools
```

## Usage

```ts
// Import all modules from the main package
import {
  // Similarity tools
  createSimilarityMeasure,
  SimilarityAlgorithm,

  // Comparison tools
  createComparator,
  ComparisonType,

  // Segmentation tools
  createSegmenter,
  SegmentationType,
} from "@nlptools/nlptools";

// Use similarity tools
const similarityMeasure = createSimilarityMeasure("levenshtein");
const similarityResult = similarityMeasure.calculate("Hello", "Hello world");

// Use comparison tools
const comparator = createComparator("diff");
const diffResult = comparator.compare("Hello world", "Hello there");

// Use segmentation tools
const segmenter = createSegmenter("sentences");
const segmentationResult = segmenter.segment("Hello world! How are you?");
```

## Included Packages

This is an umbrella package that includes the following modules:

- [@nlptools/similarity](../similarity/README.md) - Multiple algorithms for text similarity
- [@nlptools/comparison](../comparison/README.md) - Text comparison utilities
- [@nlptools/segmentation](../segmentation/README.md) - Text segmentation tools

Each module can also be installed and used independently.

## API Reference

This package re-exports all functionality from the included packages. Please refer to the individual package documentation for detailed API references:

- [Similarity API](../similarity/README.md#api-reference)
- [Comparison API](../comparison/README.md#api-reference)
- [Segmentation API](../segmentation/README.md#api-reference)

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
