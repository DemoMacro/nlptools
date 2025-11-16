// TypeScript test functions for fastest-levenshtein library
import { distance, closest } from "fastest-levenshtein";
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

// Use the same test cases as algorithms.ts
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

// Run fastest-levenshtein test
function runFastestLevenshteinTest(testCase: TestCase): AlgorithmResult {
  const { result, time } = measurePerformance(() =>
    distance(testCase.s1, testCase.s2),
  );
  return {
    name: "fastest-levenshtein",
    result: result,
    type: "distance",
    executionTime: time,
  };
}

// Run WASM Myers test
function runMyersTest(testCase: TestCase): AlgorithmResult {
  const { result, time } = measurePerformance(() =>
    wasm.myers_levenshtein(testCase.s1, testCase.s2),
  );
  return {
    name: "myers_levenshtein (WASM)",
    result: result,
    type: "distance",
    executionTime: time,
  };
}

// Run WASM Levenshtein test
function runLevenshteinTest(testCase: TestCase): AlgorithmResult {
  const { result, time } = measurePerformance(() =>
    wasm.levenshtein(testCase.s1, testCase.s2),
  );
  return {
    name: "levenshtein (WASM)",
    result: result,
    type: "distance",
    executionTime: time,
  };
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

// Run comprehensive test suite
async function runTestSuite() {
  console.log(
    "⚡ Fastest-Levenshtein vs WASM Myers vs WASM Levenshtein Comparison",
  );
  console.log("=".repeat(80));
  console.log();

  // Test all cases
  testCases.forEach((testCase, caseIndex) => {
    console.log(`📋 Test Case ${caseIndex + 1}: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    console.log(`   String 1: "${testCase.s1}"`);
    console.log(`   String 2: "${testCase.s2}"`);
    console.log();

    // Run all three algorithms
    const fastestResult = runFastestLevenshteinTest(testCase);
    const myersResult = runMyersTest(testCase);
    const levenshteinResult = runLevenshteinTest(testCase);

    console.log("   Algorithm Comparison:");
    console.log("   " + "-".repeat(50));

    console.log(
      `   📏 fastest-levenshtein    | ${formatNumber(fastestResult.result).padStart(10)} | ${formatTime(fastestResult.executionTime).padStart(10)}`,
    );
    console.log(
      `   📏 myers_levenshtein     | ${formatNumber(myersResult.result).padStart(10)} | ${formatTime(myersResult.executionTime).padStart(10)}`,
    );
    console.log(
      `   📏 levenshtein (WASM)     | ${formatNumber(levenshteinResult.result).padStart(10)} | ${formatTime(levenshteinResult.executionTime).padStart(10)}`,
    );

    // Verify correctness (all should return the same distance)
    const distancesMatch =
      fastestResult.result === myersResult.result &&
      myersResult.result === levenshteinResult.result;

    if (distancesMatch) {
      console.log(
        `   ✅ All algorithms return the same distance: ${fastestResult.result}`,
      );
    } else {
      console.log(`   ⚠️  Distance mismatch detected!`);
      console.log(`      fastest-levenshtein: ${fastestResult.result}`);
      console.log(`      myers_levenshtein:  ${myersResult.result}`);
      console.log(`      levenshtein:         ${levenshteinResult.result}`);
    }

    // Calculate performance comparison
    const fastestVsMyers =
      fastestResult.executionTime / myersResult.executionTime;
    const fastestVsWasm =
      fastestResult.executionTime / levenshteinResult.executionTime;
    const myersVsWasm =
      myersResult.executionTime / levenshteinResult.executionTime;

    console.log();
    console.log("   Performance Ratios (lower is faster):");
    console.log("   " + "-".repeat(30));
    console.log(`   fastest vs myers:  ${fastestVsMyers.toFixed(2)}x`);
    console.log(`   fastest vs wasm:   ${fastestVsWasm.toFixed(2)}x`);
    console.log(`   myers vs wasm:     ${myersVsWasm.toFixed(2)}x`);

    // Determine winner
    const algorithms = [
      { name: "fastest-levenshtein", time: fastestResult.executionTime },
      { name: "myers_levenshtein", time: myersResult.executionTime },
      { name: "levenshtein (WASM)", time: levenshteinResult.executionTime },
    ];

    const winner = algorithms.reduce((prev, current) =>
      prev.time < current.time ? prev : current,
    );

    console.log(`   🏆 Fastest: ${winner.name}`);

    console.log();
    console.log("═".repeat(80));
    console.log();
  });
}

// Performance benchmark test
async function performanceBenchmark() {
  console.log("⚡ Performance Benchmark (1000 iterations)");
  console.log("=".repeat(50));

  const testString1 = "The quick brown fox jumps over the lazy dog";
  const testString2 = "The quick brown dog jumps over the lazy fox";
  const iterations = 1000;

  console.log(`Test strings: "${testString1}" vs "${testString2}"`);
  console.log(`Iterations: ${iterations}`);
  console.log();

  // Benchmark fastest-levenshtein
  const fastestTime = measurePerformance(() => {
    for (let i = 0; i < iterations; i++) {
      distance(testString1, testString2);
    }
  }).time;

  // Benchmark WASM Myers
  const myersTime = measurePerformance(() => {
    for (let i = 0; i < iterations; i++) {
      wasm.myers_levenshtein(testString1, testString2);
    }
  }).time;

  // Benchmark WASM Levenshtein
  const levenshteinTime = measurePerformance(() => {
    for (let i = 0; i < iterations; i++) {
      wasm.levenshtein(testString1, testString2);
    }
  }).time;

  const results = [
    { name: "fastest-levenshtein", totalTime: fastestTime },
    { name: "myers_levenshtein", totalTime: myersTime },
    { name: "levenshtein (WASM)", totalTime: levenshteinTime },
  ];

  // Sort by total time
  results.sort((a, b) => a.totalTime - b.totalTime);

  console.log("Performance ranking (by total execution time):");
  results.forEach((result, index) => {
    const avgTime = result.totalTime / iterations;
    console.log(
      `${(index + 1).toString().padStart(2)}. ${result.name.padEnd(25)} | ${formatTime(avgTime).padStart(10)} | ${formatTime(result.totalTime).padStart(10)} (total)`,
    );
  });

  console.log();

  // Calculate speed ratios
  const fastest = results[0];
  const slowest = results[2];
  const speedup = slowest.totalTime / fastest.totalTime;

  console.log(
    `🚀 Performance: ${fastest.name} is ${speedup.toFixed(2)}x faster than ${slowest.name}`,
  );
  console.log();
}

// Test closest function
async function testClosestFunction() {
  console.log("🔍 Testing Fastest-Levenshtein 'closest' Function");
  console.log("=".repeat(60));

  const testStrings = [
    "kitten",
    "sitting",
    "bitten",
    "mitten",
    "kitchen",
    "knitting",
  ];

  const target = "mitten";
  console.log(`Target string: "${target}"`);
  console.log(
    `Candidate strings: [${testStrings.map((s) => `"${s}"`).join(", ")}]`,
  );
  console.log();

  // Test closest function
  const closestResult = closest(target, testStrings);
  console.log(`🎯 Closest match: "${closestResult}"`);

  // Verify with distances
  console.log();
  console.log("Distance analysis:");
  testStrings.forEach((str) => {
    const dist = distance(target, str);
    console.log(`  "${str}" -> ${dist}`);
  });

  console.log();
  console.log("═".repeat(60));
  console.log();
}

// Main function
async function main() {
  console.log("🚀 Starting Fastest-Levenshtein Comparison Test");
  console.log("Node.js version:", process.version);
  console.log("Platform:", process.platform, process.arch);
  console.log();

  try {
    // WASM module will be automatically initialized on import
    console.log("✅ WebAssembly module loaded successfully!");
    console.log("✅ Fastest-Levenshtein library imported successfully!");
    console.log();

    // Run closest function test
    await testClosestFunction();

    // Run main test suite
    await runTestSuite();

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
