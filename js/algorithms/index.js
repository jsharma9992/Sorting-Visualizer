export { default as bubble } from './bubble.js';
export { default as selection } from './selection.js';
export { default as insertion } from './insertion.js';
export { default as merge } from './merge.js';
export { default as quick } from './quick.js';

export function getPseudo(name) {
  const map = {
    bubble: `for i in range n:\n  for j in range n-i-1:\n    compare j and j+1; swap if needed`,
    selection: `for i in range n:\n  find min in unsorted; swap with i`,
    insertion: `for i from 1 to n-1:\n  insert arr[i] into sorted left side`,
    merge: `divide and merge sorted halves`,
    quick: `choose pivot; partition; sort subarrays`
  };
  return map[name] || '';
}
