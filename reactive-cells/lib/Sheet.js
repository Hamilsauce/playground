import { UIObject } from './UIObject.js';
import { Cell } from './Cell.js';

export class Sheet extends UIObject {
  #cells;

  constructor(dims) {
    super('sheet');

    this.#cells = this.addCollection('cells')

    dims = dims || { rows: 2, columns: 2 }

    this.loadCells(dims);
  }

  loadCells(dims) {
    for (var row = 0; row < dims.rows; row++) {
      for (var col = 0; col < dims.columns; col++) {
        this.insertCell(col, row)
      }
    }
  }

  insertCell(column, row) {
    const c = Cell.create({ column, row });

    this.#cells.add(c.address, c);

    return c;
  }

  render() {
    this.self.innerHTML = '';

    this.#cells.each(cell => {
      this.self.append(cell.render())
    })

    return this.self;
  }

  get cells() { return this.#cells.values }
}
