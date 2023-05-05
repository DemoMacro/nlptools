import { SupportedLanguages } from "./types";

export function segmentPhrases(
  text: string,
  options: {
    lang?: SupportedLanguages;
  }
) {
  switch (options.lang) {
    case "zh":
      return text.match(/[^，。？！；]+[。？！；]*[\p{P}]*/g);
    default:
      return text.match(/[^,.?!;]+[.?!;]*([\x20]*)/g);
  }
}
