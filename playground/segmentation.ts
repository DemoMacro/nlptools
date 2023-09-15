import { createSegmentation } from "../packages/segmentation/src/index";

const chineseText =
  "照顾病人很重要，医生会跟进，但这是一个充满痛苦和痛苦的时期。就最小的细节而言，任何人都不应从事任何一种工作，除非他从中得到一些好处。不要在痛斥中生气在快感中痛斥他要从痛中发一毛希望没有滋生。非为色欲所蒙蔽，不出也；弃职而软其心者，其过也，是劳。";
const englishText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

console.log(
  createSegmentation(chineseText, { lang: "zh", segmentation: "words" })
);

console.log(
  createSegmentation(englishText, { lang: "en", segmentation: "words" })
);

console.log(
  createSegmentation(chineseText, { lang: "zh", segmentation: "sentences" })
);

console.log(
  createSegmentation(englishText, { lang: "en", segmentation: "sentences" })
);

console.log(
  createSegmentation(chineseText, { lang: "zh", segmentation: "phrases" })
);

console.log(
  createSegmentation(englishText, { lang: "en", segmentation: "phrases" })
);

// console.log(createSegmentation(chineseText, { lang: "zh", segmentation: "paragraphs" }));

// console.log(createSegmentation(englishText, { lang: "en", segmentation: "paragraphs" }));
