/**
 * Match Rating Algorithm (MRA) — phonetic string matching.
 *
 * Developed by the Western Airlines Reservations System in 1977.
 * Designed for English names. Works by:
 * 1. Stripping vowels and duplicate adjacent consonants
 * 2. Keeping only the first and last 3 characters
 * 3. Comparing the resulting skeletons
 *
 * Returns a similarity in [0, 6] (6 = identical after reduction).
 * The normalized version returns [0, 1].
 *
 * Time: O(m + n)
 */

/**
 * Reduce a string to its MRA skeleton.
 *
 * Steps:
 * 1. Convert to uppercase
 * 2. Remove all vowels (A, E, I, O, U)
 * 3. Remove duplicate adjacent consonants
 * 4. If length > 6, keep first 3 and last 3
 */
function mraReduce(s: string): string {
  const vowels = new Set([65, 69, 73, 79, 85]); // A, E, I, O, U
  const upper = s.toUpperCase();

  // Step 1 & 2: strip vowels
  const consonants: number[] = [];
  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i);
    if (code >= 65 && code <= 90 && !vowels.has(code)) {
      consonants.push(code);
    }
  }

  // Step 3: remove adjacent duplicates
  const deduped: number[] = [];
  for (let i = 0; i < consonants.length; i++) {
    if (i === 0 || consonants[i] !== consonants[i - 1]) {
      deduped.push(consonants[i]);
    }
  }

  // Step 4: keep first 3 and last 3 if length > 6
  if (deduped.length > 6) {
    const first3 = String.fromCharCode(...deduped.slice(0, 3));
    const last3 = String.fromCharCode(...deduped.slice(-3));
    return first3 + last3;
  }

  return String.fromCharCode(...deduped);
}

/**
 * Compute the MRA similarity between two strings.
 *
 * Returns a value in [0, 6] where:
 * - 6: strings match exactly after reduction (strong match)
 * - 4-5: good match
 * - 0-3: weak or no match
 *
 * @param a - First string
 * @param b - Second string
 * @returns MRA similarity in [0, 6]
 */
export function mra(a: string, b: string): number {
  const redA = mraReduce(a);
  const redB = mraReduce(b);

  if (redA === redB) return 6;

  const maxLen = Math.max(redA.length, redB.length);
  if (maxLen === 0) return 6;

  // Compare position by position
  let matches = 0;
  const minLen = Math.min(redA.length, redB.length);
  for (let i = 0; i < minLen; i++) {
    if (redA.charCodeAt(i) === redB.charCodeAt(i)) matches++;
  }

  return matches;
}

/**
 * Compute the normalized MRA similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity in [0, 1]
 */
export function mraNormalized(a: string, b: string): number {
  return mra(a, b) / 6;
}
