/// Gotoh — global alignment with affine gap penalties.
///
/// Uses three matrices: M (match/mismatch), Ix (gap in b), Iy (gap in a).
///
/// Time: O(m * n), Space: O(m * n)

pub fn gotoh(a: &str, b: &str) -> f64 {
    gotoh_with_scores(a, b, 1.0, 0.0, -1.0, -0.5)
}

pub fn gotoh_with_scores(a: &str, b: &str, match_score: f64, mismatch_score: f64, gap_open: f64, gap_extend: f64) -> f64 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();
    let w = b_len + 1;

    let neg_inf = f64::NEG_INFINITY;
    let mut m = vec![neg_inf; (a_len + 1) * w];
    let mut ix = vec![neg_inf; (a_len + 1) * w];
    let mut iy = vec![neg_inf; (a_len + 1) * w];

    m[0] = 0.0;
    for i in 1..=a_len { ix[i * w] = gap_open + (i - 1) as f64 * gap_extend; }
    for j in 1..=b_len { iy[j] = gap_open + (j - 1) as f64 * gap_extend; }

    for i in 1..=a_len {
        let row = i * w;
        let prev = (i - 1) * w;
        for j in 1..=b_len {
            let cost = if a_bytes[i - 1] == b_bytes[j - 1] { match_score } else { mismatch_score };
            m[row + j] = (m[prev + j - 1]).max(ix[prev + j - 1]).max(iy[prev + j - 1]) + cost;
            ix[row + j] = (m[prev + j] + gap_open).max(ix[prev + j] + gap_extend);
            iy[row + j] = (m[row + j - 1] + gap_open).max(iy[row + j - 1] + gap_extend);
        }
    }

    let last = a_len * w + b_len;
    m[last].max(ix[last]).max(iy[last])
}

pub fn gotoh_normalized(a: &str, b: &str) -> f64 {
    let max_possible = a.len().max(b.len()) as f64;
    if max_possible == 0.0 { return 1.0; }
    gotoh(a, b) / max_possible
}
