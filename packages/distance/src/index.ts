export * from "@nlptools/distance-wasm";

// Import fastest-levenshtein function
import { distance as fastestLevenshtein } from "fastest-levenshtein";

// Export fastest-levenshtein function with consistent naming
export const fastest_levenshtein = fastestLevenshtein;
