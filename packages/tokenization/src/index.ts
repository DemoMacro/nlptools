import { resolveLanguage } from "@nlptools/core";
import type { Paragraph, Sentence, Word } from "nlcst";
import { toString as nlcstToString } from "nlcst-to-string";
import { retext } from "retext"; // Import the main retext processor factory
import retextEnglish from "retext-english";
/**
 * @nlptools/tokenization - Text tokenization toolkit using retext
 */
import type { Processor } from "unified";
import { visit } from "unist-util-visit";
import type {
  TokenizationOptions,
  TokenizationType,
  Tokenizer,
} from "./interfaces";

/**
 * Creates a tokenizer instance using retext.
 * @param type The granularity of tokenization (paragraphs, sentences, words).
 * @returns A Tokenizer instance.
 */
export function createTokenizer(type: TokenizationType): Tokenizer {
  return {
    tokenize(text: string, options?: TokenizationOptions): string[] {
      const { lang = "auto" } = options || {};
      const resolvedLang = resolveLanguage(text, lang);
      const tokens: string[] = [];
      // Use generic processor type and 'as any' casts due to persistent type issues

      // Start with the base retext processor (uses retext-latin)
      const processor = retext(); // Use 'as any' for the base processor

      // If language is English, add the specific English parser plugin
      if (resolvedLang === "en") {
        processor.use(
          retextEnglish as unknown as Parameters<Processor["use"]>[0],
        ); // Use 'as any' for the plugin
      } else {
        // For non-English, issue warning
        console.warn(
          `Using general Latin-script parser for language '${resolvedLang}'. Paragraph tokenization should work, but sentence/word tokenization might be less accurate.`,
        );
      }

      const tree = processor.parse(text);

      switch (type) {
        case "paragraphs":
          visit(tree, "ParagraphNode", (node: Paragraph) => {
            tokens.push(nlcstToString(node).trim());
          });
          break;
        case "sentences":
          visit(tree, "SentenceNode", (node: Sentence) => {
            tokens.push(nlcstToString(node).trim());
          });
          break;
        case "words":
          visit(tree, "WordNode", (node: Word) => {
            tokens.push(nlcstToString(node));
          });
          break;
        default:
          throw new Error(`Unsupported tokenization type: ${type}`);
      }

      return tokens.filter((t) => t.length > 0);
    },
  };
}

export * from "./interfaces";
