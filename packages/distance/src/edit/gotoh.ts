/**
 * Gotoh algorithm — global sequence alignment with affine gap penalties.
 *
 * Extension of Needleman-Wunsch that uses separate penalties for
 * gap opening and gap extension, producing more biologically realistic alignments.
 *
 * Time: O(m * n), Space: O(m * n)
 */

export interface IGotohOptions {
  /** Score for matching characters. @default 1 */
  matchScore?: number;
  /** Score for mismatching characters. @default 0 */
  mismatchScore?: number;
  /** Penalty for opening a new gap. @default -1 */
  gapOpen?: number;
  /** Penalty for extending an existing gap. @default -0.5 */
  gapExtend?: number;
}

/**
 * Compute the raw Gotoh alignment score.
 *
 * Uses three matrices: M (match/mismatch), Ix (gap in sequence a), Iy (gap in sequence b).
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Raw alignment score
 */
export function gotoh(a: string, b: string, options: IGotohOptions = {}): number {
  const matchScore = options.matchScore ?? 1;
  const mismatchScore = options.mismatchScore ?? 0;
  const gapOpen = options.gapOpen ?? -1;
  const gapExtend = options.gapExtend ?? -0.5;

  const aLen = a.length;
  const bLen = b.length;
  const w = bLen + 1;

  // M[i][j] = best score ending in match/mismatch at (i,j)
  const M = new Float64Array((aLen + 1) * w);
  // Ix[i][j] = best score ending with gap in b (insertion in a)
  const Ix = new Float64Array((aLen + 1) * w);
  // Iy[i][j] = best score ending with gap in a (insertion in b)
  const Iy = new Float64Array((aLen + 1) * w);

  // Initialize with -Infinity
  M.fill(-Infinity);
  Ix.fill(-Infinity);
  Iy.fill(-Infinity);
  M[0] = 0;

  for (let i = 1; i <= aLen; i++) {
    Ix[i * w] = gapOpen + (i - 1) * gapExtend;
  }
  for (let j = 1; j <= bLen; j++) {
    Iy[j] = gapOpen + (j - 1) * gapExtend;
  }

  for (let i = 1; i <= aLen; i++) {
    const rowBase = i * w;
    const prevRowBase = (i - 1) * w;
    for (let j = 1; j <= bLen; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? matchScore : mismatchScore;

      // M: extend alignment with match/mismatch
      M[rowBase + j] =
        Math.max(M[prevRowBase + j - 1], Ix[prevRowBase + j - 1], Iy[prevRowBase + j - 1]) + cost;

      // Ix: gap in b (deletion from a)
      Ix[rowBase + j] = Math.max(M[prevRowBase + j] + gapOpen, Ix[prevRowBase + j] + gapExtend);

      // Iy: gap in a (insertion in b)
      Iy[rowBase + j] = Math.max(M[rowBase + j - 1] + gapOpen, Iy[rowBase + j - 1] + gapExtend);
    }
  }

  const last = aLen * w + bLen;
  return Math.max(M[last], Ix[last], Iy[last]);
}

/**
 * Compute the normalized Gotoh similarity in [0, 1].
 *
 * @param a - First string
 * @param b - Second string
 * @param options - Scoring parameters
 * @returns Normalized similarity in [0, 1]
 */
export function gotohNormalized(a: string, b: string, options: IGotohOptions = {}): number {
  const matchScore = options.matchScore ?? 1;
  const maxPossible = matchScore * Math.max(a.length, b.length);
  if (maxPossible === 0) return 1;
  return gotoh(a, b, options) / maxPossible;
}
