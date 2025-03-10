/**
 * @nlptools/comparison - Difference comparison algorithm implementation
 */
import {
  AlgorithmSelector,
  BaseComparison,
  type ExtendedBaseComparisonOptions,
} from "./base";
import type {
  Comparator,
  DiffComparisonResult,
  SegmentationLevel,
} from "./interfaces";

/**
 * Calculate the longest common subsequence of two arrays
 * @param a First array
 * @param b Second array
 * @returns Length matrix of the longest common subsequence
 */
function computeLCSMatrix<T>(a: T[], b: T[]): number[][] {
  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  return matrix;
}

/**
 * Backtrack through LCS matrix to calculate differences
 * @param a Source array
 * @param b Target array
 * @param matrix LCS length matrix
 * @returns Difference result array
 */
function backtrackLCS<T>(
  a: T[],
  b: T[],
  matrix: number[][],
): Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> {
  const result: Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> =
    [];
  let i = a.length;
  let j = b.length;
  let currentType: "added" | "removed" | "unchanged" | null = null;
  let currentValues: T[] = [];

  // Helper function to add currently collected items to the result
  const pushCurrent = () => {
    if (currentType && currentValues.length > 0) {
      result.unshift({ type: currentType, value: [...currentValues] });
      currentValues = [];
    }
  };

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      // Same element, mark as unchanged
      if (currentType !== "unchanged") {
        pushCurrent();
        currentType = "unchanged";
      }
      currentValues.unshift(a[i - 1]);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      // Add element, mark as added
      if (currentType !== "added") {
        pushCurrent();
        currentType = "added";
      }
      currentValues.unshift(b[j - 1]);
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      // Remove element, mark as removed
      if (currentType !== "removed") {
        pushCurrent();
        currentType = "removed";
      }
      currentValues.unshift(a[i - 1]);
      i--;
    }
  }

  // Add the last collected items
  pushCurrent();

  return result;
}

/**
 * Compare the differences between two arrays
 * @param sourceArray Source array
 * @param targetArray Target array
 * @returns Difference result
 */
function diffArrays<T>(
  sourceArray: T[],
  targetArray: T[],
): Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> {
  const lcsMatrix = computeLCSMatrix(sourceArray, targetArray);
  return backtrackLCS(sourceArray, targetArray, lcsMatrix);
}

/**
 * Extended comparison options with algorithm selection for diff
 */
export interface ExtendedDiffComparisonOptions
  extends ExtendedBaseComparisonOptions {
  /**
   * Diff algorithm to use
   * @default "lcs"
   */
  algorithm?: "lcs" | "myers" | "patience";

  /**
   * Whether to calculate similarity ratio
   * @default false
   */
  calculateSimilarity?: boolean;

  /**
   * Algorithm mapping for different segmentation levels
   * This allows specifying different algorithms for different segmentation levels
   * @example { paragraphs: "patience", sentences: "lcs", phrases: "myers", words: "myers" }
   */
  algorithmMapping?: {
    [key in SegmentationLevel]?: "lcs" | "myers" | "patience";
  };

  /**
   * Minimum segmentation level to use when adaptive segmentation is enabled
   * The system will start with the specified segmentation level and progressively
   * move to smaller units if similarity is not sufficient
   * @default "paragraphs"
   */
  minSegmentationLevel?: SegmentationLevel;

  /**
   * Whether to use adaptive segmentation (progressively smaller units)
   * @default false
   */
  useAdaptiveSegmentation?: boolean;

  /**
   * Similarity threshold for adaptive segmentation to move to a smaller unit
   * If the similarity is below this threshold, the system will try a smaller segmentation unit
   * @default 0.5
   */
  adaptiveSegmentationThreshold?: number;
}

// This function is replaced by AlgorithmSelector.getBestDiffAlgorithm from base.ts

/**
 * Create difference comparator
 * @returns Difference comparator instance
 */
/**
 * Myers bit-vector algorithm implementation for efficient diff
 * @param a Source array
 * @param b Target array
 * @returns Difference result
 */
function myersDiff<T>(
  a: T[],
  b: T[],
): Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> {
  // Special case for empty arrays
  if (a.length === 0) {
    return b.length === 0 ? [] : [{ type: "added", value: [...b] }];
  }
  if (b.length === 0) {
    return [{ type: "removed", value: [...a] }];
  }

  // Implementation of Myers algorithm using bit vectors
  const MAX_D = a.length + b.length;
  const V = new Map<number, number>();
  const trace: Array<Map<number, number>> = [];

  // Find the end point of the shortest edit script
  let x = 0;
  let y = 0;
  let d = 0;
  outer: for (d = 0; d <= MAX_D; d++) {
    trace.push(new Map(V));
    for (let k = -d; k <= d; k += 2) {
      if (k === -d || (k !== d && (V.get(k - 1) ?? 0) < (V.get(k + 1) ?? 0))) {
        x = V.get(k + 1) || 0;
      } else {
        x = (V.get(k - 1) || 0) + 1;
      }
      y = x - k;

      // Follow diagonal
      while (x < a.length && y < b.length && a[x] === b[y]) {
        x++;
        y++;
      }

      V.set(k, x);

      if (x >= a.length && y >= b.length) {
        break outer;
      }
    }
  }

  // Backtrack to find the edit script
  const result: Array<{
    type: "added" | "removed" | "unchanged";
    value: T[];
  }> = [];
  let currentType: "added" | "removed" | "unchanged" | null = null;
  let currentValues: T[] = [];

  // Helper function to add currently collected items to the result
  const pushCurrent = () => {
    if (currentType && currentValues.length > 0) {
      result.push({ type: currentType, value: [...currentValues] });
      currentValues = [];
    }
  };

  x = a.length;
  y = b.length;

  for (d = trace.length - 1; d >= 0; d--) {
    const V = trace[d];
    const k = x - y;

    let prevK: number;
    if (k === -d || (k !== d && (V.get(k - 1) ?? 0) < (V.get(k + 1) ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = V.get(prevK) || 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      // Diagonal move (unchanged)
      if (currentType !== "unchanged") {
        pushCurrent();
        currentType = "unchanged";
      }
      currentValues.unshift(a[--x]);
      --y;
    }

    if (d === 0) break;

    if (prevX === x) {
      // Vertical move (added)
      if (currentType !== "added") {
        pushCurrent();
        currentType = "added";
      }
      currentValues.unshift(b[--y]);
    } else {
      // Horizontal move (removed)
      if (currentType !== "removed") {
        pushCurrent();
        currentType = "removed";
      }
      currentValues.unshift(a[--x]);
    }
  }

  // Add the last collected items
  pushCurrent();

  return result;
}

/**
 * Patience diff algorithm implementation for structured text
 * @param a Source array
 * @param b Target array
 * @returns Difference result
 */
function patienceDiff<T>(
  a: T[],
  b: T[],
): Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> {
  // Find unique common elements
  const uniqueCommon = (
    aArray: T[],
    bArray: T[],
  ): Array<{ indexA: number; indexB: number; value: T }> => {
    const common: Array<{ indexA: number; indexB: number; value: T }> = [];
    const aProcessed = new Set<number>();
    const bProcessed = new Set<number>();

    // Create maps of elements to their indices
    const aMap = new Map<T, number[]>();
    const bMap = new Map<T, number[]>();

    // 使用for循环替代forEach以提高性能
    for (let i = 0; i < aArray.length; i++) {
      const item = aArray[i];
      const indices = aMap.get(item) || [];
      indices.push(i);
      aMap.set(item, indices);
    }

    for (let i = 0; i < bArray.length; i++) {
      const item = bArray[i];
      const indices = bMap.get(item) || [];
      indices.push(i);
      bMap.set(item, indices);
    }

    // Find unique common elements
    for (const [val, aIndices] of aMap.entries()) {
      const bIndices = bMap.get(val);
      if (bIndices && aIndices.length === 1 && bIndices.length === 1) {
        common.push({
          indexA: aIndices[0],
          indexB: bIndices[0],
          value: val as T,
        });
      }
    }

    return common.sort((a, b) => a.indexA - b.indexA);
  };

  // Recursive implementation of patience diff
  const patience = (
    aStart: number,
    aEnd: number,
    bStart: number,
    bEnd: number,
  ): Array<{ type: "added" | "removed" | "unchanged"; value: T[] }> => {
    // Find unique common elements in current subsequences
    const uniqueCommonMap = uniqueCommon(
      a.slice(aStart, aEnd),
      b.slice(bStart, bEnd),
    );

    // Adjust indices to be absolute
    const uniqueCommonPoints = uniqueCommonMap.map((point) => ({
      indexA: point.indexA + aStart,
      indexB: point.indexB + bStart,
      value: point.value,
    }));

    if (uniqueCommonPoints.length === 0) {
      // No common elements, everything is either added or removed
      const result: Array<{
        type: "added" | "removed" | "unchanged";
        value: T[];
      }> = [];
      if (aStart < aEnd) {
        result.push({ type: "removed", value: a.slice(aStart, aEnd) });
      }
      if (bStart < bEnd) {
        result.push({ type: "added", value: b.slice(bStart, bEnd) });
      }
      return result;
    }

    // Process the first point
    const result: Array<{
      type: "added" | "removed" | "unchanged";
      value: T[];
    }> = [];
    const firstPoint = uniqueCommonPoints[0];

    // Handle elements before the first common point
    result.push(
      ...patience(aStart, firstPoint.indexA, bStart, firstPoint.indexB),
    );

    // Add the common element
    result.push({ type: "unchanged", value: [firstPoint.value] });

    // Process remaining points
    let lastPoint = firstPoint;
    for (let i = 1; i < uniqueCommonPoints.length; i++) {
      const point = uniqueCommonPoints[i];
      // Process elements between last point and current point
      result.push(
        ...patience(
          lastPoint.indexA + 1,
          point.indexA,
          lastPoint.indexB + 1,
          point.indexB,
        ),
      );
      // Add the common element
      result.push({ type: "unchanged", value: [point.value] });
      lastPoint = point;
    }

    // Handle elements after the last common point
    result.push(
      ...patience(lastPoint.indexA + 1, aEnd, lastPoint.indexB + 1, bEnd),
    );

    return result;
  };

  // Start the recursive process
  return patience(0, a.length, 0, b.length);
}

export function createDiffComparator(): Comparator {
  // Create an instance of the base comparison class
  const baseComparison = new BaseComparison();

  return {
    /**
     * Compare the differences between two texts
     * @param source Source text
     * @param target Target text
     * @param options Comparison options
     * @returns Difference comparison result
     */
    compare(
      source: string,
      target: string,
      options?: ExtendedDiffComparisonOptions,
    ): DiffComparisonResult {
      const {
        segmentationLevel = "paragraphs",
        algorithm,
        autoSelectAlgorithm = true,
        includeDetails = true,
        calculateSimilarity = true,
        useAdaptiveSegmentation = false,
        minSegmentationLevel = "paragraphs",
        adaptiveSegmentationThreshold = 0.5,
        algorithmMapping = {},
      } = options || {};

      // Define segmentation levels in order from largest to smallest
      const segmentationLevels: SegmentationLevel[] = [
        "paragraphs",
        "sentences",
        "phrases",
        "words",
      ];

      // Find the starting index for segmentation level
      const startLevelIndex = segmentationLevels.indexOf(segmentationLevel);
      const minLevelIndex = segmentationLevels.indexOf(minSegmentationLevel);

      // Validate segmentation levels
      if (startLevelIndex === -1) {
        throw new Error(`Invalid segmentation level: ${segmentationLevel}`);
      }
      if (minLevelIndex === -1) {
        throw new Error(
          `Invalid minimum segmentation level: ${minSegmentationLevel}`,
        );
      }

      // Track segmentation level usage for detailed reporting
      const segmentationLevelUsage: Record<SegmentationLevel, number> = {
        paragraphs: 0,
        sentences: 0,
        phrases: 0,
        words: 0,
      };

      // Initialize variables for diff processing
      let changes: Array<{
        type: "added" | "removed" | "unchanged";
        value: string;
      }> = [];
      let addedCount = 0;
      let removedCount = 0;
      let unchangedCount = 0;

      // Process with adaptive segmentation if enabled
      if (useAdaptiveSegmentation) {
        // Process with adaptive segmentation strategy
        const result = processWithAdaptiveSegmentation(
          source,
          target,
          startLevelIndex,
          minLevelIndex,
          segmentationLevels,
          options,
          segmentationLevelUsage,
        );

        changes = result.changes;
        addedCount = result.addedCount;
        removedCount = result.removedCount;
        unchangedCount = result.unchangedCount;
      } else {
        // Standard processing with single segmentation level
        // Process text segments using the base class method
        const { sourceSegments, targetSegments, resolvedLang } =
          baseComparison.processTextSegments(source, target, options || {});

        // Determine which algorithm to use
        let selectedAlgorithm = algorithm;
        if (!selectedAlgorithm && autoSelectAlgorithm) {
          selectedAlgorithm =
            AlgorithmSelector.getBestDiffAlgorithm(segmentationLevel);
        } else if (!selectedAlgorithm) {
          selectedAlgorithm = "lcs";
        }

        // If algorithm mapping is provided for this level, use it
        if (algorithmMapping[segmentationLevel]) {
          selectedAlgorithm = algorithmMapping[segmentationLevel] as
            | "lcs"
            | "myers"
            | "patience";
        }

        // Process the diff based on the selected algorithm
        const diffResult = processDiff(
          sourceSegments,
          targetSegments,
          selectedAlgorithm as "lcs" | "myers" | "patience",
        );
        changes = diffResult.changes;
        addedCount = diffResult.addedCount;
        removedCount = diffResult.removedCount;
        unchangedCount = diffResult.unchangedCount;

        // Update segmentation level usage for standard processing
        segmentationLevelUsage[segmentationLevel] = sourceSegments?.length || 0;
      }

      // 删除重复的myersDiff和patienceDiff函数定义，因为这些函数已经在文件顶部定义过了

      // Calculate similarity ratio if requested
      let similarityRatio: number | undefined;
      if (calculateSimilarity) {
        const totalSegments = addedCount + removedCount + unchangedCount;
        similarityRatio =
          totalSegments > 0 ? unchangedCount / totalSegments : 1;
      }

      // Prepare result object
      const result: DiffComparisonResult = {
        changes,
        similarityRatio,
      };

      // Add detailed information if requested
      if (includeDetails) {
        // 使用baseComparison获取sourceSegments和targetSegments的长度
        // 这样可以确保在任何情况下都能获取到正确的值
        const { sourceSegments, targetSegments } =
          baseComparison.processTextSegments(source, target, {
            ...options,
            segmentationLevel,
          });

        result.details = {
          sourceSize: sourceSegments.length,
          targetSize: targetSegments.length,
          addedCount,
          removedCount,
          unchangedCount,
          algorithm: useAdaptiveSegmentation
            ? "adaptive"
            : algorithm ||
              (autoSelectAlgorithm
                ? AlgorithmSelector.getBestDiffAlgorithm(segmentationLevel)
                : "lcs"),
          segmentationLevel,
        };

        // Add segmentation level usage if adaptive segmentation was used
        if (useAdaptiveSegmentation) {
          result.details.segmentationLevelUsage = segmentationLevelUsage;
        }
      }

      return result;
    },
  };
}

/**
 * Process diff based on selected algorithm
 * @param sourceSegments Source segments
 * @param targetSegments Target segments
 * @param algorithm Algorithm to use
 * @returns Processed diff result
 */
function processDiff(
  sourceSegments: string[],
  targetSegments: string[],
  algorithm: "lcs" | "myers" | "patience",
): {
  changes: Array<{ type: "added" | "removed" | "unchanged"; value: string }>;
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
} {
  // Calculate diff based on the selected algorithm
  let diffResult: Array<{
    type: "added" | "removed" | "unchanged";
    value: string[];
  }>;
  switch (algorithm) {
    case "myers":
      diffResult = myersDiff(sourceSegments, targetSegments);
      break;
    case "patience":
      diffResult = patienceDiff(sourceSegments, targetSegments);
      break;
    default:
      diffResult = diffArrays(sourceSegments, targetSegments);
      break;
  }

  // Count changes and convert segment arrays to strings
  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;
  const changes: Array<{
    type: "added" | "removed" | "unchanged";
    value: string;
  }> = [];

  for (const change of diffResult) {
    // Convert segment arrays to strings
    const value = change.value.join("\n");
    changes.push({ type: change.type, value });

    // Count changes
    switch (change.type) {
      case "added":
        addedCount += change.value.length;
        break;
      case "removed":
        removedCount += change.value.length;
        break;
      case "unchanged":
        unchangedCount += change.value.length;
        break;
    }
  }

  return {
    changes,
    addedCount,
    removedCount,
    unchangedCount,
  };
}

/**
 * Process text with adaptive segmentation strategy
 * @param source Source text
 * @param target Target text
 * @param startLevelIndex Starting segmentation level index
 * @param minLevelIndex Minimum segmentation level index
 * @param segmentationLevels Array of segmentation levels
 * @param options Comparison options
 * @param levelUsage Record to track segmentation level usage
 * @returns Processed diff result
 */
function processWithAdaptiveSegmentation(
  source: string,
  target: string,
  startLevelIndex: number,
  minLevelIndex: number,
  segmentationLevels: SegmentationLevel[],
  options?: ExtendedDiffComparisonOptions,
  levelUsage: Record<SegmentationLevel, number> = {
    paragraphs: 0,
    sentences: 0,
    phrases: 0,
    words: 0,
  },
): {
  changes: Array<{ type: "added" | "removed" | "unchanged"; value: string }>;
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
} {
  // Create a base comparison instance
  const baseComparison = new BaseComparison();

  // Initialize options with defaults
  const processOptions: ExtendedDiffComparisonOptions = {
    algorithm: undefined,
    autoSelectAlgorithm: true,
    algorithmMapping: {},
    ignoreCase: false,
    adaptiveSegmentationThreshold: 0.5,
    ...options,
  };

  // Start with the largest segmentation level
  const currentLevel = segmentationLevels[startLevelIndex];

  // Process text segments at the current level
  const { sourceSegments, targetSegments } = baseComparison.processTextSegments(
    source,
    target,
    { ...processOptions, segmentationLevel: currentLevel },
  );

  // Select the appropriate algorithm for this level
  let selectedAlgorithm = processOptions.algorithm;
  if (!selectedAlgorithm && processOptions.autoSelectAlgorithm) {
    selectedAlgorithm = AlgorithmSelector.getBestDiffAlgorithm(currentLevel);
  } else if (!selectedAlgorithm) {
    selectedAlgorithm = "lcs";
  }

  // If algorithm mapping is provided for this level, use it
  if (processOptions.algorithmMapping?.[currentLevel]) {
    selectedAlgorithm = processOptions.algorithmMapping[currentLevel] as
      | "lcs"
      | "myers"
      | "patience";
  }

  // Process the diff based on the selected algorithm
  const result = processDiff(
    sourceSegments,
    targetSegments,
    selectedAlgorithm as "lcs" | "myers" | "patience",
  );

  // Update segmentation level usage
  levelUsage[currentLevel] += sourceSegments.length;

  // If we can go deeper and should try smaller units
  if (
    startLevelIndex < minLevelIndex &&
    result.unchangedCount /
      (result.addedCount + result.removedCount + result.unchangedCount) <
      (processOptions.adaptiveSegmentationThreshold || 0.5)
  ) {
    // Try with next smaller segmentation level
    return processWithAdaptiveSegmentation(
      source,
      target,
      startLevelIndex + 1,
      minLevelIndex,
      segmentationLevels,
      processOptions,
      levelUsage,
    );
  }

  return result;
}
