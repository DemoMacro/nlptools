export function segmentParagraphs(text: string): string[] {
  return text.split(/[\f\n\r\t\v]+/);
}
