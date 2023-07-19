export function segmentParagraphs(text: string) {
  return text
    .split(/[\f\n\r\t\v]+/gm)
    .map((s) => s.trim())
    .filter((w) => !!w);
}
