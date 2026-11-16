(function () {
  const $ = (id) => document.getElementById(id);
  const DELAYS = [400, 150, 50, 15, 3]; // ms per step for speed 1..5
  let current = 'bubble', original = [], data = [], bars = [], running = false, token = 0;

  const algoList = $('algoList');
  Object.entries(ALGORITHMS).forEach(([key, a]) => {
    const b = document.createElement('button');
    b.textContent = a.name; b.dataset.key = key; b.setAttribute('role', 'radio');
    b.onclick = () => select(key);
    algoList.appendChild(b);
  });

  function select(key) {
    if (running) return;
    current = key;
    algoList.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', b.dataset.key === key));
    const a = ALGORITHMS[key];
    $('infoName').textContent = a.name;
    $('tBest').textContent = a.best; $('tAvg').textContent = a.avg;
    $('tWorst').textContent = a.worst; $('tSpace').textContent = a.space;
    $('infoDesc').textContent = a.desc;
    restore();
  }
  function render() {
    const box = $('bars'); box.innerHTML = ''; bars = [];
    data.forEach((v) => {
      const d = document.createElement('div');
      d.className = 'bar'; d.style.height = v + '%'; box.appendChild(d); bars.push(d);
    });
  }
  function counters(c, s) { $('cmp').textContent = c; $('swp').textContent = s; }
  function status(t) { $('status').textContent = t; }
  function lock(on) {
    running = on;
    ['start', 'reset', 'shuffle', 'size'].forEach((id) => ($(id).disabled = on));
    algoList.querySelectorAll('button').forEach((b) => (b.disabled = on));
  }
  function newArray() {
    const n = +$('size').value;
    original = Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 95));
    restore();
  }
  function restore() { data = original.slice(); counters(0, 0); status('Ready'); render(); }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clear = (idx) => idx.forEach((i) => bars[i] && bars[i].classList.remove('compare', 'swap'));

  async function start() {
    if (running) return;
    restore(); lock(true); status('Sorting…');
    let c = 0, s = 0;
    for (const e of ALGORITHMS[current].run(data)) {
      if (e.t === 'cmp') { c++; bars[e.i].classList.add('compare'); bars[e.j].classList.add('compare'); }
      else if (e.t === 'swap') {
        s++; [bars[e.i].style.height, bars[e.j].style.height] = [data[e.i] + '%', data[e.j] + '%'];
        bars[e.i].classList.add('swap'); bars[e.j].classList.add('swap');
      } else if (e.t === 'set') { s++; bars[e.i].style.height = e.v + '%'; bars[e.i].classList.add('swap'); }
      else if (e.t === 'done') bars[e.i].classList.add('sorted');
      counters(c, s);
      if (e.t !== 'done') { await sleep(DELAYS[$('speed').value - 1]); clear([e.i, e.j]); }
    }
    bars.forEach((b) => { b.classList.remove('compare', 'swap'); b.classList.add('sorted'); });
    status('Sorted'); lock(false);
  }

  $('size').oninput = () => { $('sizeOut').textContent = $('size').value; newArray(); };
  $('speed').oninput = () => ($('speedOut').textContent = $('speed').value);
  $('shuffle').onclick = newArray;
  $('reset').onclick = restore;
  $('start').onclick = start;
  select('bubble'); newArray();
})();
