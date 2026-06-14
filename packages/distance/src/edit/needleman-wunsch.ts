/**
 * Needleman-Wunsch global sequence alignment algorithm.
 *
 * Classic global alignment algorithm used in bioinformatics.
 * Unlike Smith-Waterman (local), this aligns entire sequences end-to-end.
 *
 * Default scoring: match=1, mismatch=0, gap=-1 (matching textdistance.rs)
 *
 * Time: O(m * n), Space: O(m * n)
 */

export interface INeedlemanWunschOptions {
  /** Score for matching characters. @default 1 */
  matchScore?: number;
  /** Score for mismatching characters. @default 0 */
  mismatchScore?: number;
  /** Score penalty for a gap. @default -1 */
  gapScore?: number;
}

/**
 * Compute the raw Needleman-Wunsch alignment score.
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Raw alignment score
 */
export function needlemanWunsch(
  a: string,
  b: string,
  options: INeedlemanWunschOptions = {},
): number {
  const matchScore = options.matchScore ?? 1;
  const mismatchScore = options.mismatchScore ?? 0;
  const gapScore = options.gapScore ?? -1;

  const aLen = a.length;
  const bLen = b.length;

  const w = bLen + 1;
  const dp = new Int32Array((aLen + 1) * w);

  // Initialize borders: gaps along first row and column
  for (let i = 1; i <= aLen; i++) dp[i * w] = i * gapScore;
  for (let j = 1; j <= bLen; j++) dp[j] = j * gapScore;

  for (let i = 1; i <= aLen; i++) {
    const rowBase = i * w;
    const prevRowBase = (i - 1) * w;
    for (let j = 1; j <= bLen; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? matchScore : mismatchScore;
      const diag = dp[prevRowBase + j - 1] + cost;
      const up = dp[prevRowBase + j] + gapScore;
      const left = dp[rowBase + j - 1] + gapScore;
      dp[rowBase + j] = Math.max(diag, up, left);
    }
  }

  return dp[aLen * w + bLen];
}

/**
 * Compute the normalized Needleman-Wunsch similarity in [0, 1].
 *
 * Normalized by matchScore * max(len(a), len(b)).
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Normalized similarity in [0, 1]
 */
export function needlemanWunschNormalized(
  a: string,
  b: string,
  options: INeedlemanWunschOptions = {},
): number {
  const matchScore = options.matchScore ?? 1;
  const maxPossible = matchScore * Math.max(a.length, b.length);
  if (maxPossible === 0) return 1;
  return needlemanWunsch(a, b, options) / maxPossible;
}
