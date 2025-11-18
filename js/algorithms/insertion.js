export default function insertion(arr) {
  const actions = [];
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      actions.push({type:'compare', indices:[j, j+1]});
      if (arr[j] > key) {
        arr[j+1] = arr[j];
        actions.push({type:'swap', indices:[j, j+1], array: arr.slice()});
        j--;
      } else break;
    }
    arr[j+1] = key;
    actions.push({type:'overwrite', indices:[j+1], array: arr.slice()});
  }
  for (let k = 0; k < n; k++) actions.push({type:'set-sorted', indices:[k]});
  return actions;
}
