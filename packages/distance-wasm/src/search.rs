/// FuzzySearch — Rust equivalent of the TS FuzzySearch class.
///
/// Operates on string arrays with configurable similarity algorithm and threshold.
/// For object arrays, the JS wrapper extracts string values and passes them as
/// flat arrays with per-key weights.

use wasm_bindgen::prelude::*;

use crate::edit::*;
use crate::token::*;

// ============================================================================
// Similarity algorithm enum
// ============================================================================

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum Algorithm {
    Levenshtein,
    Jaro,
    JaroWinkler,
    Hamming,
    Sift4,
    LcsSeq,
    LcsStr,
    Ratcliff,
    SmithWaterman,
    NeedlemanWunsch,
    Gotoh,
    BagDistance,
    Mra,
    Jaccard,
    Cosine,
    Sorensen,
    Tversky,
    Overlap,
    JaccardBigram,
    CosineBigram,
}

fn apply_algorithm(algo: Algorithm, a: &str, b: &str) -> f64 {
    match algo {
        Algorithm::Levenshtein => levenshtein_normalized(a, b),
        Algorithm::Jaro => jaro(a, b),
        Algorithm::JaroWinkler => jaro_winkler(a, b),
        Algorithm::Hamming => hamming_normalized(a, b),
        Algorithm::Sift4 => sift4_simple_normalized(a, b),
        Algorithm::LcsSeq => lcs_seq_normalized(a, b),
        Algorithm::LcsStr => lcs_str_normalized(a, b),
        Algorithm::Ratcliff => ratcliff_obershelp(a, b),
        Algorithm::SmithWaterman => smith_waterman_normalized(a, b),
        Algorithm::NeedlemanWunsch => needleman_wunsch_normalized(a, b),
        Algorithm::Gotoh => gotoh_normalized(a, b),
        Algorithm::BagDistance => bag_distance_normalized(a, b),
        Algorithm::Mra => mra_normalized(a, b),
        Algorithm::Jaccard => jaccard(a, b),
        Algorithm::Cosine => cosine(a, b),
        Algorithm::Sorensen => sorensen(a, b),
        Algorithm::Tversky => tversky(a, b),
        Algorithm::Overlap => overlap(a, b),
        Algorithm::JaccardBigram => jaccard_bigram(a, b),
        Algorithm::CosineBigram => cosine_bigram(a, b),
    }
}

// ============================================================================
// SearchResult — returned to JS
// ============================================================================

#[wasm_bindgen]
pub struct SearchResult {
    index: u32,
    score: f64,
}

#[wasm_bindgen]
impl SearchResult {
    #[wasm_bindgen(getter)]
    pub fn index(&self) -> u32 { self.index }

    #[wasm_bindgen(getter)]
    pub fn score(&self) -> f64 { self.score }
}

// ============================================================================
// FuzzySearch — main search engine
// ============================================================================

#[wasm_bindgen]
pub struct FuzzySearch {
    items: Vec<String>,
    algo: Algorithm,
    threshold: f64,
    case_sensitive: bool,
}

#[wasm_bindgen]
impl FuzzySearch {
    /// Create a new FuzzySearch for a string array.
    #[wasm_bindgen(constructor)]
    pub fn new(items: Vec<String>, algo: Algorithm, threshold: f64, case_sensitive: bool) -> Self {
        FuzzySearch { items, algo, threshold, case_sensitive }
    }

    /// Search for items similar to the query.
    /// Returns results sorted by score descending, filtered by threshold.
    #[wasm_bindgen]
    pub fn search(&self, query: &str, limit: Option<u32>) -> Vec<SearchResult> {
        let q = if self.case_sensitive { query.to_string() } else { query.to_lowercase() };
        let effective_limit = limit.unwrap_or(u32::MAX) as usize;

        let mut results: Vec<SearchResult> = Vec::new();

        for (i, item) in self.items.iter().enumerate() {
            let item_str = if self.case_sensitive { item.clone() } else { item.to_lowercase() };
            let score = apply_algorithm(self.algo, &q, &item_str);
            if score >= self.threshold {
                results.push(SearchResult { index: i as u32, score });
            }
        }

        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
        results.truncate(effective_limit);
        results
    }

    /// Get the number of items in the collection.
    #[wasm_bindgen(getter)]
    pub fn size(&self) -> u32 { self.items.len() as u32 }

    /// Replace the collection.
    #[wasm_bindgen]
    pub fn set_items(&mut self, items: Vec<String>) { self.items = items; }

    /// Add an item to the collection.
    #[wasm_bindgen]
    pub fn add(&mut self, item: String) { self.items.push(item); }

    /// Clear the collection.
    #[wasm_bindgen]
    pub fn clear(&mut self) { self.items.clear(); }
}

// ============================================================================
// Multi-key FuzzySearch for object arrays
// ============================================================================

/// Multi-key search result with per-key scores.
#[wasm_bindgen]
pub struct MultiKeySearchResult {
    index: u32,
    score: f64,
    key_scores: Vec<f64>,
}

#[wasm_bindgen]
impl MultiKeySearchResult {
    #[wasm_bindgen(getter)]
    pub fn index(&self) -> u32 { self.index }

    #[wasm_bindgen(getter)]
    pub fn score(&self) -> f64 { self.score }

    /// Get per-key scores as a flat array.
    #[wasm_bindgen]
    pub fn key_scores(&self) -> Vec<f64> { self.key_scores.clone() }
}

/// Multi-key fuzzy search for object arrays.
/// The JS wrapper extracts string values from objects and passes them as flat arrays.
///
/// For example, given objects with keys ["title", "author"]:
/// - `key_values` = ["title1", "author1", "title2", "author2", ...]
/// - `num_keys` = 2
/// - `weights` = [0.7, 0.3]
#[wasm_bindgen]
pub struct MultiKeyFuzzySearch {
    /// Flat array of string values, row-major: [item0_key0, item0_key1, item1_key0, ...]
    key_values: Vec<String>,
    num_keys: usize,
    num_items: usize,
    weights: Vec<f64>,
    algo: Algorithm,
    threshold: f64,
    case_sensitive: bool,
}

#[wasm_bindgen]
impl MultiKeyFuzzySearch {
    /// Create a new multi-key search.
    ///
    /// `key_values`: flat array of extracted string values (num_items * num_keys)
    /// `num_keys`: number of keys per item
    /// `weights`: weight per key (will be normalized to sum to 1)
    #[wasm_bindgen(constructor)]
    pub fn new(
        key_values: Vec<String>,
        num_keys: u32,
        weights: Vec<f64>,
        algo: Algorithm,
        threshold: f64,
        case_sensitive: bool,
    ) -> Self {
        let nk = num_keys as usize;
        let ni = if nk > 0 { key_values.len() / nk } else { 0 };

        // Normalize weights
        let total: f64 = weights.iter().sum();
        let normalized: Vec<f64> = if total > 0.0 {
            weights.iter().map(|w| w / total).collect()
        } else {
            vec![1.0 / nk as f64; nk]
        };

        MultiKeyFuzzySearch {
            key_values,
            num_keys: nk,
            num_items: ni,
            weights: normalized,
            algo,
            threshold,
            case_sensitive,
        }
    }

    /// Search with per-key scoring.
    #[wasm_bindgen]
    pub fn search(&self, query: &str, limit: Option<u32>) -> Vec<MultiKeySearchResult> {
        let q = if self.case_sensitive { query.to_string() } else { query.to_lowercase() };
        let effective_limit = limit.unwrap_or(u32::MAX) as usize;

        let mut results: Vec<MultiKeySearchResult> = Vec::new();

        for i in 0..self.num_items {
            let mut score = 0.0;
            let mut key_scores = Vec::with_capacity(self.num_keys);

            for k in 0..self.num_keys {
                let val = &self.key_values[i * self.num_keys + k];
                let item_str = if self.case_sensitive { val.clone() } else { val.to_lowercase() };
                let s = apply_algorithm(self.algo, &q, &item_str);
                key_scores.push(s);
                score += self.weights[k] * s;
            }

            if score >= self.threshold {
                results.push(MultiKeySearchResult { index: i as u32, score, key_scores });
            }
        }

        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
        results.truncate(effective_limit);
        results
    }

    #[wasm_bindgen(getter)]
    pub fn size(&self) -> u32 { self.num_items as u32 }
}

// ============================================================================
// find_best_match — one-shot convenience function
// ============================================================================

/// Find the single best match for a query against a string collection.
/// Returns (index, score) or (-1, 0.0) if nothing meets the threshold.
#[wasm_bindgen]
pub fn find_best_match(
    query: &str,
    items: Vec<String>,
    algo: Algorithm,
    threshold: f64,
    case_sensitive: bool,
) -> SearchResult {
    let q = if case_sensitive { query.to_string() } else { query.to_lowercase() };

    let mut best_idx: u32 = u32::MAX;
    let mut best_score = 0.0f64;

    for (i, item) in items.iter().enumerate() {
        let item_str = if case_sensitive { item.clone() } else { item.to_lowercase() };
        let score = apply_algorithm(algo, &q, &item_str);
        if score >= threshold && score > best_score {
            best_score = score;
            best_idx = i as u32;
        }
    }

    SearchResult { index: best_idx, score: best_score }
}
