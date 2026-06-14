/// Ratcliff-Obershelp — Gestalt pattern matching.
///
/// Iteratively finds longest common substrings using a stack-based approach.
///
/// Time: O(n * m * k) where k = recursion depth

pub fn ratcliff_obershelp(a: &str, b: &str) -> f64 {
    if a == b { return 1.0; }
    let total_len = a.len() + b.len();
    if total_len == 0 { return 1.0; }

    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let mut total_match = 0u32;

    // Stack of (a_start, a_end, b_start, b_end)
    let mut stack: Vec<(usize, usize, usize, usize)> = vec![(0, a.len(), 0, b.len())];

    while let Some((a_start, a_end, b_start, b_end)) = stack.pop() {
        if a_end == a_start || b_end == b_start { continue; }

        let lcs = find_lcs(&a_bytes[a_start..a_end], &b_bytes[b_start..b_end]);
        if lcs.len == 0 { continue; }

        total_match += lcs.len as u32;

        // Push right side
        let a_right = a_start + lcs.a_idx + lcs.len;
        let b_right = b_start + lcs.b_idx + lcs.len;
        if a_end > a_right && b_end > b_right {
            stack.push((a_right, a_end, b_right, b_end));
        }

        // Push left side
        if lcs.a_idx > 0 && lcs.b_idx > 0 {
            stack.push((a_start, a_start + lcs.a_idx, b_start, b_start + lcs.b_idx));
        }
    }

    2.0 * total_match as f64 / total_len as f64
}

struct LcsResult {
    len: usize,
    a_idx: usize,
    b_idx: usize,
}

/// Find the longest common substring and its positions.
fn find_lcs(a: &[u8], b: &[u8]) -> LcsResult {
    let a_len = a.len();
    let b_len = b.len();

    if a_len == 0 || b_len == 0 {
        return LcsResult { len: 0, a_idx: 0, b_idx: 0 };
    }

    let mut max_len = 0usize;
    let mut end_i = 0usize;
    let mut end_j = 0usize;
    let mut dp = vec![0u32; b_len + 1];

    for i in 1..=a_len {
        let mut prev = 0u32;
        for j in 1..=b_len {
            let temp = dp[j];
            if a[i - 1] == b[j - 1] {
                dp[j] = prev + 1;
                if dp[j] as usize > max_len {
                    max_len = dp[j] as usize;
                    end_i = i;
                    end_j = j;
                }
            } else {
                dp[j] = 0;
            }
            prev = temp;
        }
    }

    LcsResult {
        len: max_len,
        a_idx: end_i - max_len,
        b_idx: end_j - max_len,
    }
}
