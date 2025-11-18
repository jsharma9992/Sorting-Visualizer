export default function selection(arr) {
  const actions = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i+1; j < n; j++) {
      actions.push({type:'compare', indices:[minIdx,j]});
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      actions.push({type:'swap', indices:[i,minIdx], array: arr.slice()});
    }
    actions.push({type:'set-sorted', indices:[i]});
  }
  actions.push({type:'set-sorted', indices:[n-1]});
  return actions;
}
