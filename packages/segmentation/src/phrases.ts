import type { SupportedLanguages } from "./types";
import { segmentParagraphs } from "./paragraphs";

export function segmentPhrases(
  text: string,
  options: {
    lang?: SupportedLanguages;
  }
) {
  const paragraphs = segmentParagraphs(text);

  switch (options.lang) {
    case "zh":
      return paragraphs
        .flatMap((paragraph: string) =>
          paragraph.match(/[^，。？！；]+[，。？！；]*[\p{P}]*/gm)
        )
        .filter((w) => !!w);
    default:
      return paragraphs
        .flatMap((paragraph: string) =>
          paragraph.match(/[^,.?!;]+[,.?!;]*([\x20]*)/gm)
        )
        .filter((w) => !!w);
  }
}
