/// Shared utilities for string distance algorithms.
///
/// All algorithms operate on `&[u8]` (ASCII bytes) for maximum performance.
/// Non-ASCII strings are handled by falling back to char-based operations where needed.

/// Normalize a distance to a similarity score in [0, 1].
#[inline]
pub fn normalize(distance: u32, max_distance: u32) -> f64 {
    if max_distance == 0 {
        1.0
    } else {
        1.0 - (distance as f64 / max_distance as f64)
    }
}

/// Build a character frequency array for ASCII bytes (0-127).
/// Returns false if any byte is >= 128.
#[inline]
pub fn build_char_freq(arr: &mut [u32; 128], s: &[u8]) -> bool {
    for &b in s {
        if b >= 128 {
            return false;
        }
        arr[b as usize] += 1;
    }
    true
}

/// Count intersection of two frequency arrays (multiset intersection).
#[inline]
pub fn intersect_count(a: &[u32; 128], b: &[u32; 128]) -> u32 {
    let mut count = 0u32;
    for i in 0..128 {
        count += a[i].min(b[i]);
    }
    count
}

/// Count union of two frequency arrays (multiset union).
#[inline]
pub fn union_count(a: &[u32; 128], b: &[u32; 128]) -> u32 {
    let mut count = 0u32;
    for i in 0..128 {
        count += a[i].max(b[i]);
    }
    count
}

/// Total count of all values in a frequency array.
#[inline]
pub fn total_count(arr: &[u32; 128]) -> u32 {
    arr.iter().sum()
}
