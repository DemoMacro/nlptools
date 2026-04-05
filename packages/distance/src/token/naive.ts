/**
 * Naive string similarity measures: prefix, suffix, length.
 *
 * Time: O(min(m, n)) for prefix/suffix, O(1) for length
 */

/**
 * Compute prefix similarity between two strings.
 *
 * prefix(a, b) = commonPrefixLength / max(|a|, |b|)
 *
 * @param a - First string
 * @param b - Second string
 * @returns Prefix similarity in [0, 1]
 */
export function prefix(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  let commonLen = 0;
  while (
    commonLen < a.length &&
    commonLen < b.length &&
    a.charCodeAt(commonLen) === b.charCodeAt(commonLen)
  ) {
    commonLen++;
  }

  return commonLen / maxLen;
}

/**
 * Compute suffix similarity between two strings.
 *
 * suffix(a, b) = commonSuffixLength / max(|a|, |b|)
 *
 * @param a - First string
 * @param b - Second string
 * @returns Suffix similarity in [0, 1]
 */
export function suffix(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  let commonLen = 0;
  const aEnd = a.length;
  const bEnd = b.length;
  while (
    commonLen < aEnd &&
    commonLen < bEnd &&
    a.charCodeAt(aEnd - 1 - commonLen) === b.charCodeAt(bEnd - 1 - commonLen)
  ) {
    commonLen++;
  }

  return commonLen / maxLen;
}

/**
 * Compute length-based similarity between two strings.
 *
 * length(a, b) = 1 - |len(a) - len(b)| / max(len(a), len(b))
 *
 * @param a - First string
 * @param b - Second string
 * @returns Normalized length similarity in [0, 1]
 */
export function length(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - Math.abs(a.length - b.length) / maxLen;
}
