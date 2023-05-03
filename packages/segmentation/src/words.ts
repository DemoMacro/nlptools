import { SupportedLanguages } from "./types";
import { cut } from "@node-rs/jieba";

export function splitWord(
  text: string,
  options: {
    lang?: SupportedLanguages;
  }
) {
  switch (options.lang) {
    case "zh":
      return cut(text, true);
    default:
      return text.split(/(\x20|[.?!;]+\x20)/g);
  }
}
