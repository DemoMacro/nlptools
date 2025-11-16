use textdistance::Algorithm;
use wasm_bindgen::prelude::*;

mod myers;

// ============================================================================
// Edit-based Algorithms
// ============================================================================

// Levenshtein distance - Standard edit distance algorithm
#[wasm_bindgen]
pub fn levenshtein(s1: &str, s2: &str) -> u32 {
    textdistance::str::levenshtein(s1, s2) as u32
}

#[wasm_bindgen]
pub fn levenshtein_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::levenshtein(s1, s2)
}

// Damerau-Levenshtein distance - Edit distance with character transposition
#[wasm_bindgen]
pub fn damerau_levenshtein(s1: &str, s2: &str) -> u32 {
    textdistance::str::damerau_levenshtein(s1, s2) as u32
}

#[wasm_bindgen]
pub fn damerau_levenshtein_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::damerau_levenshtein(s1, s2)
}

// Jaro similarity - Suitable for short string matching
#[wasm_bindgen]
pub fn jaro(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::jaro(s1, s2)
}

// Jaro-Winkler similarity - Improved version of Jaro with prefix weighting
#[wasm_bindgen]
pub fn jarowinkler(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::jaro_winkler(s1, s2)
}

// Hamming distance - Replacement distance for equal-length strings
#[wasm_bindgen]
pub fn hamming(s1: &str, s2: &str) -> u32 {
    textdistance::str::hamming(s1, s2) as u32
}

#[wasm_bindgen]
pub fn hamming_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::hamming(s1, s2)
}

// Sift4 algorithm - Fast approximate string comparison
#[wasm_bindgen]
pub fn sift4_simple(s1: &str, s2: &str) -> u32 {
    textdistance::str::sift4_simple(s1, s2) as u32
}

#[wasm_bindgen]
pub fn sift4_simple_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::sift4_simple(s1, s2)
}

// Myers algorithm - Efficient bit-parallel edit distance
#[wasm_bindgen]
pub fn myers_levenshtein(s1: &str, s2: &str) -> u32 {
    myers::myers_distance(s1, s2)
}

#[wasm_bindgen]
pub fn myers_levenshtein_normalized(s1: &str, s2: &str) -> f64 {
    myers::myers_similarity(s1, s2)
}

// ============================================================================
// Sequence-based Algorithms
// ============================================================================

// Longest Common Subsequence (LCS) - Non-contiguous
#[wasm_bindgen]
pub fn lcs_seq(s1: &str, s2: &str) -> u32 {
    textdistance::str::lcsseq(s1, s2) as u32
}

#[wasm_bindgen]
pub fn lcs_seq_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::lcsseq(s1, s2)
}

// Longest Common Substring (LCSstr) - Contiguous
#[wasm_bindgen]
pub fn lcs_str(s1: &str, s2: &str) -> u32 {
    textdistance::str::lcsstr(s1, s2) as u32
}

#[wasm_bindgen]
pub fn lcs_str_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::lcsstr(s1, s2)
}

// Ratcliff-Obershelp algorithm - Gestalt pattern matching
#[wasm_bindgen]
pub fn ratcliff_obershelp(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::ratcliff_obershelp(s1, s2)
}

// ============================================================================
// Token-based Algorithms
// ============================================================================

// Jaccard similarity - Set intersection/union
#[wasm_bindgen]
pub fn jaccard(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::jaccard(s1, s2)
}

// Cosine similarity - Vector angle cosine
#[wasm_bindgen]
pub fn cosine(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::cosine(s1, s2)
}

// Sorensen-Dice 相似度
#[wasm_bindgen]
pub fn sorensen(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::sorensen_dice(s1, s2)
}

// Tversky index - Asymmetric similarity measure
#[wasm_bindgen]
pub fn tversky(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::tversky(s1, s2)
}

// Smith-Waterman algorithm - Local sequence alignment
#[wasm_bindgen]
pub fn smith_waterman(s1: &str, s2: &str) -> u32 {
    textdistance::str::smith_waterman(s1, s2) as u32
}

#[wasm_bindgen]
pub fn smith_waterman_normalized(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::smith_waterman(s1, s2)
}

// Overlap coefficient - Overlap coefficient
#[wasm_bindgen]
pub fn overlap(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::overlap(s1, s2)
}

// ============================================================================
// Naive Algorithms
// ============================================================================

// Prefix similarity - Prefix matching
#[wasm_bindgen]
pub fn prefix(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::prefix(s1, s2)
}

// Suffix similarity - Suffix matching
#[wasm_bindgen]
pub fn suffix(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::suffix(s1, s2)
}

// Length similarity - Length difference
#[wasm_bindgen]
pub fn length(s1: &str, s2: &str) -> f64 {
    textdistance::nstr::length(s1, s2)
}

// ============================================================================
// Bigram Algorithms - Character pair based comparison
// ============================================================================

// Jaccard Bigram similarity
#[wasm_bindgen]
pub fn jaccard_bigram(s1: &str, s2: &str) -> f64 {
    let jaccard = textdistance::Jaccard::default();
    let result = jaccard.for_bigrams(s1, s2);
    result.nsim()
}

// Cosine Bigram similarity
#[wasm_bindgen]
pub fn cosine_bigram(s1: &str, s2: &str) -> f64 {
    let cosine = textdistance::Cosine::default();
    let result = cosine.for_bigrams(s1, s2);
    result.nsim()
}

// ============================================================================
// Universal comparison function - Call different algorithms by name
// ============================================================================

#[wasm_bindgen]
pub fn compare(s1: &str, s2: &str, algorithm: &str) -> f64 {
    match algorithm.to_lowercase().as_str() {
        "levenshtein" => textdistance::nstr::levenshtein(s1, s2),
        "damerau_levenshtein" | "damerau-levenshtein" => {
            textdistance::nstr::damerau_levenshtein(s1, s2)
        }
        "jaro" => textdistance::nstr::jaro(s1, s2),
        "jaro_winkler" | "jaro-winkler" | "jarowinkler" => textdistance::nstr::jaro_winkler(s1, s2),
        "hamming" => textdistance::nstr::hamming(s1, s2),
        "sift4" | "sift4_simple" => textdistance::nstr::sift4_simple(s1, s2),
        "myers" | "myers_levenshtein" | "myers-levenshtein" => myers::myers_similarity(s1, s2),
        "lcs_seq" | "lcs-seq" | "lcsseq" => textdistance::nstr::lcsseq(s1, s2),
        "lcs_str" | "lcs-str" | "lcsstr" => textdistance::nstr::lcsstr(s1, s2),
        "ratcliff_obershelp" | "ratcliff-obershelp" => {
            textdistance::nstr::ratcliff_obershelp(s1, s2)
        }
        "jaccard" => textdistance::nstr::jaccard(s1, s2),
        "cosine" => textdistance::nstr::cosine(s1, s2),
        "sorensen" | "dice" | "sorensen_dice" => textdistance::nstr::sorensen_dice(s1, s2),
        "tversky" => textdistance::nstr::tversky(s1, s2),
        "overlap" => textdistance::nstr::overlap(s1, s2),
        "prefix" => textdistance::nstr::prefix(s1, s2),
        "suffix" => textdistance::nstr::suffix(s1, s2),
        "length" => textdistance::nstr::length(s1, s2),
        "jaccard_bigram" | "jaccard-bigram" => {
            let jaccard = textdistance::Jaccard::default();
            jaccard.for_bigrams(s1, s2).nsim()
        }
        "cosine_bigram" | "cosine-bigram" => {
            let cosine = textdistance::Cosine::default();
            cosine.for_bigrams(s1, s2).nsim()
        }
        "smith_waterman" | "smith-waterman" => textdistance::nstr::smith_waterman(s1, s2),
        _ => textdistance::nstr::levenshtein(s1, s2), // Default to Levenshtein
    }
}
