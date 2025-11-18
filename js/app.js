// app.js (ES module)
// Modular visualizer + generator-based sorting algorithms.
// Key features: pause/resume, step, speed control, array types, metrics, code snippet panel.
// Simple utility helpers
const q = (sel, root = document) => root.querySelector(sel);
const qs = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* Visualizer class
   Responsibilities:
   - manage array data
   - render bars
   - consume algorithm generator actions
   - handle controls (start/pause/step/new array)
*/
class Visualizer {
  constructor() {
    this.barsContainer = q('#bars');
    this.statusEl = q('#status');
    this.codeEl = q('#code-snippet');

    this.sizeInput = q('#array-size');
    this.speedInput = q('#speed');
    this.algorithmSelect = q('#algorithm-select');
    this.arrayTypeSelect = q('#array-type');

    this.newBtn = q('#new-array');
    this.startBtn = q('#start');
    this.pauseBtn = q('#pause');
    this.stepBtn = q('#step');
    this.darkToggle = q('#dark-toggle');

    this.array = [];
    this.nodes = [];
    this.isRunning = false;
    this.isPaused = false;
    this.stepMode = false;

    this.metrics = { comparisons: 0, swaps: 0 };
    this.timeStart = 0;
    this.elapsed = 0;

    this.currentGenerator = null;
    this.currentAlgorithmName = null;
    this.animationTask = null;

    this._bindEvents();
    this.createArray();
    this._render();
    this._loadCodeSnippet();
  }

  _bindEvents() {
    this.newBtn.addEventListener('click', () => { this.createArray(); this._render(); this._resetMetrics(); });
    this.startBtn.addEventListener('click', () => this.startSort());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.stepBtn.addEventListener('click', () => this.step());
    this.sizeInput.addEventListener('input', () => { this.createArray(); this._render(); });
    this.algorithmSelect.addEventListener('change', () => this._loadCodeSnippet());
    this.arrayTypeSelect.addEventListener('change', () => this.createArray());
    this.darkToggle.addEventListener('change', (e) => document.documentElement.classList.toggle('dark', e.target.checked));
  }

  _resetMetrics() {
    this.metrics = { comparisons: 0, swaps: 0 };
    this._updateMetricsUI();
    this.elapsed = 0;
    q('#metric-time').textContent = '0ms';
  }

  _updateMetricsUI() {
    q('#metric-comparisons').textContent = this.metrics.comparisons;
    q('#metric-swaps').textContent = this.metrics.swaps;
  }

  createArray() {
    const n = Number(this.sizeInput.value || 60);
    const type = this.arrayTypeSelect.value;
    this.array = new Array(n).fill(0).map((_, i) => {
      if (type === 'reversed') return Math.round((n - i) * (100 / n));
      if (type === 'nearly-sorted') {
        const base = Math.round((i + 1) * (100 / n));
        return base + (Math.random() < 0.05 ? Math.round(15 * (Math.random() - 0.5)) : 0);
      }
      return Math.round(5 + Math.random() * 95);
    });
    this._resetMetrics();
  }

  _render() {
    // Clear and create bars
    this.barsContainer.innerHTML = '';
    this.nodes = [];
    const n = this.array.length;
    const widthPct = 100 / n;
    for (let i = 0; i < n; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.width = `calc(${widthPct}% - 2px)`;
      bar.style.height = `${this.array[i]}%`;
      bar.setAttribute('data-index', i);
      bar.setAttribute('aria-hidden', 'true');
      this.barsContainer.appendChild(bar);
      this.nodes.push(bar);
    }
    this._updateStatus('Ready');
  }

  _updateStatus(text) {
    this.statusEl.textContent = text;
  }

  async startSort() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.stepMode = false;
    this._resetMetrics();
    this.timeStart = performance.now();

    const alg = this.algorithmSelect.value;
    this.currentAlgorithmName = alg;
    this.currentGenerator = SortAlgorithms.getGenerator(alg, [...this.array], this.metrics);

    this._loadCodeSnippet();
    await this._runGenerator();
  }

  async _runGenerator() {
    const speed = Number(this.speedInput.value);
    let next;
    while (true) {
      if (this.isPaused) {
        await this._sleep(50);
        continue;
      }
      // If step mode, pause after one step
      if (this.stepMode) {
        this.isPaused = true;
        this.stepMode = false;
      }

      next = this.currentGenerator.next();
      if (next.done) break;

      const action = next.value;
      // action example: {type:'compare',indices:[i,j]} or {type:'swap',indices:[i,j],array:currentArray}
      this._applyAction(action);
      this._updateMetricsUI();

      // dynamic delay: map speed slider to ms
      await this._sleep(Math.max(5, 1000 - speed)); // higher speed => smaller delay
    }
    this.elapsed = Math.round(performance.now() - this.timeStart);
    q('#metric-time').textContent = `${this.elapsed}ms`;
    this._updateStatus('Completed');
    this.isRunning = false;
  }

  _applyAction(action) {
    if (!action) return;
    const { type, indices, array } = action;
    // Clear highlight
    this.nodes.forEach(n => n.style.background = '');
    if (type === 'compare') {
      indices.forEach(i => this._highlight(i, 'compare'));
      this._updateStatus(`Comparing ${indices.join(',')}`);
    } else if (type === 'swap') {
      indices.forEach(i => this._highlight(i, 'swap'));
      // update heights to reflect array snapshot
      if (Array.isArray(array)) {
        this.array = [...array];
        for (let i = 0; i < this.nodes.length; i++) {
          this.nodes[i].style.height = `${this.array[i]}%`;
        }
      }
      this._updateStatus(`Swapped ${indices.join(',')}`);
    } else if (type === 'overwrite') {
      // for merge sort style operations
      if (Array.isArray(array)) {
        this.array = [...array];
        for (let i = 0; i < this.nodes.length; i++) {
          this.nodes[i].style.height = `${this.array[i]}%`;
        }
      }
    }
  }

  _highlight(idx, kind = 'compare') {
    const node = this.nodes[idx];
    if (!node) return;
    if (kind === 'compare') node.style.background = 'var(--bar-compare)';
    else if (kind === 'swap') node.style.background = 'var(--bar-swap)';
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    this._updateStatus(this.isPaused ? 'Paused' : 'Running');
  }

  step() {
    if (!this.isRunning) {
      // If not running, start in step mode
      this.startSort();
      this.stepMode = true;
      return;
    }
    if (this.isPaused) {
      this.stepMode = true;
      this.isPaused = false;
    } else {
      // If running, toggle to pause then set step
      this.isPaused = true;
      this.stepMode = true;
    }
  }

  _sleep(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _loadCodeSnippet() {
    const alg = this.algorithmSelect.value;
    const snippet = SortAlgorithms.codeSnippets[alg] || '// code snippet not available';
    this.codeEl.textContent = snippet;
  }
}
/* SortAlgorithms module
   - exposes generator creators for each algorithm
   - each generator yields lightweight action objects consumed by Visualizer
   - updates metrics object passed by reference
*/
const SortAlgorithms = (function () {
  const codeSnippets = {
    bubble: `function* bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      yield {type:'compare', indices:[j,j+1]};\n      if (arr[j] > arr[j+1]) {\n        [arr[j],arr[j+1]] = [arr[j+1],arr[j]];\n        yield {type:'swap', indices:[j,j+1], array:[...arr]};\n      }\n    }\n  }\n}`,
    // other algorithm snippets...
  };
  function* bubbleGen(arr, metrics) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        metrics.comparisons++;
        yield { type: 'compare', indices: [j, j + 1] };
        if (arr[j] > arr[j + 1]) {
          metrics.swaps++;
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          yield { type: 'swap', indices: [j, j + 1], array: [...arr] };
        }
      }
    }
  }
  // Placeholder / skeleton for merge, quick, insertion, heap -- implement similarly as generators
  function* insertionGen(arr, metrics) {
    for (let i = 1; i < arr.length; i++) {
      let j = i - 1;
      const key = arr[i];
      while (j >= 0 && arr[j] > key) {
        metrics.comparisons++;
        yield { type: 'compare', indices: [j, j + 1] };
        arr[j + 1] = arr[j];
        metrics.swaps++;
        yield { type: 'swap', indices: [j, j + 1], array: [...arr] };
        j--;
      }
      arr[j + 1] = key;
      yield { type: 'overwrite', indices: [j + 1], array: [...arr] };
    }
  }
  // Public factory
  function getGenerator(name, arr, metrics) {
    switch (name) {
      case 'bubble': return bubbleGen(arr, metrics);
      case 'insertion': return insertionGen(arr, metrics);
      // case 'merge': return mergeGen(arr, metrics);
      // case 'quick': return quickGen(arr, metrics);
      // case 'heap': return heapGen(arr, metrics);
      default: return bubbleGen(arr, metrics);
    }
  }
  return { getGenerator, codeSnippets };
})();// Initialize visualizer on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.visualizer = new Visualizer();
});
