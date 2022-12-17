export class Cell {
  #value;
 
  constructor(value) {
    this.#value = value;
  }
  
  static createCell({value}){
    value = value ? value : 0;
    return new Cell(value)
  }
  
  get value() { return this.#value };
}
