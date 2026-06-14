/// Tversky index — asymmetric set similarity.
///
/// T(A, B; α, β) = |A ∩ B| / (|A ∩ B| + α|A \ B| + β|B \ A|)
/// Default: α = β = 1 (same as Jaccard)
/// Time: O(m + n)

pub fn tversky(a: &str, b: &str) -> f64 {
    tversky_with_params(a, b, 1.0, 1.0)
}

pub fn tversky_with_params(a: &str, b: &str, alpha: f64, beta: f64) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();

    let mut freq_a = [0u32; 128];
    let mut freq_b = [0u32; 128];

    if !crate::utils::build_char_freq(&mut freq_a, a_bytes) || !crate::utils::build_char_freq(&mut freq_b, b_bytes) {
        return tversky_fallback(a_bytes, b_bytes, alpha, beta);
    }

    let intersection = crate::utils::intersect_count(&freq_a, &freq_b);
    let total_a = crate::utils::total_count(&freq_a);
    let total_b = crate::utils::total_count(&freq_b);

    let only_a = total_a - intersection;
    let only_b = total_b - intersection;
    let denominator = intersection as f64 + alpha * only_a as f64 + beta * only_b as f64;
    if denominator == 0.0 { 1.0 } else { intersection as f64 / denominator }
}

fn tversky_fallback(a: &[u8], b: &[u8], alpha: f64, beta: f64) -> f64 {
    let mut fa = std::collections::HashMap::<u8, u32>::new();
    let mut fb = std::collections::HashMap::<u8, u32>::new();
    for &c in a { *fa.entry(c).or_insert(0) += 1; }
    for &c in b { *fb.entry(c).or_insert(0) += 1; }

    let (smaller, larger) = if fa.len() <= fb.len() { (&fa, &fb) } else { (&fb, &fa) };
    let mut intersection = 0u32;
    for (k, &v) in smaller {
        if let Some(&w) = larger.get(k) { intersection += v.min(w); }
    }
    let total_a: u32 = fa.values().sum();
    let total_b: u32 = fb.values().sum();

    let only_a = total_a - intersection;
    let only_b = total_b - intersection;
    let denominator = intersection as f64 + alpha * only_a as f64 + beta * only_b as f64;
    if denominator == 0.0 { 1.0 } else { intersection as f64 / denominator }
}
