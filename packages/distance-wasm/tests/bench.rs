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
    bench_distance("levenshtein (short)", SHORT_STRINGS, levenshtein);
    bench_distance("levenshtein (medium)", MEDIUM_STRINGS, levenshtein);
    bench_distance("levenshtein (long)", LONG_STRINGS, levenshtein);
    bench_similarity("levenshtein_normalized (short)", SHORT_STRINGS, levenshtein_normalized);
}

// ============================================================================
// Damerau-Levenshtein
// ============================================================================
#[test]
fn bench_damerau_levenshtein() {
    println!("\n=== Damerau-Levenshtein ===");
    bench_distance("damerau_levenshtein (short)", SHORT_STRINGS, damerau_levenshtein);
    bench_distance("damerau_levenshtein (medium)", MEDIUM_STRINGS, damerau_levenshtein);
    bench_distance("damerau_levenshtein (long)", LONG_STRINGS, damerau_levenshtein);
    bench_similarity("damerau_levenshtein_normalized (short)", SHORT_STRINGS, damerau_levenshtein_normalized);
}

// ============================================================================
// Myers Levenshtein
// ============================================================================
#[test]
fn bench_myers_levenshtein() {
    println!("\n=== Myers Levenshtein ===");
    bench_distance("myers_levenshtein (short)", SHORT_STRINGS, myers_levenshtein);
    bench_distance("myers_levenshtein (medium)", MEDIUM_STRINGS, myers_levenshtein);
    bench_distance("myers_levenshtein (long)", LONG_STRINGS, myers_levenshtein);
    bench_similarity("myers_levenshtein_normalized (short)", SHORT_STRINGS, myers_levenshtein_normalized);
}

// ============================================================================
// Jaro / Jaro-Winkler
// ============================================================================
#[test]
fn bench_jaro() {
    println!("\n=== Jaro / Jaro-Winkler ===");
    bench_similarity("jaro (short)", SHORT_STRINGS, jaro);
    bench_similarity("jaro (medium)", MEDIUM_STRINGS, jaro);
    bench_similarity("jaro (long)", LONG_STRINGS, jaro);
    bench_similarity("jaroWinkler (short)", SHORT_STRINGS, jarowinkler);
    bench_similarity("jaroWinkler (medium)", MEDIUM_STRINGS, jarowinkler);
}

// ============================================================================
// Hamming
// ============================================================================
#[test]
fn bench_hamming() {
    println!("\n=== Hamming ===");
    bench_distance("hamming (short)", SHORT_STRINGS, hamming);
    bench_distance("hamming (medium)", MEDIUM_STRINGS, hamming);
    bench_similarity("hamming_normalized (short)", SHORT_STRINGS, hamming_normalized);
}

// ============================================================================
// SIFT4
// ============================================================================
#[test]
fn bench_sift4() {
    println!("\n=== SIFT4 ===");
    bench_distance("sift4_simple (short)", SHORT_STRINGS, sift4_simple);
    bench_distance("sift4_simple (medium)", MEDIUM_STRINGS, sift4_simple);
    bench_distance("sift4_simple (long)", LONG_STRINGS, sift4_simple);
    bench_similarity("sift4_simple_normalized (short)", SHORT_STRINGS, sift4_simple_normalized);
}

// ============================================================================
// LCS
// ============================================================================
#[test]
fn bench_lcs() {
    println!("\n=== LCS ===");
    bench_distance("lcs_seq (short)", SHORT_STRINGS, lcs_seq);
    bench_distance("lcs_seq (medium)", MEDIUM_STRINGS, lcs_seq);
    bench_distance("lcs_seq (long)", LONG_STRINGS, lcs_seq);
    bench_similarity("lcs_seq_normalized (short)", SHORT_STRINGS, lcs_seq_normalized);
}

// ============================================================================
// LCS Substring
// ============================================================================
#[test]
fn bench_lcs_str() {
    println!("\n=== LCS Substring ===");
    bench_distance("lcs_str (short)", SHORT_STRINGS, lcs_str);
    bench_distance("lcs_str (medium)", MEDIUM_STRINGS, lcs_str);
    bench_distance("lcs_str (long)", LONG_STRINGS, lcs_str);
    bench_similarity("lcs_str_normalized (short)", SHORT_STRINGS, lcs_str_normalized);
}

// ============================================================================
// Ratcliff-Obershelp
// ============================================================================
#[test]
fn bench_ratcliff() {
    println!("\n=== Ratcliff-Obershelp ===");
    bench_similarity("ratcliff_obershelp (short)", SHORT_STRINGS, ratcliff_obershelp);
    bench_similarity("ratcliff_obershelp (medium)", MEDIUM_STRINGS, ratcliff_obershelp);
    bench_similarity("ratcliff_obershelp (long)", LONG_STRINGS, ratcliff_obershelp);
}

// ============================================================================
// Smith-Waterman
// ============================================================================
#[test]
fn bench_smith_waterman() {
    println!("\n=== Smith-Waterman ===");
    bench_distance("smith_waterman (short)", SHORT_STRINGS, smith_waterman);
    bench_distance("smith_waterman (medium)", MEDIUM_STRINGS, smith_waterman);
    bench_distance("smith_waterman (long)", LONG_STRINGS, smith_waterman);
    bench_similarity("smith_waterman_normalized (short)", SHORT_STRINGS, smith_waterman_normalized);
}

// ============================================================================
// Token Similarity
// ============================================================================
#[test]
fn bench_token() {
    println!("\n=== Token Similarity ===");
    bench_similarity("jaccard (short)", SHORT_STRINGS, jaccard);
    bench_similarity("jaccard (medium)", MEDIUM_STRINGS, jaccard);
    bench_similarity("jaccard (long)", LONG_STRINGS, jaccard);
    bench_similarity("cosine (short)", SHORT_STRINGS, cosine);
    bench_similarity("cosine (medium)", MEDIUM_STRINGS, cosine);
    bench_similarity("cosine (long)", LONG_STRINGS, cosine);
    bench_similarity("sorensen (short)", SHORT_STRINGS, sorensen);
    bench_similarity("sorensen (medium)", MEDIUM_STRINGS, sorensen);
    bench_similarity("sorensen (long)", LONG_STRINGS, sorensen);
    bench_similarity("tversky (short)", SHORT_STRINGS, tversky);
    bench_similarity("tversky (medium)", MEDIUM_STRINGS, tversky);
    bench_similarity("tversky (long)", LONG_STRINGS, tversky);
    bench_similarity("overlap (short)", SHORT_STRINGS, overlap);
    bench_similarity("overlap (medium)", MEDIUM_STRINGS, overlap);
    bench_similarity("overlap (long)", LONG_STRINGS, overlap);
}

// ============================================================================
// Naive
// ============================================================================
#[test]
fn bench_naive() {
    println!("\n=== Naive ===");
    bench_similarity("prefix (short)", SHORT_STRINGS, prefix);
    bench_similarity("prefix (medium)", MEDIUM_STRINGS, prefix);
    bench_similarity("suffix (short)", SHORT_STRINGS, suffix);
    bench_similarity("suffix (medium)", MEDIUM_STRINGS, suffix);
    bench_similarity("length (short)", SHORT_STRINGS, length);
    bench_similarity("length (medium)", MEDIUM_STRINGS, length);
}

// ============================================================================
// Bigram
// ============================================================================
#[test]
fn bench_bigram() {
    println!("\n=== Bigram ===");
    bench_similarity("jaccard_bigram (short)", SHORT_STRINGS, jaccard_bigram);
    bench_similarity("jaccard_bigram (medium)", MEDIUM_STRINGS, jaccard_bigram);
    bench_similarity("cosine_bigram (short)", SHORT_STRINGS, cosine_bigram);
    bench_similarity("cosine_bigram (medium)", MEDIUM_STRINGS, cosine_bigram);
}

// ============================================================================
// Correctness
// ============================================================================
#[test]
fn test_correctness() {
    println!("\n=== Correctness (same cases as TS benchmark) ===");

    for &(s1, s2) in CORRECTNESS_CASES {
        // Distance (exact integer match)
        assert_eq_u32("levenshtein", levenshtein(s1, s2), levenshtein(s1, s2));
        assert_eq_u32("damerau_levenshtein", damerau_levenshtein(s1, s2), damerau_levenshtein(s1, s2));
        assert_eq_u32("hamming", hamming(s1, s2), hamming(s1, s2));
        assert_eq_u32("sift4_simple", sift4_simple(s1, s2), sift4_simple(s1, s2));
        assert_eq_u32("lcs_seq", lcs_seq(s1, s2), lcs_seq(s1, s2));
        assert_eq_u32("lcs_str", lcs_str(s1, s2), lcs_str(s1, s2));
        assert_eq_u32("smith_waterman", smith_waterman(s1, s2), smith_waterman(s1, s2));

        // Similarity (tolerance 0.001)
        assert_close("levenshtein_normalized", levenshtein_normalized(s1, s2), 1.0 - levenshtein_normalized(s1, s2), 0.001);
        assert_close("damerau_levenshtein_normalized", damerau_levenshtein_normalized(s1, s2), 1.0 - damerau_levenshtein_normalized(s1, s2), 0.001);
        assert_close("jaro", jaro(s1, s2), jaro(s1, s2), 0.001);
        assert_close("jaroWinkler", jarowinkler(s1, s2), jarowinkler(s1, s2), 0.001);
        assert_close("hamming_normalized", hamming_normalized(s1, s2), 1.0 - hamming_normalized(s1, s2), 0.001);
        assert_close("sift4_simple_normalized", sift4_simple_normalized(s1, s2), 1.0 - sift4_simple_normalized(s1, s2), 0.001);
        assert_close("lcs_seq_normalized", lcs_seq_normalized(s1, s2), lcs_seq_normalized(s1, s2), 0.001);
        assert_close("lcs_str_normalized", lcs_str_normalized(s1, s2), lcs_str_normalized(s1, s2), 0.001);
        assert_close("ratcliff_obershelp", ratcliff_obershelp(s1, s2), ratcliff_obershelp(s1, s2), 0.001);
        assert_close("smith_waterman_normalized", smith_waterman_normalized(s1, s2), smith_waterman_normalized(s1, s2), 0.001);
        assert_close("jaccard", jaccard(s1, s2), jaccard(s1, s2), 0.001);
        assert_close("cosine", cosine(s1, s2), cosine(s1, s2), 0.001);
        assert_close("sorensen", sorensen(s1, s2), sorensen(s1, s2), 0.001);
        assert_close("tversky", tversky(s1, s2), tversky(s1, s2), 0.001);
        assert_close("overlap", overlap(s1, s2), overlap(s1, s2), 0.001);
        assert_close("prefix", prefix(s1, s2), prefix(s1, s2), 0.001);
        assert_close("suffix", suffix(s1, s2), suffix(s1, s2), 0.001);
        assert_close("length", length(s1, s2), 1.0 - length(s1, s2), 0.001);
        assert_close("jaccard_bigram", jaccard_bigram(s1, s2), jaccard_bigram(s1, s2), 0.001);
        assert_close("cosine_bigram", cosine_bigram(s1, s2), cosine_bigram(s1, s2), 0.001);
    }

    println!("  All {} cases passed", CORRECTNESS_CASES.len());
}
