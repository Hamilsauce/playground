import { createMatrix, loadMatrix } from './logical-grid/matrix.collection.js';

const m1 = [
  [11, 12, 13],
  [21, 22, 23],
  [31, 32, 33],
];

const matrix2 = [
  [2, 2, 2],
  [2, 2, 2],
  [2, 2, 2],
];
// let newcol = matrix2[3]=[100]
matrix2[3] = [100]

console.log('matrix2', !matrix2[5])
const matrix1 = loadMatrix(m1)

console.log('matrix1', matrix1.column(1))

const transpose = (m = []) => {
  const t1 = []

  m.forEach((row, i) => {
    if (!t1[i]) t1[i] = []

    row.forEach((cell, j) => {
      t1[i][j] = cell
    });
  });
  
  return t1
}

console.log('transpose', transpose(m1))


const addMatrices = (m1 = [], m2 = []) => {
  const currentCoord = { x: 0, }

  while (m1.length) {
    /* code */
  }

  const added = m1
    .reduce((acc, cell, i) => {


    }, []);

};
