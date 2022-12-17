import { UIObject } from './UIObject.js';
import { tokenizeFormula } from './formula-parser.js';
import { getCellValueByAddrress, selectCellStream } from '../script.js';
const { forkJoin, Observable, iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

let formula1 = 'AC132+2-B2/C3:C6*"fuck"'

// let parsed1 = splitByOperators(formula1)
let tokenized1 = tokenizeFormula(formula1)

console.warn('tokenized1', tokenized1)

export class Cell extends UIObject {
  #address;
  #value;
  #value$;
  #formula;

  constructor(address, value, formula) {
    super('cell');

    this.#address = address || null;

    this.#value = value || null;

    this.#value$ = new ReplaySubject();

    this.#formula = formula || null;

    this.formula$ = fromEvent(this.#input, 'change')
      .pipe(
        // tap(e => e.preventDefault()),
        // tap(e => e.stopPropagation()),
        map(({ target }) => target.value),
        map(value => {
          if (!value.startsWith('=')) {
            this.#value$.next(value);
          }

          return value;
        }),
        filter(_ => _.startsWith('=')),
        map(formula => {
          return Cell.tokenizeFormula(formula.replace('=', ''))
        }),
        tap(x => console.warn('tokenizeFormula IN  STREAM', x)),
        map(tokens => Cell.selectCellStream(tokens.filter(_ => _.type === 'reference').map(({ value }) => value))),
        // mergeMap(),
        tap(cellValues => console.warn(', cellValues', cellValues)),
        mergeMap(cellValues$ => cellValues$ //Cell.selectCellStream(tokens.filter(_ => _.type === 'reference').map(({ value }) => value))
          .pipe(

            tap(x => console.log('this.formula$', x)),
            tap(this.#value$),
          )
        ),
      );

    this.formula$.subscribe()
    // this.#value$.subscribe(x => console.warn('CELL VALUE IN SUBJECT ', x))

    // console.log('this.#value$', this.#value$)
  }

  static create({ column, row }) {
    const c = new Cell([column, row].toString());
    return c;
  }

  static tokenizeFormula(formulaString) {
    return tokenizeFormula(formulaString);
  }

  static selectCellStream(...addresses) {
    return selectCellStream(addresses);
  }

  render() {
    this.self.dataset.address = this.#address;

    this.setValue(this.#value || null);

    return this.self;
  }

  setValue(v) {
    this.#input.value = v;
  }

  getValue() {
    // If formula, evaluate assign to #value
    return this.#input.value;
  }

  get #input() { return this.self.querySelector('input') };

  get address() { return this.#address }

  get column() { return +this.#address.split(',')[0] }

  get row() { return +this.#address.split(',')[1] }
}
