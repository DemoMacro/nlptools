/// Longest Common Substring (contiguous).
///
/// Time: O(m * n), Space: O(min(m, n))

pub fn lcs_str(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 || b_len == 0 { return 0; }

    let mut max_len = 0u32;
    let mut dp = vec![0u32; b_len + 1];

    for i in 1..=a_len {
        let mut prev = 0u32;
        for j in 1..=b_len {
            let temp = dp[j];
            if a_bytes[i - 1] == b_bytes[j - 1] {
                dp[j] = prev + 1;
                if dp[j] > max_len { max_len = dp[j]; }
            } else {
                dp[j] = 0;
            }
            prev = temp;
        }
    }

    max_len
}

pub fn lcs_str_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as f64;
    if max_len == 0.0 { return 1.0; }
    lcs_str(a, b) as f64 / max_len
}
