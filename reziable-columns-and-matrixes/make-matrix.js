export const defaultMatrix = new Array(25)
  .fill([])
  .map((row, i) => {
    return [...(new Array(25).map((c, i) => ({ type: 0 })))]
  }) //[...row, ...new Array(25).fill(0)])

// .fill(new Array(25).fill(0))

console.log('defaultMatrix', defaultMatrix);
const cell11 = defaultMatrix[1][1]
const cell22 = defaultMatrix[2][2]
// const row1 = [...defaultMatrix[1]]
// const row2 = defaultMatrix[2]

// console.log('row1 === row2', row1 === row2)
// cell11 = 5
console.log('cell11', cell11)
