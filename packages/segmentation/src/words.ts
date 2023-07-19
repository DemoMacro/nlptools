import type { SupportedLanguages } from "./types";
import { cut } from "jieba-wasm";

export function segmentWords(
  text: string,
  options: {
    lang?: SupportedLanguages;
  }
) {
  switch (options.lang) {
    case "zh":
      return cut(text, true) as string[];
    default:
      return text
        .replace(/([\x20,.;:?!])/gm, "\r\n$1\r\n")
        .split(/[\f\n\r\t\v]+/gm)
        .map((s) => s.trim())
        .filter((w) => !!w);
  }
}
