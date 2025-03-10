/**
 * @nlptools/core - Core utilities and interfaces for NLP tools
 */

/**
 * Supported language types
 */
export type SupportedLanguages = "en" | "zh" | "auto";

/**
 * Base configuration options interface
 */
export interface BaseOptions {
  /**
   * Language setting
   * @default "auto"
   */
  lang?: SupportedLanguages;
}

/**
 * Text processing result interface
 */
export interface TextProcessingResult<T> {
  /**
   * Processing result
   */
  result: T;

  /**
   * Metadata information
   */
  metadata?: Record<string, unknown>;
}

/**
 * Text processor interface
 */
export interface TextProcessor<T, O extends BaseOptions = BaseOptions> {
  /**
   * Process text
   * @param text Input text
   * @param options Processing options
   * @returns Processing result
   */
  process(text: string, options?: O): TextProcessingResult<T>;
}

/**
 * Detect language type
 * @param text Input text
 * @returns Detected language type
 */
export function detectLanguage(text: string): SupportedLanguages {
  // Simple language detection logic, check if contains Chinese characters
  const hasChineseChar = /[\u4e00-\u9fa5]/.test(text);
  return hasChineseChar ? "zh" : "en";
}

/**
 * Process language options, auto-detect if set to auto
 * @param text Input text
 * @param lang Language option
 * @returns Determined language type
 */
export function resolveLanguage(
  text: string,
  lang: SupportedLanguages = "auto",
): SupportedLanguages {
  if (lang === "auto") {
    return detectLanguage(text);
  }
  return lang;
}

/**
 * Text cleaning options
 */
export interface TextCleanOptions extends BaseOptions {
  /**
   * Whether to remove punctuation
   * @default false
   */
  removePunctuation?: boolean;

  /**
   * Whether to remove numbers
   * @default false
   */
  removeNumbers?: boolean;

  /**
   * Whether to remove whitespace
   * @default true
   */
  removeWhitespace?: boolean;

  /**
   * Whether to convert to lowercase
   * @default false
   */
  toLowerCase?: boolean;
}

/**
 * Clean text
 * @param text Input text
 * @param options Cleaning options
 * @returns Cleaned text
 */
export function cleanText(
  text: string,
  options: TextCleanOptions = {},
): string {
  const {
    removePunctuation = false,
    removeNumbers = false,
    removeWhitespace = true,
    toLowerCase = false,
  } = options;

  let result = text;

  if (removePunctuation) {
    // Remove Chinese and English punctuation marks
    result = result.replace(/[\p{P}]/gu, "");
  }

  if (removeNumbers) {
    result = result.replace(/\d+/g, "");
  }

  if (removeWhitespace) {
    result = result.replace(/\s+/g, "");
  }

  if (toLowerCase) {
    result = result.toLowerCase();
  }

  return result;
}
