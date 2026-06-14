/// Overlap coefficient — set similarity normalized by the smaller set.
///
/// overlap(A, B) = |A ∩ B| / min(|A|, |B|)
/// Time: O(m + n)

pub fn overlap(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();

    let mut freq_a = [0u32; 128];
    let mut freq_b = [0u32; 128];

    if !crate::utils::build_char_freq(&mut freq_a, a_bytes) || !crate::utils::build_char_freq(&mut freq_b, b_bytes) {
        return overlap_fallback(a_bytes, b_bytes);
    }

    let intersection = crate::utils::intersect_count(&freq_a, &freq_b);
    let total_a = crate::utils::total_count(&freq_a);
    let total_b = crate::utils::total_count(&freq_b);

    if total_a == 0 && total_b == 0 { return 1.0; }
    if total_a == 0 || total_b == 0 { return 0.0; }
    intersection as f64 / total_a.min(total_b) as f64
}

fn overlap_fallback(a: &[u8], b: &[u8]) -> f64 {
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

    if total_a == 0 && total_b == 0 { return 1.0; }
    if total_a == 0 || total_b == 0 { return 0.0; }
    intersection as f64 / total_a.min(total_b) as f64
}
