# @nlptools/segmentation

![npm version](https://img.shields.io/npm/v/@nlptools/segmentation)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/segmentation)
![npm license](https://img.shields.io/npm/l/@nlptools/segmentation)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Programmatically create text segmentations, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/segmentation

# yarn
$ yarn add @nlptools/segmentation

# pnpm
$ pnpm add @nlptools/segmentation
```

## Usage

```ts
// Import the segmentation creator function
import { createSegmenter, SegmentationType } from "@nlptools/segmentation";

// Create a segmenter with your preferred segmentation type
const wordsSegmenter = createSegmenter("words");
const sentencesSegmenter = createSegmenter("sentences");
const paragraphsSegmenter = createSegmenter("paragraphs");
const phrasesSegmenter = createSegmenter("phrases");

// Segment text into words
const wordsResult = wordsSegmenter.segment("Hello, world! How are you today?", {
  lang: "en", // default is "auto"
});

console.log(wordsResult.segments); // Array of word segments
console.log(wordsResult.metadata); // Additional metadata

// Segment text into sentences
const sentencesResult = sentencesSegmenter.segment(
  "Hello, world! How are you today?",
);
console.log(sentencesResult.segments); // ["Hello, world!", "How are you today?"]
```

## API Reference

### Types

#### `SegmentationType`

Available segmentation types: `"paragraphs"` | `"sentences"` | `"phrases"` | `"words"`

#### `SegmentationOptions`

Options for text segmentation:

```ts
interface SegmentationOptions extends BaseOptions {
  // Additional options specific to segmentation
}
```

#### `SegmentationResult`

Result of text segmentation:

```ts
interface SegmentationResult {
  segments: string[];
  metadata?: Record<string, unknown>;
}
```

### Functions and Classes

#### `createSegmenter(type: SegmentationType): Segmenter`

Creates a segmenter instance using the specified segmentation type.

#### `Segmenter` Interface

```ts
interface Segmenter {
  segment(text: string, options?: SegmentationOptions): SegmentationResult;
}
```

### Segmentation Types

#### Paragraphs

Segments text into paragraphs based on line breaks and other paragraph delimiters.

#### Sentences

Segments text into sentences based on punctuation and language-specific rules.

#### Phrases

Segments text into phrases based on punctuation and grammatical structures.

#### Words

Segments text into individual words based on spaces and language-specific tokenization rules.

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
