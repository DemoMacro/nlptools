/**
 * @nlptools/comparison example
 * Demonstrates how to use text similarity functionality for both English and Chinese texts
 * Includes examples of different similarity algorithms and options
 */
import {
  createSimilarityMeasure,
  type SimilarityResult,
  type SimilarityOptions,
} from "../../packages/comparison/src/index";

// Create similarity measure instances
const levenshteinMeasure = createSimilarityMeasure("levenshtein");
const jaccardMeasure = createSimilarityMeasure("jaccard");
const cosineMeasure = createSimilarityMeasure("cosine");
const consecutiveMeasure = createSimilarityMeasure("consecutive");

// ============================================================================
// Basic Examples
// ============================================================================

// Simple example with short text
const simpleSource = "Hello, world!";
const simpleTarget = "Hello, Dolly!";

// Simple similarity comparison with different algorithms
const simpleLevenshteinResult = levenshteinMeasure.calculate(
  simpleSource,
  simpleTarget,
  {
    caseSensitive: false,
  },
);

const simpleJaccardResult = jaccardMeasure.calculate(
  simpleSource,
  simpleTarget,
  {
    caseSensitive: false,
  },
);

const simpleCosineResult = cosineMeasure.calculate(simpleSource, simpleTarget, {
  caseSensitive: false,
});

const simpleConsecutiveResult = consecutiveMeasure.calculate(
  simpleSource,
  simpleTarget,
  {
    caseSensitive: false,
  },
);

console.log("Simple Levenshtein similarity result:", simpleLevenshteinResult);
console.log("Simple Jaccard similarity result:", simpleJaccardResult);
console.log("Simple Cosine similarity result:", simpleCosineResult);
console.log("Simple Consecutive similarity result:", simpleConsecutiveResult);

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
const chineseLevenshteinResult = levenshteinMeasure.calculate(
  chineseSource,
  chineseTarget,
  {
    caseSensitive: false,
  },
);

const chineseJaccardResult = jaccardMeasure.calculate(
  chineseSource,
  chineseTarget,
  {
    caseSensitive: false,
  },
);

const chineseCosineResult = cosineMeasure.calculate(
  chineseSource,
  chineseTarget,
  {
    caseSensitive: false,
  },
);

const chineseConsecutiveResult = consecutiveMeasure.calculate(
  chineseSource,
  chineseTarget,
  {
    caseSensitive: false,
    minMatchLength: 5,
  },
);

console.log("Source text:", chineseSource);
console.log("Target text:", chineseTarget);
console.log(
  "Levenshtein similarity:",
  chineseLevenshteinResult.similarity.toFixed(4),
);
console.log("Jaccard similarity:", chineseJaccardResult.similarity.toFixed(4));
console.log("Cosine similarity:", chineseCosineResult.similarity.toFixed(4));
console.log(
  "Consecutive similarity:",
  chineseConsecutiveResult.similarity.toFixed(4),
);

console.log("\nEnglish text similarity comparison:");
const englishLevenshteinResult = levenshteinMeasure.calculate(
  englishSource,
  englishTarget,
  {
    caseSensitive: false,
  },
);

const englishJaccardResult = jaccardMeasure.calculate(
  englishSource,
  englishTarget,
  {
    caseSensitive: false,
  },
);

const englishCosineResult = cosineMeasure.calculate(
  englishSource,
  englishTarget,
  {
    caseSensitive: false,
  },
);

const englishConsecutiveResult = consecutiveMeasure.calculate(
  englishSource,
  englishTarget,
  {
    caseSensitive: false,
    minMatchLength: 5,
  },
);

console.log("Source text:", englishSource);
console.log("Target text:", englishTarget);
console.log(
  "Levenshtein similarity:",
  englishLevenshteinResult.similarity.toFixed(4),
);
console.log("Jaccard similarity:", englishJaccardResult.similarity.toFixed(4));
console.log("Cosine similarity:", englishCosineResult.similarity.toFixed(4));
console.log(
  "Consecutive similarity:",
  englishConsecutiveResult.similarity.toFixed(4),
);

// Large text comparison examples
console.log("\nLarge text comparison examples:");
console.log("Large Chinese text similarity comparison:");
const largeChineseLevenshteinResult = levenshteinMeasure.calculate(
  largeChineseSource,
  largeChineseTarget,
  {
    caseSensitive: false,
  },
);

const largeChineseJaccardResult = jaccardMeasure.calculate(
  largeChineseSource,
  largeChineseTarget,
  {
    caseSensitive: false,
  },
);

const largeChineseCosineResult = cosineMeasure.calculate(
  largeChineseSource,
  largeChineseTarget,
  {
    caseSensitive: false,
  },
);

const largeChineseConsecutiveResult = consecutiveMeasure.calculate(
  largeChineseSource,
  largeChineseTarget,
  {
    caseSensitive: false,
    minMatchLength: 10,
  },
);

console.log(
  "Levenshtein similarity (large Chinese):",
  largeChineseLevenshteinResult.similarity.toFixed(4),
);
console.log(
  "Jaccard similarity (large Chinese):",
  largeChineseJaccardResult.similarity.toFixed(4),
);
console.log(
  "Cosine similarity (large Chinese):",
  largeChineseCosineResult.similarity.toFixed(4),
);
console.log(
  "Consecutive similarity (large Chinese):",
  largeChineseConsecutiveResult.similarity.toFixed(4),
);

console.log("\nLarge English text similarity comparison:");
const largeEnglishLevenshteinResult = levenshteinMeasure.calculate(
  largeEnglishSource,
  largeEnglishTarget,
  {
    caseSensitive: false,
  },
);

const largeEnglishJaccardResult = jaccardMeasure.calculate(
  largeEnglishSource,
  largeEnglishTarget,
  {
    caseSensitive: false,
  },
);

const largeEnglishCosineResult = cosineMeasure.calculate(
  largeEnglishSource,
  largeEnglishTarget,
  {
    caseSensitive: false,
  },
);

const largeEnglishConsecutiveResult = consecutiveMeasure.calculate(
  largeEnglishSource,
  largeEnglishTarget,
  {
    caseSensitive: false,
    minMatchLength: 10,
  },
);

console.log(
  "Levenshtein similarity (large English):",
  largeEnglishLevenshteinResult.similarity.toFixed(4),
);
console.log(
  "Jaccard similarity (large English):",
  largeEnglishJaccardResult.similarity.toFixed(4),
);
console.log(
  "Cosine similarity (large English):",
  largeEnglishCosineResult.similarity.toFixed(4),
);
console.log(
  "Consecutive similarity (large English):",
  largeEnglishConsecutiveResult.similarity.toFixed(4),
);

// Examples of different minMatchLength for consecutive algorithm
console.log(
  "\nExamples of different minMatchLength for consecutive algorithm:",
);
for (const minLength of [3, 5, 10, 15]) {
  console.log(`\nUsing minMatchLength: ${minLength}`);
  const result = consecutiveMeasure.calculate(chineseSource, chineseTarget, {
    caseSensitive: false,
    minMatchLength: minLength,
  });
  console.log(`Similarity: ${result.similarity.toFixed(4)}`);
  console.log(`Distance: ${result.distance.toFixed(4)}`);
}
