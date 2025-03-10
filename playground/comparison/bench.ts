/**
 * @nlptools/comparison Benchmark
 * Performance testing for text comparison functionality
 */
import { Bench } from "@funish/bench";
import { createComparator } from "../../packages/comparison/src/index";

const bench = new Bench({
  times: 5000,
  unit: "ms",
});

// Short example texts
const chineseSource =
  "自然语言处理是人工智能的一个重要分支。它主要研究人类和计算机如何使用自然语言进行有效的交流。";
const chineseTarget =
  "自然语言处理是人工智能的一个重要领域。它研究人类和计算机如何使用自然语言进行有效的交流。";

const englishSource =
  "Natural Language Processing is a significant branch of artificial intelligence. It studies various theories and methods for effective communication.";
const englishTarget =
  "NLP is an important field in AI. It researches theories and approaches for efficient communication between humans and computers.";

// Large example texts (multiple paragraphs)
const largeChinese = `
自然语言处理（Natural Language Processing，简称NLP）是计算机科学、人工智能和语言学的交叉学科，致力于使计算机能够理解、解释和生成人类语言。

自然语言处理的历史可以追溯到20世纪50年代，当时研究人员开始探索机器翻译的可能性。早期的自然语言处理系统主要基于规则和语法，通过手工编写的规则来分析和生成文本。

随着计算能力的提升和机器学习技术的发展，自然语言处理在20世纪90年代开始转向统计方法。统计自然语言处理利用大量文本数据来训练模型，使系统能够从数据中学习语言模式和规律。

进入21世纪，深度学习技术的兴起为自然语言处理带来了革命性的变化。基于神经网络的模型，如循环神经网络（RNN）、长短期记忆网络（LSTM）和注意力机制，显著提高了自然语言处理任务的性能。

近年来，预训练语言模型如BERT、GPT和T5的出现，进一步推动了自然语言处理的发展。这些模型通过在大规模文本语料库上进行预训练，学习了丰富的语言知识，可以适应各种下游任务。

自然语言处理的应用非常广泛，包括机器翻译、情感分析、文本分类、问答系统、对话系统、文本摘要和信息提取等。随着技术的不断进步，自然语言处理正在改变人类与计算机交互的方式，使人机交流更加自然和高效。
`;

const largeEnglish = `
Natural Language Processing (NLP) is an interdisciplinary field of computer science, artificial intelligence, and linguistics dedicated to enabling computers to understand, interpret, and generate human language.

The history of NLP can be traced back to the 1950s when researchers began exploring the possibilities of machine translation. Early NLP systems were primarily rule-based and grammatical, using hand-crafted rules to analyze and generate text.

With the increase in computational power and the development of machine learning techniques, NLP began shifting towards statistical methods in the 1990s. Statistical NLP leverages large amounts of text data to train models, allowing systems to learn language patterns and regularities from data.

Entering the 21st century, the rise of deep learning technologies brought revolutionary changes to NLP. Neural network-based models such as Recurrent Neural Networks (RNNs), Long Short-Term Memory networks (LSTMs), and attention mechanisms significantly improved the performance of NLP tasks.

In recent years, the emergence of pre-trained language models like BERT, GPT, and T5 has further advanced the development of NLP. These models learn rich linguistic knowledge through pre-training on large-scale text corpora and can adapt to various downstream tasks.

The applications of NLP are extensive, including machine translation, sentiment analysis, text classification, question answering systems, dialogue systems, text summarization, and information extraction. With continuous technological advancements, NLP is changing the way humans interact with computers, making human-machine communication more natural and efficient.
`;

// Create comparators
const diffComparator = createComparator("diff");
const similarityComparator = createComparator("similarity");

// Benchmark diff comparison with short texts
bench.add("diff comparison - short english", () => {
  diffComparator.compare(englishSource, englishTarget, {
    lang: "en",
    segmentationLevel: "words",
  });
});

bench.add("diff comparison - short chinese", () => {
  diffComparator.compare(chineseSource, chineseTarget, {
    lang: "zh",
    segmentationLevel: "words",
  });
});

// Benchmark similarity comparison with short texts
bench.add("similarity comparison - short english", () => {
  similarityComparator.compare(englishSource, englishTarget, {
    lang: "en",
  });
});

bench.add("similarity comparison - short chinese", () => {
  similarityComparator.compare(chineseSource, chineseTarget, {
    lang: "zh",
  });
});

// Benchmark diff comparison with large texts
bench.add("diff comparison - large english", () => {
  diffComparator.compare(
    largeEnglish,
    largeEnglish
      .replace("artificial intelligence", "AI")
      .replace("machine learning", "ML"),
    {
      lang: "en",
      segmentationLevel: "paragraphs",
    },
  );
});

bench.add("diff comparison - large chinese", () => {
  diffComparator.compare(
    largeChinese,
    largeChinese.replace("人工智能", "AI").replace("机器学习", "ML"),
    {
      lang: "zh",
      segmentationLevel: "paragraphs",
    },
  );
});

// Benchmark similarity comparison with large texts
bench.add("similarity comparison - large english", () => {
  similarityComparator.compare(
    largeEnglish,
    largeEnglish
      .replace("artificial intelligence", "AI")
      .replace("machine learning", "ML"),
    {
      lang: "en",
      segmentationLevel: "paragraphs",
    },
  );
});

bench.add("similarity comparison - large chinese", () => {
  similarityComparator.compare(
    largeChinese,
    largeChinese.replace("人工智能", "AI").replace("机器学习", "ML"),
    {
      lang: "zh",
      segmentationLevel: "paragraphs",
    },
  );
});

// Run the benchmark and print results
bench.print();
