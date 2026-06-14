/// Jaccard similarity — character multiset intersection/union.
///
/// Uses ASCII fast path with frequency arrays.
/// Time: O(m + n)

pub fn jaccard(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();

    let mut freq_a = [0u32; 128];
    let mut freq_b = [0u32; 128];

    if !crate::utils::build_char_freq(&mut freq_a, a_bytes) || !crate::utils::build_char_freq(&mut freq_b, b_bytes) {
        return jaccard_fallback(a_bytes, b_bytes);
    }

    let ic = crate::utils::intersect_count(&freq_a, &freq_b);
    let uc = crate::utils::union_count(&freq_a, &freq_b);

    if uc == 0 { 1.0 } else { ic as f64 / uc as f64 }
}

fn jaccard_fallback(a: &[u8], b: &[u8]) -> f64 {
    let mut fa = std::collections::HashMap::<u8, u32>::new();
    let mut fb = std::collections::HashMap::<u8, u32>::new();
    for &c in a { *fa.entry(c).or_insert(0) += 1; }
    for &c in b { *fb.entry(c).or_insert(0) += 1; }

    let (smaller, larger) = if fa.len() <= fb.len() { (&fa, &fb) } else { (&fb, &fa) };
    let mut ic = 0u32;
    let mut only_smaller = 0u32;
    for (k, &v) in smaller {
        if let Some(&w) = larger.get(k) { ic += v.min(w); only_smaller += v.max(w) - v.min(w); }
        else { only_smaller += v; }
    }
    let mut only_larger = 0u32;
    for (k, &v) in larger {
        if !smaller.contains_key(k) { only_larger += v; }
    }
    let uc = ic + only_smaller + only_larger;
    if uc == 0 { 1.0 } else { ic as f64 / uc as f64 }
}

/// Jaccard on character bigrams.
pub fn jaccard_bigram(a: &str, b: &str) -> f64 {
    bigram_similarity(a, b, |ic, ua, ub| {
        let uc = ua + ub - ic;
        if uc == 0 { 1.0 } else { ic as f64 / uc as f64 }
    })
}

/// Build bigram frequency map (integer-encoded for ASCII).
fn bigram_freq(s: &[u8]) -> std::collections::HashMap<u32, u32> {
    let mut map = std::collections::HashMap::new();
    if s.len() < 2 { return map; }
    for i in 0..s.len() - 1 {
        let key = ((s[i] as u32) << 8) | (s[i + 1] as u32);
        *map.entry(key).or_insert(0) += 1;
    }
    map
}

pub fn bigram_similarity(a: &str, b: &str, score_fn: fn(u32, u32, u32) -> f64) -> f64 {
    let fa = bigram_freq(a.as_bytes());
    let fb = bigram_freq(b.as_bytes());

    let (smaller, larger) = if fa.len() <= fb.len() { (&fa, &fb) } else { (&fb, &fa) };
    let mut ic = 0u32;
    for (k, &v) in smaller {
        if let Some(&w) = larger.get(k) { ic += v.min(w); }
    }
    let ua: u32 = fa.values().sum();
    let ub: u32 = fb.values().sum();

    score_fn(ic, ua, ub)
}
