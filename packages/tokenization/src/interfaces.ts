/**
 * @nlptools/tokenization - Interface definitions
 */
import type { BaseOptions, SupportedLanguages } from "@nlptools/core";

/**
 * Tokenization granularity levels
 */
export type TokenizationType = "paragraphs" | "sentences" | "words"; // Removed "phrases" for now

/**
 * Tokenization options
 */
export interface TokenizationOptions extends BaseOptions {
  /**
   * Language
   * @default "auto"
   */
  lang?: SupportedLanguages;

  // chineseDictionary is removed as retext handles tokenization differently.
  // Specific options for Chinese might be needed later if using a dedicated library.
}

/**
 * Tokenizer interface
 */
export interface Tokenizer {
  /**
   * Tokenize text based on the configured type and options.
   * @param text Text to be tokenized
   * @param options Tokenization options
   * @returns Array of tokens (strings)
   */
  tokenize(text: string, options?: TokenizationOptions): string[];
}
