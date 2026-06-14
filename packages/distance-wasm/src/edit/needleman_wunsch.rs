/// Needleman-Wunsch global sequence alignment.
///
/// Default scoring: match=1, mismatch=0, gap=-1
///
/// Time: O(m * n), Space: O(m * n)

pub fn needleman_wunsch(a: &str, b: &str) -> i32 {
    needleman_wunsch_with_scores(a, b, 1, 0, -1)
}

pub fn needleman_wunsch_with_scores(a: &str, b: &str, match_score: i32, mismatch_score: i32, gap_score: i32) -> i32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    let w = b_len + 1;
    let mut dp = vec![0i32; (a_len + 1) * w];

    // Initialize borders
    for i in 1..=a_len { dp[i * w] = i as i32 * gap_score; }
    for j in 1..=b_len { dp[j] = j as i32 * gap_score; }

    for i in 1..=a_len {
        let row_base = i * w;
        let prev_row_base = (i - 1) * w;
        for j in 1..=b_len {
            let cost = if a_bytes[i - 1] == b_bytes[j - 1] { match_score } else { mismatch_score };
            let diag = dp[prev_row_base + j - 1] + cost;
            let up = dp[prev_row_base + j] + gap_score;
            let left = dp[row_base + j - 1] + gap_score;
            dp[row_base + j] = diag.max(up).max(left);
        }
    }

    dp[a_len * w + b_len]
}

pub fn needleman_wunsch_normalized(a: &str, b: &str) -> f64 {
    let max_possible = a.len().max(b.len()) as f64;
    if max_possible == 0.0 { return 1.0; }
    needleman_wunsch(a, b) as f64 / max_possible
}
