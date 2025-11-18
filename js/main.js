import Visualizer from './visualizer.js';
import * as Algs from './algorithms/index.js';

const elements = {
  visual: document.getElementById('visual'),
  newArray: document.getElementById('newArray'),
  start: document.getElementById('start'),
  pauseResume: document.getElementById('pauseResume'),
  reset: document.getElementById('reset'),
  size: document.getElementById('size'),
  sizeValue: document.getElementById('size-value'),
  speed: document.getElementById('speed'),
  speedValue: document.getElementById('speed-value'),
  algorithm: document.getElementById('algorithm'),
  comparisons: document.getElementById('comparisons'),
  swaps: document.getElementById('swaps'),
  elapsed: document.getElementById('elapsed'),
  code: document.getElementById('code')
};

const visualizer = new Visualizer(elements, Algs);

// wire up controls
elements.size.addEventListener('input', () => {
  elements.sizeValue.textContent = elements.size.value;
  visualizer.generateNew(+elements.size.value);
});

elements.speed.addEventListener('input', () => {
  elements.speedValue.textContent = `${elements.speed.value}ms`;
  visualizer.setSpeed(+elements.speed.value);
});

elements.newArray.addEventListener('click', () => visualizer.generateNew(+elements.size.value));

elements.start.addEventListener('click', async () => {
  const alg = elements.algorithm.value;
  await visualizer.start(alg);
});

elements.pauseResume.addEventListener('click', () => visualizer.togglePause());

elements.reset.addEventListener('click', () => visualizer.reset());

// initialize UI
elements.sizeValue.textContent = elements.size.value;
elements.speedValue.textContent = `${elements.speed.value}ms`;
visualizer.generateNew(+elements.size.value);
