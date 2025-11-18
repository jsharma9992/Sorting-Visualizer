export default function quick(arr) {
  const actions = [];
  function partition(a, low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      actions.push({type:'compare', indices:[j, high]});
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        actions.push({type:'swap', indices:[i,j], array: a.slice()});
      }
    }
    [a[i+1], a[high]] = [a[high], a[i+1]];
    actions.push({type:'swap', indices:[i+1, high], array: a.slice()});
    return i+1;
  }
  function quickSort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high);
      quickSort(a, low, pi-1);
      quickSort(a, pi+1, high);
    }
  }
  quickSort(arr, 0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) actions.push({type:'set-sorted', indices:[i]});
  return actions;
}
