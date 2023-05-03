# @nlptools/similarity

![npm version](https://img.shields.io/npm/v/@nlptools/similarity)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/similarity)
![npm license](https://img.shields.io/npm/l/@nlptools/similarity)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Multiple algorithms for similarity, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/similarity

# yarn
$ yarn add @nlptools/similarity

# pnpm
$ pnpm add @nlptools/similarity
```

## Usage

```ts
// levenshtein distance
import { levenshteinDistance } from "@nlptools/similarity";

const distance = levenshteinDistance("Hello, world!", "Hello, world?");
```

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
