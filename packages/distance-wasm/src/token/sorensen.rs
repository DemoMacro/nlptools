/// Sørensen-Dice coefficient — character multiset.
///
/// DSC(A, B) = 2 * |A ∩ B| / (|A| + |B|)
/// Time: O(m + n)

pub fn sorensen(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();

    let mut freq_a = [0u32; 128];
    let mut freq_b = [0u32; 128];

    if !crate::utils::build_char_freq(&mut freq_a, a_bytes) || !crate::utils::build_char_freq(&mut freq_b, b_bytes) {
        return sorensen_fallback(a_bytes, b_bytes);
    }

    let ic = crate::utils::intersect_count(&freq_a, &freq_b);
    let total = a_bytes.len() as u32 + b_bytes.len() as u32;
    if total == 0 { 1.0 } else { 2.0 * ic as f64 / total as f64 }
}

fn sorensen_fallback(a: &[u8], b: &[u8]) -> f64 {
    let mut fa = std::collections::HashMap::<u8, u32>::new();
    let mut fb = std::collections::HashMap::<u8, u32>::new();
    for &c in a { *fa.entry(c).or_insert(0) += 1; }
    for &c in b { *fb.entry(c).or_insert(0) += 1; }

    let (smaller, larger) = if fa.len() <= fb.len() { (&fa, &fb) } else { (&fb, &fa) };
    let mut ic = 0u32;
    for (k, &v) in smaller {
        if let Some(&w) = larger.get(k) { ic += v.min(w); }
    }
    let total = a.len() as u32 + b.len() as u32;
    if total == 0 { 1.0 } else { 2.0 * ic as f64 / total as f64 }
}
