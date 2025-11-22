/**
 * Vitest benchmark tests for @nlptools/distance package
 *
 * This module provides performance tests that match the Rust benchmark tests
 * in packages/distance-wasm/tests/bench.rs, using Lorem Ipsum text.
 *
 * The benchmark methodology mirrors the Rust implementation:
 * - 1000 iterations per test
 * - Manual loop control to match Rust timing methodology
 * - Same test data and algorithm coverage
 */

import { describe, it, expect, bench } from "vitest";
import * as wasm from "@nlptools/distance-wasm";
import * as distance from "@nlptools/distance";

// Benchmark configuration to match Rust implementation
const BENCH_CONFIG = {
  iterations: 1000, // Match Rust bench.rs ITERATIONS
  time: 1000, // Run for at least 1 second to get stable measurements
};

// Test data for benchmarking - Lorem Ipsum text (matching Rust bench.rs)
const SHORT_STRINGS = [
  { s1: "Lorem", s2: "ipsum" },
  { s1: "dolor", s2: "dolor" },
  { s1: "sit", s2: "sed" },
  { s1: "amet", s2: "adip" },
  { s1: "lorem", s2: "ipsum" },
];

const MEDIUM_STRINGS = [
  {
    s1: "Lorem ipsum dolor sit amet",
    s2: "Lorem ipsum dolor sit amet consectetur adipiscing",
  },
  {
    s1: "sed do eiusmod tempor incididunt",
    s2: "sed do eiusmod tempor incididunt ut labore",
  },
  {
    s1: "ut labore et dolore magna aliqua",
    s2: "ut enim ad minim veniam quis nostrud",
  },
];

const LONG_STRINGS = [
  {
    s1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    s2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    s1: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    s2: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  },
];

describe("Edit Distance Algorithms Benchmark (Lorem Ipsum)", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "damerau_levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.damerau_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "myers_levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.myers_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "fastest_levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          distance.fastest_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "hamming",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS.slice(0, 3)) {
          wasm.hamming(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "sift4_simple",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.sift4_simple(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "damerau_levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.damerau_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "myers_levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.myers_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "fastest_levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          distance.fastest_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "sift4_simple",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.sift4_simple(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) {
          wasm.levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "damerau_levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) {
          wasm.damerau_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "myers_levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) {
          wasm.myers_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "fastest_levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) {
          distance.fastest_levenshtein(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });
});

describe("Similarity Algorithms Benchmark (Lorem Ipsum)", () => {
  describe("Edit-based Similarity", () => {
    bench(
      "levenshtein_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.levenshtein_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "damerau_levenshtein_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.damerau_levenshtein_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "myers_levenshtein_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.myers_levenshtein_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "hamming_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS.slice(0, 3)) {
          wasm.hamming_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "sift4_simple_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.sift4_simple_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "jaro",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.jaro(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "jarowinkler",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.jarowinkler(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });

  describe("Token-based Similarity", () => {
    bench(
      "jaccard",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.jaccard(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "cosine",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.cosine(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "sorensen",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.sorensen(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "tversky",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) {
          wasm.tversky(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "overlap",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.overlap(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });

  describe("Sequence-based Similarity", () => {
    bench(
      "lcs_seq_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.lcs_seq_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "lcs_str_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.lcs_str_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "ratcliff_obershelp",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.ratcliff_obershelp(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "smith_waterman_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.smith_waterman_normalized(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });

  describe("Bigram & Naive Similarity", () => {
    bench(
      "jaccard_bigram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.jaccard_bigram(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "cosine_bigram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.cosine_bigram(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "prefix",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.prefix(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "suffix",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.suffix(s1, s2);
        }
      },
      BENCH_CONFIG,
    );

    bench(
      "length",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.length(s1, s2);
        }
      },
      BENCH_CONFIG,
    );
  });
});

describe("Universal Compare Function Benchmark (Lorem Ipsum)", () => {
  const algorithms = [
    "levenshtein",
    "damerau_levenshtein",
    "jaro",
    "jaro_winkler",
    "cosine",
    "jaccard",
    "lcs_seq",
    "myers_levenshtein",
  ] as const;

  algorithms.forEach((algorithm) => {
    bench(
      `compare_${algorithm}`,
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) {
          wasm.compare(s1, s2, algorithm);
        }
      },
      BENCH_CONFIG,
    );
  });
});

describe("Algorithm Correctness Tests (Lorem Ipsum)", () => {
  it("should validate similarity scores are within bounds [0, 1]", () => {
    const testCases = [
      { s1: "Lorem", s2: "ipsum" },
      { s1: "dolor", s2: "dolor" },
      { s1: "consectetur", s2: "consectetuer" },
      { s1: "adipiscing", s2: "adipiscere" },
    ];

    for (const { s1, s2 } of testCases) {
      const levSim = wasm.levenshtein_normalized(s1, s2);
      const jaroSim = wasm.jaro(s1, s2);
      const jaroWinSim = wasm.jarowinkler(s1, s2);
      const jaccardSim = wasm.jaccard(s1, s2);
      const cosineSim = wasm.cosine(s1, s2);

      expect(levSim).toBeGreaterThanOrEqual(0);
      expect(levSim).toBeLessThanOrEqual(1);
      expect(jaroSim).toBeGreaterThanOrEqual(0);
      expect(jaroSim).toBeLessThanOrEqual(1);
      expect(jaroWinSim).toBeGreaterThanOrEqual(0);
      expect(jaroWinSim).toBeLessThanOrEqual(1);
      expect(jaccardSim).toBeGreaterThanOrEqual(0);
      expect(jaccardSim).toBeLessThanOrEqual(1);
      expect(cosineSim).toBeGreaterThanOrEqual(0);
      expect(cosineSim).toBeLessThanOrEqual(1);
    }
  });

  it("should validate universal compare matches direct function calls", () => {
    const testCases = [
      { s1: "Lorem", s2: "ipsum" },
      { s1: "dolor", s2: "dolor" },
    ];

    for (const { s1, s2 } of testCases) {
      const levDirect = wasm.levenshtein_normalized(s1, s2);
      const levUniversal = wasm.compare(s1, s2, "levenshtein");

      const jaroDirect = wasm.jaro(s1, s2);
      const jaroUniversal = wasm.compare(s1, s2, "jaro");

      expect(Math.abs(levDirect - levUniversal)).toBeLessThan(0.001);
      expect(Math.abs(jaroDirect - jaroUniversal)).toBeLessThan(0.001);
    }
  });

  it("should validate identical strings return distance 0 and similarity 1", () => {
    const testStrings = ["Lorem", "dolor", "consectetur"];

    for (const s of testStrings) {
      // Distance should be 0 for identical strings
      expect(wasm.levenshtein(s, s)).toBe(0);
      expect(wasm.damerau_levenshtein(s, s)).toBe(0);
      expect(wasm.myers_levenshtein(s, s)).toBe(0);
      expect(distance.fastest_levenshtein(s, s)).toBe(0);

      // Similarity should be 1 for identical strings
      expect(wasm.jarowinkler(s, s)).toBe(1);
      expect(wasm.jaro(s, s)).toBe(1);
    }
  });

  it("should return same results for all Levenshtein implementations", () => {
    const testCases = [
      { s1: "Lorem", s2: "ipsum" },
      { s1: "dolor", s2: "dolor" },
      { s1: "consectetur", s2: "consectetuer" },
      { s1: "adipiscing", s2: "adipiscere" },
    ];

    for (const { s1, s2 } of testCases) {
      const wasmResult = wasm.levenshtein(s1, s2);
      const fastResult = distance.fastest_levenshtein(s1, s2);
      const myersResult = wasm.myers_levenshtein(s1, s2);

      expect(wasmResult).toBe(fastResult);
      expect(wasmResult).toBe(myersResult);
      expect(fastResult).toBe(myersResult);
    }
  });
});
