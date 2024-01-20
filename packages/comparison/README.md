# @nlptools/comparison

![npm version](https://img.shields.io/npm/v/@nlptools/comparison)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/comparison)
![npm license](https://img.shields.io/npm/l/@nlptools/comparison)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Programmatically create text comparisons, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/comparison

# yarn
$ yarn add @nlptools/comparison

# pnpm
$ pnpm add @nlptools/comparison
```

## Usage

```ts
// diff
import { createDiffComparison } from "@nlptools/comparison";

const diff = createDiffComparison("Hello, world!", "Hello, world?", {
  // options
  ignoreCase: false,
  lang: "en",
  segmentation: "chars",
});

// similarity
import { createSimilarityComparison } from "@nlptools/comparison";

const similarity = createSimilarityComparison(
  "Hello, world!",
  "Hello, world?",
  {
    // options
    lang: "en",
    threshold: 10,
  },
);
```

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
