export default function bubble(arr) {
  const actions = [];
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      actions.push({type:'compare', indices:[j,j+1]});
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        actions.push({type:'swap', indices:[j,j+1], array: arr.slice()});
      }
    }
    actions.push({type:'set-sorted', indices:[n-i-1]});
  }
  return actions;
}
