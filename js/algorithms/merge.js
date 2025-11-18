export default function merge(arr) {
  const actions = [];
  function mergeSort(a, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(a, l, m);
    mergeSort(a, m+1, r);
    const left = a.slice(l, m+1);
    const right = a.slice(m+1, r+1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      actions.push({type:'compare', indices:[l+i, m+1+j]});
      if (left[i] <= right[j]) {
        a[k++] = left[i++];
      } else {
        a[k++] = right[j++];
      }
      actions.push({type:'overwrite', indices:[k-1], array: a.slice()});
    }
    while (i < left.length) { a[k++] = left[i++]; actions.push({type:'overwrite', indices:[k-1], array: a.slice()}); }
    while (j < right.length) { a[k++] = right[j++]; actions.push({type:'overwrite', indices:[k-1], array: a.slice()}); }
  }
  mergeSort(arr, 0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) actions.push({type:'set-sorted', indices:[i]});
  return actions;
}
