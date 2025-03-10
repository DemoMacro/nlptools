# Natural language processing tools

![GitHub](https://img.shields.io/github/license/DemoMacro/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Natural language processing tools, powered by Demo Macro.

## Introduction

NLPTools is a comprehensive collection of natural language processing utilities designed to simplify text analysis, comparison, and manipulation. The project is structured as a monorepo with multiple specialized packages that can be used together or independently.

## Features

- **Text Similarity**: Multiple algorithms for measuring text similarity (Levenshtein, Jaccard, Cosine)
- **Text Comparison**: Tools for comparing and finding differences between texts
- **Text Segmentation**: Utilities for breaking text into paragraphs, sentences, phrases, and words
- **Language Support**: Support for multiple languages with automatic language detection
- **Modular Design**: Use only what you need with independent packages

## Installation

```bash
# Install the main package with all utilities
pnpm install @nlptools/nlptools

# Or install individual packages as needed
pnpm install @nlptools/similarity
pnpm install @nlptools/comparison
pnpm install @nlptools/segmentation
pnpm install @nlptools/core
```

## Quick Start

```ts
// Import from the main package
import {
  createSimilarityMeasure,
  createComparator,
  createSegmenter,
} from "@nlptools/nlptools";

// Calculate text similarity
const similarity = createSimilarityMeasure("levenshtein").calculate(
  "Hello world",
  "Hello there",
);
console.log(`Similarity: ${similarity.similarity}`);

// Compare texts and get differences
const diff = createComparator("diff").compare("Hello world", "Hello there");
console.log(diff.differences);

// Segment text into sentences
const sentences = createSegmenter("sentences").segment(
  "Hello world! How are you today?",
);
console.log(sentences.segments);
```

## Packages

- [nlptools](./packages/nlptools/README.md) - Main package that includes all modules
- [@nlptools/similarity](./packages/similarity/README.md) - Text similarity algorithms
- [@nlptools/comparison](./packages/comparison/README.md) - Text comparison utilities
- [@nlptools/segmentation](./packages/segmentation/README.md) - Text segmentation tools
- [@nlptools/core](./packages/core/README.md) - Core utilities and interfaces

## Documentation

Each package contains detailed documentation and examples. See the individual package READMEs for more information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
