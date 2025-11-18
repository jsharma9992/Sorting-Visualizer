import { sleep } from './utils.js';

export default class Visualizer {
  constructor(el, algModule) {
    // el is the elements map passed from main
    this.el = el;
    this.alg = algModule;

    this.array = [];
    this.nodes = [];
    this.isSorting = false;
    this.isPaused = false;
    this.stopRequested = false;
    this.speed = 300; // ms

    this.metrics = { comparisons: 0, swaps: 0 };
  }

  _renderArray() {
    const container = this.el.visual;
    container.innerHTML = '';
    const n = this.array.length;
    for (let i = 0; i < n; i++) {
      const div = document.createElement('div');
      div.className = 'bar';
      div.style.height = `${this.array[i]}%`;
      div.dataset.index = i;
      container.appendChild(div);
      this.nodes.push(div);
    }
  }

  generateNew(size = 60) {
    if (this.isSorting) return;
    this.array = Array.from({length: size}, () => 5 + Math.round(Math.random() * 95));
    this.nodes = [];
    this._renderArray();
    this._resetMetricsUI();
    this.el.code.textContent = this.alg.getPseudo(this.el.algorithm.value);
  }

  setSpeed(ms) { this.speed = ms; }

  _resetMetricsUI() {
    this.metrics = { comparisons: 0, swaps: 0 };
    this.el.comparisons.textContent = 0;
    this.el.swaps.textContent = 0;
    this.el.elapsed.textContent = '0ms';
  }

  _updateMetricsUI() {
    this.el.comparisons.textContent = this.metrics.comparisons;
    this.el.swaps.textContent = this.metrics.swaps;
  }

  _disableControls(disabled) {
    this.el.newArray.disabled = disabled;
    this.el.start.disabled = disabled;
    this.el.size.disabled = disabled;
    this.el.algorithm.disabled = disabled;
  }

  async start(algName) {
    if (this.isSorting) return;
    this.isSorting = true;
    this.stopRequested = false;
    this.isPaused = false;

    this._disableControls(true);
    this.el.pauseResume.disabled = false;
    this.el.reset.disabled = false;
    this.el.pauseResume.textContent = 'Pause';

    const actions = this.alg[algName]([...this.array]);

    const startTime = performance.now();

    for (let i = 0; i < actions.length; i++) {
      if (this.stopRequested) break;
      // pause handling
      while (this.isPaused) {
        await sleep(50);
        if (this.stopRequested) break;
      }

      const a = actions[i];
      await this._performAction(a);
      this._updateMetricsUI();
      await sleep(this.speed);
    }

    const elapsed = Math.round(performance.now() - startTime);
    this.el.elapsed.textContent = `${elapsed}ms`;

    if (!this.stopRequested) this._markSorted();

    this.isSorting = false;
    this._disableControls(false);
    this.el.pauseResume.disabled = true;
  }

  togglePause() {
    if (!this.isSorting) return;
    this.isPaused = !this.isPaused;
    this.el.pauseResume.textContent = this.isPaused ? 'Resume' : 'Pause';
  }

  reset() {
    // stop sorting and restore UI
    if (!this.isSorting) return;
    this.stopRequested = true;
    this.isPaused = false;
    this.el.pauseResume.textContent = 'Pause';
    this._disableControls(false);
    this.el.pauseResume.disabled = true;
  }

  async _performAction(action) {
    const { type, indices, array } = action;
    // clear previous states
    this.nodes.forEach(n => n.classList.remove('state-compare','state-swap'));
    if (type === 'compare') {
      indices.forEach(i => this._setState(i,'compare'));
      this.metrics.comparisons++;
    } else if (type === 'swap') {
      indices.forEach(i => this._setState(i,'swap'));
      this.metrics.swaps++;
      if (array) {
        this.array = array.slice();
        this._syncHeights();
      }
    } else if (type === 'overwrite') {
      if (array) { this.array = array.slice(); this._syncHeights(); }
    } else if (type === 'set-sorted') {
      indices.forEach(i => this.nodes[i]?.classList.add('state-sorted'));
    }
  }

  _setState(i, kind) {
    const node = this.nodes[i];
    if (!node) return;
    if (kind === 'compare') node.classList.add('state-compare');
    if (kind === 'swap') node.classList.add('state-swap');
  }

  _syncHeights() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].style.height = `${this.array[i]}%`;
    }
  }

  _markSorted() {
    for (let i = 0; i < this.nodes.length; i++) this.nodes[i].classList.add('state-sorted');
  }
}
