import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
import { range } from '/lib/collection.helpers.js'

export class Matrix {
  constructor(rows) {
    this.rows
  }

  placeAt(point = { x: -1, y: -1 }) {}

  load(matrix) {
    this.rows = matrix.rows
    return this;
  }

  cell(r, c) { return this.rows[r].columns[c] }

  toList() { return this.rows.reduce((list, r) => [...list, ...r.columns], []) }

  row(rowIndex = 0) { return this.rows[rowIndex] }

  column(columnIndex = 0) {
    return this.columns[columnIndex];
  }

  #deriveColumns() {
    const colArr = new Array(9).fill([])

    const fields = this.rows
      .forEach((row, rowI) => {
        row.columns          .forEach((f, colI) => {
            colArr[colI][rowI] = f;
          })
      })

    return colArr;
  }

  get columns() { return this._columns ? this._columns : this.#deriveColumns() }

  get firstCell() { return this.cell(0, 0) }

  get lastCell() { return this.cell(this.rowCount, this.columnCount) }


  // transpose() {
  //   this.matrix =this.rows
  //     .reduce((cols, row, rowIndex, arr) => {
  //       const c = rowIndex

  //       let r = 0;
  //       let cols = row .reduce((cols, col, columnIndex, arr) => {
  //         // this.columns = 
  //       })
  //       let column = [];

  //       while (c > arr.length) {
  //         column = [...column, arr[c][r]];
  //         r += 1
  //       }

  //       return [...cols, column];
  //     }, []);
  //     return this
  // }

  insert(row, column, data = {}) {
    this.rows[row].columns[column] = data;
    return this.cell(r, c);
  }

  print() {
    const mstring = this.rows
      .reduce((rout, row, i) => {
        const rstring = row.columns
          .reduce((cout, cell, i) => {
            return `${cout} [${cell.column} ${cell.row}]`
          }, '').trim()
        return `${rout}\n\n${rstring}`
      }, '').trim()
    console.log(mstring)
  }

  appendToRow(rowIndex, data = {}) {
    this.matrix[rowIndex].push(data) //= [...this.matrix[rowIndex][y],data;
    return this;
  }

  get columnCount() { return this.rows[0].columns.length - 1 }

  get rowCount() { return this.rows.length - 1 }
}

export const createMatrix = (r, c) => {
  return new Matrix().load(range(0, r)
    .reduce((matrix, row, rowIndex) => {
      row = { columns: [] }
      for (let col = 0; col < c; col++) {
        const newCol = { x: col, y: rowIndex }
        row.columns = [...row.columns, newCol]
      }
      return {
        ...matrix,
        rows: [
          ...matrix.rows,
           row
        ],
      };
    }, { rows: [] }));
}

export const loadMatrix = (map) => {
  return new Matrix().load(map
    .reduce((matrix, tileRow, rowIndex) => {
      const row = tileRow
        .reduce((row, cell, cellIndex) => {
          return {
            ...row,
            columns: [
             ...row.columns, {
                tileType: cell,
                type: 'tile',
                row: rowIndex,
                column: cellIndex,
              }
            ],
          }
        }, { columns: [] })

      return {
        ...matrix,
        rows: [
          ...matrix.rows,
           row
        ],
      };
    }, { rows: [] }));
}
