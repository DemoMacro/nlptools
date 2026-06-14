/// Longest Common Subsequence (LCS) — non-contiguous.
///
/// Uses standard DP with O(min(m,n)) space.
///
/// Time: O(m * n), Space: O(min(m, n))

pub fn lcs_seq(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 || b_len == 0 { return 0; }

    // Ensure a is shorter for O(min(m,n)) space
    if a_len > b_len {
        return lcs_seq_inner(b_bytes, a_bytes);
    }
    lcs_seq_inner(a_bytes, b_bytes)
}

#[inline]
fn lcs_seq_inner(short: &[u8], long: &[u8]) -> u32 {
    let n = short.len();
    let m = long.len();
    let mut prev = vec![0u32; n + 1];

    for i in 1..=m {
        let mut prev_diag = 0u32;
        for j in 1..=n {
            let temp = prev[j];
            if short[j - 1] == long[i - 1] {
                prev[j] = prev_diag + 1;
            } else {
                prev[j] = prev[j].max(prev[j - 1]);
            }
            prev_diag = temp;
        }
    }

    prev[n]
}

pub fn lcs_seq_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as f64;
    if max_len == 0.0 { return 1.0; }
    lcs_seq(a, b) as f64 / max_len
}

/// LCS matching pairs: returns (indexInA, indexInB) pairs.
#[allow(dead_code)]
pub fn lcs_seq_pairs(a: &str, b: &str) -> Vec<(usize, usize)> {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 || b_len == 0 { return vec![]; }

    // Build full DP table for traceback
    let w = b_len + 1;
    let mut dp = vec![0u32; (a_len + 1) * w];
    for i in 1..=a_len {
        for j in 1..=b_len {
            if a_bytes[i - 1] == b_bytes[j - 1] {
                dp[i * w + j] = dp[(i - 1) * w + j - 1] + 1;
            } else {
                dp[i * w + j] = dp[(i - 1) * w + j].max(dp[i * w + j - 1]);
            }
        }
    }

    // Traceback
    let mut pairs = Vec::new();
    let (mut i, mut j) = (a_len, b_len);
    while i > 0 && j > 0 {
        if a_bytes[i - 1] == b_bytes[j - 1] {
            pairs.push((i - 1, j - 1));
            i -= 1;
            j -= 1;
        } else if dp[(i - 1) * w + j] >= dp[i * w + j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }

    pairs.reverse();
    pairs
}
