/// Naive string similarity: prefix, suffix, length.
///
/// Time: O(min(m, n)) for prefix/suffix, O(1) for length

pub fn prefix(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let max_len = a_bytes.len().max(b_bytes.len()) as f64;
    if max_len == 0.0 { return 1.0; }

    let min_len = a_bytes.len().min(b_bytes.len());
    let mut common = 0usize;
    while common < min_len && a_bytes[common] == b_bytes[common] {
        common += 1;
    }
    common as f64 / max_len
}

pub fn suffix(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let max_len = a_bytes.len().max(b_bytes.len()) as f64;
    if max_len == 0.0 { return 1.0; }

    let min_len = a_bytes.len().min(b_bytes.len());
    let mut common = 0usize;
    while common < min_len
        && a_bytes[a_bytes.len() - 1 - common] == b_bytes[b_bytes.len() - 1 - common]
    {
        common += 1;
    }
    common as f64 / max_len
}

pub fn length(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as f64;
    if max_len == 0.0 { return 1.0; }
    1.0 - (a.len() as f64 - b.len() as f64).abs() / max_len
}
