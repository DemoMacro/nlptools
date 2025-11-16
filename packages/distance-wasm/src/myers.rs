// Myers algorithm implementation - efficient bit-parallel edit distance
// Based on Gene Myers' O(ND) algorithm with bit-parallel optimization

/// Myers 32-bit implementation for strings up to 32 characters
fn myers_32(a: &str, b: &str) -> u32 {
    let n = a.chars().count();
    let m = b.chars().count();

    if n == 0 {
        return m as u32;
    }
    if m == 0 {
        return n as u32;
    }

    // Character bitmask table (65536 entries for Unicode BMP)
    let mut peq = vec![0u32; 0x10000];

    // Build character bit masks for string a
    for (i, ch) in a.chars().enumerate() {
        let code = ch as u32 as u16;
        peq[code as usize] |= 1u32 << i;
    }

    let lst = 1u32 << (n - 1); // Last bit position
    let mut pv = !0u32; // Previous vertical -1 (all bits set)
    let mut mv = 0u32; // Previous vertical 0 (all bits clear)
    let mut sc = n as u32; // Score (edit distance)

    // Process each character in string b
    for ch in b.chars() {
        let code = ch as u32 as u16;
        let mut eq = peq[code as usize];

        let xv = eq | mv;
        eq |= ((eq & pv).wrapping_add(pv)) ^ pv;
        mv |= !(eq | pv);
        pv &= eq;

        if mv & lst != 0 {
            sc += 1;
        }
        if pv & lst != 0 {
            sc -= 1;
        }

        mv = (mv << 1) | 1;
        pv = (pv << 1) | !(xv | mv);
        mv &= xv;
    }

    sc
}

/// Myers extended implementation for longer strings using block-based approach
fn myers_x(a: &str, b: &str) -> u32 {
    let n = a.chars().count();
    let m = b.chars().count();

    if n == 0 {
        return m as u32;
    }
    if m == 0 {
        return n as u32;
    }

    let word_size = 32;
    let hsize = (n + word_size - 1) / word_size; // Number of horizontal blocks
    let vsize = (m + word_size - 1) / word_size; // Number of vertical blocks

    // Initialize horizontal and vertical carry arrays
    let mut phc = vec![!0u32; hsize]; // Previous horizontal carry
    let mut mhc = vec![0u32; hsize]; // Previous horizontal mismatch

    // Character bitmask table
    let mut peq = vec![0u32; 0x10000];

    let a_chars: Vec<char> = a.chars().collect();
    let b_chars: Vec<char> = b.chars().collect();

    // Process all but the last vertical block
    for block in 0..(vsize - 1) {
        let mut mv = 0u32;
        let mut pv = !0u32;
        let start = block * word_size;
        let end = (block + 1) * word_size;

        // Build character bit masks for this block of string b
        for k in start..end.min(m) {
            let code = b_chars[k] as u32 as u16;
            peq[code as usize] |= 1u32 << (k - start);
        }

        // Process each character in string a
        for (i, &ch) in a_chars.iter().enumerate() {
            let code = ch as u32 as u16;
            let eq = peq[code as usize];

            let block_i = i / word_size;
            let bit_i = i % word_size;

            let pb = (phc[block_i] >> bit_i) & 1;
            let mb = (mhc[block_i] >> bit_i) & 1;

            let xv = eq | mv;
            let xh = ((((eq | mb) & pv).wrapping_add(pv)) ^ pv) | eq | mb;

            let mut ph = mv | !(xh | pv);
            let mut mh = pv & xh;

            if ((ph >> 31) ^ pb) != 0 {
                phc[block_i] ^= 1u32 << bit_i;
            }
            if ((mh >> 31) ^ mb) != 0 {
                mhc[block_i] ^= 1u32 << bit_i;
            }

            ph = (ph << 1) | pb;
            mh = (mh << 1) | mb;
            pv = mh | !(xv | ph);
            mv = ph & xv;
        }

        // Clear peq for this block
        for k in start..end.min(m) {
            let code = b_chars[k] as u32 as u16;
            peq[code as usize] = 0;
        }
    }

    // Process the last vertical block and compute final score
    let mut mv = 0u32;
    let mut pv = !0u32;
    let start = (vsize - 1) * word_size;
    let vlen = m - start;

    // Build character bit masks for the last block
    for k in start..m {
        let code = b_chars[k] as u32 as u16;
        peq[code as usize] |= 1u32 << (k - start);
    }

    let mut score = m as u32;

    for (i, &ch) in a_chars.iter().enumerate() {
        let code = ch as u32 as u16;
        let eq = peq[code as usize];

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

        if ((ph >> 31) ^ pb) != 0 {
            phc[block_i] ^= 1u32 << bit_i;
        }
        if ((mh >> 31) ^ mb) != 0 {
            mhc[block_i] ^= 1u32 << bit_i;
        }

        ph = (ph << 1) | pb;
        mh = (mh << 1) | mb;
        pv = mh | !(xv | ph);
        mv = ph & xv;
    }

    // Clear peq for the last block
    for k in start..m {
        let code = b_chars[k] as u32 as u16;
        peq[code as usize] = 0;
    }

    score
}

/// Main Myers distance function
pub fn myers_distance(a: &str, b: &str) -> u32 {
    let a_len = a.chars().count();
    let b_len = b.chars().count();

    // Ensure a is the longer string
    if a_len < b_len {
        return myers_distance(b, a);
    }

    if b_len == 0 {
        return a_len as u32;
    }

    // Use 32-bit version for shorter strings
    if a_len <= 32 {
        myers_32(a, b)
    } else {
        myers_x(a, b)
    }
}

/// Normalized Myers similarity (1.0 = identical, 0.0 = completely different)
pub fn myers_similarity(a: &str, b: &str) -> f64 {
    let a_len = a.chars().count();
    let b_len = b.chars().count();
    let max_len = a_len.max(b_len);

    if max_len == 0 {
        return 1.0;
    }

    let distance = myers_distance(a, b);
    1.0 - (distance as f64 / max_len as f64)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_myers_distance_basic() {
        // Test identical strings
        assert_eq!(myers_distance("hello", "hello"), 0);

        // Test empty strings
        assert_eq!(myers_distance("", "hello"), 5);
        assert_eq!(myers_distance("hello", ""), 5);
        assert_eq!(myers_distance("", ""), 0);

        // Test simple cases
        assert_eq!(myers_distance("a", "b"), 1);
        assert_eq!(myers_distance("cat", "car"), 1);
        assert_eq!(myers_distance("kitten", "sitting"), 3);
    }

    #[test]
    fn test_myers_distance_edge_cases() {
        // Test single character strings
        assert_eq!(myers_distance("a", "a"), 0);
        assert_eq!(myers_distance("a", ""), 1);
        assert_eq!(myers_distance("", "a"), 1);

        // Test with Unicode characters
        assert_eq!(myers_distance("café", "cafe"), 1);
        assert_eq!(myers_distance("naïve", "naive"), 1);

        // Test case sensitivity
        assert_eq!(myers_distance("Hello", "hello"), 1);
        assert_eq!(myers_distance("WORLD", "world"), 5);
    }

    #[test]
    fn test_myers_similarity() {
        // Test identical strings
        assert_eq!(myers_similarity("hello", "hello"), 1.0);

        // Test empty strings
        assert_eq!(myers_similarity("", ""), 1.0);
        assert_eq!(myers_similarity("", "hello"), 0.0);
        assert_eq!(myers_similarity("hello", ""), 0.0);

        // Test simple cases
        assert!((myers_similarity("a", "b") - 0.0).abs() < f64::EPSILON);
        assert!((myers_similarity("cat", "car") - 0.6666667).abs() < 0.0001);
        assert!((myers_similarity("test", "text") - 0.75).abs() < 0.0001);
    }

    #[test]
    fn test_myers_32_bit_optimization() {
        // Test strings <= 32 characters to test the 32-bit optimization
        let a = "The quick brown fox jumps";
        let b = "The quick brown dog jumps";

        let distance = myers_distance(a, b);
        assert_eq!(distance, 2);

        let similarity = myers_similarity(a, b);
        assert!(similarity > 0.8 && similarity < 1.0);
    }

    #[test]
    fn test_myers_extended_block() {
        // Test strings > 32 characters to test the block-based approach
        let a = "The quick brown fox jumps over the lazy dog and runs away";
        let b = "The quick brown dog jumps over the lazy fox and runs far away";

        let distance = myers_distance(a, b);
        assert!(distance > 0 && distance < 20);

        let similarity = myers_similarity(a, b);
        assert!(similarity > 0.5 && similarity <= 1.0);
    }

    #[test]
    fn test_myers_symmetry() {
        // Myers distance should be symmetric
        let a = "algorithm";
        let b = "logarithm";

        let dist_ab = myers_distance(a, b);
        let dist_ba = myers_distance(b, a);

        assert_eq!(dist_ab, dist_ba);

        let sim_ab = myers_similarity(a, b);
        let sim_ba = myers_similarity(b, a);

        assert!((sim_ab - sim_ba).abs() < f64::EPSILON);
    }

    #[test]
    fn test_myers_triangle_inequality() {
        // Test triangle inequality: d(a,c) <= d(a,b) + d(b,c)
        let a = "hello";
        let b = "hallo";
        let c = "hola";

        let d_ac = myers_distance(a, c);
        let d_ab = myers_distance(a, b);
        let d_bc = myers_distance(b, c);

        assert!(d_ac <= d_ab + d_bc);
    }

    #[test]
    fn test_myers_long_string() {
        let a = "The quick brown fox jumps over the lazy dog";
        let b = "The quick brown dog jumps over the lazy fox";

        let distance = myers_distance(a, b);
        let similarity = myers_similarity(a, b);

        // Distance should be reasonable for this case
        assert!(distance > 0 && distance < 20);
        assert!(similarity > 0.5 && similarity <= 1.0);
    }

    #[test]
    fn test_myers_legal_text() {
        let a = "The parties hereby agree to the following terms and conditions";
        let b = "Both parties acknowledge and accept the stipulated provisions herein";

        let distance = myers_distance(a, b);
        let similarity = myers_similarity(a, b);

        assert!(distance > 0);
        assert!(similarity >= 0.0 && similarity <= 1.0);
    }

    // Test cases that match standard Levenshtein distance behavior
    #[test]
    fn test_myers_levenshtein_parity() {
        let test_cases = vec![
            ("", "", 0),
            ("", "abc", 3),
            ("abc", "", 3),
            ("sitting", "sitting", 0),
            ("sitting", "kitten", 3),
            ("example", "samples", 3),
            ("distance", "difference", 5),
            ("test", "text", 1),
            ("test", "tset", 2),
            ("test", "qwe", 4),
            ("test", "testit", 2),
            ("test", "tesst", 1),
            ("test", "tet", 1),
            ("kitten", "sitting", 3),
            ("gumbo", "gambol", 2),
            ("saturday", "sunday", 3),
            ("a", "b", 1),
            ("ab", "ac", 1),
            ("ac", "bc", 1),
            ("abc", "axc", 1),
            ("xabxcdxxefxgx", "1ab2cd34ef5g6", 6),
            ("xabxcdxxefxgx", "abcdefg", 6),
            ("javawasneat", "scalaisgreat", 7),
            ("example", "samples", 3),
            ("sturgeon", "urgently", 6),
            ("levenshtein", "frankenstein", 6),
            ("distance", "difference", 5),
            ("Tier", "Tor", 2),
        ];

        for (s1, s2, expected) in test_cases {
            assert_eq!(
                myers_distance(s1, s2),
                expected,
                "Failed for pair: '{}' vs '{}', expected {}, got {}",
                s1,
                s2,
                expected,
                myers_distance(s1, s2)
            );
        }
    }

    #[test]
    fn test_myers_performance_regression() {
        // Simple performance test to ensure algorithm doesn't have major regressions
        let a = "abcdefghijklmnopqrstuvwxyz";
        let b = "zyxwvutsrqponmlkjihgfedcba";

        let start = std::time::Instant::now();
        let _distance = myers_distance(a, b);
        let duration = start.elapsed();

        // Should complete within reasonable time (10ms is generous)
        assert!(
            duration.as_millis() < 10,
            "Myers algorithm took too long: {:?}",
            duration
        );
    }

    #[test]
    fn test_myers_unicode_handling() {
        // Test with various Unicode characters
        let cases = vec![
            ("café", "cafe", 1),
            ("résumé", "resume", 2),
            ("naïve", "naive", 1),
            ("señor", "senor", 1),
            ("Москва", "Moskva", 6),
        ];

        for (s1, s2, expected) in cases {
            assert_eq!(
                myers_distance(s1, s2),
                expected,
                "Unicode test failed for '{}' vs '{}'",
                s1,
                s2
            );
        }
    }
}
