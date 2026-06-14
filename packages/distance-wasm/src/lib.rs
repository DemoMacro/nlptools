use wasm_bindgen::prelude::*;

pub mod edit;
pub mod search;
pub mod token;
pub mod utils;

#[cfg(feature = "console_error_panic_hook")]
#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

// ============================================================================
// Edit Distance
// ============================================================================

#[wasm_bindgen]
pub fn levenshtein(s1: &str, s2: &str) -> u32 { edit::levenshtein(s1, s2) }

#[wasm_bindgen]
pub fn levenshtein_normalized(s1: &str, s2: &str) -> f64 { edit::levenshtein_normalized(s1, s2) }

#[wasm_bindgen]
pub fn damerau_levenshtein(s1: &str, s2: &str) -> u32 { edit::damerau_levenshtein(s1, s2) }

#[wasm_bindgen]
pub fn damerau_levenshtein_normalized(s1: &str, s2: &str) -> f64 { edit::damerau_levenshtein_normalized(s1, s2) }

#[wasm_bindgen]
pub fn jaro(s1: &str, s2: &str) -> f64 { edit::jaro(s1, s2) }

#[wasm_bindgen]
pub fn jarowinkler(s1: &str, s2: &str) -> f64 { edit::jaro_winkler(s1, s2) }

#[wasm_bindgen]
pub fn hamming(s1: &str, s2: &str) -> u32 { edit::hamming(s1, s2) }

#[wasm_bindgen]
pub fn hamming_normalized(s1: &str, s2: &str) -> f64 { edit::hamming_normalized(s1, s2) }

#[wasm_bindgen]
pub fn sift4_simple(s1: &str, s2: &str) -> u32 { edit::sift4_simple(s1, s2) }

#[wasm_bindgen]
pub fn sift4_simple_normalized(s1: &str, s2: &str) -> f64 { edit::sift4_simple_normalized(s1, s2) }

// ============================================================================
// Sequence-based
// ============================================================================

#[wasm_bindgen]
pub fn lcs_seq(s1: &str, s2: &str) -> u32 { edit::lcs_seq(s1, s2) }

#[wasm_bindgen]
pub fn lcs_seq_normalized(s1: &str, s2: &str) -> f64 { edit::lcs_seq_normalized(s1, s2) }

#[wasm_bindgen]
pub fn lcs_str(s1: &str, s2: &str) -> u32 { edit::lcs_str(s1, s2) }

#[wasm_bindgen]
pub fn lcs_str_normalized(s1: &str, s2: &str) -> f64 { edit::lcs_str_normalized(s1, s2) }

#[wasm_bindgen]
pub fn ratcliff_obershelp(s1: &str, s2: &str) -> f64 { edit::ratcliff_obershelp(s1, s2) }

#[wasm_bindgen]
pub fn smith_waterman(s1: &str, s2: &str) -> u32 { edit::smith_waterman(s1, s2) }

#[wasm_bindgen]
pub fn smith_waterman_normalized(s1: &str, s2: &str) -> f64 { edit::smith_waterman_normalized(s1, s2) }

#[wasm_bindgen]
pub fn needleman_wunsch(s1: &str, s2: &str) -> i32 { edit::needleman_wunsch(s1, s2) }

#[wasm_bindgen]
pub fn needleman_wunsch_normalized(s1: &str, s2: &str) -> f64 { edit::needleman_wunsch_normalized(s1, s2) }

#[wasm_bindgen]
pub fn gotoh(s1: &str, s2: &str) -> f64 { edit::gotoh(s1, s2) }

#[wasm_bindgen]
pub fn gotoh_normalized(s1: &str, s2: &str) -> f64 { edit::gotoh_normalized(s1, s2) }

#[wasm_bindgen]
pub fn monge_elkan(s1: &str, s2: &str) -> f64 { edit::monge_elkan(s1, s2) }

#[wasm_bindgen]
pub fn monge_elkan_symmetric(s1: &str, s2: &str) -> f64 { edit::monge_elkan_symmetric(s1, s2) }

#[wasm_bindgen]
pub fn bag_distance(s1: &str, s2: &str) -> u32 { edit::bag_distance(s1, s2) }

#[wasm_bindgen]
pub fn bag_distance_normalized(s1: &str, s2: &str) -> f64 { edit::bag_distance_normalized(s1, s2) }

#[wasm_bindgen]
pub fn mra(s1: &str, s2: &str) -> u32 { edit::mra(s1, s2) }

#[wasm_bindgen]
pub fn mra_normalized(s1: &str, s2: &str) -> f64 { edit::mra_normalized(s1, s2) }

// ============================================================================
// Token Similarity
// ============================================================================

#[wasm_bindgen]
pub fn jaccard(s1: &str, s2: &str) -> f64 { token::jaccard(s1, s2) }

#[wasm_bindgen]
pub fn cosine(s1: &str, s2: &str) -> f64 { token::cosine(s1, s2) }

#[wasm_bindgen]
pub fn sorensen(s1: &str, s2: &str) -> f64 { token::sorensen(s1, s2) }

#[wasm_bindgen]
pub fn tversky(s1: &str, s2: &str) -> f64 { token::tversky(s1, s2) }

#[wasm_bindgen]
pub fn overlap(s1: &str, s2: &str) -> f64 { token::overlap(s1, s2) }

#[wasm_bindgen]
pub fn jaccard_bigram(s1: &str, s2: &str) -> f64 { token::jaccard_bigram(s1, s2) }

#[wasm_bindgen]
pub fn cosine_bigram(s1: &str, s2: &str) -> f64 { token::cosine_bigram(s1, s2) }

// ============================================================================
// Naive
// ============================================================================

#[wasm_bindgen]
pub fn prefix(s1: &str, s2: &str) -> f64 { token::prefix(s1, s2) }

#[wasm_bindgen]
pub fn suffix(s1: &str, s2: &str) -> f64 { token::suffix(s1, s2) }

#[wasm_bindgen]
pub fn length(s1: &str, s2: &str) -> f64 { token::length(s1, s2) }

// ============================================================================
// Universal compare
// ============================================================================

#[wasm_bindgen]
pub fn compare(s1: &str, s2: &str, algorithm: &str) -> f64 {
    match algorithm.to_lowercase().as_str() {
        "levenshtein" => levenshtein_normalized(s1, s2),
        "damerau_levenshtein" | "damerau-levenshtein" => damerau_levenshtein_normalized(s1, s2),
        "jaro" => jaro(s1, s2),
        "jaro_winkler" | "jaro-winkler" | "jarowinkler" => jarowinkler(s1, s2),
        "hamming" => hamming_normalized(s1, s2),
        "sift4" | "sift4_simple" => sift4_simple_normalized(s1, s2),
        "lcs_seq" | "lcs-seq" | "lcsseq" => lcs_seq_normalized(s1, s2),
        "lcs_str" | "lcs-str" | "lcsstr" => lcs_str_normalized(s1, s2),
        "ratcliff_obershelp" | "ratcliff-obershelp" => ratcliff_obershelp(s1, s2),
        "smith_waterman" | "smith-waterman" => smith_waterman_normalized(s1, s2),
        "needleman_wunsch" | "needleman-wunsch" => needleman_wunsch_normalized(s1, s2),
        "gotoh" => gotoh_normalized(s1, s2),
        "monge_elkan" | "monge-elkan" => monge_elkan(s1, s2),
        "bag_distance" | "bag-distance" => bag_distance_normalized(s1, s2),
        "mra" => mra_normalized(s1, s2),
        "jaccard" => jaccard(s1, s2),
        "cosine" => cosine(s1, s2),
        "sorensen" | "dice" | "sorensen_dice" => sorensen(s1, s2),
        "tversky" => tversky(s1, s2),
        "overlap" => overlap(s1, s2),
        "prefix" => prefix(s1, s2),
        "suffix" => suffix(s1, s2),
        "length" => length(s1, s2),
        "jaccard_bigram" | "jaccard-bigram" => jaccard_bigram(s1, s2),
        "cosine_bigram" | "cosine-bigram" => cosine_bigram(s1, s2),
        _ => levenshtein_normalized(s1, s2),
    }
}
