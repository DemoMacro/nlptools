/// Hamming distance — counts character mismatches.
///
/// Time: O(min(m, n))

use crate::utils::normalize;

pub fn hamming(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let min_len = a_bytes.len().min(b_bytes.len());
    let mut count = (a_bytes.len() as i32 - b_bytes.len() as i32).unsigned_abs();

    for i in 0..min_len {
        if a_bytes[i] != b_bytes[i] {
            count += 1;
        }
    }

    count
}

pub fn hamming_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as u32;
    normalize(hamming(a, b), max_len)
}
