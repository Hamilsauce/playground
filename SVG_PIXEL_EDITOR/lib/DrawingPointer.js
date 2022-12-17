import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { rxjs, template, date, array, utils, text } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { takeWhile, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class PointerMark {
  #start = { x: 0, y: 0 }
  #end = { x: 0, y: 0 }
  #current = { x: 0, y: 0 }
  #length = 0;
  #self;

  constructor() {

  }

  getTotalLength() {}

  getPointAtLength() {}
}

export class DrawingPointer extends EventEmitter {
  #size = 5;
  #step = 5;
  #color = 'red';
  #canvasContext;
  // #tool = 'pen';
  #tool = 'pixel';
  #isDrawing = false;
  #isConnected;
  #surface;
  #pointerSubscription;

  #currentMark = {
    start: null,
    current: null,
    end: null,
  };
  #pointerEvents$ = {
    down: null,
    move: null,
    up: null,
  };

  #position = { x: 0, y: 0 }

  constructor(initialTool = 'pen') {
    super();
  }

  setCanvasContext(canvas) {
    this.#canvasContext = canvas;
    this.setEventSource();
  }

  setPosition(pt) {
    const { start, current, end } = this.#currentMark
    const point = this.getPoint(pt.x, pt.y)

    this.previousPoint = this.#position;
    this.#position = point

    return point;
  }

  setTool(tool) {}

  setEventSource(layer) {
    if (this.#pointerSubscription && this.#pointerSubscription.unsubscribe) this.#pointerSubscription.unsubscribe();

    this.#pointerSubscription = this.#canvasContext.activeLayer$
      .pipe(
        tap(x => this.#surface = x),
    
        switchMap(e => fromEvent(this.drawSurface, 'pointerdown').pipe(
          tap(this.#isDrawing = true),
          tap(x => this.#currentMark = { ...this.#currentMark, ...{ start: null, current: null, end: null } }),
          map(({ clientX, clientY }) => ({ x: clientX, y: clientY })),
          map(this.setPosition.bind(this)),
          map(() => this.#isDrawing),
       
          switchMap(isDrawing => fromEvent(this.drawSurface, 'pointermove').pipe(
            map(({ clientX, clientY }) => ({ x: clientX, y: clientY })),
            map(this.setPosition.bind(this)),
            map(this.createMarkPoint.bind(this)),
            switchMap(e => fromEvent(this.drawSurface, 'pointerup')
              .pipe(
                tap(this.#isDrawing = false),
              ))))
        ))
      )
      .subscribe()
  }

  createMarkPoint({ tool, x, y }) {
    tool = !tool ? this.#tool : tool
    const pt = !(x && y) ? this.#position : { x, y }

    if (tool === 'pen') {
      const circ = document.createElementNS(SVG_NS, 'circle');
      circ.setAttribute('r', this.#size);
      circ.setAttribute('cx', pt.x)
      circ.setAttribute('cy', pt.y)
      circ.setAttribute('fill', this.#color);

      this.drawSurface.append(circ);
      return circ;
    }

    if (tool === 'pixel') {
      const pixel = document.createElementNS(SVG_NS, 'rect');
      pixel.setAttribute('width', this.#size);
      pixel.setAttribute('height', this.#size);
      pixel.setAttribute('transform', `translate(-${this.#size/2}, -${this.#size/1.5})`);
      pixel.setAttribute('x', pt.x)
      pixel.setAttribute('y', pt.y)
      pixel.setAttribute('fill', this.#color);

      this.drawSurface.append(pixel);
      return pixel;
    }
  }

  initialize$(pointerEvents$) {}

  initialize(canvas) {
    this.setCanvasContext(canvas);
  }

  draw() {
    /* 
      Renders current mark on drawing surface
      according to current pointer tool and settings
    */
  }

  down() { /* Set current mark/starting point */ }

  move() { /* Append point to current mark*/ }

  up() { /* complete currentmark/append end point */ }

  cancel() { /* Remove current mark if not complete/ended */ }

  getPoint(x, y) {
    return this.ctx.createPoint(x, y, );
  }

  get drawSurface() {
    return this.#canvasContext.activeLayer
    return this.#surface

  };

  get ctx() { return this.#canvasContext };
}
