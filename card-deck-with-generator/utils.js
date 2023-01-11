export const printArrayObjectProps = (label, arr, ...propertyNames) => {
  const arr2 = '\n' + arr.map((_, i) => `[${i}] | ${propertyNames.map(prop => `${prop}: ${_[prop]} | `)}`)
    .join('~')
    .replace(/\~/g, '\n')
    .replace(/\,/g, '');

  console.warn(`${label}
------`, arr2);

  return arr2;
}

const printIds = (label, arr) => {
  return printArrayObjectProps(label || 'IDs', arr, 'id')
}

const src = [
  { id: 0, value: 'queen' },
  { id: 1, value: 'king' },
  { id: 2, value: '10' },
  { id: 3, value: 'jack' },
  { id: 4, value: 'ace' },
]

const top2 = src.slice(0, 2);

const toBottom = [...src.filter(_ => !top2.includes(_)), ...top2]
// printIds('toBottom', toBottom)
printArrayObjectProps('src', src, 'id', 'value')
// console.log('toBottom', toBottom.toString())
