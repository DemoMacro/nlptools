# @nlptools/core

![npm version](https://img.shields.io/npm/v/@nlptools/core)
![npm downloads](https://img.shields.io/npm/dw/@nlptools/core)
![npm license](https://img.shields.io/npm/l/@nlptools/core)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Core utilities and interfaces for NLP tools, powered by Demo Macro.

## Getting started

```bash
# npm
$ npm install @nlptools/core

# yarn
$ yarn add @nlptools/core

# pnpm
$ pnpm add @nlptools/core
```

## Usage

```ts
import {
  resolveLanguage,
  type SupportedLanguages,
  type BaseOptions,
} from "@nlptools/core";

// Detect language automatically
const lang = resolveLanguage("Hello, world!"); // returns "en"

// Use BaseOptions in your own interfaces
interface MyOptions extends BaseOptions {
  customOption?: string;
}

// Create a text processor
const processor: TextProcessor<string, MyOptions> = {
  process(text: string, options?: MyOptions) {
    const lang = resolveLanguage(text, options?.lang);
    // Process text based on language and options
    return {
      result: text,
      metadata: { lang },
    };
  },
};
```

## API Reference

### Types

#### `SupportedLanguages`

Supported language types: `"en"` | `"zh"` | `"auto"`

#### `BaseOptions`

Base configuration options interface with language setting.

#### `TextProcessingResult<T>`

Text processing result interface with result and optional metadata.

#### `TextProcessor<T, O>`

Text processor interface for processing text with options.

### Functions

#### `resolveLanguage(text: string, preferredLang?: SupportedLanguages): string`

Detects or resolves the language of the provided text.

## License

- [MIT](LICENSE) &copy; [Demo Macro](https://imst.xyz/)
