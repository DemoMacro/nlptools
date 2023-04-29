export function splitSentences(text: string): string[] {
  return text.split(/[\p{P}]+/);
}
