/// Match Rating Algorithm (MRA) — phonetic string matching.
///
/// Steps:
/// 1. Strip vowels and duplicate adjacent consonants
/// 2. Keep first 3 and last 3 characters if length > 6
/// 3. Compare skeletons
///
/// Time: O(m + n)

fn mra_reduce(s: &str) -> Vec<u8> {
    let vowels: [bool; 128] = {
        let mut v = [false; 128];
        v[b'A' as usize] = true;
        v[b'E' as usize] = true;
        v[b'I' as usize] = true;
        v[b'O' as usize] = true;
        v[b'U' as usize] = true;
        v
    };

    // Step 1 & 2: strip vowels, uppercase
    let mut consonants = Vec::new();
    for &b in s.as_bytes() {
        let upper = if b >= b'a' && b <= b'z' { b - 32 } else { b };
        if upper >= 128 || !vowels[upper as usize] {
            consonants.push(upper);
        }
    }

    // Step 3: remove adjacent duplicates
    let mut deduped = Vec::new();
    for &c in &consonants {
        if deduped.is_empty() || *deduped.last().unwrap() != c {
            deduped.push(c);
        }
    }

    // Step 4: keep first 3 and last 3 if > 6
    if deduped.len() > 6 {
        let mut result = Vec::with_capacity(6);
        result.extend_from_slice(&deduped[..3]);
        result.extend_from_slice(&deduped[deduped.len() - 3..]);
        result
    } else {
        deduped
    }
}

pub fn mra(a: &str, b: &str) -> u32 {
    let red_a = mra_reduce(a);
    let red_b = mra_reduce(b);

    if red_a == red_b { return 6; }

    let min_len = red_a.len().min(red_b.len());
    let mut matches = 0u32;
    for i in 0..min_len {
        if red_a[i] == red_b[i] { matches += 1; }
    }
    matches
}

pub fn mra_normalized(a: &str, b: &str) -> f64 {
    mra(a, b) as f64 / 6.0
}
