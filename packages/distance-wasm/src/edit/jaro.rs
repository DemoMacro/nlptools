/// Jaro and Jaro-Winkler similarity algorithms.
///
/// Time: O(m * n)

pub fn jaro(a: &str, b: &str) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 && b_len == 0 { return 1.0; }
    if a_len == 0 || b_len == 0 { return 0.0; }

    let max_len = a_len.max(b_len);
    let match_distance = if max_len <= 1 {
        if a_len == b_len && a_bytes == b_bytes { return 1.0; } else { return 0.0; }
    } else {
        max_len / 2 - 1
    };

    let mut a_matches = vec![false; a_len];
    let mut b_matches = vec![false; b_len];
    let mut matches = 0u32;
    let mut transpositions = 0u32;

    // Find matching characters
    for i in 0..a_len {
        let start = i.saturating_sub(match_distance);
        let end = (i + match_distance + 1).min(b_len);
        for j in start..end {
            if b_matches[j] || a_bytes[i] != b_bytes[j] { continue; }
            a_matches[i] = true;
            b_matches[j] = true;
            matches += 1;
            break;
        }
    }

    if matches == 0 { return 0.0; }

    // Count transpositions
    let mut k = 0usize;
    for i in 0..a_len {
        if !a_matches[i] { continue; }
        while !b_matches[k] { k += 1; }
        if a_bytes[i] != b_bytes[k] { transpositions += 1; }
        k += 1;
    }

    let m = matches as f64;
    (m / a_len as f64 + m / b_len as f64 + (m - transpositions as f64 / 2.0) / m) / 3.0
}

pub fn jaro_winkler(a: &str, b: &str) -> f64 {
    let p = 0.1;
    let max_prefix = 4;

    let jaro_score = jaro(a, b);

    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let min_len = a_bytes.len().min(b_bytes.len()).min(max_prefix);
    let mut l = 0usize;
    while l < min_len && a_bytes[l] == b_bytes[l] {
        l += 1;
    }

    jaro_score + l as f64 * p * (1.0 - jaro_score)
}
