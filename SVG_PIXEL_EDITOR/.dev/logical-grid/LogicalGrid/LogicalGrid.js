const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
import { draggable } from '/utils/draggable.service.js'

import { Tile } from '/logical-grid/Tile.js'
import { LogicalTile } from '../LogicalTile.js'
import { GridView } from '../GridView.js'
import { loadMatrix } from '../matrix.collection.js';
import { grid10x10 } from '../map1.js'
// console.log('Tile',new Tile())

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };

  toString() {
    return `[ ${this.x} ${this.y} ]`
  }
}


export class Cell extends Point {
  constructor({ x, y, size, scale }, grid) {
    super(x, y);
    this.size = size;
    this.scale = scale || 1;
    this.grid = grid;
    this.offset = 4
  }

  get XY() { return { x: this.x, y: this.y } }
  get neighbors() { return this.grid.neighborsOf(this) };
}




export class LogicalGrid extends EventTarget {
  matrix;

  constructor() {
    super();
    
    const activeHandler = this.handleActivatedTile.bind(this)

    this.addEventListener('tile:active', activeHandler)
    // this.matrix = loadMatrix(r, c)
  }

  handleActivatedTile(e) {
    const tile = this.getTile(e.detail.row, e.detail.column)
    
    tile.active = true;
    
    console.log('tile fetched n acfive', { tile })
  }

  groupBy() {}

  difference(arr1, arr2, comparer) { return arr1.filter(arr1El => !arr2.includes(arr1El)) }

  distinctValues(arr) { return Array.isArray(arr) ? [...new Set(arr)] : ['err'] }

  intersection(arr1, arr2, comparer) { return arr1.filter(arr1El => arr2.includes(arr1El)) }

  union(...arrs) { return arrs.reduce((uni, arr) => [...new Set([...uni, ...arr2]), []]) }


  orderBy(dim = 'row', dir = 'asc') {
    return
  }

  each() {}

  getTile(c, r) {
    return this.matrix.rows[Math.abs(-(r) + this.offset.row)].columns[(Math.abs(this.offset.column + (-c)))];
  }
  
  getTileKey({ row, column }) {
    return `r${row}c${column}`
  }

  lookupTile(t) {
    return this.tileMap.get(t.tileKey)
  }

  matrixToMap() {
    return this.matrix.toList().reduce((map, tile, i) => {
      const k = this.getTileKey(tile)
      return map.set(k, { ...tile, tileKey: k })
    }, new Map())
  }


  neighbors(tile) {
    const { column, row } = tile

    return {
      north: () => (column, row - 1),
      east: () => (column + 1, row),
      south: () => (column, row + 1),
      west: () => (column - 1, row),
    }
  }

  print() {
    this.matrix.print()
  }

  load(matrix) {
    this.matrix = loadMatrix(matrix);
    this.tileMap = this.matrixToMap(this.matrix)
    // console.warn(this.matrix);
  }

  translateGrid(offset = { row: 0, column: 0 }) {
    this.offset = offset

    this.matrix.rows
      .forEach((rowObj, rowIndex) => {
        rowObj.columns.forEach((colObj, colIndex) => {
          this.matrix.rows[rowIndex].columns[colIndex] = {
            ...colObj,
            row: colObj.row + offset.row,
            column: colObj.column + offset.column,
          }
        })
      });
    console.log('this.matrix', this.matrix)
    return this;
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const canvas = document.querySelector('svg')
// const surface = document.querySelector('#surface')

const grid = new LogicalGrid();



grid.load(grid10x10);

// console.warn(grid.matrix.rows[2].columns);
grid.translateGrid({ row: -Math.floor((grid.matrix.rows.length / 2)), column: -Math.floor((grid.matrix.rows[0].columns.length / 2)) })
// grid.print()
// grid.matrix.transpose();

const gview = new GridView(canvas, grid);
const scene = document.querySelector('#scene')
// scene.appendChild(gview.self)
draggable(canvas, scene)
// draggable(canvas,gview.self)

// document.querySelector('#surface').appendChild(gview.self)
// gview.init();
gview.load(grid.matrix)

grid.tileEvents$ = gview.subscribe()

grid.tileEvents$
  .pipe(
    map(x => grid.getTile(x.y, x.x)),
    tap(x => console.log('HEARD IN LOGICAL G', x)),
  )
  .subscribe()

grid.print()
console.log('matty.columns', grid.matrix.columns)


const actorTemp = `
<g class="actor" id="john2" data-row="0" data-column="0" transform="translate(50,50) scale(1)">
  <circle data-row="0" data-column="0" transform="translate(10,0.5) scale(1)" fill="blue"  class="actor-shape" r="0.4"></circle>
</g>
`

const createActor = () => {
  const doc = new DocumentFragment();
  return new DOMParser().parseFromString(actorTemp, 'image/svg+xml').firstElementChild
}

const actor2 = createActor()

gview.self.querySelector('#actors').appendChild(actor2)
gview.self.appendChild(actor2)
