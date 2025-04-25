# nlptools Implementation Plan

This plan outlines the steps to implement the functionalities defined in `docs/requirements.md`.

## Phase 1: Core Setup and Tokenization

### `@nlptools/core`

- [ ] Define core shared interfaces (`BaseOptions`, `SegmentationLevel`, etc.).
- [ ] Define common error classes.
- [ ] Implement basic utility functions (e.g., normalization, language helpers - if needed early).
- [ ] Set up basic unit tests for utilities.
- [ ] Initial documentation for core concepts.

### `@nlptools/tokenization`

- [ ] Integrate `retext` and necessary plugins (e.g., `retext-english`, `retext-chinese-parsimmon`).
- [ ] Implement `tokenize` function/class.
- [ ] Implement segmentation for Paragraphs (using `retext` structure).
- [ ] Implement segmentation for Sentences (using `retext-sentence-spacing` or similar).
- [ ] Implement segmentation for Words (using `retext` structure).
- [ ] Implement handling for `TokenizationOptions` (language selection, level selection).
- [ ] Add unit tests for tokenization at different levels and languages (English, Chinese).
- [ ] Add basic benchmarks for tokenization performance.
- [ ] Document `tokenize` function and options.

## Phase 2: Comparison Logic - Diff

### `@nlptools/comparison` (Diff Part)

- [ ] Define `DiffResult` and related interfaces (`DiffChange`, `DiffResultDetails`).
- [ ] Refactor/Implement `base.ts` for shared comparison logic (if needed, beyond `@nlptools/core`).
- [ ] Implement LCS diff algorithm.
- [ ] Implement Myers diff algorithm.
- [ ] Implement Patience diff algorithm.
- [ ] Create `diff.ts` module/class (`DiffComparator`).
- [ ] Implement main `calculateDiff` function/method.
- [ ] Integrate tokenization from `@nlptools/tokenization`.
- [ ] Implement algorithm selection logic (manual and automatic via `AlgorithmSelector`).
- [ ] Implement optional detailed statistics (`details`).
- [ ] Implement optional simple similarity ratio based on diff.
- [ ] Add unit tests for diff algorithms with various inputs and segmentation levels.
- [ ] Add benchmarks for diff performance.
- [ ] Document `calculateDiff` and `DiffOptions`.

## Phase 3: Comparison Logic - Similarity & Matching

### `@nlptools/comparison` (Similarity Part)

- [ ] Define `SimilarityResult` and related interfaces (`MatchBlock`).
- [ ] Create `similarity.ts` module/class (`SimilarityComparator`).
- [ ] Implement Levenshtein similarity algorithm.
- [ ] Implement Jaccard similarity algorithm.
- [ ] Implement Cosine similarity algorithm.
- [ ] Implement Consecutive Match similarity/matching algorithm.
- [ ] Implement main `calculateSimilarity` function/method (for overall score).
- [ ] Implement `findMatches` function/method (for Requirement 1.4).
- [ ] Integrate tokenization from `@nlptools/tokenization`.
- [ ] Implement algorithm selection for similarity.
- [ ] Add unit tests for similarity algorithms and matching logic.
- [ ] Add benchmarks for similarity performance.
- [ ] Document `calculateSimilarity`, `findMatches`, and `SimilarityOptions`.

## Phase 4: Advanced Comparison Features & API

### `@nlptools/comparison` (Advanced)

- [ ] Implement Adaptive Segmentation logic for Diff.
- [ ] Implement Adaptive Segmentation logic for Similarity/Matching (if applicable).
- [ ] Refine `AlgorithmSelector` based on testing and benchmarks.
- [ ] Finalize the unified `compare` API (if chosen over separate functions).
- [ ] Add comprehensive integration tests covering diff, similarity, matching, and adaptive segmentation.

### `@nlptools/nlptools` (Root/CLI)

- [ ] Set up the root package.
- [ ] Re-export key APIs from `core`, `tokenization`, and `comparison`.
- [ ] (Optional) Design and implement the CLI interface.
  - [ ] Argument parsing.
  - [ ] File input/output handling.
  - [ ] Console output formatting.
  - [ ] Add CLI tests.
- [ ] Document public API surface / CLI usage.

## Phase 5: Finalization & Documentation

- [ ] Review and enhance all unit tests and integration tests.
- [ ] Run full benchmark suite and document performance results.
- [ ] Complete API reference documentation for all packages.
- [ ] Write comprehensive usage examples in the `playground` and/or documentation.
- [ ] Review and finalize `README.md` files for all packages and the root project.
- [ ] Update `requirements.md` and `implementation-plan.md` if necessary.
- [ ] Set up CI/CD pipeline (linting, testing, building, potentially publishing).

## Cross-Cutting Concerns (Throughout Development)

- [ ] Maintain code quality (linting, formatting).
- [ ] Ensure adequate test coverage.
- [ ] Document code (JSDoc/TSDoc) as it's written.
- [ ] Address performance considerations (Requirement 2.1).
- [ ] Ensure accuracy of results (Requirement 2.2).
