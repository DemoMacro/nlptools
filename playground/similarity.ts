import { distance, closest } from "@nlptools/similarity";

const str = "hello";
const arr = ["hello", "world", "foo", "bar", "baz"];

console.log(closest(str, arr));
console.log(distance("hello", closest(str, arr)));
