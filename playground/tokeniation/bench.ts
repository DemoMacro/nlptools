import { readFileSync } from "node:fs";
import { join } from "node:path";
/**
 * @nlptools/tokenization Benchmark (formerly segmentation)
 * Performance testing for text tokenization functionality using sample files.
 */
import { Bench } from "@funish/bench";
import { createTokenizer } from "../../packages/tokenization/src/index";

const bench = new Bench({
  times: 5000,
  unit: "ms",
});

// --- Load Sample Texts ---
const samplesDir = join(__dirname, "../samples");
const chineseText = readFileSync(join(samplesDir, "chinese.txt"), "utf-8");
const englishText = readFileSync(join(samplesDir, "english.txt"), "utf-8");
// Use a concatenated text for general benchmarks
const combinedText = `${englishText}\n\n${chineseText}`;

// --- Create Tokenizers ---
const wordTokenizer = createTokenizer("words");
const sentenceTokenizer = createTokenizer("sentences");
const paragraphTokenizer = createTokenizer("paragraphs");

// --- Benchmarks ---

// Benchmark word tokenization (auto lang detection on combined text)
bench.add("word tokenization (auto - combined)", () => {
  wordTokenizer.tokenize(combinedText);
});

// Benchmark sentence tokenization (auto lang detection on combined text)
bench.add("sentence tokenization (auto - combined)", () => {
  sentenceTokenizer.tokenize(combinedText);
});

// Benchmark paragraph tokenization (auto lang detection on combined text)
bench.add("paragraph tokenization (auto - combined)", () => {
  paragraphTokenizer.tokenize(combinedText);
});

// Benchmark word tokenization (explicit English on English text)
bench.add("word tokenization (en - english text)", () => {
  wordTokenizer.tokenize(englishText, { lang: "en" });
});

// Benchmark word tokenization (explicit Chinese on Chinese text)
bench.add("word tokenization (zh - chinese text)", () => {
  wordTokenizer.tokenize(chineseText, { lang: "zh" });
});

// Benchmark word tokenization (explicit English on Chinese text - expect warning/inaccuracy)
bench.add("word tokenization (en - chinese text)", () => {
  wordTokenizer.tokenize(chineseText, { lang: "en" });
});

// Run the benchmarks and print results
bench.print();
