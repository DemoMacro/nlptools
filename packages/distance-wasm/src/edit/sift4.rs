/// SIFT4 simple — fast approximate string distance.
///
/// Time: O(n * maxOffset)

use crate::utils::normalize;

const MAX_OFFSET: usize = 5;

pub fn sift4_simple(a: &str, b: &str) -> u32 {
    let a_bytes = a.as_bytes();
    let b_bytes = b.as_bytes();
    let a_len = a_bytes.len();
    let b_len = b_bytes.len();

    let mut c1 = 0usize;
    let mut c2 = 0usize;
    let mut lcss = 0u32;
    let mut local_cs = 0u32;

    while c1 < a_len && c2 < b_len {
        if a_bytes[c1] == b_bytes[c2] {
            local_cs += 1;
        } else {
            lcss += local_cs;
            local_cs = 0;
            if c1 != c2 {
                c1 = c1.max(c2);
                c2 = c1;
                if c1 >= a_len || c2 >= b_len { break; }
            }
            for offset in 0..MAX_OFFSET {
                if c1 + offset >= a_len && c2 + offset >= b_len { break; }
                if c1 + offset < a_len && a_bytes[c1 + offset] == b_bytes[c2] {
                    c1 += offset;
                    local_cs += 1;
                    break;
                }
                if c2 + offset < b_len && a_bytes[c1] == b_bytes[c2 + offset] {
                    c2 += offset;
                    local_cs += 1;
                    break;
                }
            }
        }
        c1 += 1;
        c2 += 1;
    }

    lcss += local_cs;
    (a_len.max(b_len) as u32) - lcss
}

pub fn sift4_simple_normalized(a: &str, b: &str) -> f64 {
    let max_len = a.len().max(b.len()) as u32;
    normalize(sift4_simple(a, b), max_len)
}
