const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class GridView {
  constructor(el, dims, pushEventsFn) {
    this.self = el;
    this.dims = dims
    this.tiles = new Map();

    this.createGrid(dims)

    this.clickHandler = this.handleClick.bind(this);

    this.clicks$ = fromEvent(this.self, 'pointerdown').pipe(
      map(e => {
        const t = e.target.closest('.tile');
        const bb = t.getBoundingClientRect();
        return bb
        return {
          ...bb,
          x: bb.x - 2,
          y: bb.y - 37,
        }
      }),
      tap(x => console.log('x', x)),
      tap(payload => pushEventsFn('tile:click', payload)),
    ).subscribe()
  }

  get boundingBox() {
    return this.self.getBoundingClientRect()
  }

  get mapOffset() {
    const padding = { x: 2, y: 2 }
    return {
      x: 0 + 2,
      y: 37 + 2
    }
  }

  createGrid(dims, savedTiles) {
    this.tiles.clear();
    this.self.innerHTML = '';

    this.setGridSize(dims);

    for (var row = 0; row < dims.height; row++) {
      for (var col = 0; col < dims.width; col++) {
        this.insertTile(row, col, 'empty');
      }
    }

    this.self.append(...[...this.tiles.values()]);

  }

  insertTile(r, c, type) {
    const t = document.createElement('div');
    t.classList.add('tile');
    t.dataset.address = [r, c].toString();
    this.tiles.set(t.dataset.address, t)

    return t;

  }

  setGridSize({ height, width, tilesize }) {
    this.self.style.gridTemplateColumns = `repeat(${ width || this.dims.width }, ${tilesize}px)`;

    this.self.style.gridTemplateRows = `repeat(${ height || this.dims.height }, ${tilesize}px)`;
  }

  handleClick(e) {
    const t = e.target.closest('.tile');
    const bbox = t.getBoundingClientRect();
  }
}


export class Overlay {
  constructor(el, dims, eventStream) {
    this.self = el;
    this.dims = dims
    this.tileEvents$ = eventStream;
    this.getPointerMove = (target) => fromEvent(target, 'pointermove');
    this.gridMoves$ = this.getPointerMove(document.querySelector('#app-body'))

    this.grid = document.querySelector('#grid');
    this.appbody = document.querySelector('#app-body');

    this.tileEvents$
      .pipe(
        filter(_ => _),
        tap(() => this.selections.forEach(s => s.remove())),
        map(({ type, payload }) => payload),
        tap(this.insertSelection.bind(this)),
        switchMap(({ x, y }) => this.gridMoves$
          // switchMap(({x,y}) => this.getPointerMove(this.self)
          .pipe(
            map(({ clientX, clientY }) => ({ width: this.sel.getBoundingClientRect().x + clientX || 0, height: this.sel.getBoundingClientRect().y || 0 + clientY || 0 })),
            // map(({ clientX, clientY }) => ({ width: this.sel.getBoundingClientRect() + clientX, y: clientY })),
            // tap(this.resizeSelection.bind(this)),
            // takeUntil
            // tap(x => console.log('TAP', x)),
            // tap(({ x, y }) => console.log('el from point', document.elementFromPoint(x, y))),

          )
        )
      )
      // .subscribe()

    this.init(dims)
  }

  get selections() {
    return [...this.self.querySelectorAll('.selection')]
  }

  get boundingBox() {
    return this.self.getBoundingClientRect()
  }

  init(dims) {
    this.setSize(dims);

  }

  insertSelection({ x, y, width, height }) {
    this.sel = document.createElement('div');
    this.sel.classList.add('selection');

    this.self.append(this.sel)
    // this.appbody.append(this.sel)

    this.sel.style.top = `${y-37}px`
    this.sel.style.left = `${x}px`
    this.sel.style.height = `${height}px`
    this.sel.style.width = `${width}px`

    return this.sel
  }

  resizeSelection({ width, height }) {
    if (!this.sel) return;
    this.sel.style.width = `${width}px`
    this.sel.style.width = `${height}px`
    // this.sel = document.createElement('div');
    // sel.classList.add('selection');
    // this.self.append(this.sel)
    // sel.dataset.address = [r, c].toString();


    // this.tiles.set(t.dataset.address, t)

    return this.sel
  }

  setSize({ height, width, tilesize }) {
    this.self.style.width = width + 'px'
    this.self.style.height = height + 'px'
  }

  // handleClick(e) {
  //   const t = e.target.closest('.tile');
  //   const bbox = t.getBoundingClientRect();
  // }
}



const appbody = document.querySelector('#app-body')
const gridEl = document.createElement('div');
const overlayGrid = document.createElement('div');

gridEl.classList.add('grid');
gridEl.id = 'grid'

overlayGrid.classList.add('overlay-grid');
overlayGrid.id = 'overlay-grid'

appbody.innerHTML = ''

const dims = {
  width: 25,
  height: 25,
  tilesize: 30
}

appbody.append(
  gridEl,
  overlayGrid,
)
const gridEvents$ = new BehaviorSubject(null);

const pushEvent = (type, payload) => {
  gridEvents$.next({ type, payload })
}

const getUpdates = () => {
  return gridEvents$.asObservable()
}


const grid = new GridView(gridEl, dims, pushEvent)


const overlay = new Overlay(overlayGrid, grid.boundingBox, gridEvents$);
