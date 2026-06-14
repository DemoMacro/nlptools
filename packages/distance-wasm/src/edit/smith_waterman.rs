/// Smith-Waterman local sequence alignment.
///
/// Default scoring: match=1, mismatch=0, gap=-1
///
/// Time: O(m * n), Space: O(m * n)

pub fn smith_waterman(a: &str, b: &str) -> u32 {
    smith_waterman_with_scores(a, b, 1, 0, -1)
}

pub fn smith_waterman_with_scores(a: &str, b: &str, match_score: i32, mismatch_score: i32, gap_score: i32) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 || b_len == 0 { return 0; }

    let w = b_len + 1;
    let mut dp = vec![0i32; (a_len + 1) * w];
    let mut max_score = 0i32;

    for i in 1..=a_len {
        let row_base = i * w;
        let prev_row_base = (i - 1) * w;
        for j in 1..=b_len {
            let cost = if a_bytes[i - 1] == b_bytes[j - 1] { match_score } else { mismatch_score };
            let diag = dp[prev_row_base + j - 1] + cost;
            let up = dp[prev_row_base + j] + gap_score;
            let left = dp[row_base + j - 1] + gap_score;
            let val = 0.max(diag).max(up).max(left);
            dp[row_base + j] = val;
            if val > max_score { max_score = val; }
        }
    }

    max_score as u32
}

pub fn smith_waterman_normalized(a: &str, b: &str) -> f64 {
    let max_possible = a.len().max(b.len()) as f64;
    if max_possible == 0.0 { return 1.0; }
    smith_waterman(a, b) as f64 / max_possible
}
