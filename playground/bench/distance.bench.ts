/**
 * Vitest benchmark tests for @nlptools/distance package
 *
 * Compares pure TS implementations against WASM (distance-wasm) for the same algorithms.
 */

import { describe, bench } from "vitest";
import * as wasm from "@nlptools/distance-wasm";
import * as ts from "@nlptools/distance";

const BENCH_CONFIG = {
  iterations: 1000,
  time: 1000,
};

// Test data - Lorem Ipsum text
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

// ============================================================================
// Levenshtein: TS (fastest-levenshtein) vs WASM (textdistance)
// ============================================================================
describe("Levenshtein: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: levenshtein",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: levenshtein",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "TS: levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) ts.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: levenshtein",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) wasm.levenshtein(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Normalized", () => {
    bench(
      "TS: levenshteinNormalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.levenshteinNormalized(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: levenshtein_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.levenshtein_normalized(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// LCS: TS (@algorithm.ts/lcs) vs WASM (textdistance)
// ============================================================================
describe("LCS: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: lcsDistance",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.lcsDistance(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: lcs_seq",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.lcs_seq(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: lcsDistance",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.lcsDistance(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: lcs_seq",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.lcs_seq(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "TS: lcsDistance",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) ts.lcsDistance(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: lcs_seq",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) wasm.lcs_seq(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Normalized", () => {
    bench(
      "TS: lcsNormalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.lcsNormalized(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: lcs_seq_normalized",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.lcs_seq_normalized(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// Jaccard: TS vs WASM
// ============================================================================
describe("Jaccard: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: jaccard",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: jaccard",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: jaccard",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: jaccard",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "TS: jaccard",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) ts.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: jaccard",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) wasm.jaccard(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// Cosine: TS vs WASM
// ============================================================================
describe("Cosine: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: cosine",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: cosine",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: cosine",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: cosine",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "TS: cosine",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) ts.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: cosine",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) wasm.cosine(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// Sorensen-Dice: TS vs WASM
// ============================================================================
describe("Sorensen-Dice: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: sorensen",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: sorensen",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: sorensen",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: sorensen",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Long Strings (> 200 chars)", () => {
    bench(
      "TS: sorensen",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) ts.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: sorensen",
      () => {
        for (const { s1, s2 } of LONG_STRINGS) wasm.sorensen(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// Bigram variants: TS vs WASM
// ============================================================================
describe("Bigram: TS vs WASM", () => {
  describe("Short Strings (< 10 chars)", () => {
    bench(
      "TS: jaccardNgram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.jaccardNgram(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: jaccard_bigram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.jaccard_bigram(s1, s2);
      },
      BENCH_CONFIG,
    );

    bench(
      "TS: cosineNgram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) ts.cosineNgram(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: cosine_bigram",
      () => {
        for (const { s1, s2 } of SHORT_STRINGS) wasm.cosine_bigram(s1, s2);
      },
      BENCH_CONFIG,
    );
  });

  describe("Medium Strings (10-100 chars)", () => {
    bench(
      "TS: jaccardNgram",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.jaccardNgram(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: jaccard_bigram",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.jaccard_bigram(s1, s2);
      },
      BENCH_CONFIG,
    );

    bench(
      "TS: cosineNgram",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) ts.cosineNgram(s1, s2);
      },
      BENCH_CONFIG,
    );
    bench(
      "WASM: cosine_bigram",
      () => {
        for (const { s1, s2 } of MEDIUM_STRINGS) wasm.cosine_bigram(s1, s2);
      },
      BENCH_CONFIG,
    );
  });
});

// ============================================================================
// Correctness: verify TS and WASM produce same results (bench mode)
// ============================================================================
const CORRECTNESS_CASES = [
  { s1: "kitten", s2: "sitting" },
  { s1: "Lorem", s2: "ipsum" },
  { s1: "dolor", s2: "dolor" },
  { s1: "consectetur", s2: "consectetuer" },
  { s1: "adipiscing", s2: "adipiscere" },
  { s1: "", s2: "" },
  { s1: "hello", s2: "" },
  { s1: "", s2: "world" },
  { s1: "abcdef", s2: "azced" },
  {
    s1: "Lorem ipsum dolor sit amet",
    s2: "Lorem ipsum dolor sit amet consectetur adipiscing",
  },
];

function assertEq(label: string, actual: number, expected: number, tol = 0) {
  if (tol > 0) {
    if (Math.abs(actual - expected) > tol)
      throw new Error(`${label}: ${actual} !== ${expected} (tol=${tol})`);
  } else {
    if (actual !== expected) throw new Error(`${label}: ${actual} !== ${expected}`);
  }
}

// WASM convention notes:
// - Edit distances (levenshtein, damerau, hamming, sift4): return raw distance
// - lcs_seq / lcs_str: return LCS *length*, not distance
// - length: returns normalized *distance* (0 = identical)
// - *_normalized for edit distances: return normalized *distance* (0 = identical)
// - Similarity functions (jaro, cosine, jaccard, etc.): return similarity (1 = identical)
// - lcs_seq_normalized / lcs_str_normalized / smith_waterman_normalized: similarity

describe("Correctness: TS vs WASM", () => {
  bench(
    "levenshtein",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("levenshtein", ts.levenshtein(s1, s2), wasm.levenshtein(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "lcsLength",
    () => {
      // wasm.lcs_seq returns LCS length, not distance
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("lcs_seq", ts.lcsLength(s1, s2), wasm.lcs_seq(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "jaccard",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("jaccard", ts.jaccard(s1, s2), wasm.jaccard(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "cosine",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("cosine", ts.cosine(s1, s2), wasm.cosine(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "sorensen",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("sorensen", ts.sorensen(s1, s2), wasm.sorensen(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "levenshteinNormalized",
    () => {
      // wasm returns normalized distance (0=identical), TS returns similarity (1=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "levNorm",
          ts.levenshteinNormalized(s1, s2),
          1 - wasm.levenshtein_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "lcsNormalized",
    () => {
      // wasm.lcs_seq_normalized returns similarity (1=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("lcsNorm", ts.lcsNormalized(s1, s2), wasm.lcs_seq_normalized(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  // --- New algorithms ---
  bench(
    "damerauLevenshtein",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("damerau", ts.damerauLevenshtein(s1, s2), wasm.damerau_levenshtein(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "damerauLevenshteinNormalized",
    () => {
      // wasm returns normalized distance (0=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "damerauN",
          ts.damerauLevenshteinNormalized(s1, s2),
          1 - wasm.damerau_levenshtein_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "jaro",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("jaro", ts.jaro(s1, s2), wasm.jaro(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "jaroWinkler",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("jw", ts.jaroWinkler(s1, s2), wasm.jarowinkler(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "hamming",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("hamming", ts.hamming(s1, s2), wasm.hamming(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "hammingNormalized",
    () => {
      // wasm returns normalized distance (0=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "hammingN",
          ts.hammingNormalized(s1, s2),
          1 - wasm.hamming_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "lcsSubstringLength",
    () => {
      // wasm.lcs_str returns LCS substring length, not distance
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("lcsStr", ts.lcsSubstringLength(s1, s2), wasm.lcs_str(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "lcsSubstringNormalized",
    () => {
      // wasm.lcs_str_normalized returns similarity (1=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "lcsStrN",
          ts.lcsSubstringNormalized(s1, s2),
          wasm.lcs_str_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "ratcliff",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("ratcliff", ts.ratcliff(s1, s2), wasm.ratcliff_obershelp(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "smithWaterman",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("sw", ts.smithWaterman(s1, s2), wasm.smith_waterman(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "smithWatermanNormalized",
    () => {
      // wasm.smith_waterman_normalized returns similarity (1=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "swN",
          ts.smithWatermanNormalized(s1, s2),
          wasm.smith_waterman_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "sift4",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("sift4", ts.sift4(s1, s2), wasm.sift4_simple(s1, s2));
    },
    BENCH_CONFIG,
  );

  bench(
    "sift4Normalized",
    () => {
      // wasm returns normalized distance (0=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "sift4N",
          ts.sift4Normalized(s1, s2),
          1 - wasm.sift4_simple_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "tversky",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("tversky", ts.tversky(s1, s2), wasm.tversky(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "overlap",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("overlap", ts.overlap(s1, s2), wasm.overlap(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "prefix",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("prefix", ts.prefix(s1, s2), wasm.prefix(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "suffix",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("suffix", ts.suffix(s1, s2), wasm.suffix(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );

  bench(
    "length",
    () => {
      // wasm.length returns normalized distance (0=identical)
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("length", ts.length(s1, s2), 1 - wasm.length(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );
});
