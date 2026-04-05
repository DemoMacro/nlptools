/**
 * Vitest benchmark: FuzzySearch (nlptools) vs Fuse.js
 *
 * Compares result quality and search speed across different collection sizes.
 */

import { describe, bench } from "vitest";
import Fuse from "fuse.js";
import { FuzzySearch, findBestMatch } from "@nlptools/distance";

const BENCH_CONFIG = {
  iterations: 1000,
  time: 1000,
};

// ============================================================================
// Test data
// ============================================================================

const BOOKS = [
  { title: "Old Man's War", author: "John Scalzi" },
  { title: "The Lock Artist", author: "Steve Hamilton" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "Great Expectations", author: "Charles Dickens" },
  { title: "The Hunger Games", author: "Suzanne Collins" },
  { title: "Harry Potter", author: "J.K. Rowling" },
  { title: "To Kill a Mockingbird", author: "Harper Lee" },
  { title: "Pride and Prejudice", author: "Jane Austen" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger" },
  { title: "Brave New World", author: "Aldous Huxley" },
  { title: "Lord of the Flies", author: "William Golding" },
  { title: "The Hobbit", author: "J.R.R. Tolkien" },
  { title: "Fahrenheit 451", author: "Ray Bradbury" },
  { title: "Moby Dick", author: "Herman Melville" },
  { title: "War and Peace", author: "Leo Tolstoy" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "The Odyssey", author: "Homer" },
  { title: "Don Quixote", author: "Miguel de Cervantes" },
  { title: "1984", author: "George Orwell" },
  { title: "Animal Farm", author: "George Orwell" },
];

const STRING_LIST = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon",
  "mango",
  "nectarine",
  "orange",
  "pear",
  "quince",
  "raspberry",
  "strawberry",
  "tangerine",
  "watermelon",
  "blueberry",
];

const QUERIES = [
  "old man",
  "grate gatsbi",
  "hary poter",
  "jane austn",
  "george orwel",
  "frnkenstein",
];

// ============================================================================
// Correctness: compare top results
// ============================================================================

function assertTopMatch(label: string, actual: string, expected: string) {
  if (actual !== expected) {
    throw new Error(`${label}: top match "${actual}" !== expected "${expected}"`);
  }
}

// Run correctness checks once, print results
console.log("\n=== Correctness: FuzzySearch vs Fuse.js ===\n");

{
  // Object array: title key
  const fuse = new Fuse(BOOKS, { keys: ["title"], includeScore: true });
  const nlptools = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "levenshtein" });

  console.log("Object array (title key, levenshtein):");
  for (const q of QUERIES) {
    const fuseResults = fuse.search(q);
    const nlptoolsResults = nlptools.search(q);
    if (fuseResults.length === 0 && nlptoolsResults.length === 0) {
      console.log(`  "${q}" → no match`);
      continue;
    }
    const fuseTop = fuseResults.length > 0 ? fuseResults[0].item.title : "(none)";
    const fuseScore =
      fuseResults.length > 0 ? ((fuseResults[0] as any).score?.toFixed(3) ?? "N/A") : "N/A";
    const nlptoolsTop =
      nlptoolsResults.length > 0 ? (nlptoolsResults[0].item as any).title : "(none)";
    const nlptoolsScore = nlptoolsResults.length > 0 ? nlptoolsResults[0].score.toFixed(3) : "N/A";
    console.log(
      `  "${q}" → Fuse: "${fuseTop}" (${fuseScore}), NLPTools: "${nlptoolsTop}" (${nlptoolsScore})`,
    );
  }

  // String array: fruit search
  const fuseStr = new Fuse(STRING_LIST, { includeScore: true });
  const nlptoolsStr = new FuzzySearch(STRING_LIST, { algorithm: "levenshtein" });
  const fruitQueries = ["aple", "bannana", "strwbrry", "mngo", "bluberry"];

  console.log("\nString array (levenshtein):");
  for (const q of fruitQueries) {
    const fuseResults = fuseStr.search(q);
    const nlptoolsResults = nlptoolsStr.search(q);
    if (fuseResults.length === 0 && nlptoolsResults.length === 0) continue;
    const fuseTop = fuseResults[0].item;
    const nlptoolsTop = nlptoolsResults[0].item as string;
    assertTopMatch(q, nlptoolsTop, fuseTop);
    console.log(`  "${q}" → "${fuseTop}" (${nlptoolsResults[0].score.toFixed(3)})`);
  }

  // findBestMatch
  const best = findBestMatch("hary poter", BOOKS, {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "author", weight: 0.3 },
    ],
  });
  if (!best) throw new Error("findBestMatch returned null");
  console.log(
    `\nfindBestMatch("hary poter") → "${(best.item as any).title}" (${best.score.toFixed(3)})`,
  );

  // Weighted multi-key with details
  const detailed = new FuzzySearch(BOOKS, {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "author", weight: 0.3 },
    ],
    algorithm: "cosine",
    includeMatchDetails: true,
  });
  const results = detailed.search("george orwel");
  if (results.length === 0) throw new Error("No results for 'george orwel'");
  const top = results[0] as any;
  console.log(
    `weighted cosine("george orwel") → "${top.item.title}" (${top.score.toFixed(3)}) [title=${top.matches.title.toFixed(3)}, author=${top.matches.author.toFixed(3)}]`,
  );

  console.log("\n=== All correctness checks passed ===\n");
}

describe("Correctness: FuzzySearch vs Fuse.js", () => {
  bench(
    "Object array: title key",
    () => {
      const fuse = new Fuse(BOOKS, { keys: ["title"] });
      const nlptools = new FuzzySearch(BOOKS, {
        keys: [{ name: "title" }],
        algorithm: "levenshtein",
      });
      for (const q of QUERIES) {
        const fuseResults = fuse.search(q);
        const nlptoolsResults = nlptools.search(q);
        if (fuseResults.length === 0 && nlptoolsResults.length === 0) continue;
        // Only assert when both have results; Fuse.js threshold may filter more aggressively
        if (fuseResults.length > 0 && nlptoolsResults.length > 0) {
          assertTopMatch(q, (nlptoolsResults[0].item as any).title, fuseResults[0].item.title);
        }
      }
    },
    BENCH_CONFIG,
  );

  bench(
    "String array: fruit search",
    () => {
      const fuse = new Fuse(STRING_LIST);
      const nlptools = new FuzzySearch(STRING_LIST, { algorithm: "levenshtein" });
      const fruitQueries = ["aple", "bannana", "strwbrry", "mngo", "bluberry"];
      for (const q of fruitQueries) {
        const fuseResults = fuse.search(q);
        const nlptoolsResults = nlptools.search(q);
        if (fuseResults.length === 0 && nlptoolsResults.length === 0) continue;
        assertTopMatch(q, nlptoolsResults[0].item as string, fuseResults[0].item);
      }
    },
    BENCH_CONFIG,
  );

  bench(
    "findBestMatch convenience function",
    () => {
      const result = findBestMatch("hary poter", BOOKS, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "author", weight: 0.3 },
        ],
      });
      if (!result) throw new Error("findBestMatch returned null");
      if ((result.item as any).title !== "Harry Potter") {
        throw new Error(
          `findBestMatch: got "${(result.item as any).title}", expected "Harry Potter"`,
        );
      }
    },
    BENCH_CONFIG,
  );

  bench(
    "Weighted multi-key search",
    () => {
      const nlptools = new FuzzySearch(BOOKS, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "author", weight: 0.3 },
        ],
        algorithm: "cosine",
        includeMatchDetails: true,
      });
      const results = nlptools.search("george orwel");
      if (results.length === 0) throw new Error("No results for 'george orwel'");
    },
    BENCH_CONFIG,
  );
});

// ============================================================================
// Performance: FuzzySearch vs Fuse.js
// ============================================================================

describe("Performance: String array (20 items)", () => {
  let fuse: Fuse<string>;
  let nlptools: FuzzySearch<string>;

  bench(
    "setup: Fuse.js",
    () => {
      fuse = new Fuse(STRING_LIST);
    },
    BENCH_CONFIG,
  );

  bench(
    "setup: NLPTools FuzzySearch",
    () => {
      nlptools = new FuzzySearch(STRING_LIST);
    },
    BENCH_CONFIG,
  );

  bench(
    "search: Fuse.js x 6 queries",
    () => {
      for (const q of ["aple", "bannana", "strwbrry", "mngo", "bluberry", "grap"]) {
        fuse.search(q);
      }
    },
    BENCH_CONFIG,
  );

  bench(
    "search: NLPTools x 6 queries",
    () => {
      for (const q of ["aple", "bannana", "strwbrry", "mngo", "bluberry", "grap"]) {
        nlptools.search(q);
      }
    },
    BENCH_CONFIG,
  );
});

describe("Performance: Object array (20 items, single key)", () => {
  let fuse: Fuse<any>;
  let nlptools: FuzzySearch<any>;

  bench(
    "setup: Fuse.js",
    () => {
      fuse = new Fuse(BOOKS, { keys: ["title"] });
    },
    BENCH_CONFIG,
  );

  bench(
    "setup: NLPTools FuzzySearch",
    () => {
      nlptools = new FuzzySearch(BOOKS, { keys: [{ name: "title" }] });
    },
    BENCH_CONFIG,
  );

  bench(
    "search: Fuse.js x 6 queries",
    () => {
      for (const q of QUERIES) fuse.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "search: NLPTools x 6 queries",
    () => {
      for (const q of QUERIES) nlptools.search(q);
    },
    BENCH_CONFIG,
  );
});

describe("Performance: Object array (20 items, multi-key weighted)", () => {
  let fuse: Fuse<any>;
  let nlptools: FuzzySearch<any>;

  bench(
    "setup: Fuse.js",
    () => {
      fuse = new Fuse(BOOKS, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "author", weight: 0.3 },
        ],
      });
    },
    BENCH_CONFIG,
  );

  bench(
    "setup: NLPTools FuzzySearch",
    () => {
      nlptools = new FuzzySearch(BOOKS, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "author", weight: 0.3 },
        ],
      });
    },
    BENCH_CONFIG,
  );

  bench(
    "search: Fuse.js x 6 queries",
    () => {
      for (const q of QUERIES) fuse.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "search: NLPTools x 6 queries",
    () => {
      for (const q of QUERIES) nlptools.search(q);
    },
    BENCH_CONFIG,
  );
});

describe("Performance: findBestMatch one-shot", () => {
  bench(
    "findBestMatch x 6 queries",
    () => {
      for (const q of QUERIES) findBestMatch(q, BOOKS, { keys: [{ name: "title" }] });
    },
    BENCH_CONFIG,
  );
});

describe("Performance: Different algorithms", () => {
  bench(
    "levenshtein x 6 queries",
    () => {
      const s = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "levenshtein" });
      for (const q of QUERIES) s.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "cosine x 6 queries",
    () => {
      const s = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "cosine" });
      for (const q of QUERIES) s.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "jaccard x 6 queries",
    () => {
      const s = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "jaccard" });
      for (const q of QUERIES) s.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "sorensen x 6 queries",
    () => {
      const s = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "sorensen" });
      for (const q of QUERIES) s.search(q);
    },
    BENCH_CONFIG,
  );

  bench(
    "jaccardNgram x 6 queries",
    () => {
      const s = new FuzzySearch(BOOKS, { keys: [{ name: "title" }], algorithm: "jaccardNgram" });
      for (const q of QUERIES) s.search(q);
    },
    BENCH_CONFIG,
  );
});
