# @nlptools/splitter

![npm version](https://img.shields.io/npm/v/@nlptools/splitter)
![npm license](https://img.shields.io/npm/l/@nlptools/splitter)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Text splitting utilities - LangChain.js text splitters wrapper for NLPTools

This package provides convenient access to LangChain.js text splitting utilities through the NLPTools ecosystem. It includes various text splitters for chunking documents and processing large texts.

## Installation

```bash
# Install with npm
npm install @nlptools/splitter

# Install with yarn
yarn add @nlptools/splitter

# Install with pnpm
pnpm add @nlptools/splitter
```

## Usage

### Basic Setup

```typescript
import {
  RecursiveCharacterTextSplitter,
  CharacterTextSplitter,
  MarkdownTextSplitter,
  TokenTextSplitter,
} from "@nlptools/splitter";
```

### Available Splitters

- **RecursiveCharacterTextSplitter** - Splits text recursively using different separators
- **CharacterTextSplitter** - Splits text by character count
- **MarkdownTextSplitter** - Specialized splitter for Markdown documents
- **TokenTextSplitter** - Splits text by token count
- **LatexTextSplitter** - Specialized splitter for LaTeX documents

### Example Usage

```typescript
import { RecursiveCharacterTextSplitter } from "@nlptools/splitter";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const text = "Your long text content here...";
const chunks = await splitter.splitText(text);
console.log(chunks);
```

## Features

- 📝 **Multiple Splitting Strategies**: Character, token, and format-aware splitting
- 🔧 **Configurable**: Customizable chunk size and overlap
- 📦 **TypeScript First**: Full type safety
- 🚀 **Based on LangChain.js**: Reliable and well-tested implementations

## References

This package incorporates and builds upon the following excellent open source projects:

- [LangChain.js Text Splitters](https://docs.langchain.com/oss/javascript/integrations/splitters) - Core text splitting implementations via `@langchain/textsplitters`

## License

[MIT](../../LICENSE) &copy; [Demo Macro](https://imst.xyz/)
