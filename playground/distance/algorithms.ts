// TypeScript test functions for Distance-wasm
import * as wasm from "@nlptools/distance";

// Algorithm result interface
interface AlgorithmResult {
  name: string;
  result: number;
  type: "distance" | "similarity";
  executionTime: number;
}

// Test case interface
interface TestCase {
  name: string;
  s1: string;
  s2: string;
  description?: string;
}

// Configuration for all algorithm functions
const algorithms = {
  // Edit Distance algorithms
  levenshtein: { type: "distance" as const, category: "Edit Distance" },
  levenshtein_normalized: {
    type: "similarity" as const,
    category: "Edit Distance",
  },
  damerau_levenshtein: { type: "distance" as const, category: "Edit Distance" },
  damerau_levenshtein_normalized: {
    type: "similarity" as const,
    category: "Edit Distance",
  },
  jaro: { type: "similarity" as const, category: "Edit Distance" },
  jarowinkler: { type: "similarity" as const, category: "Edit Distance" },
  hamming: { type: "distance" as const, category: "Edit Distance" },
  hamming_normalized: {
    type: "similarity" as const,
    category: "Edit Distance",
  },
  sift4_simple: { type: "distance" as const, category: "Edit Distance" },
  sift4_simple_normalized: {
    type: "similarity" as const,
    category: "Edit Distance",
  },
  myers_levenshtein: { type: "distance" as const, category: "Edit Distance" },
  myers_levenshtein_normalized: {
    type: "similarity" as const,
    category: "Edit Distance",
  },
  fastest_levenshtein: { type: "distance" as const, category: "Edit Distance" },

  // Sequence algorithms
  lcs_seq: { type: "distance" as const, category: "Sequence" },
  lcs_seq_normalized: { type: "similarity" as const, category: "Sequence" },
  lcs_str: { type: "distance" as const, category: "Sequence" },
  lcs_str_normalized: { type: "similarity" as const, category: "Sequence" },
  ratcliff_obershelp: { type: "similarity" as const, category: "Sequence" },
  smith_waterman: { type: "distance" as const, category: "Sequence" },
  smith_waterman_normalized: {
    type: "similarity" as const,
    category: "Sequence",
  },

  // Token algorithms
  jaccard: { type: "similarity" as const, category: "Token" },
  jaccard_bigram: { type: "similarity" as const, category: "Token" },
  cosine: { type: "similarity" as const, category: "Token" },
  cosine_bigram: { type: "similarity" as const, category: "Token" },
  sorensen: { type: "similarity" as const, category: "Token" },
  tversky: { type: "similarity" as const, category: "Token" },
  overlap: { type: "similarity" as const, category: "Token" },

  // Naive algorithms
  prefix: { type: "similarity" as const, category: "Naive" },
  suffix: { type: "similarity" as const, category: "Naive" },
  length: { type: "similarity" as const, category: "Naive" },
};

// Complex long text test cases
const testCases: TestCase[] = [
  {
    name: "Academic paper paragraph 1",
    s1: `The rapid advancement of artificial intelligence and machine learning technologies has revolutionized numerous industries, including healthcare, finance, and transportation. Recent research demonstrates that deep learning architectures, particularly transformer models, have achieved state-of-the-art performance in natural language processing tasks, enabling more accurate and efficient analysis of large-scale text data. These technological breakthroughs have significant implications for academic research and industrial applications.`,
    s2: `Recent developments in artificial intelligence and machine learning have transformed various sectors such as healthcare, finance, and transportation. Studies indicate that deep learning systems, especially transformer architectures, show excellent results in natural language processing tasks, facilitating better and more rapid processing of extensive text datasets. These innovations present important opportunities for both academic investigation and commercial utilization.`,
    description:
      "Similar academic paper paragraphs with extensive vocabulary overlap",
  },
  {
    name: "Technical documentation comparison",
    s1: `In this comprehensive guide, we will explore the fundamental concepts of microservices architecture. We'll discuss how microservices enable developers to build scalable and maintainable applications by breaking down complex systems into smaller, independent services. Each service can be developed, deployed, and scaled independently, which allows teams to use different programming languages and databases for different services. This approach improves fault isolation and makes it easier to implement continuous delivery practices.`,
    s2: `This tutorial covers the essential principles of service-oriented architecture. We examine how SOA helps organizations create flexible and robust systems by decomposing monolithic applications into discrete, autonomous components. Every component can be designed, tested, and maintained separately, which permits engineering teams to leverage various technology stacks and persistence layers for different components. This methodology enhances system resilience and simplifies the implementation of DevOps workflows.`,
    description:
      "Technical documentation, similar topics with different expressions",
  },
  {
    name: "Legal contract clauses",
    s1: `The parties hereby agree to the following terms and conditions: The Service Provider shall deliver software development services according to the specifications outlined in Exhibit A. The Client shall provide timely feedback and necessary resources to facilitate project completion. All intellectual property rights developed during the engagement shall belong to the Client, except for pre-existing tools and methodologies used by the Service Provider. Payment shall be made in accordance with the schedule detailed in Section 4.`,
    s2: `Both parties acknowledge and accept the stipulated provisions herein: The Developer shall provide programming services as specified in the attached technical documentation. The Customer shall supply prompt feedback and required resources to support successful project delivery. All intellectual property created during this agreement shall vest in the Customer, excluding the Developer's proprietary frameworks and processes. Compensation shall follow the payment schedule described in Section 4.`,
    description:
      "Legal contract clauses, highly similar but with different wording",
  },
  {
    name: "News report comparison",
    s1: `Breaking news: Scientists at the leading research institute have discovered a potential breakthrough in renewable energy storage technology. The new battery system, developed over five years of intensive research, demonstrates a 300% improvement in energy density compared to current lithium-ion batteries. The breakthrough could revolutionize electric vehicle range and grid storage capabilities, potentially accelerating the global transition to sustainable energy sources. Industry experts have praised the development as a significant milestone in clean energy technology.`,
    s2: `Latest developments: Researchers at a prominent university laboratory have announced a major advancement in battery storage innovation. The novel energy storage solution, created through extensive experimentation spanning multiple years, shows triple the capacity of conventional battery technologies currently in use. This innovation promises to transform electric automobile mileage and power grid applications, potentially hastening worldwide adoption of renewable energy solutions. Energy sector analysts have hailed this as a crucial advancement in sustainable technology development.`,
    description: "News reports, same event with different expression styles",
  },
  {
    name: "Fiction text excerpt",
    s1: `The old man walked slowly through the misty forest, his weathered face reflecting years of hardship and wisdom accumulated over eight decades of life. He remembered the tales his grandfather had told him about these very woods, stories of ancient spirits and forgotten paths that had guided travelers for generations. The morning dew glistened on spiderwebs stretched between ancient oak branches, creating a natural cathedral that had witnessed countless sunrises and sunsets throughout the centuries of human existence in this mystical landscape.`,
    s2: `An elderly figure strolled leisurely through the fog-covered woodland, his aged features displaying the burden and understanding accumulated during eighty years of existence. He recalled the narratives his ancestor had shared regarding these particular forests, legends of primordial beings and forgotten routes that had guided wanderers for countless generations. Dawn moisture sparkled on arachnid constructions suspended between venerable oak limbs, forming a natural sanctuary that had observed innumerous dawns and dusks through the ages of human habitation within this enchanted terrain.`,
    description:
      "Literary descriptions, highly similar but with completely different vocabulary",
  },
  {
    name: "Scientific paper abstract",
    s1: `This paper presents a novel approach to optimizing deep neural network architectures through automated architecture search. We propose a reinforcement learning framework that efficiently explores the search space of neural network configurations, achieving state-of-the-art results on multiple benchmark datasets including ImageNet, CIFAR-10, and PTB. Our method reduces computational requirements by 70% compared to existing approaches while maintaining comparable performance. Extensive experiments demonstrate the effectiveness of our architecture search strategy across various domains and tasks, showing particular strength in computer vision and natural language processing applications.`,
    s2: `We introduce an innovative methodology for enhancing convolutional neural network structures via intelligent architectural discovery. Our framework implements evolutionary algorithms that systematically investigate neural network design spaces, delivering cutting-edge performance across standard benchmarking datasets including ImageNet, CIFAR-10, and PTB. The technique decreases computational overhead by 65% relative to traditional methods while preserving equivalent accuracy. Comprehensive evaluations validate the efficiency of our architectural exploration mechanism across different domains and applications, with notable success in image classification and text processing scenarios.`,
    description:
      "Scientific paper abstracts, same research content with different expressions",
  },
];

// Performance measurement function
function measurePerformance<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, time: end - start };
}

// Run single algorithm test
function runAlgorithmTest(
  algorithmName: keyof typeof algorithms,
  testCase: TestCase,
): AlgorithmResult | null {
  try {
    const algorithm = algorithms[algorithmName];
    const func = wasm[algorithmName] as Function;

    if (typeof func !== "function") {
      console.warn(`Algorithm ${algorithmName} not found`);
      return null;
    }

    const { result, time } = measurePerformance(() =>
      func(testCase.s1, testCase.s2),
    );

    return {
      name: algorithmName,
      result: Number(result),
      type: algorithm.type,
      executionTime: time,
    };
  } catch (error) {
    console.error(`Algorithm ${algorithmName} execution failed:`, error);
    return null;
  }
}

// Format number
function formatNumber(num: number, decimals: number = 4): string {
  return num.toFixed(decimals);
}

// Format time
function formatTime(ms: number): string {
  if (ms < 0.001) return "< 0.001ms";
  if (ms < 1) return `${(ms * 1000).toFixed(1)}μs`;
  return `${ms.toFixed(3)}ms`;
}

// Show algorithm information
function showAlgorithmInfo() {
  console.log("📚 Algorithm Information");
  console.log("=".repeat(50));

  console.log("Supported algorithms:");
  console.log(
    "  Edit Distance: levenshtein, damerau_levenshtein, jaro, jarowinkler, hamming, sift4_simple, myers_levenshtein",
  );
  console.log(
    "  Sequence-based: lcs_seq, lcs_str, ratcliff_obershelp, smith_waterman",
  );
  console.log("  Token-based: jaccard, cosine, sorensen, tversky, overlap");
  console.log("  Bigram: jaccard_bigram, cosine_bigram");
  console.log("  Naive: prefix, suffix, length");
  console.log("  JavaScript implementations: fastest_levenshtein");
  console.log();
}

// Run test suite
async function runTestSuite() {
  console.log("🧬 Distance WASM Algorithm Tests");
  console.log("=".repeat(60));
  console.log();

  // Show algorithm information
  showAlgorithmInfo();

  // Run all algorithms for each test case
  testCases.forEach((testCase, caseIndex) => {
    console.log(`📋 Test Case ${caseIndex + 1}: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    console.log(`   String 1: "${testCase.s1}"`);
    console.log(`   String 2: "${testCase.s2}"`);
    console.log();

    // Show results by category
    const categories = ["Edit Distance", "Sequence", "Token", "Naive"];

    categories.forEach((category) => {
      console.log(`   ${category} Algorithms:`);
      console.log("   " + "-".repeat(40));

      const categoryAlgorithms = Object.entries(algorithms).filter(
        ([_, algo]) => algo.category === category,
      );

      categoryAlgorithms.forEach(([name]) => {
        const result = runAlgorithmTest(
          name as keyof typeof algorithms,
          testCase,
        );
        if (result) {
          const typeIcon = result.type === "similarity" ? "🎯" : "📏";
          console.log(
            `   ${typeIcon} ${name.padEnd(25)} | ${formatNumber(result.result).padStart(10)} | ${formatTime(result.executionTime).padStart(10)}`,
          );
        } else {
          console.log(`   ❌ ${name.padEnd(25)} | Not available`);
        }
      });
      console.log();
    });

    // Find best similarity and minimum distance
    const similarityResults: AlgorithmResult[] = [];
    const distanceResults: AlgorithmResult[] = [];

    Object.keys(algorithms).forEach((name) => {
      const result = runAlgorithmTest(
        name as keyof typeof algorithms,
        testCase,
      );
      if (result) {
        if (result.type === "similarity") {
          similarityResults.push(result);
        } else {
          distanceResults.push(result);
        }
      }
    });

    if (similarityResults.length > 0) {
      const bestSimilarity = similarityResults.reduce((a, b) =>
        a.result > b.result ? a : b,
      );
      console.log(
        `   🏆 Highest similarity: ${bestSimilarity.name} (${formatNumber(bestSimilarity.result)})`,
      );
    }

    if (distanceResults.length > 0) {
      const bestDistance = distanceResults.reduce((a, b) =>
        a.result < b.result ? a : b,
      );
      console.log(
        `   🎯 Minimum distance: ${bestDistance.name} (${formatNumber(bestDistance.result)})`,
      );
    }

    console.log();
    console.log("═".repeat(60));
    console.log();
  });
}

// Performance benchmark test
async function performanceBenchmark() {
  console.log("⚡ Performance Benchmark");
  console.log("=".repeat(30));

  const testString1 = "The quick brown fox jumps over the lazy dog";
  const testString2 = "The quick brown dog jumps over the lazy fox";
  const iterations = 1000;

  console.log(`Test strings: "${testString1}" vs "${testString2}"`);
  console.log(`Iterations: ${iterations}`);
  console.log();

  const benchmarkResults: Array<{
    name: string;
    totalTime: number;
    avgTime: number;
  }> = [];

  for (const [name] of Object.entries(algorithms)) {
    const func = wasm[name as keyof typeof wasm] as Function;

    if (typeof func !== "function") continue;

    try {
      const totalTime = measurePerformance(() => {
        for (let i = 0; i < iterations; i++) {
          func(testString1, testString2);
        }
      }).time;

      const avgTime = totalTime / iterations;
      benchmarkResults.push({ name, totalTime, avgTime });
    } catch (error) {
      console.warn(`Algorithm ${name} benchmark failed:`, error);
    }
  }

  // Sort by average execution time
  benchmarkResults.sort((a, b) => a.avgTime - b.avgTime);

  console.log("Performance ranking (by average execution time):");
  benchmarkResults.forEach((result, index) => {
    console.log(
      `${(index + 1).toString().padStart(2)}. ${result.name.padEnd(25)} | ${formatTime(result.avgTime).padStart(10)} | ${formatTime(result.totalTime).padStart(10)} (total)`,
    );
  });
  console.log();
}

// Universal compare function test
async function testCompareFunction() {
  console.log("🔧 Universal Compare Function Test");
  console.log("=".repeat(50));

  const testString1 = testCases[0].s1; // Academic paper paragraph 1
  const testString2 = testCases[0].s2; // Academic paper paragraph 2

  console.log(`Test text length 1: ${testString1.length} characters`);
  console.log(`Test text length 2: ${testString2.length} characters`);
  console.log();

  const algorithmsToTest = [
    "levenshtein",
    "jaro",
    "jarowinkler",
    "jaccard",
    "cosine",
    "sorensen",
    "hamming",
    "damerau_levenshtein",
    "lcs_seq",
    "ratcliff_obershelp",
  ];

  algorithmsToTest.forEach((algoName) => {
    try {
      const result = wasm.compare(testString1, testString2, algoName);
      console.log(`  ${algoName.padEnd(25)}: ${formatNumber(Number(result))}`);
    } catch (error) {
      console.log(`  ${algoName.padEnd(25)}: Error - ${String(error)}`);
    }
  });
  console.log();
}

// Main function
async function main() {
  console.log("🚀 Starting Distance WASM Test");
  console.log("Node.js version:", process.version);
  console.log("Platform:", process.platform, process.arch);
  console.log();

  try {
    // WASM module will be automatically initialized on import
    console.log("✅ WebAssembly module loaded successfully!");
    console.log();

    // Run main test suite
    await runTestSuite();

    // Test universal compare function
    await testCompareFunction();

    // Run performance benchmark
    await performanceBenchmark();

    console.log("✅ All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);
