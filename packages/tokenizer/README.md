# @nlptools/tokenizer

![npm version](https://img.shields.io/npm/v/@nlptools/tokenizer)
![npm license](https://img.shields.io/npm/l/@nlptools/tokenizer)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Tokenization utilities - HuggingFace tokenizers wrapper for NLPTools

This package provides convenient access to HuggingFace tokenization utilities through the NLPTools ecosystem. It includes fast, client-side tokenization for various LLM models and supports both browser and Node.js environments.

## Installation

```bash
# Install with npm
npm install @nlptools/tokenizer

# Install with yarn
yarn add @nlptools/tokenizer

# Install with pnpm
pnpm add @nlptools/tokenizer
```

## Usage

### Basic Setup

```typescript
import { Tokenizer } from "@nlptools/tokenizer";
```

### Available Functions

- **Tokenizer** - Main tokenizer class for encoding and decoding text
- **encode()** - Convert text to token IDs and tokens
- **decode()** - Convert token IDs back to text
- **tokenize()** - Split text into token strings
- ** AddedToken** - Custom token configuration class

### Example Usage

```typescript
import { Tokenizer } from "@nlptools/tokenizer";

// Load tokenizer from HuggingFace Hub
const modelId = "HuggingFaceTB/SmolLM3-3B";
const tokenizerJson = await fetch(
  `https://huggingface.co/${modelId}/resolve/main/tokenizer.json`,
).then((res) => res.json());
const tokenizerConfig = await fetch(
  `https://huggingface.co/${modelId}/resolve/main/tokenizer_config.json`,
).then((res) => res.json());

// Create tokenizer instance
const tokenizer = new Tokenizer(tokenizerJson, tokenizerConfig);

// Encode text
const encoded = tokenizer.encode("Hello World");
console.log(encoded.ids); // [9906, 4435]
console.log(encoded.tokens); // ['Hello', 'ĠWorld']
console.log(encoded.attention_mask); // [1, 1]

// Decode back to text
const decoded = tokenizer.decode(encoded.ids);
console.log(decoded); // 'Hello World'

// Get token count
const tokenCount = tokenizer.encode("This is a sentence.").ids.length;
console.log(`Token count: ${tokenCount}`);
```

## Features

- 🚀 **Fast & Lightweight**: Zero-dependency implementation for client-side use
- 🔧 **Model Compatible**: Works with HuggingFace model tokenizers
- 📱 **Cross-Platform**: Supports both browser and Node.js environments
- 📦 **TypeScript First**: Full type safety with comprehensive API
- 🌐 **HuggingFace Hub**: Direct integration with model repositories

## References

This package incorporates and builds upon the following excellent open source projects:

- [HuggingFace Tokenizers.js](https://github.com/huggingface/tokenizers.js) - Core tokenization implementations via `@huggingface/tokenizers`

## License

[MIT](../../LICENSE) &copy; [Demo Macro](https://imst.xyz/)
