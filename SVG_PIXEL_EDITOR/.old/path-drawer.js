import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { takeUntil, take, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class StreamState {
  #EventKeys = new Set(['down', 'move', 'up', ])
  #throttleDelta = 0;
  #drawSubject;
  #points = new Map([
    ['down', null],
    ['move', null],
    ['up', null],
  ]);

  #events$ = new Map();

  constructor(eventTarget, throttleDelta = 0.01) {


    this.eventTarget = eventTarget;

    this.activeStroke = null;

    this.canvasStrokes = [];

    this.#throttleDelta = throttleDelta;

    this.#drawSubject = new Subject();

    this.pointerdown$ = fromEvent(eventTarget, 'pointerdown').pipe(
      mergeMap(downEvent => of (downEvent).pipe(
        tap(point => this.beginDraw()),
        map(this.getPointOfEvent.bind(this)),
        tap(point => this.setEventPoint('down', point)),
        tap(({ x, y }) => this.renderPoint({ x, y, pointType: 'down' })),
        // tap(() => console.warn('[POINTER DOWN #Points]', [...this.#points.values()])),
        tap(this.#drawSubject),
      )));

    this.pointermove$ = fromEvent(eventTarget, 'pointermove').pipe(
      mergeMap(moveEvent => of (moveEvent).pipe(
        takeUntil(this.pointerup$),
        map(this.getPointOfEvent.bind(this)),
        this.throttleDraw(),
        tap(point => this.setEventPoint('move', point)),
        tap(({ x, y }) => this.renderPoint({ x, y, pointType: 'move' })),
        // tap(() => console.log('[POINTER MOVE #Points]', [...this.#points.values()])),
      )));

    this.pointerup$ = fromEvent(eventTarget, 'pointerup')
      .pipe(
        mergeMap(upEvent => of (upEvent).pipe(
          map(this.getPointOfEvent.bind(this)),
          tap(point => this.setEventPoint('up', point)),
          tap(({ x, y }) => this.renderPoint({ x, y, pointType: 'up' })),
          tap(this.resetPoints.bind(this)),
        )));


    this.pointerStream$ = this.pointerdown$
      .pipe(
        mergeMap(downPoint => this.pointermove$
          .pipe(
            tap(this.#drawSubject),
            switchMap(movePoint => this.pointerup$
              .pipe(
                // tap(() => console.warn('[POINTER UP #Points]', [...this.#points.values()])),
              )
            )
          )
        )
      );

    this.pointerStream$.subscribe(this.#drawSubject)

    this.#EventKeys.forEach(key => {
      this.#events$.set(key, fromEvent(eventTarget, `pointer${key}`))
    });
  };

  renderPoint({ pointType, x, y }) {
    if (!pointType || !(!!this.activeStroke)) return;

    const point = document.createElementNS(SVG_NS, 'circle');
    console.log('Object.assign(this.eventTarget.createSVGPoint(), {x: 10, y: 10}))', Object.assign(this.eventTarget.createSVGPoint(), { x, y }))
    point.cx.baseVal.value = x;
    point.cy.baseVal.value = y;
    point.r.baseVal.value = 0.2;
    point.classList.add('stroke-point')

    if (pointType === 'move') {
      point.style.fill = 'black';

      this.activeStroke.prepend(point);
      // console.log('point.isPointInFill(', point.isPointInFill(new DOMPoint(1,1)));
      return this.activeStroke

      return point;
    }


    point.style.fill = pointType === 'down' ? 'green' : 'red';

    this.activeStroke.append(point);

    return this.activeStroke;
  }

  toCanvasPoint({ x, y }) {
    return new DOMPoint(x, y).matrixTransform(
      this.eventTarget.getScreenCTM().inverse()
    );
  }

  setDrawThrottle() {}

  getDrawStream() {
    return this.#drawSubject.asObservable();
  }

  throttleDraw() {
    return filter((point) => {
      if (!!this.#points.get('up')) return false;

      if (!(!!this.#points.get('down'))) return true;

      return (!!this.#points.get('move')) ?
        (Math.abs(point.x - this.#points.get('move').x) >= this.#throttleDelta ||
          Math.abs(point.y - this.#points.get('move').y) >= this.#throttleDelta) :
        (Math.abs(point.x - this.#points.get('down').x) >= this.#throttleDelta ||
          Math.abs(point.y - this.#points.get('down').y) >= this.#throttleDelta)
    });
  }

  getPointOfEvent({ clientX, clientY, type }) {
    const point = { x: clientX, y: clientY }

    return this.toCanvasPoint(point)
  }

  beginDraw() {
    if (!!this.activeStroke) {
      this.canvasStrokes.push(this.activeStroke)
    }

    this.activeStroke = document.createElementNS(SVG_NS, 'g')
    this.activeStroke.classList.add('canvas-stroke');

    this.eventTarget.append(this.activeStroke);

    return this.activeStroke
  }

  resetPoints() {
    [...this.#points].forEach(([k, v], i) => {
      this.#points.set(k, null);
    });

    return this;
  }

  setEventPoint(pointType, point) {
    if (!this.#points.has(pointType)) return null;
    // console.log('pointType', pointType)
    return this.#points.set(pointType, point).get(pointType)
  }

  createPointerStream() {}

  // get points() { return this.#points };

  get downPoint() { return this.#points.get('down') };
  get movePoint() { return this.#points.get('move') };
  get upPoint() { return this.#points.get('up') };
  // set prop(v) { this.#prop = v };
}
