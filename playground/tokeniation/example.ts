import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  type TokenizationOptions,
  createTokenizer,
} from "../../packages/tokenization/src/index";

/**
 * @nlptools/tokenization Example (formerly segmentation)
 * Demonstrates how to use text tokenization functionality using sample files.
 */

// --- Load Sample Texts ---
const samplesDir = join(__dirname, "../samples"); // Assumes samples dir is sibling to tokeniation
const chineseText = readFileSync(join(samplesDir, "chinese.txt"), "utf-8");
const englishText = readFileSync(join(samplesDir, "english.txt"), "utf-8");

// --- Create Tokenizers ---
const wordTokenizer = createTokenizer("words");
const sentenceTokenizer = createTokenizer("sentences");
const paragraphTokenizer = createTokenizer("paragraphs");

// --- Helper Function ---
function demonstrateTokenization(
  tokenizerName: string,
  tokenizer: ReturnType<typeof createTokenizer>,
  text: string,
  options?: TokenizationOptions,
) {
  console.log(
    `\n${tokenizerName} tokenization example (${options?.lang || "auto"}):`,
  );
  const tokens = tokenizer.tokenize(text, options);
  console.log(`Input Text (from file ${options?.lang || "auto"}.txt):`);
  console.log(`"${text.substring(0, 80)}..."`); // Show a bit more context
  console.log(`Tokens (${tokens.length}):`, tokens);
}

// --- Word-level tokenization examples ---
console.log("\n--- Word-level tokenization ---");
demonstrateTokenization("Word", wordTokenizer, chineseText, { lang: "zh" });
demonstrateTokenization("Word", wordTokenizer, englishText, { lang: "en" });

// --- Sentence-level tokenization examples ---
console.log("\n--- Sentence-level tokenization ---");
demonstrateTokenization("Sentence", sentenceTokenizer, chineseText, {
  lang: "zh",
});
demonstrateTokenization("Sentence", sentenceTokenizer, englishText, {
  lang: "en",
});

// --- Paragraph-level tokenization examples ---
console.log("\n--- Paragraph-level tokenization ---");
demonstrateTokenization("Paragraph", paragraphTokenizer, chineseText, {
  lang: "zh",
});
demonstrateTokenization("Paragraph", paragraphTokenizer, englishText, {
  lang: "en",
});

// --- Example with language auto-detection ---
// Using English text for word auto-detection
console.log("\n--- Auto-detection examples ---");
demonstrateTokenization("Word (auto)", wordTokenizer, englishText);
// Using Chinese text for sentence auto-detection
demonstrateTokenization("Sentence (auto)", sentenceTokenizer, chineseText);
