import { Cell } from './cell.js';

export class Matrix {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static createMatrix(data) {
    value = value ? value : 0;
    return new Matrix(value)
  }

  add() {}

  multiply() {}

  divide() {}

  transpose() {}

  translate() {}

  rotate() {}

  load(Values = []) {

  }

  get value() { return this.#value };
}
