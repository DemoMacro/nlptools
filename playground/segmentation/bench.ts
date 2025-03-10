/**
 * @nlptools/segmentation Benchmark
 * Performance testing for text segmentation functionality
 */
import { Bench } from "@funish/bench";
import { createSegmenter } from "../../packages/segmentation/src/index";

const bench = new Bench({
  times: 5000,
  unit: "ms",
});

const text =
  "照顾病人很重要，医生会跟进，但这是一个充满痛苦和痛苦时期。就最小的细节而言，任何人都不应从事任何一种工作，除非他从中得到一些好处。不要在痛斥中生气在快感中痛斥他要从痛中发一毛希望没有滋生。非为色欲所蒙蔽，不出也；弃职而软其心者，其过也，是劳。";

// Create segmenters
const wordSegmenter = createSegmenter("words");
const phraseSegmenter = createSegmenter("phrases");
const sentenceSegmenter = createSegmenter("sentences");
const paragraphSegmenter = createSegmenter("paragraphs");

bench.add("word segmentation", () => {
  wordSegmenter.segment(text, {
    lang: "zh",
  });
});

bench.add("phrase segmentation", () => {
  phraseSegmenter.segment(text, {
    lang: "zh",
  });
});

bench.add("sentence segmentation", () => {
  sentenceSegmenter.segment(text, {
    lang: "zh",
  });
});

bench.add("paragraph segmentation", () => {
  paragraphSegmenter.segment(text, {
    lang: "zh",
  });
});

bench.print();
