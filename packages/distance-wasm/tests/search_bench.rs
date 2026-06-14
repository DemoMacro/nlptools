#![cfg(test)]

use distance_wasm::*;
use distance_wasm::search::*;
use std::time::Instant;

const BOOKS: &[&str] = &[
    "Old Man's War",
    "The Lock Artist",
    "The Great Gatsby",
    "Great Expectations",
    "The Hunger Games",
    "Harry Potter",
    "To Kill a Mockingbird",
    "Pride and Prejudice",
    "The Catcher in the Rye",
    "Brave New World",
    "Lord of the Flies",
    "The Hobbit",
    "Fahrenheit 451",
    "Moby Dick",
    "War and Peace",
    "Crime and Punishment",
    "The Odyssey",
    "Don Quixote",
    "1984",
    "Animal Farm",
];

const STRING_LIST: &[&str] = &[
    "apple",
    "banana",
    "cherry",
    "date",
    "elderberry",
    "fig",
    "grape",
    "honeydew",
    "kiwi",
    "lemon",
    "mango",
    "nectarine",
    "orange",
    "pear",
    "quince",
    "raspberry",
    "strawberry",
    "tangerine",
    "watermelon",
    "blueberry",
];

const SEARCH_QUERIES: &[&str] = &[
    "old man",
    "grate gatsbi",
    "hary poter",
    "jane austn",
    "george orwel",
    "frnkenstein",
];

const FRUIT_QUERIES: &[&str] = &["aple", "bannana", "strwbrry", "mngo", "bluberry"];

const ITERATIONS: u64 = 1000;

fn bench_search(
    label: &str,
    items: &[&str],
    queries: &[&str],
    algo: fn(&str, &str) -> f64,
) {
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for q in queries {
            let q_lower = q.to_lowercase();
            for item in items {
                let item_lower = item.to_lowercase();
                let _ = algo(&q_lower, &item_lower);
            }
        }
    }
    let total = ITERATIONS as f64 * queries.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<40} | {:>10.2} us/query", label, avg_us);
}

#[test]
fn bench_search_algorithms() {
    println!("\n=== Search: Different Algorithms (20 items, 6 queries) ===");
    bench_search(
        "levenshtein x 6 queries",
        STRING_LIST,
        SEARCH_QUERIES,
        levenshtein_normalized,
    );
    bench_search("cosine x 6 queries", STRING_LIST, SEARCH_QUERIES, cosine);
    bench_search("jaccard x 6 queries", STRING_LIST, SEARCH_QUERIES, jaccard);
    bench_search("sorensen x 6 queries", STRING_LIST, SEARCH_QUERIES, sorensen);
    bench_search(
        "jaccard_bigram x 6 queries",
        STRING_LIST,
        SEARCH_QUERIES,
        jaccard_bigram,
    );
}

#[test]
fn bench_search_object_array() {
    println!("\n=== Search: Object Array (20 books, title key) ===");
    bench_search(
        "levenshtein x 6 queries",
        BOOKS,
        SEARCH_QUERIES,
        levenshtein_normalized,
    );
    bench_search("cosine x 6 queries", BOOKS, SEARCH_QUERIES, cosine);
}

#[test]
fn bench_search_fuzzy() {
    println!("\n=== Search: Fruit Fuzzy Matching (20 items, 5 queries) ===");
    bench_search(
        "levenshtein x 5 queries",
        STRING_LIST,
        FRUIT_QUERIES,
        levenshtein_normalized,
    );
}

#[test]
fn bench_fuzzy_search_class() {
    let string_items: Vec<String> = STRING_LIST.iter().map(|s| s.to_string()).collect();
    let book_items: Vec<String> = BOOKS.iter().map(|s| s.to_string()).collect();

    println!("\n=== FuzzySearch class (20 items) ===");

    // String array search
    let fs = FuzzySearch::new(string_items.clone(), Algorithm::Levenshtein, 0.3, false);
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for q in SEARCH_QUERIES {
            let _ = fs.search(q, None);
        }
    }
    let total = ITERATIONS as f64 * SEARCH_QUERIES.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<40} | {:>10.2} us/query", "string array (levenshtein)", avg_us);

    // Object array (title key) search
    let fs2 = FuzzySearch::new(book_items.clone(), Algorithm::Levenshtein, 0.3, false);
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for q in SEARCH_QUERIES {
            let _ = fs2.search(q, None);
        }
    }
    let total = ITERATIONS as f64 * SEARCH_QUERIES.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<40} | {:>10.2} us/query", "object/title (levenshtein)", avg_us);

    // Multi-key weighted search (title=0.7, author=0.3)
    let titles: Vec<String> = BOOKS.iter().map(|s| s.to_string()).collect();
    let authors: Vec<String> = vec![
        "John Scalzi", "Steve Hamilton", "F. Scott Fitzgerald", "Charles Dickens",
        "Suzanne Collins", "J.K. Rowling", "Harper Lee", "Jane Austen",
        "J.D. Salinger", "Aldous Huxley", "William Golding", "J.R.R. Tolkien",
        "Ray Bradbury", "Herman Melville", "Leo Tolstoy", "Fyodor Dostoevsky",
        "Homer", "Miguel de Cervantes", "George Orwell", "George Orwell",
    ].into_iter().map(|s| s.to_string()).collect();
    let mut key_values = Vec::new();
    for i in 0..BOOKS.len() {
        key_values.push(titles[i].clone());
        key_values.push(authors[i].clone());
    }
    let mks = MultiKeyFuzzySearch::new(key_values, 2, vec![0.7, 0.3], Algorithm::Levenshtein, 0.3, false);
    let start = Instant::now();
    for _ in 0..ITERATIONS {
        for q in SEARCH_QUERIES {
            let _ = mks.search(q, None);
        }
    }
    let total = ITERATIONS as f64 * SEARCH_QUERIES.len() as f64;
    let avg_us = start.elapsed().as_micros() as f64 / total;
    println!("  {:<40} | {:>10.2} us/query", "object/title+author (weighted)", avg_us);
}
