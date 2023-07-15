import type { SupportedLanguages } from "./types";
import { segmentParagraphs } from "./paragraphs";

export function segmentSentences(
  text: string,
  options: {
    lang?: SupportedLanguages;
  }
) {
  const paragraphs = segmentParagraphs(text);

  switch (options.lang) {
    case "zh":
      return paragraphs.flatMap((paragraph: string) =>
        paragraph.match(/[^。？！；]+[。？！；]*[\p{P}]*/gm)
      );
    default:
      // return text.match(/[^.?!;]+[.?!;]*(\x20*)/gm);
      return paragraphs.flatMap((paragraph: string) =>
        paragraph.match(/[^.?!;]+[.?!;]*(\x20*)/gm)
      );
  }
}
