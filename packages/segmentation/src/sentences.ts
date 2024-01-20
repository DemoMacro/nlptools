import type { SupportedLanguages } from "./types";

export function segmentSentences(
  text: string,
  options: {
    lang?: SupportedLanguages;
  },
) {
  switch (options.lang) {
    case "zh":
      return text
        .replace(/([。；？！])/gm, "$1\r\n")
        .split(/[\f\n\r\t\v]+/gm)
        .map((s) => s.trim())
        .filter((w) => !!w);
    default:
      return text
        .replace(/([.;?!])/gm, "$1\r\n")
        .split(/[\f\n\r\t\v]+/gm)
        .map((s) => s.trim())
        .filter((w) => !!w);
  }
}
