#![cfg(test)]

use distance_wasm::*;
use std::time::Instant;

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
    (
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet consectetur adipiscing",
    ),
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
    assert_eq!(actual, expected, "FAIL {}: {} != {}", label, actual, expected);
}

fn assert_close(label: &str, actual: f64, expected: f64, tol: f64) {
    assert!(
        (actual - expected).abs() < tol,
        "FAIL {}: {} != {} (tol={})",
        label, actual, expected, tol
    );
}

#[test]
fn bench_levenshtein() {
    println!("\n=== Levenshtein ===");
    bench_distance("levenshtein (short)", SHORT_STRINGS, levenshtein);
    bench_distance("levenshtein (medium)", MEDIUM_STRINGS, levenshtein);
    bench_distance("levenshtein (long)", LONG_STRINGS, levenshtein);
    bench_similarity(
        "levenshtein_normalized (short)",
        SHORT_STRINGS,
        levenshtein_normalized,
    );
}

#[test]
fn bench_damerau_levenshtein() {
    println!("\n=== Damerau-Levenshtein ===");
    bench_distance(
        "damerau_levenshtein (short)",
        SHORT_STRINGS,
        damerau_levenshtein,
    );
    bench_distance(
        "damerau_levenshtein (medium)",
        MEDIUM_STRINGS,
        damerau_levenshtein,
    );
    bench_distance(
        "damerau_levenshtein (long)",
        LONG_STRINGS,
        damerau_levenshtein,
    );
    bench_similarity(
        "damerau_levenshtein_normalized (short)",
        SHORT_STRINGS,
        damerau_levenshtein_normalized,
    );
}

#[test]
fn bench_jaro() {
    println!("\n=== Jaro / Jaro-Winkler ===");
    bench_similarity("jaro (short)", SHORT_STRINGS, jaro);
    bench_similarity("jaro (medium)", MEDIUM_STRINGS, jaro);
    bench_similarity("jaro (long)", LONG_STRINGS, jaro);
    bench_similarity("jaroWinkler (short)", SHORT_STRINGS, jarowinkler);
    bench_similarity("jaroWinkler (medium)", MEDIUM_STRINGS, jarowinkler);
}

#[test]
fn bench_hamming() {
    println!("\n=== Hamming ===");
    bench_distance("hamming (short)", SHORT_STRINGS, hamming);
    bench_distance("hamming (medium)", MEDIUM_STRINGS, hamming);
    bench_similarity("hamming_normalized (short)", SHORT_STRINGS, hamming_normalized);
}

#[test]
fn bench_sift4() {
    println!("\n=== SIFT4 ===");
    bench_distance("sift4_simple (short)", SHORT_STRINGS, sift4_simple);
    bench_distance("sift4_simple (medium)", MEDIUM_STRINGS, sift4_simple);
    bench_distance("sift4_simple (long)", LONG_STRINGS, sift4_simple);
    bench_similarity(
        "sift4_simple_normalized (short)",
        SHORT_STRINGS,
        sift4_simple_normalized,
    );
}

#[test]
fn bench_lcs() {
    println!("\n=== LCS ===");
    bench_distance("lcs_seq (short)", SHORT_STRINGS, lcs_seq);
    bench_distance("lcs_seq (medium)", MEDIUM_STRINGS, lcs_seq);
    bench_distance("lcs_seq (long)", LONG_STRINGS, lcs_seq);
    bench_similarity("lcs_seq_normalized (short)", SHORT_STRINGS, lcs_seq_normalized);
}

#[test]
fn bench_lcs_str() {
    println!("\n=== LCS Substring ===");
    bench_distance("lcs_str (short)", SHORT_STRINGS, lcs_str);
    bench_distance("lcs_str (medium)", MEDIUM_STRINGS, lcs_str);
    bench_distance("lcs_str (long)", LONG_STRINGS, lcs_str);
    bench_similarity(
        "lcs_str_normalized (short)",
        SHORT_STRINGS,
        lcs_str_normalized,
    );
}

#[test]
fn bench_ratcliff() {
    println!("\n=== Ratcliff-Obershelp ===");
    bench_similarity(
        "ratcliff_obershelp (short)",
        SHORT_STRINGS,
        ratcliff_obershelp,
    );
    bench_similarity(
        "ratcliff_obershelp (medium)",
        MEDIUM_STRINGS,
        ratcliff_obershelp,
    );
    bench_similarity(
        "ratcliff_obershelp (long)",
        LONG_STRINGS,
        ratcliff_obershelp,
    );
}

#[test]
fn bench_smith_waterman() {
    println!("\n=== Smith-Waterman ===");
    bench_distance("smith_waterman (short)", SHORT_STRINGS, smith_waterman);
    bench_distance("smith_waterman (medium)", MEDIUM_STRINGS, smith_waterman);
    bench_distance("smith_waterman (long)", LONG_STRINGS, smith_waterman);
    bench_similarity(
        "smith_waterman_normalized (short)",
        SHORT_STRINGS,
        smith_waterman_normalized,
    );
}

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

#[test]
fn bench_bigram() {
    println!("\n=== Bigram ===");
    bench_similarity("jaccard_bigram (short)", SHORT_STRINGS, jaccard_bigram);
    bench_similarity("jaccard_bigram (medium)", MEDIUM_STRINGS, jaccard_bigram);
    bench_similarity("cosine_bigram (short)", SHORT_STRINGS, cosine_bigram);
    bench_similarity("cosine_bigram (medium)", MEDIUM_STRINGS, cosine_bigram);
}

#[test]
fn test_correctness() {
    println!("\n=== Correctness ===");

    assert_eq_u32("levenshtein('', '')", levenshtein("", ""), 0);
    assert_eq_u32("levenshtein('abc', '')", levenshtein("abc", ""), 3);
    assert_eq_u32("levenshtein('', 'abc')", levenshtein("", "abc"), 3);
    assert_eq_u32(
        "levenshtein('kitten','sitting')",
        levenshtein("kitten", "sitting"),
        3,
    );
    assert_eq_u32(
        "levenshtein('saturday','sunday')",
        levenshtein("saturday", "sunday"),
        3,
    );
    assert_eq_u32("levenshtein('test','text')", levenshtein("test", "text"), 1);
    assert_eq_u32("levenshtein('abc','abc')", levenshtein("abc", "abc"), 0);

    let a_long = "The quick brown fox jumps over the lazy dog and runs away very far from home";
    let b_long =
        "The quick brown dog jumps over the lazy fox and runs very very far away from home";
    let dist_long = levenshtein(a_long, b_long);
    assert!(dist_long > 0 && dist_long < 30, "levenshtein long: {}", dist_long);

    assert_eq_u32("damerau('abc','acb')", damerau_levenshtein("abc", "acb"), 1);
    assert_eq_u32(
        "damerau('abc','abc')",
        damerau_levenshtein("abc", "abc"),
        0,
    );

    assert_eq_u32(
        "hamming('karolin','kathrin')",
        hamming("karolin", "kathrin"),
        3,
    );
    assert_eq_u32("hamming('abc','abc')", hamming("abc", "abc"), 0);

    assert_eq_u32("sift4('abc','abc')", sift4_simple("abc", "abc"), 0);
    let sift_dist = sift4_simple("kitten", "sitting");
    assert!(sift_dist > 0 && sift_dist < 6, "sift4 kitten/sitting: {}", sift_dist);

    assert_eq_u32("lcs_seq('abcde','ace')", lcs_seq("abcde", "ace"), 3);
    assert_eq_u32("lcs_seq('abc','abc')", lcs_seq("abc", "abc"), 3);
    assert_eq_u32("lcs_seq('','abc')", lcs_seq("", "abc"), 0);

    assert_eq_u32("lcs_str('abcde','abfde')", lcs_str("abcde", "abfde"), 2);
    assert_eq_u32("lcs_str('abc','xyz')", lcs_str("abc", "xyz"), 0);

    let sw = smith_waterman("ACGT", "ACGT");
    assert_eq_u32("sw('ACGT','ACGT')", sw, 4);

    for &(s1, s2) in CORRECTNESS_CASES {
        let lev_norm = levenshtein_normalized(s1, s2);
        assert!(
            lev_norm >= 0.0 && lev_norm <= 1.0,
            "lev_norm out of range: {}",
            lev_norm
        );
        let j = jaro(s1, s2);
        assert!(j >= 0.0 && j <= 1.0, "jaro out of range: {}", j);
        let jw = jarowinkler(s1, s2);
        assert!(jw >= 0.0 && jw <= 1.0, "jarowinkler out of range: {}", jw);
        let jac = jaccard(s1, s2);
        assert!(jac >= 0.0 && jac <= 1.0, "jaccard out of range: {}", jac);
        let cos = cosine(s1, s2);
        assert!(cos >= 0.0 && cos <= 1.0, "cosine out of range: {}", cos);
        let sor = sorensen(s1, s2);
        assert!(sor >= 0.0 && sor <= 1.0, "sorensen out of range: {}", sor);
        let rat = ratcliff_obershelp(s1, s2);
        assert!(rat >= 0.0 && rat <= 1.0, "ratcliff out of range: {}", rat);

        assert_eq_u32("lev sym", levenshtein(s1, s2), levenshtein(s2, s1));
        assert_close("jaro sym", jaro(s1, s2), jaro(s2, s1), 0.001);
        assert_close("jaccard sym", jaccard(s1, s2), jaccard(s2, s1), 0.001);
        assert_close("cosine sym", cosine(s1, s2), cosine(s2, s1), 0.001);
    }

    println!("  All {} cases passed", CORRECTNESS_CASES.len());
}
