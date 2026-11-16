# Sorting Visualizer

An interactive web app that animates how classic sorting algorithms work. Plain HTML, CSS and JavaScript: no build step, no dependencies.

> **Note:** This is an original implementation written to match a feature brief. It is **not** a copy of, and has not been checked against, `bitleakash6/Sorting-Visualizer-Web-Application`.

## Features
- Six algorithms with step-by-step animation
- Colour-coded bars: unsorted, comparing, moving, in place
- Array size slider (5-100) and 5 speed levels
- New random array, Reset (same array again), Start
- Live comparison and swap/write counters
- Time and space complexity panel for the selected algorithm
- Responsive layout (phone, tablet, desktop), light/dark theme, reduced-motion support

## Algorithms
Bubble, Selection, Insertion, Merge, Quick, Heap.

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) |
| Selection | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion | O(n) | O(n²) | O(n²) | O(1) |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick (last-element pivot) | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) |

## Folder structure
```
Sorting-Visualizer/
├── index.html
├── css/style.css
├── js/algorithms.js   # generators that yield animation steps
├── js/main.js         # UI and animation loop
├── assets/favicon.svg
├── test.js            # algorithm tests (Node)
├── README.md
├── LICENSE
└── .gitignore
```

## Run locally
Open `index.html` in any modern browser. Optional: `python -m http.server` then visit http://localhost:8000.
Run the algorithm tests with `node test.js`.

## Screenshots
Add your own screenshots to `assets/` and link them here.

## Future improvements
Pause/step controls, counting and radix sort, custom input arrays, sound.

## Author
Your Name - https://github.com/YOUR_USERNAME

## License
MIT (see `LICENSE`). Replace the name in LICENSE with yours.
