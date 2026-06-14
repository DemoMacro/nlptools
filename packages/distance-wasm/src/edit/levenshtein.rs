/// Levenshtein edit distance using Myers bit-parallel algorithm.
///
/// Uses 32-bit block-based Myers for ALL string lengths:
/// - Short strings (<=32 bytes): single-block fast path
/// - Long strings: multi-block processing (32 bits per block)
///
/// This matches the approach used by fastest-levenshtein (JS) and rapidfuzz (Rust).
///
/// Time: O(n * ceil(m/32)), Space: O(ceil(m/32))

use crate::utils::normalize;

/// Myers 32-bit: single block for strings up to 32 bytes.
#[inline]
fn myers_32(a: &[u8], b: &[u8]) -> u32 {
    let n = a.len();
    let m = b.len();
    let lst = 1u32 << (n - 1);

    let mut peq = [0u32; 128];
    for i in 0..n {
        peq[a[i] as usize] |= 1u32 << i;
    }

    let mut pv = !0u32;
    let mut mv = 0u32;
    let mut sc = n as u32;

    for j in 0..m {
        let mut eq = peq[b[j] as usize];
        let xv = eq | mv;
        eq |= ((eq & pv).wrapping_add(pv)) ^ pv;
        mv |= !(eq | pv);
        pv &= eq;

        if mv & lst != 0 { sc += 1; }
        if pv & lst != 0 { sc -= 1; }

        mv = (mv << 1) | 1;
        pv = (pv << 1) | !(xv | mv);
        mv &= xv;
    }

    sc
}

/// Myers block-based: multi-block for strings longer than 32 bytes.
fn myers_x(a: &[u8], b: &[u8]) -> u32 {
    let n = a.len();
    let m = b.len();
    let word_size = 32usize;
    let hsize = (n + word_size - 1) / word_size;
    let vsize = (m + word_size - 1) / word_size;

    let mut phc = vec![!0u32; hsize];
    let mut mhc = vec![0u32; hsize];

    let mut peq = [0u32; 128];

    // Process all but the last vertical block
    for block in 0..vsize - 1 {
        let mut mv = 0u32;
        let mut pv = !0u32;
        let start = block * word_size;
        let end = start + word_size;

        // Build PEQ for this block of b
        for &c in &peq { let _ = c; } // keep compiler happy
        for k in start..end {
            peq[b[k] as usize] |= 1u32 << (k - start);
        }

        for i in 0..n {
            let eq = peq[a[i] as usize];
            let block_i = i / word_size;
            let bit_i = i % word_size;

            let pb = (phc[block_i] >> bit_i) & 1;
            let mb = (mhc[block_i] >> bit_i) & 1;

            let xv = eq | mv;
            let xh = ((((eq | mb) & pv).wrapping_add(pv)) ^ pv) | eq | mb;
            let mut ph = mv | !(xh | pv);
            let mut mh = pv & xh;

            if ((ph >> 31) ^ pb) != 0 { phc[block_i] ^= 1u32 << bit_i; }
            if ((mh >> 31) ^ mb) != 0 { mhc[block_i] ^= 1u32 << bit_i; }

            ph = (ph << 1) | pb;
            mh = (mh << 1) | mb;
            pv = mh | !(xv | ph);
            mv = ph & xv;
        }

        // Clear PEQ for this block
        for k in start..end {
            peq[b[k] as usize] = 0;
        }
    }

    // Process the last vertical block
    let mut mv = 0u32;
    let mut pv = !0u32;
    let start = (vsize - 1) * word_size;
    let vlen = m - start;

    for k in start..m {
        peq[b[k] as usize] |= 1u32 << (k - start);
    }

    let mut score = m as u32;

    for i in 0..n {
        let eq = peq[a[i] as usize];
        let block_i = i / word_size;
        let bit_i = i % word_size;

        let pb = (phc[block_i] >> bit_i) & 1;
        let mb = (mhc[block_i] >> bit_i) & 1;

        let xv = eq | mv;
        let xh = ((((eq | mb) & pv).wrapping_add(pv)) ^ pv) | eq | mb;
        let mut ph = mv | !(xh | pv);
        let mut mh = pv & xh;

        if vlen > 0 {
            score += (ph >> (vlen - 1)) & 1;
            score -= (mh >> (vlen - 1)) & 1;
        }

        if ((ph >> 31) ^ pb) != 0 { phc[block_i] ^= 1u32 << bit_i; }
        if ((mh >> 31) ^ mb) != 0 { mhc[block_i] ^= 1u32 << bit_i; }

        ph = (ph << 1) | pb;
        mh = (mh << 1) | mb;
        pv = mh | !(xv | ph);
        mv = ph & xv;
    }

    score
}

pub fn levenshtein(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    if a_len == 0 { return b_len as u32; }
    if b_len == 0 { return a_len as u32; }

    // Ensure a is the shorter string (pattern), b is the longer (text)
    if a_len > b_len {
        return levenshtein_inner(b_bytes, a_bytes);
    }
    levenshtein_inner(a_bytes, b_bytes)
}

#[inline]
fn levenshtein_inner(short: &[u8], long: &[u8]) -> u32 {
    if short.len() <= 32 {
        myers_32(short, long)
    } else {
        myers_x(short, long)
    }
}

pub fn levenshtein_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as u32;
    normalize(levenshtein(a, b), max_len)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_levenshtein_basic() {
        assert_eq!(levenshtein("", ""), 0);
        assert_eq!(levenshtein("", "abc"), 3);
        assert_eq!(levenshtein("abc", ""), 3);
        assert_eq!(levenshtein("kitten", "sitting"), 3);
        assert_eq!(levenshtein("saturday", "sunday"), 3);
        assert_eq!(levenshtein("test", "text"), 1);
        assert_eq!(levenshtein("abc", "abc"), 0);
    }

    #[test]
    fn test_levenshtein_long() {
        // Test strings > 32 bytes (multi-block Myers)
        let a = "The quick brown fox jumps over the lazy dog and runs away very far from home";
        let b = "The quick brown dog jumps over the lazy fox and runs very very far away from home";
        let dist = levenshtein(a, b);
        assert!(dist > 0 && dist < 30, "levenshtein long: {}", dist);
    }

    #[test]
    fn test_levenshtein_symmetry() {
        assert_eq!(levenshtein("abc", "xyz"), levenshtein("xyz", "abc"));
    }

    #[test]
    fn test_levenshtein_normalized() {
        assert_eq!(levenshtein_normalized("", ""), 1.0);
        assert!((levenshtein_normalized("kitten", "sitting") - 0.5714).abs() < 0.01);
    }
}
