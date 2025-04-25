# nlptools Project Requirements

This document outlines the functional and non-functional requirements for the `nlptools` project.

## 1. Core Functionality

### 1.1 Text Segmentation

- **Requirement:** The system must be able to segment input text into various linguistic units.
- **Supported Levels:**
  - Paragraphs
  - Sentences
  - Phrases (Optional, definition TBD)
  - Words
- **Language Support:** Segmentation must correctly handle different languages, with initial focus on English and Chinese.
- **Implementation:** Likely resides in `@nlptools/core` or a dedicated `@nlptools/tokenization` package.

### 1.2 Difference Comparison (Diff)

- **Requirement:** The system must identify and report the differences between two input texts (source and target).
- **Output:** The output should clearly distinguish between:
  - Added segments
  - Removed segments
  - Unchanged segments
- **Segmentation Levels:** Difference comparison must operate at the segmentation levels defined in section 1.1.
- **Algorithms:** Support multiple diff algorithms, including but not limited to:
  - Longest Common Subsequence (LCS)
  - Myers Diff
  - Patience Diff
- **Algorithm Selection:** Provide a mechanism to select a specific algorithm or automatically choose a suitable one based on segmentation level or other criteria.
- **Adaptive Segmentation:** Optionally support adaptive segmentation, applying finer-grained comparison to sections identified as different at a coarser level.
- **Details:** Optionally provide detailed statistics (e.g., counts of added/removed/unchanged segments, source/target sizes, algorithm used).
- **Implementation:** Resides in the `@nlptools/comparison` package.

### 1.3 Similarity Analysis

- **Requirement:** The system must calculate a quantitative similarity score between two input texts.
- **Output:** A numerical score (e.g., between 0 and 1) representing the overall similarity.
- **Segmentation Levels:** Similarity calculation must operate at the segmentation levels defined in section 1.1.
- **Algorithms:** Support multiple similarity algorithms, including but not limited to:
  - Levenshtein Distance (or normalized similarity)
  - Jaccard Index
  - Cosine Similarity
  - Consecutive Match-based Similarity (e.g., for plagiarism detection)
- **Algorithm Selection:** Provide a mechanism to select a specific algorithm or automatically choose a suitable one.
- **Implementation:** Resides in the `@nlptools/comparison` package, likely in a dedicated module (e.g., `similarity.ts`).

### 1.4 Match Identification (Highlighting/Extraction)

- **Requirement:** The system must identify and report specific segments or blocks of text that are considered identical or highly similar between the source and target texts. This is akin to highlighting matching passages in plagiarism detection.
- **Output:** A list of matching blocks, including:
  - Content of the match
  - Location (e.g., start/end indices or line numbers) in both source and target texts.
  - Optional: Similarity score for the specific block if not an exact match.
- **Algorithms:** Likely utilizes algorithms focused on sequence matching (e.g., the "consecutive" algorithm mentioned, N-grams, fingerprinting).
- **Implementation:** Resides in the `@nlptools/comparison` package, likely associated with the Similarity Analysis module.

## 2. Non-Functional Requirements

### 2.1 Performance

- **Requirement:** Algorithms should be efficient enough to handle reasonably large texts (e.g., several pages) within acceptable time limits. Performance targets should be defined and tested via benchmarks.

### 2.2 Accuracy

- **Requirement:** Segmentation and comparison results should be accurate according to linguistic standards and chosen algorithm definitions.

### 2.3 Modularity & Extensibility

- **Requirement:** The codebase should be modular (using packages like `core`, `comparison`, `tokenization`) to facilitate maintenance and future extensions (e.g., adding new languages, algorithms, or features).

### 2.4 API Design

- **Requirement:** Provide clear, well-documented, and easy-to-use APIs (likely TypeScript functions/classes) for developers integrating these tools. APIs should allow flexible configuration of options (segmentation level, algorithm, etc.).

### 2.5 Language Support

- **Requirement:** While initial focus is on English and Chinese, the design should allow for adding support for other languages in the future.

## 3. Documentation

- **Requirement:** Provide comprehensive documentation, including:
  - API reference
  - Usage examples
  - Explanation of algorithms and options
  - Contribution guidelines
  - This requirements document.

## 4. Development & Tooling

- **Requirement:** Utilize modern development practices and tooling (e.g., TypeScript, linters, formatters, testing frameworks, CI/CD).
- **Monorepo:** The project uses a monorepo structure (likely managed by pnpm workspaces).

## 5. Package Breakdown and Responsibilities

This section details the purpose and primary functions of each package within the `nlptools` monorepo.

### 5.1 `@nlptools/core`

- **Purpose:** Provides fundamental utilities, base classes, shared type definitions, and core abstractions used across other `nlptools` packages. Aims to reduce code duplication and establish common patterns.
- **Key Functions:**
  - Shared TypeScript interfaces and types (e.g., `BaseOptions`, `SegmentationLevel`).
  - Base classes or functions for common operations (if applicable, e.g., base comparator logic before specialization).
  - Common utility functions (e.g., language detection helpers, normalization utilities).
  - Error handling classes or constants.
- **Dependencies:** Minimal external dependencies. Primarily serves as a dependency for other internal packages.

### 5.2 `@nlptools/tokenization`

- **Purpose:** Handles the process of breaking down raw text into meaningful linguistic units (tokens) based on specified segmentation levels and language.
- **Key Functions:**
  - Implements text segmentation for paragraphs, sentences, and words (Requirement 1.1).
  - Integrates with underlying NLP libraries (e.g., `retext` and its ecosystem) for robust parsing.
  - Provides functions or classes to tokenize text strings into arrays of segments.
  - Manages language-specific segmentation rules or models.
- **Dependencies:** `@nlptools/core`, `retext` (and relevant plugins), potentially language model libraries.
- **API:** Exposes functions like `tokenize(text: string, options: TokenizationOptions): Segment[]`.

### 5.3 `@nlptools/comparison`

- **Purpose:** Contains the logic for comparing two texts, encompassing both difference (diff) analysis and similarity assessment.
- **Key Functions:**
  - Implements difference comparison algorithms (LCS, Myers, Patience) (Requirement 1.2).
  - Calculates overall similarity scores using various algorithms (Levenshtein, Jaccard, Cosine, Consecutive) (Requirement 1.3).
  - Identifies and extracts matching text blocks between source and target (Requirement 1.4).
  - Manages algorithm selection (manual and automatic) based on user options or heuristics.
  - Implements adaptive segmentation logic for comparison.
  - Defines result structures (`DiffResult`, `SimilarityResult`, `MatchBlock`).
- **Dependencies:** `@nlptools/core`, `@nlptools/tokenization`.
- **API:** Exposes primary functions like `calculateDiff(...)`, `calculateSimilarity(...)`, `findMatches(...)` or a unified `compare(...)` function.

### 5.4 `@nlptools/nlptools` (Potential Root/CLI Package)

- **Purpose:** (Assumed) Acts as the main entry point for the `nlptools` library or a potential Command Line Interface (CLI) tool. It likely aggregates functionality from other packages.
- **Key Functions:**
  - Re-exports core functionalities from `tokenization` and `comparison` packages for easier top-level import by users.
  - (If CLI) Parses command-line arguments, reads input files/text, invokes the appropriate comparison/tokenization functions, and formats the output for the console.
- **Dependencies:** `@nlptools/core`, `@nlptools/tokenization`, `@nlptools/comparison`.
- **API:** (If library) Provides the main public API surface. (If CLI) Defines the command-line usage and options.

### 5.5 `playground`

- **Purpose:** Not a published package. Serves as a development environment for testing, benchmarking, and demonstrating the usage of the `nlptools` packages.
- **Key Functions:**
  - Contains example scripts (`example.ts`).
  - Includes benchmark tests (`bench.ts`).
  - May contain sample data or test cases.
- **Dependencies:** Depends on all other `@nlptools` packages for testing purposes.
