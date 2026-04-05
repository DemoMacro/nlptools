/**
 * Ratcliff-Obershelp algorithm — Gestalt pattern matching.
 *
 * Iteratively finds the longest common substring using a stack-based approach,
 * combining scores from both sides. Returns a similarity in [0, 1].
 *
 * Based on the textdistance.rs implementation.
 *
 * Time: O(n * m * log(n * m)) worst case, O(n + m) average
 */

/**
 * Internal: find the longest common substring and return its length and positions.
 */
function findLCS(a: string, b: string): { len: number; aIdx: number; bIdx: number } {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0 || bLen === 0) return { len: 0, aIdx: 0, bIdx: 0 };

  let maxLen = 0;
  let endI = 0;
  let endJ = 0;
  const dp = new Uint32Array(bLen + 1);

  for (let i = 1; i <= aLen; i++) {
    let prev = 0;
    for (let j = 1; j <= bLen; j++) {
      const temp = dp[j];
      if (a.charCodeAt(i - 1) === b.charCodeAt(j - 1)) {
        dp[j] = prev + 1;
        if (dp[j] > maxLen) {
          maxLen = dp[j];
          endI = i;
          endJ = j;
        }
      } else {
        dp[j] = 0;
      }
      prev = temp;
    }
  }

  return { len: maxLen, aIdx: endI - maxLen, bIdx: endJ - maxLen };
}

/**
 * Compute Ratcliff-Obershelp similarity between two strings.
 *
 * Uses an iterative stack-based approach to avoid stack overflow on
 * very different strings. The algorithm recursively finds the longest
 * common substring and combines similarity scores from both sides.
 *
 * similarity = 2 * M / T, where M = total matched characters, T = total characters
 *
 * @param a - First string
 * @param b - Second string
 * @returns Ratcliff-Obershelp similarity in [0, 1]
 */
export function ratcliff(a: string, b: string): number {
  if (a === b) return 1;
  const totalLen = a.length + b.length;
  if (totalLen === 0) return 1;

  let totalMatch = 0;

  // Stack of (aLeft, aRight, bLeft, bRight) pairs to process
  const stack: [number, number, number, number][] = [[0, a.length, 0, b.length]];

  while (stack.length > 0) {
    const [aStart, aEnd, bStart, bEnd] = stack.pop()!;

    if (aEnd - aStart === 0 || bEnd - bStart === 0) continue;

    const subA = a.slice(aStart, aEnd);
    const subB = b.slice(bStart, bEnd);

    const lcs = findLCS(subA, subB);

    if (lcs.len === 0) continue;

    totalMatch += lcs.len;

    // Push right sides first (processed after left due to LIFO)
    const aRightStart = aStart + lcs.aIdx + lcs.len;
    const bRightStart = bStart + lcs.bIdx + lcs.len;
    if (aEnd - aRightStart > 0 && bEnd - bRightStart > 0) {
      stack.push([aRightStart, aEnd, bRightStart, bEnd]);
    }

    // Push left sides
    const aLeftEnd = aStart + lcs.aIdx;
    const bLeftEnd = bStart + lcs.bIdx;
    if (aLeftEnd - aStart > 0 && bLeftEnd - bStart > 0) {
      stack.push([aStart, aLeftEnd, bStart, bLeftEnd]);
    }
  }

  return (2 * totalMatch) / totalLen;
}
