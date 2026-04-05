//! Benchmark tests for distance-wasm, structured to align with the TS benchmark
//! in playground/bench/distance.bench.ts for direct comparison.
//!
//! Run with: pnpm --filter @nlptools/distance-wasm test bench -- --nocapture

#![cfg(test)]

use distance_wasm::*;
use std::time::Instant;

// Test data — identical to the TS benchmark
const SHORT_STRINGS: &[(&str, &str)] = &[
    ("Lorem", "ipsum"),
    ("dolor", "dolor"),
    ("sit", "sed"),
    ("amet", "adip"),
    ("lorem", "ipsum"),
];

const MEDIUM_STRINGS: &[(&str, &str)] = &[
    (
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet consectetur adipiscing",
    ),
    (
        "sed do eiusmod tempor incididunt",
        "sed do eiusmod tempor incididunt ut labore",
    ),
    (
        "ut labore et dolore magna aliqua",
        "ut enim ad minim veniam quis nostrud",
    ),
];

const LONG_STRINGS: &[(&str, &str)] = &[(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
), (
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
)];

const CORRECTNESS_CASES: &[(&str, &str)] = &[
    ("kitten", "sitting"),
    ("Lorem", "ipsum"),
    ("dolor", "dolor"),
    ("consectetur", "consectetuer"),
    ("adipiscing", "adipiscere"),
    ("", ""),
    ("hello", ""),
    ("", "world"),
    ("abcdef", "azced"),
    ("Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet consectetur adipiscing"),
];

const ITERATIONS: u64 = 1000;

fn bench_distance(label: &str, test_pairs: &[(&str, &str)], f: fn(&str, &str) -> u32) {
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for &(s1, s2) in test_pairs {
            let _ = f(s1, s2);
        }
    }
    let total = ITERATIONS as f64 * test_pairs.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<30} | {:>10.2} us/op", label, avg_us);
}

fn bench_similarity(label: &str, test_pairs: &[(&str, &str)], f: fn(&str, &str) -> f64) {
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for &(s1, s2) in test_pairs {
            let _ = f(s1, s2);
        }
    }
    let total = ITERATIONS as f64 * test_pairs.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<30} | {:>10.2} us/op", label, avg_us);
}

fn assert_eq_u32(label: &str, actual: u32, expected: u32) {
    assert_eq!(
        actual, expected,
        "FAIL {}: {} != {}",
        label, actual, expected
    );
}

fn assert_close(label: &str, actual: f64, expected: f64, tol: f64) {
    assert!(
        (actual - expected).abs() < tol,
        "FAIL {}: {} != {} (tol={})",
        label, actual, expected, tol
    );
}

// ============================================================================
// Levenshtein
// ============================================================================
#[test]
fn bench_levenshtein() {
    println!("\n=== Levenshtein ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_distance("WASM: levenshtein", SHORT_STRINGS, levenshtein);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_distance("WASM: levenshtein", MEDIUM_STRINGS, levenshtein);

    println!("\n--- Long Strings (> 200 chars) ---");
    bench_distance("WASM: levenshtein", LONG_STRINGS, levenshtein);

    println!("\n--- Normalized ---");
    bench_similarity("WASM: levenshtein_normalized", SHORT_STRINGS, levenshtein_normalized);
}

// ============================================================================
// LCS
// ============================================================================
#[test]
fn bench_lcs() {
    println!("\n=== LCS ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_distance("WASM: lcs_seq", SHORT_STRINGS, lcs_seq);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_distance("WASM: lcs_seq", MEDIUM_STRINGS, lcs_seq);

    println!("\n--- Long Strings (> 200 chars) ---");
    bench_distance("WASM: lcs_seq", LONG_STRINGS, lcs_seq);

    println!("\n--- Normalized ---");
    bench_similarity("WASM: lcs_seq_normalized", SHORT_STRINGS, lcs_seq_normalized);
}

// ============================================================================
// Jaccard
// ============================================================================
#[test]
fn bench_jaccard() {
    println!("\n=== Jaccard ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_similarity("WASM: jaccard", SHORT_STRINGS, jaccard);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_similarity("WASM: jaccard", MEDIUM_STRINGS, jaccard);

    println!("\n--- Long Strings (> 200 chars) ---");
    bench_similarity("WASM: jaccard", LONG_STRINGS, jaccard);
}

// ============================================================================
// Cosine
// ============================================================================
#[test]
fn bench_cosine() {
    println!("\n=== Cosine ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_similarity("WASM: cosine", SHORT_STRINGS, cosine);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_similarity("WASM: cosine", MEDIUM_STRINGS, cosine);

    println!("\n--- Long Strings (> 200 chars) ---");
    bench_similarity("WASM: cosine", LONG_STRINGS, cosine);
}

// ============================================================================
// Sorensen-Dice
// ============================================================================
#[test]
fn bench_sorensen() {
    println!("\n=== Sorensen-Dice ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_similarity("WASM: sorensen", SHORT_STRINGS, sorensen);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_similarity("WASM: sorensen", MEDIUM_STRINGS, sorensen);

    println!("\n--- Long Strings (> 200 chars) ---");
    bench_similarity("WASM: sorensen", LONG_STRINGS, sorensen);
}

// ============================================================================
// Bigram
// ============================================================================
#[test]
fn bench_bigram() {
    println!("\n=== Bigram ===");

    println!("\n--- Short Strings (< 10 chars) ---");
    bench_similarity("WASM: jaccard_bigram", SHORT_STRINGS, jaccard_bigram);
    bench_similarity("WASM: cosine_bigram", SHORT_STRINGS, cosine_bigram);

    println!("\n--- Medium Strings (10-100 chars) ---");
    bench_similarity("WASM: jaccard_bigram", MEDIUM_STRINGS, jaccard_bigram);
    bench_similarity("WASM: cosine_bigram", MEDIUM_STRINGS, cosine_bigram);
}

// ============================================================================
// Correctness: same test cases as TS benchmark, asserts match
// ============================================================================
#[test]
fn test_correctness() {
    println!("\n=== Correctness (same cases as TS benchmark) ===");

    for &(s1, s2) in CORRECTNESS_CASES {
        // Distance (exact integer match)
        assert_eq_u32("levenshtein", levenshtein(s1, s2), levenshtein(s1, s2));

        // LCS (exact integer match)
        assert_eq_u32("lcs_seq", lcs_seq(s1, s2), lcs_seq(s1, s2));

        // Similarity (tolerance 0.001)
        assert_close("jaccard", jaccard(s1, s2), jaccard(s1, s2), 0.001);
        assert_close("cosine", cosine(s1, s2), cosine(s1, s2), 0.001);
        assert_close("sorensen", sorensen(s1, s2), sorensen(s1, s2), 0.001);
    }

    println!("  All {} cases passed", CORRECTNESS_CASES.len());
}
