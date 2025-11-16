# NLPTools

![GitHub](https://img.shields.io/github/license/DemoMacro/nlptools)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Comprehensive NLP toolkit with high-performance string distance and similarity algorithms

NLPTools provides a complete suite of natural language processing tools, including high-performance WebAssembly implementations and JavaScript-based algorithms for text similarity and distance calculations.

## Packages

This is a monorepo that contains the following packages:

- **[nlptools](./packages/nlptools/README.md)** - Main package that exports all algorithms and utilities from the entire toolkit
- **[@nlptools/distance](./packages/distance/README.md)** - Complete distance algorithms package including both WebAssembly and JavaScript implementations
- **[@nlptools/distance-wasm](./packages/distance-wasm/README.md)** - High-performance WebAssembly library with optimized Rust implementations

## Quick Start

### Installation

```bash
# Install the main package (includes all algorithms)
pnpm installnlptools

# Or install specific packages
pnpm install @nlptools/distance        # Complete distance algorithms
pnpm install @nlptools/distance-wasm   # WASM-optimized algorithms only

# Clone the repository for development
git clone https://github.com/DemoMacro/nlptools.git
cd nlptools
pnpm install
```

### Basic Usage

```typescript
// Using the main package (recommended)
import * as nlptools from "nlptools";

// Calculate Levenshtein distance
const distance = nlptools.levenshtein("kitten", "sitting");
console.log(`Distance: ${distance}`); // Output: 3

// Calculate normalized similarity (0-1)
const similarity = nlptools.jaro("hello", "hallo");
console.log(`Similarity: ${similarity}`); // Output: 0.8666666666666667

// Use the universal compare function
const result = nlptools.compare("apple", "apply", "levenshtein");
console.log(`Result: ${result}`); // Output: 0.2
```

## Contributing

We welcome contributions! Here's how to get started:

### Quick Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/nlptools.git
   cd nlptools
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/DemoMacro/nlptools.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Development mode**:

   ```bash
   pnpm dev
   ```

### Development Workflow

1. **Code**: Follow our project standards
2. **Test**: `pnpm build`
3. **Commit**: Use conventional commits (`feat:`, `fix:`, etc.)
4. **Push**: Push to your fork
5. **Submit**: Create a Pull Request to upstream repository

## Support & Community

- 📫 [Report Issues](https://github.com/DemoMacro/nlptools/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by [Demo Macro](https://imst.xyz/)
