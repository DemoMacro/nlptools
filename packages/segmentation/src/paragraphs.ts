export function splitParagraphs(text: string): string[] {
  return text.split(/[\f\n\r\t\v]+/);
}
