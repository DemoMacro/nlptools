/// Bag distance — fast approximation of edit distance.
///
/// bag(a, b) = max(|a|, |b|) - |a ∩ b|
/// Time: O(m + n)

use crate::utils::{normalize, build_char_freq, intersect_count};

pub fn bag_distance(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();

    let mut freq_a = [0u32; 128];
    let mut freq_b = [0u32; 128];

    let intersection = if build_char_freq(&mut freq_a, a_bytes) && build_char_freq(&mut freq_b, b_bytes) {
        intersect_count(&freq_a, &freq_b)
    } else {
        // Non-ASCII fallback: simple byte multiset
        let mut fa = std::collections::HashMap::<u8, u32>::new();
        let mut fb = std::collections::HashMap::<u8, u32>::new();
        for &b in a_bytes { *fa.entry(b).or_insert(0) += 1; }
        for &b in b_bytes { *fb.entry(b).or_insert(0) += 1; }
        let mut count = 0u32;
        for (k, &v) in &fa {
            count += v.min(*fb.get(k).unwrap_or(&0));
        }
        count
    };

    (a_bytes.len().max(b_bytes.len()) as u32) - intersection
}

pub fn bag_distance_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as u32;
    normalize(bag_distance(a, b), max_len)
}
