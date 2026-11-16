/* Each algorithm is a generator that sorts array `a` in place and yields
   step events: {t:'cmp',i,j} | {t:'swap',i,j} | {t:'set',i,v} | {t:'done',i} */
(function (root) {
  function* bubble(a) {
    for (let n = a.length; n > 1; n--) {
      let swapped = false;
      for (let i = 0; i < n - 1; i++) {
        yield { t: 'cmp', i, j: i + 1 };
        if (a[i] > a[i + 1]) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; swapped = true; yield { t: 'swap', i, j: i + 1 }; }
      }
      yield { t: 'done', i: n - 1 };
      if (!swapped) { for (let k = 0; k < n - 1; k++) yield { t: 'done', i: k }; return; }
    }
    if (a.length) yield { t: 'done', i: 0 };
  }
  function* selection(a) {
    for (let i = 0; i < a.length; i++) {
      let m = i;
      for (let j = i + 1; j < a.length; j++) { yield { t: 'cmp', i: m, j }; if (a[j] < a[m]) m = j; }
      if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; yield { t: 'swap', i, j: m }; }
      yield { t: 'done', i };
    }
  }
  function* insertion(a) {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        yield { t: 'cmp', i: j - 1, j };
        if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; yield { t: 'swap', i: j - 1, j }; j--; } else break;
      }
    }
    for (let i = 0; i < a.length; i++) yield { t: 'done', i };
  }
  function* merge(a) {
    function* rec(lo, hi) {
      if (hi - lo < 1) return;
      const mid = (lo + hi) >> 1;
      yield* rec(lo, mid); yield* rec(mid + 1, hi);
      const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;
      while (i < L.length && j < R.length) {
        yield { t: 'cmp', i: lo + i, j: mid + 1 + j };
        a[k] = L[i] <= R[j] ? L[i++] : R[j++]; yield { t: 'set', i: k, v: a[k] }; k++;
      }
      while (i < L.length) { a[k] = L[i++]; yield { t: 'set', i: k, v: a[k] }; k++; }
      while (j < R.length) { a[k] = R[j++]; yield { t: 'set', i: k, v: a[k] }; k++; }
    }
    yield* rec(0, a.length - 1);
    for (let i = 0; i < a.length; i++) yield { t: 'done', i };
  }
  function* quick(a) {
    function* rec(lo, hi) {
      if (lo > hi) return;
      if (lo === hi) { yield { t: 'done', i: lo }; return; }
      const p = a[hi]; let s = lo;
      for (let i = lo; i < hi; i++) {
        yield { t: 'cmp', i, j: hi };
        if (a[i] < p) { if (i !== s) { [a[i], a[s]] = [a[s], a[i]]; yield { t: 'swap', i, j: s }; } s++; }
      }
      if (s !== hi) { [a[s], a[hi]] = [a[hi], a[s]]; yield { t: 'swap', i: s, j: hi }; }
      yield { t: 'done', i: s };
      yield* rec(lo, s - 1); yield* rec(s + 1, hi);
    }
    yield* rec(0, a.length - 1);
  }
  function* heap(a) {
    const n = a.length;
    function* sift(i, size) {
      for (;;) {
        let m = i; const l = 2 * i + 1, r = l + 1;
        if (l < size) { yield { t: 'cmp', i: m, j: l }; if (a[l] > a[m]) m = l; }
        if (r < size) { yield { t: 'cmp', i: m, j: r }; if (a[r] > a[m]) m = r; }
        if (m === i) return;
        [a[i], a[m]] = [a[m], a[i]]; yield { t: 'swap', i, j: m }; i = m;
      }
    }
    for (let i = (n >> 1) - 1; i >= 0; i--) yield* sift(i, n);
    for (let e = n - 1; e > 0; e--) {
      [a[0], a[e]] = [a[e], a[0]]; yield { t: 'swap', i: 0, j: e };
      yield { t: 'done', i: e }; yield* sift(0, e);
    }
    if (n) yield { t: 'done', i: 0 };
  }
  const ALGORITHMS = {
    bubble: { name: 'Bubble Sort', run: bubble, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      desc: 'Repeatedly swaps neighbouring items that are out of order, so the largest value bubbles to the end.' },
    selection: { name: 'Selection Sort', run: selection, best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      desc: 'Finds the smallest remaining item and places it at the front of the unsorted part.' },
    insertion: { name: 'Insertion Sort', run: insertion, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
      desc: 'Takes each item and slides it left into its place among the items already sorted.' },
    merge: { name: 'Merge Sort', run: merge, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
      desc: 'Splits the array in halves, sorts each half, then merges them back in order.' },
    quick: { name: 'Quick Sort', run: quick, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
      desc: 'Picks a pivot, moves smaller items before it and larger after, then sorts each side.' },
    heap: { name: 'Heap Sort', run: heap, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)',
      desc: 'Builds a max-heap, then repeatedly moves the largest item to the end.' }
  };
  root.ALGORITHMS = ALGORITHMS;
  if (typeof module !== 'undefined') module.exports = ALGORITHMS;
})(typeof window !== 'undefined' ? window : globalThis);
