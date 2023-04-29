import { cut } from "@node-rs/jieba";

export function splitWord(text: string, lang?: "zh"): string[] {
  if (lang === "zh") {
    return cut(text, true);
  } else {
    return text.split(/\s+/);
  }
}
