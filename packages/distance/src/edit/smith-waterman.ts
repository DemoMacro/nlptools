/**
 * Smith-Waterman local sequence alignment algorithm.
 *
 * Designed for biological sequence alignment, it finds the best
 * local alignment between two sequences.
 *
 * Default scoring: match=1, mismatch=0, gap=-1 (matches textdistance.rs)
 *
 * Time: O(m * n), Space: O(m * n)
 */

/**
 * Options for Smith-Waterman alignment.
 */
export interface ISmithWatermanOptions {
  /** Score for matching characters. @default 1 */
  matchScore?: number;
  /** Score for mismatching characters. @default 0 */
  mismatchScore?: number;
  /** Score penalty for a gap. @default -1 */
  gapScore?: number;
}

/**
 * Compute the raw Smith-Waterman alignment score.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Raw alignment score (non-negative)
 */
export function smithWaterman(a: string, b: string, options: ISmithWatermanOptions = {}): number {
  const matchScore = options.matchScore ?? 1;
  const mismatchScore = options.mismatchScore ?? 0;
  const gapScore = options.gapScore ?? -1;

  const aLen = a.length;
  const bLen = b.length;

  const w = bLen + 1;
  const dp = new Int16Array((aLen + 1) * w);
  dp.fill(0);

  for (let i = 1; i <= aLen; i++) {
    const rowBase = i * w;
    const prevRowBase = (i - 1) * w;
    for (let j = 1; j <= bLen; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? matchScore : mismatchScore;
      const diag = dp[prevRowBase + j - 1] + cost;
      const up = dp[prevRowBase + j] + gapScore;
      const left = dp[rowBase + j - 1] + gapScore;
      dp[rowBase + j] = Math.max(0, diag, up, left);
    }
  }

  // textdistance.rs returns dist_mat[l1][l2] (bottom-right cell), not max
  return dp[aLen * w + bLen];
}

/**
 * Compute the normalized Smith-Waterman similarity in [0, 1].
 *
 * Normalized by matchScore * max(len(a), len(b)), matching textdistance.rs convention.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Normalized similarity in [0, 1]
 */
export function smithWatermanNormalized(
  a: string,
  b: string,
  options: ISmithWatermanOptions = {},
): number {
  const matchScore = options.matchScore ?? 1;
  const maxPossible = matchScore * Math.max(a.length, b.length);
  if (maxPossible === 0) return 1;
  return smithWaterman(a, b, options) / maxPossible;
}
