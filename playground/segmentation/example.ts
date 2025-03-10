import {
  type SegmentationType,
  createSegmenter,
} from "../../packages/segmentation/src/index";

/**
 * @nlptools/segmentation Example
 * Demonstrates how to use text segmentation functionality
 */

// Example text
const chineseText1 =
  "照顾病人很重要，医生会跟进，但这是一个充满痛苦和痛苦时期。就最小的细节而言，任何人都不应从事任何一种工作，除非他从中得到一些好处。不要在痛斥中生气在快感中痛斥他要从痛中发一毛希望没有滋生。非为色欲所蒙蔽，不出也；弃职而软其心者，其过也，是劳。";
const englishText1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

// Create segmenters of different levels
const wordSegmenter = createSegmenter("words");
const phraseSegmenter = createSegmenter("phrases");
const sentenceSegmenter = createSegmenter("sentences");
const paragraphSegmenter = createSegmenter("paragraphs");

// Word-level segmentation example
console.log("\nWord-level segmentation example:");
console.log("Chinese text word-level segmentation:");
console.log(wordSegmenter.segment(chineseText1, { lang: "zh" }));
console.log("English text word-level segmentation:");
console.log(wordSegmenter.segment(englishText1, { lang: "en" }));

// Phrase-level segmentation example
console.log("\nPhrase-level segmentation example:");
console.log("Chinese text phrase-level segmentation:");
console.log(phraseSegmenter.segment(chineseText1, { lang: "zh" }));
console.log("English text phrase-level segmentation:");
console.log(phraseSegmenter.segment(englishText1, { lang: "en" }));

// Sentence-level segmentation example
console.log("\nSentence-level segmentation example:");
console.log("Chinese text sentence-level segmentation:");
console.log(sentenceSegmenter.segment(chineseText1, { lang: "zh" }));
console.log("English text sentence-level segmentation:");
console.log(sentenceSegmenter.segment(englishText1, { lang: "en" }));

// Paragraph-level segmentation example
console.log("\nParagraph-level segmentation example:");
console.log("Chinese text paragraph-level segmentation:");
console.log(paragraphSegmenter.segment(chineseText1, { lang: "zh" }));
console.log("English text paragraph-level segmentation:");
console.log(paragraphSegmenter.segment(englishText1, { lang: "en" }));

// Example text 2
const chineseText2 =
  "自然语言处理是人工智能的一个重要分支。它研究人与计算机之间用自然语言进行有效通信的各种理论和方法。自然语言处理是一门融合语言学、计算机科学、数学的交叉学科。";
const englishText2 =
  "Natural Language Processing is a significant branch of artificial intelligence. It studies various theories and methods for effective communication between humans and computers using natural language. NLP is an interdisciplinary field that combines linguistics, computer science, and mathematics.";

// Multi-paragraph text example
console.log("\nMulti-paragraph text example:");
const multiParagraphChinese =
  "自然语言处理是人工智能的一个重要分支。它研究人与计算机之间用自然语言进行有效通信的各种理论和方法。\n\n自然语言处理是一门融合语言学、计算机科学、数学的交叉学科。它的应用非常广泛，包括机器翻译、情感分析、文本分类等。";
const multiParagraphEnglish =
  "Natural Language Processing is a significant branch of artificial intelligence. It studies various theories and methods for effective communication between humans and computers using natural language.\n\nNLP is an interdisciplinary field that combines linguistics, computer science, and mathematics. Its applications are extensive, including machine translation, sentiment analysis, text classification, and more.";

console.log("Chinese multi-paragraph text segmentation:");
console.log(paragraphSegmenter.segment(multiParagraphChinese, { lang: "zh" }));
console.log("English multi-paragraph text segmentation:");
console.log(paragraphSegmenter.segment(multiParagraphEnglish, { lang: "en" }));

// Automatic language detection example
console.log("\nAutomatic language detection example:");
const mixedText = "这是一段混合了Chinese and English的文本。";
console.log("Mixed text:", mixedText);
console.log(wordSegmenter.segment(mixedText));

// Comparison of different segmentation levels
console.log("\nComparison of different segmentation levels:");
const segmentationLevels: SegmentationType[] = [
  "words",
  "phrases",
  "sentences",
  "paragraphs",
];

for (const level of segmentationLevels) {
  console.log(`\nUsing ${level} level for segmentation:`);
  const segmenter = createSegmenter(level);
  const result = segmenter.segment(chineseText2, { lang: "zh" });
  console.log(`Segmentation result (${result.length} items):`, result);
}
