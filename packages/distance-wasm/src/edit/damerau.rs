/// Damerau-Levenshtein distance (unrestricted variant).
///
/// Implements the algorithm from Lowrance & Wagner (1975) as described on Wikipedia.
/// Allows transpositions of adjacent characters, even when substrings are edited multiple times.
///
/// Time: O(m * n), Space: O(m * n)

use crate::utils::normalize;

pub fn damerau_levenshtein(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 { return b_len as u32; }
    if b_len == 0 { return a_len as u32; }

    let max_dist = (a_len + b_len) as u32;
    let w = b_len + 2;
    let mut d = vec![0u32; (a_len + 2) * w];

    // Initialize borders (Wikipedia indices -1..a_len, -1..b_len)
    // Our mapping: Wikipedia d[i,j] = d[(i+1)*w + (j+1)]
    d[0] = max_dist;
    for i in 0..=a_len {
        d[(i + 1) * w] = max_dist;
        d[(i + 1) * w + 1] = i as u32;
    }
    for j in 0..=b_len {
        d[j + 1] = max_dist;
        d[w + j + 1] = j as u32;
    }

    // da[c] = last row (1-indexed) where character c appeared in A
    let mut da = [0usize; 128];

    for i in 0..a_len {
        let a_char = a_bytes[i];
        let i1 = i + 1; // 1-indexed

        // db = last column (1-indexed) where a[i] appeared in B (before current j)
        let mut db = 0usize;

        for j in 0..b_len {
            let b_char = b_bytes[j];
            let j1 = j + 1; // 1-indexed

            // k = last row where b[j] appeared in A (1-indexed, 0 if never)
            let k = if b_char < 128 { da[b_char as usize] } else { 0 };
            // l = db = last column where a[i] appeared in B before j (1-indexed, 0 if never)
            let l = db;

            let cost = if a_char == b_char { 0 } else { 1 };

            if a_char == b_char {
                db = j1;
            }

            // Wikipedia mapping: d[i,j] = d[(i+1)*w + (j+1)]
            let sub = d[i1 * w + j1] + cost;
            let ins = d[i1 * w + (j1 + 1)] + 1;
            let del = d[(i1 + 1) * w + j1] + 1;
            // Transposition: d[k-1, l-1] + (i-k-1) + 1 + (j-l-1)
            // = d[(k-1+1)*w + (l-1+1)] + i + j - k - l + 1
            // = d[k*w + l] + i1 + j1 - k - l - 1
            let trans = d[k * w + l] + i1 as u32 + j1 as u32 - k as u32 - l as u32 - 1;

            d[(i1 + 1) * w + (j1 + 1)] = sub.min(ins).min(del).min(trans);
        }

        if a_char < 128 { da[a_char as usize] = i1; }
    }

    d[(a_len + 1) * w + (b_len + 1)]
}

pub fn damerau_levenshtein_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as u32;
    normalize(damerau_levenshtein(a, b), max_len)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_damerau_basic() {
        assert_eq!(damerau_levenshtein("", ""), 0);
        assert_eq!(damerau_levenshtein("abc", ""), 3);
        assert_eq!(damerau_levenshtein("", "abc"), 3);
        assert_eq!(damerau_levenshtein("abc", "abc"), 0);
    }

    #[test]
    fn test_damerau_transposition() {
        // Adjacent transposition
        assert_eq!(damerau_levenshtein("abc", "acb"), 1);
        assert_eq!(damerau_levenshtein("ab", "ba"), 1);
        assert_eq!(damerau_levenshtein("ca", "abc"), 2); // Wikipedia example
    }

    #[test]
    fn test_damerau_no_transposition() {
        // Non-adjacent: should be 2, not 1
        assert_eq!(damerau_levenshtein("abc", "cba"), 2);
    }

    #[test]
    fn test_damerau_normalized() {
        assert_eq!(damerau_levenshtein_normalized("", ""), 1.0);
        assert!((damerau_levenshtein_normalized("abc", "acb") - 0.6667).abs() < 0.01);
    }
}
