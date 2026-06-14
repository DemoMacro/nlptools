/// Monge-Elkan similarity — asymmetric token-based similarity.
///
/// For each token in A, finds the best matching token in B using
/// an inner similarity function, then averages those best scores.
///
/// Time: O(n * m * k) where n, m = token counts, k = inner algorithm cost

use crate::edit::levenshtein::levenshtein_normalized;

pub fn monge_elkan(a: &str, b: &str) -> f64 {
    monge_elkan_inner(a, b, levenshtein_normalized)
}

#[allow(dead_code)]
pub fn monge_elkan_with_fn(a: &str, b: &str, inner_fn: fn(&str, &str) -> f64) -> f64 {
    monge_elkan_inner(a, b, inner_fn)
}

fn monge_elkan_inner(a: &str, b: &str, inner_fn: fn(&str, &str) -> f64) -> f64 {
    let tokens_a: Vec<&str> = a.split_whitespace().collect();
    let tokens_b: Vec<&str> = b.split_whitespace().collect();

    if tokens_a.is_empty() && tokens_b.is_empty() { return 1.0; }
    if tokens_a.is_empty() || tokens_b.is_empty() { return 0.0; }

    let mut sum = 0.0;
    for t_a in &tokens_a {
        let mut best = 0.0f64;
        for t_b in &tokens_b {
            let sim = inner_fn(t_a, t_b);
            if sim > best { best = sim; }
        }
        sum += best;
    }

    sum / tokens_a.len() as f64
}

pub fn monge_elkan_symmetric(a: &str, b: &str) -> f64 {
    (monge_elkan(a, b) + monge_elkan(b, a)) / 2.0
}
