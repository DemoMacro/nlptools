/**
 * @nlptools/comparison - Levenshtein similarity algorithm implementation
 * Based on fastest-levenshtein library
 * github: https://github.com/ka-weihe/fastest-levenshtein
 */
import type {
  ClosestResult,
  SimilarityMeasure,
  SimilarityOptions,
  SimilarityResult,
} from "./interfaces";

// Precalculated array for Myers algorithm
const peq = new Uint32Array(0x10000);

/**
 * Myers bit vector algorithm implementation (32-bit version)
 * Suitable for shorter strings (length<=32)
 */
const myers_32 = (a: string, b: string): number => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;
  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }
  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) {
      sc++;
    }
    if (pv & lst) {
      sc--;
    }
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  i = n;
  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }
  return sc;
};

/**
 * Myers bit vector algorithm implementation (extended version)
 * Suitable for longer strings (length>32)
 */
const myers_x = (b: string, a: string): number => {
  const n = a.length;
  const m = b.length;
  const mhc = [];
  const phc = [];
  const hsize = Math.ceil(n / 32);
  const vsize = Math.ceil(m / 32);
  for (let i = 0; i < hsize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }
  let j = 0;
  for (; j < vsize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const vlen = Math.min(32, m) + start;
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      if ((ph >>> 31) ^ pb) {
        phc[(i / 32) | 0] ^= 1 << i;
      }
      if ((mh >>> 31) ^ mb) {
        mhc[(i / 32) | 0] ^= 1 << i;
      }
      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] = 0;
    }
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const vlen = Math.min(32, m - start) + start;
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] |= 1 << k;
  }
  let score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[a.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += (ph >>> (m - 1)) & 1;
    score -= (mh >>> (m - 1)) & 1;
    if ((ph >>> 31) ^ pb) {
      phc[(i / 32) | 0] ^= 1 << i;
    }
    if ((mh >>> 31) ^ mb) {
      mhc[(i / 32) | 0] ^= 1 << i;
    }
    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] = 0;
  }
  return score;
};

/**
 * Calculate Levenshtein distance between two strings
 */
const calculateDistance = (valueA: string, valueB: string): number => {
  let a = valueA;
  let b = valueB;

  // Ensure a is the longer string to optimize calculation
  if (a.length < b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }

  // Special handling for empty strings
  if (b.length === 0) {
    return a.length;
  }

  // Choose different algorithm implementations based on string length
  if (a.length <= 32) {
    return myers_32(a, b);
  }
  return myers_x(a, b);
};

/**
 * Levenshtein similarity measure implementation
 */
export class LevenshteinMeasure implements SimilarityMeasure {
  /**
   * Calculate similarity between two strings
   */
  calculate(
    a: string,
    b: string,
    options: SimilarityOptions = {},
  ): SimilarityResult {
    const { caseSensitive = false } = options;

    // If case should be ignored, convert text to lowercase
    let textA = a;
    let textB = b;
    if (!caseSensitive) {
      textA = textA.toLowerCase();
      textB = textB.toLowerCase();
    }

    const distance = calculateDistance(textA, textB);
    const similarity = 1 - distance / Math.max(a.length, b.length);

    return {
      distance,
      similarity,
    };
  }

  /**
   * Find the closest string
   */
  findClosest(
    query: string,
    candidates: readonly string[],
    options: SimilarityOptions = {},
  ): ClosestResult {
    if (!candidates.length) {
      return {
        closest: "",
        similarity: 0,
        distance: 1,
      };
    }

    // Iterate through all candidate strings to find the one with minimum distance
    let minDistance = Number.MAX_VALUE;
    let closest = candidates[0];
    let maxSimilarity = -1;

    for (const candidate of candidates) {
      const result = this.calculate(query, candidate, options);

      if (result.distance < minDistance) {
        minDistance = result.distance;
        closest = candidate;
        // Calculate similarity
        maxSimilarity = result.similarity;
      }
    }

    return {
      closest,
      similarity: maxSimilarity,
      distance: minDistance,
    };
  }
}

/**
 * Create Levenshtein similarity measure instance
 */
export function createLevenshteinMeasure(): SimilarityMeasure {
  return new LevenshteinMeasure();
}
