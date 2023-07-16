import { Bench } from "@funish/bench";
import { cut } from "@node-rs/jieba";
import { createSegmentation } from "../packages/segmentation/src/index";

const bench = new Bench({
  times: 5000,
  unit: "ms",
});

const text =
  "照顾病人很重要，医生会跟进，但这是一个充满痛苦和痛苦的时期。就最小的细节而言，任何人都不应从事任何一种工作，除非他从中得到一些好处。不要在痛斥中生气在快感中痛斥他要从痛中发一毛希望没有滋生。非为色欲所蒙蔽，不出也；弃职而软其心者，其过也，是劳。";

bench.add("nodejieba", () => {
  cut(text, true);
});

bench.add("word segmentation", () => {
  createSegmentation(text, {
    lang: "zh",
    segmentation: "words",
  });
});

bench.add("phrase segmentation", () => {
  createSegmentation(text, {
    lang: "zh",
    segmentation: "phrases",
  });
});

bench.add("sentence segmentation", () => {
  createSegmentation(text, {
    lang: "zh",
    segmentation: "sentences",
  });
});

bench.add("paragraph segmentation", () => {
  createSegmentation(text, {
    lang: "zh",
    segmentation: "paragraphs",
  });
});

bench.print();
