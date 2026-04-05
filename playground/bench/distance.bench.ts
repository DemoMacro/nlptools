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
    "lcsDistance",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("lcs_seq", ts.lcsDistance(s1, s2), wasm.lcs_seq(s1, s2));
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
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq(
          "levNorm",
          ts.levenshteinNormalized(s1, s2),
          wasm.levenshtein_normalized(s1, s2),
          0.001,
        );
    },
    BENCH_CONFIG,
  );

  bench(
    "lcsNormalized",
    () => {
      for (const { s1, s2 } of CORRECTNESS_CASES)
        assertEq("lcsNorm", ts.lcsNormalized(s1, s2), wasm.lcs_seq_normalized(s1, s2), 0.001);
    },
    BENCH_CONFIG,
  );
});
