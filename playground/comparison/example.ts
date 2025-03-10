/**
 * @nlptools/comparison example
 * Demonstrates how to use text comparison functionality for both English and Chinese texts
 * Includes examples of different comparison methods and options
 */
import {
  type DiffComparisonResult,
  type SegmentationLevel,
  type SimilarityComparisonResult,
  createComparator,
} from "../../packages/comparison/src/index";

// Create comparator instances
const diffComparator = createComparator("diff");
const similarityComparator = createComparator("similarity");

// ============================================================================
// Basic Examples
// ============================================================================

// Simple example with short text
const simpleSource = "Hello, world!";
const simpleTarget = "Hello, Dolly!";

// Simple difference comparison
const simpleDiffResult = diffComparator.compare(simpleSource, simpleTarget, {
  lang: "en",
  segmentationLevel: "words",
});

// Simple similarity comparison
const simpleSimilarityResult = similarityComparator.compare(
  simpleSource,
  simpleTarget,
  {
    lang: "en",
  },
);

console.log("Simple difference comparison result:", simpleDiffResult);
console.log("Simple similarity comparison result:", simpleSimilarityResult);

// ============================================================================
// Standard Text Examples (English and Chinese)
// ============================================================================

// Example texts - Chinese
const chineseSource =
  "自然语言处理是人工智能的一个重要分支，它研究有效沟通的各种理论和方法。";
const chineseTarget =
  "自然语言处理（NLP）是人工智能的一个重要领域，它研究人与计算机之间高效沟通的理论和方法。";

// Example texts - English
const englishSource =
  "Natural Language Processing is a significant branch of artificial intelligence. It studies various theories and methods for effective communication.";
const englishTarget =
  "NLP is an important field in AI. It researches theories and approaches for efficient communication between humans and computers.";

// ============================================================================
// Large Text Examples (English and Chinese)
// ============================================================================

// Large example texts - Chinese (multiple paragraphs)
const largeChineseSource = `
自然语言处理（Natural Language Processing，简称NLP）是计算机科学、人工智能和语言学的交叉学科，致力于使计算机能够理解、解释和生成人类语言。

自然语言处理的历史可以追溯到20世纪50年代，当时研究人员开始探索机器翻译的可能性。早期的自然语言处理系统主要基于规则和语法，通过手工编写的规则来分析和生成文本。

随着计算能力的提升和机器学习技术的发展，自然语言处理在20世纪90年代开始转向统计方法。统计自然语言处理利用大量文本数据来训练模型，使系统能够从数据中学习语言模式和规律。
`;

const largeChineseTarget = `
自然语言处理（NLP）是计算机科学、AI和语言学的交叉学科，致力于使计算机能够理解、解释和生成人类语言。

自然语言处理的历史可以追溯到20世纪50年代，当时研究人员开始探索机器翻译的可能性。早期的NLP系统主要基于规则和语法，通过手工编写的规则来分析和生成文本。

随着计算能力的提升和ML技术的发展，自然语言处理在20世纪90年代开始转向统计方法。统计NLP利用大量文本数据来训练模型，使系统能够从数据中学习语言模式和规律。
`;

// Large example texts - English (multiple paragraphs)
const largeEnglishSource = `
Natural Language Processing (NLP) is an interdisciplinary field of computer science, artificial intelligence, and linguistics dedicated to enabling computers to understand, interpret, and generate human language.

The history of NLP can be traced back to the 1950s when researchers began exploring the possibilities of machine translation. Early NLP systems were primarily rule-based and grammatical, using hand-crafted rules to analyze and generate text.

With the increase in computational power and the development of machine learning techniques, NLP began shifting towards statistical methods in the 1990s. Statistical NLP leverages large amounts of text data to train models, allowing systems to learn language patterns and regularities from data.
`;

const largeEnglishTarget = `
NLP is an interdisciplinary field of computer science, AI, and linguistics dedicated to enabling computers to understand, interpret, and generate human language.

The history of Natural Language Processing can be traced back to the 1950s when researchers began exploring the possibilities of machine translation. Early systems were primarily rule-based and grammatical, using hand-crafted rules to analyze and generate text.

With the increase in computational power and the development of ML techniques, NLP began shifting towards statistical methods in the 1990s. Statistical Natural Language Processing leverages large amounts of text data to train models, allowing systems to learn language patterns and regularities from data.
`;

// Similarity comparison examples
console.log("\nSimilarity comparison examples:");
console.log("Chinese text similarity comparison:");
const chineseSimilarityResult = similarityComparator.compare(
  chineseSource,
  chineseTarget,
  {
    lang: "zh",
    ignoreCase: true,
    threshold: 0.6,
    segmentationLevel: "sentences",
  },
) as SimilarityComparisonResult;

console.log("Source text:", chineseSource);
console.log("Target text:", chineseTarget);
console.log(
  "Overall similarity:",
  chineseSimilarityResult.overallSimilarity.toFixed(4),
);
console.log("Number of matches:", chineseSimilarityResult.items.length);
console.log("Match details:", chineseSimilarityResult.items);

console.log("\nEnglish text similarity comparison:");
const englishSimilarityResult = similarityComparator.compare(
  englishSource,
  englishTarget,
  {
    lang: "en",
    ignoreCase: true,
    threshold: 0.5,
    segmentationLevel: "phrases",
  },
) as SimilarityComparisonResult;

console.log("Source text:", englishSource);
console.log("Target text:", englishTarget);
console.log(
  "Overall similarity:",
  englishSimilarityResult.overallSimilarity.toFixed(4),
);
console.log("Number of matches:", englishSimilarityResult.items.length);
console.log("Match details:", englishSimilarityResult.items);

// Difference comparison examples
console.log("\nDifference comparison examples:");
console.log("Chinese text difference comparison:");
const chineseDiffResult = diffComparator.compare(chineseSource, chineseTarget, {
  lang: "zh",
  ignoreCase: false,
  segmentationLevel: "words",
});

console.log("Source text:", chineseSource);
console.log("Target text:", chineseTarget);
console.log("Difference result:", chineseDiffResult);

console.log("\nEnglish text difference comparison:");
const englishDiffResult = diffComparator.compare(englishSource, englishTarget, {
  lang: "en",
  ignoreCase: true,
  segmentationLevel: "words",
});

console.log("Source text:", englishSource);
console.log("Target text:", englishTarget);
console.log("Difference result:", englishDiffResult);

// Large text comparison examples
console.log("\nLarge text comparison examples:");
console.log("Large Chinese text similarity comparison:");
const largeChineseSimilarityResult = similarityComparator.compare(
  largeChineseSource,
  largeChineseTarget,
  {
    lang: "zh",
    ignoreCase: true,
    threshold: 0.7,
    segmentationLevel: "paragraphs",
  },
) as SimilarityComparisonResult;

console.log(
  "Overall similarity (large Chinese):",
  largeChineseSimilarityResult.overallSimilarity.toFixed(4),
);
console.log("Number of matches:", largeChineseSimilarityResult.items.length);

console.log("\nLarge English text similarity comparison:");
const largeEnglishSimilarityResult = similarityComparator.compare(
  largeEnglishSource,
  largeEnglishTarget,
  {
    lang: "en",
    ignoreCase: true,
    threshold: 0.6,
    segmentationLevel: "paragraphs",
  },
) as SimilarityComparisonResult;

console.log(
  "Overall similarity (large English):",
  largeEnglishSimilarityResult.overallSimilarity.toFixed(4),
);
console.log("Number of matches:", largeEnglishSimilarityResult.items.length);

// Large text difference comparison
console.log("\nLarge text difference comparison:");
console.log("Large Chinese text difference comparison:");
const largeChineseDiffResult = diffComparator.compare(
  largeChineseSource,
  largeChineseTarget,
  {
    lang: "zh",
    segmentationLevel: "paragraphs",
  },
) as DiffComparisonResult;

console.log(
  "Difference operations count:",
  largeChineseDiffResult.changes.length,
);

console.log("\nLarge English text difference comparison:");
const largeEnglishDiffResult = diffComparator.compare(
  largeEnglishSource,
  largeEnglishTarget,
  {
    lang: "en",
    segmentationLevel: "paragraphs",
  },
) as DiffComparisonResult;

console.log(
  "Difference operations count:",
  largeEnglishDiffResult.changes.length,
);

// Examples of different segmentation levels
console.log("\nExamples of different segmentation levels:");
const segmentationLevels: SegmentationLevel[] = [
  "words",
  "phrases",
  "sentences",
  "paragraphs",
];

for (const level of segmentationLevels) {
  console.log(`\nUsing ${level} level for similarity comparison:`);
  const result = similarityComparator.compare(chineseSource, chineseTarget, {
    lang: "zh",
    segmentationLevel: level,
  }) as SimilarityComparisonResult;
  console.log(`Overall similarity: ${result.overallSimilarity.toFixed(4)}`);
  console.log(`Number of matches: ${result.items.length}`);
}
