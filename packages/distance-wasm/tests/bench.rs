//! Simple benchmark tests for distance-wasm algorithms using Lorem Ipsum text
//!
//! This module provides basic performance tests for all distance algorithms
//! implemented in the WebAssembly module.

#![cfg(test)]

use distance_wasm::*;
use std::time::Instant;

// Test data for benchmarking - Lorem Ipsum text
static SHORT_STRINGS: &[(&str, &str)] = &[
    ("Lorem", "ipsum"),
    ("dolor", "dolor"),
    ("sit", "sed"),
    ("amet", "adip"),
    ("lorem", "ipsum"),
];

static MEDIUM_STRINGS: &[(&str, &str)] = &[
    (
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet consectetur adipiscing"
    ),
    (
        "sed do eiusmod tempor incididunt",
        "sed do eiusmod tempor incididunt ut labore"
    ),
    (
        "ut labore et dolore magna aliqua",
        "ut enim ad minim veniam quis nostrud"
    ),
];

static LONG_STRINGS: &[(&str, &str)] = &[
    (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    ),
    (
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
    ),
];

/// Benchmark a distance function that takes two strings and returns u32
fn bench_distance<F>(name: &str, func: F, test_pairs: &[(&str, &str)]) -> (String, f64)
where
    F: Fn(&str, &str) -> u32,
{
    let iterations = 1000;
    let start = Instant::now();

    for _ in 0..iterations {
        for (s1, s2) in test_pairs {
            let _ = func(s1, s2);
        }
    }

    let duration = start.elapsed();
    let avg_time_ms = duration.as_millis() as f64 / (iterations * test_pairs.len()) as f64;

    (name.to_string(), avg_time_ms)
}

/// Benchmark a similarity function that takes two strings and returns f64
fn bench_similarity<F>(name: &str, func: F, test_pairs: &[(&str, &str)]) -> (String, f64)
where
    F: Fn(&str, &str) -> f64,
{
    let iterations = 1000;
    let start = Instant::now();

    for _ in 0..iterations {
        for (s1, s2) in test_pairs {
            let _ = func(s1, s2);
        }
    }

    let duration = start.elapsed();
    let avg_time_ms = duration.as_millis() as f64 / (iterations * test_pairs.len()) as f64;

    (name.to_string(), avg_time_ms)
}

#[test]
fn bench_edit_distance_algorithms() {
    println!("\n=== Edit Distance Algorithms Benchmark (Lorem Ipsum) ===");

    // Short strings
    println!("\n--- Short Strings (< 10 chars) ---");
    let mut results = vec![
        bench_distance("levenshtein", levenshtein, SHORT_STRINGS),
        bench_distance("damerau_levenshtein", damerau_levenshtein, SHORT_STRINGS),
        bench_distance("myers_levenshtein", myers_levenshtein, SHORT_STRINGS),
        bench_distance("hamming", hamming, &[("lorem", "ipsum")]),
        bench_distance("sift4_simple", sift4_simple, SHORT_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<20} | {:8.4} ms", index + 1, name, time);
    }

    // Medium strings
    println!("\n--- Medium Strings (10-100 chars) ---");
    let mut results = vec![
        bench_distance("levenshtein", levenshtein, MEDIUM_STRINGS),
        bench_distance("damerau_levenshtein", damerau_levenshtein, MEDIUM_STRINGS),
        bench_distance("myers_levenshtein", myers_levenshtein, MEDIUM_STRINGS),
        bench_distance("sift4_simple", sift4_simple, MEDIUM_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<20} | {:8.4} ms", index + 1, name, time);
    }

    // Long strings
    println!("\n--- Long Strings (> 200 chars) ---");
    let mut results = vec![
        bench_distance("levenshtein", levenshtein, LONG_STRINGS),
        bench_distance("damerau_levenshtein", damerau_levenshtein, LONG_STRINGS),
        bench_distance("myers_levenshtein", myers_levenshtein, LONG_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<20} | {:8.4} ms", index + 1, name, time);
    }

    if !results.is_empty() {
        let fastest = &results[0];
        let slowest = &results[results.len() - 1];
        let speedup = slowest.1 / fastest.1;
        println!("\n🏆 Fastest: {} ({:.4} ms)", fastest.0, fastest.1);
        println!("🐌 Slowest: {} ({:.4} ms)", slowest.0, slowest.1);
        println!("⚡ Speed difference: {:.2}x", speedup);
    }
}

#[test]
fn bench_similarity_algorithms() {
    println!("\n=== Similarity Algorithms Benchmark (Lorem Ipsum) ===");

    // Edit-based similarity algorithms
    println!("\n--- Edit-based Similarity ---");
    let mut results = vec![
        bench_similarity("levenshtein_normalized", levenshtein_normalized, SHORT_STRINGS),
        bench_similarity("damerau_levenshtein_normalized", damerau_levenshtein_normalized, SHORT_STRINGS),
        bench_similarity("myers_levenshtein_normalized", myers_levenshtein_normalized, SHORT_STRINGS),
        bench_similarity("hamming_normalized", hamming_normalized, &[("lorem", "ipsum")]),
        bench_similarity("sift4_simple_normalized", sift4_simple_normalized, SHORT_STRINGS),
        bench_similarity("jaro", jaro, SHORT_STRINGS),
        bench_similarity("jarowinkler", jarowinkler, SHORT_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<25} | {:8.4} ms", index + 1, name, time);
    }

    // Token-based similarity algorithms
    println!("\n--- Token-based Similarity ---");
    let mut results = vec![
        bench_similarity("jaccard", jaccard, MEDIUM_STRINGS),
        bench_similarity("cosine", cosine, MEDIUM_STRINGS),
        bench_similarity("sorensen", sorensen, MEDIUM_STRINGS),
        bench_similarity("tversky", tversky, MEDIUM_STRINGS),
        bench_similarity("overlap", overlap, SHORT_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<25} | {:8.4} ms", index + 1, name, time);
    }

    // Sequence-based similarity algorithms
    println!("\n--- Sequence-based Similarity ---");
    let mut results = vec![
        bench_similarity("lcs_seq_normalized", lcs_seq_normalized, SHORT_STRINGS),
        bench_similarity("lcs_str_normalized", lcs_str_normalized, SHORT_STRINGS),
        bench_similarity("ratcliff_obershelp", ratcliff_obershelp, SHORT_STRINGS),
        bench_similarity("smith_waterman_normalized", smith_waterman_normalized, SHORT_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<25} | {:8.4} ms", index + 1, name, time);
    }

    // Bigram and Naive similarity algorithms
    println!("\n--- Bigram & Naive Similarity ---");
    let mut results = vec![
        bench_similarity("jaccard_bigram", jaccard_bigram, SHORT_STRINGS),
        bench_similarity("cosine_bigram", cosine_bigram, SHORT_STRINGS),
        bench_similarity("prefix", prefix, SHORT_STRINGS),
        bench_similarity("suffix", suffix, SHORT_STRINGS),
        bench_similarity("length", length, SHORT_STRINGS),
    ];

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<25} | {:8.4} ms", index + 1, name, time);
    }
}

#[test]
fn bench_universal_compare() {
    println!("\n=== Universal Compare Function Benchmark (Lorem Ipsum) ===");

    let algorithms = vec![
        "levenshtein",
        "damerau_levenshtein",
        "jaro",
        "jaro_winkler",
        "cosine",
        "jaccard",
        "lcs_seq",
        "myers_levenshtein",
    ];

    println!("\n--- Universal Compare Performance ---");
    let mut results = vec![];

    for algorithm in algorithms {
        let (name, time) = bench_similarity(
            &format!("compare_{}", algorithm),
            |s1, s2| compare(s1, s2, algorithm),
            SHORT_STRINGS
        );
        results.push((name, time));
    }

    results.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

    for (index, (name, time)) in results.iter().enumerate() {
        println!("{:2}. {:<25} | {:8.4} ms", index + 1, name, time);
    }
}

#[test]
fn test_algorithm_correctness() {
    println!("\n=== Algorithm Correctness Check (Lorem Ipsum) ===");

    let test_cases = [
        ("Lorem", "ipsum"),
        ("dolor", "dolor"),
        ("consectetur", "consectetuer"),
        ("adipiscing", "adipiscere"),
    ];

    for (s1, s2) in test_cases {
        println!("\nTesting: \"{}\" vs \"{}\"", s1, s2);

        // Basic distance checks
        let lev = levenshtein(s1, s2);
        let dam_lev = damerau_levenshtein(s1, s2);
        let myers = myers_levenshtein(s1, s2);

        println!("  Distances - Levenshtein: {}, Damerau-Levenshtein: {}, Myers: {}", lev, dam_lev, myers);

        // Similarity scores should be between 0 and 1
        let lev_sim = levenshtein_normalized(s1, s2);
        let jaro_sim = jaro(s1, s2);
        let jaro_win_sim = jarowinkler(s1, s2);

        assert!(lev_sim >= 0.0 && lev_sim <= 1.0, "Levenshtein similarity out of bounds: {}", lev_sim);
        assert!(jaro_sim >= 0.0 && jaro_sim <= 1.0, "Jaro similarity out of bounds: {}", jaro_sim);
        assert!(jaro_win_sim >= 0.0 && jaro_win_sim <= 1.0, "Jaro-Winkler similarity out of bounds: {}", jaro_win_sim);

        println!("  Similarities - Lev: {:.3}, Jaro: {:.3}, Jaro-Winkler: {:.3}", lev_sim, jaro_sim, jaro_win_sim);

        // Universal compare should match direct function calls
        let lev_universal = compare(s1, s2, "levenshtein");
        let jaro_universal = compare(s1, s2, "jaro");

        assert!((lev_sim - lev_universal).abs() < 0.001, "Universal Levenshtein mismatch");
        assert!((jaro_sim - jaro_universal).abs() < 0.001, "Universal Jaro mismatch");

        println!("  ✅ Universal compare matches direct calls");
    }

    println!("\n✅ All correctness checks passed!");
}