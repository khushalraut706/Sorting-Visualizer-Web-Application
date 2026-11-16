// Run with: node test.js  (checks every algorithm on many random arrays)
const A = require('./js/algorithms.js');
let bad = 0;
for (const [k, a] of Object.entries(A)) {
  for (let t = 0; t < 300; t++) {
    const n = Math.floor(Math.random() * 60);
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 30));
    const want = arr.slice().sort((x, y) => x - y);
    const work = arr.slice(), replay = arr.slice(), done = new Set();
    for (const e of a.run(work)) {
      if (e.t === 'swap') [replay[e.i], replay[e.j]] = [replay[e.j], replay[e.i]];
      if (e.t === 'set') replay[e.i] = e.v;
      if (e.t === 'done') done.add(e.i);
    }
    const ok = JSON.stringify(work) === JSON.stringify(want) && JSON.stringify(replay) === JSON.stringify(want) && done.size === n;
    if (!ok) { bad++; console.log('FAIL', k, arr.join(',')); break; }
  }
  console.log(k, 'ok');
}
process.exit(bad ? 1 : 0);
