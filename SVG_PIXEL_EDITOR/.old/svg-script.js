import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { getTemplater, setTemplateSource } from './lib/svg-templater.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js'
import { StreamState } from './path-drawer.js';
import { App } from './app.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const { download, template, date, array, utils, text } = ham;

// const toolbarEvents = new DOMEventStream(document.querySelector('#toolbar'), 'click')

// toolbarEvents.subscribe(e => {
//   console.log('TOOLBAR EVENT CALLBACK IN SCRIPT.JS', e);
// })

const appConfig = {
  components: []
}


const templater = setTemplateSource('canvas-elements');

const app = new App('#app')


const makeDraggable = (svg, el) => {
  const stopDrag = draggable(svg, el);

  el.dataset.draggable = true;

  el.removeDrag = () => {
    stopDrag();
    el.dataset.draggable = false;
  }

  svg.style.touchAction = 'none';

  return el;
}


const getPointerEvents = (target) => {
  return fromEvent(target, 'click')
    .pipe(
      switchMap(downEvent => of (downEvent)
        .pipe(
          map(x => x),
          tap(x => console.log('TAP', x)),
        )
      )
    );

  return {
    down$: fromEvent(target, 'pointerdown'),
    move$: fromEvent(document, 'pointermove'),
    up$: fromEvent(document, 'pointerup'),
  }
}

const getEventStream = (target, eventType, callback) => {
  return fromEvent(target, eventType)
    .pipe(
      switchMap(downEvent => of (downEvent)
        .pipe(
          // map(({ target }) => target.closest('g')),
          map(el => !!callback ? callback(el) : el),
          tap(x => console.log(eventType, { x })),
          map(x => x),
        )
      )
    );

  return {
    down$: fromEvent(target, 'pointerdown'),
    move$: fromEvent(document, 'pointermove'),
    up$: fromEvent(document, 'pointerup'),
  }
}



const setViewport = (canvas, { width, height, x, y }) => {
  canvas.width.baseVal.value = width;
  canvas.height.baseVal.value = height;

  return canvas;
};

const setCoordinateSystem = (canvas, rect) => {
  Object.assign(canvas.viewBox.baseVal, rect);

  return canvas;
};


const getCanvasElementFromPoint = (point) => {
  const el = document.elementFromPoint(point.x, point.y).closest('[data-canvas-element]')

  return el;
};

const createCanvas = (name, canvasContainer, options) => {
  const canvas = templater.get('canvas');
  const { height, width, x, y, } = canvasContainer.getBoundingClientRect();

  if (canvasContainer) options.viewport = { height, width };

  if (options.viewport) setViewport(canvas, options.viewport);

  if (options.viewBox) setCoordinateSystem(canvas, options.viewBox);

  Object.entries(options.attributes || {}).forEach(
    ([name, value]) => canvas.setAttribute(name, value)
  );

  Object.entries(options.style || {}).forEach(
    ([name, value]) => canvas.style[name] = value
  );

  return canvas;
};

const setElementPoint = (el, { x, y }) => {
  el.x.baseVal.value = x;
  el.y.baseVal.value = y;

  return el;
};

const setElementDims = (el, { width, height }) => {
  el.width.baseVal.value = width;
  el.height.baseVal.value = height;

  return el;
};


const createCanvasElement = (canvas, elementName, options) => {
  const el = templater.get(elementName);
  // const { height, width, x, y, } = elContainer.getBoundingClientRect();

  // if (elContainer) options.viewport = { height, width };

  if (options.point) setElementPoint(el, options.point);

  if (options.dims) setElementDims(el, options.dims);

  Object.entries(options.attributes || {}).forEach(
    ([name, value]) => el.setAttribute(name, value)
  );

  Object.entries(options.style || {}).forEach(
    ([name, value]) => el.style[name] = value
  );

  return el;
};

const addCanvasElements = (canvas, ...canvasElements) => {
  canvas.append(...[...canvasElements].map((el) => makeDraggable(canvas, el)));

  return canvas;
};

const attachCanvas = (container, canvas) => {
  container.append(canvas);

  return canvas;
};

const DEFAULT_CANVAS_CONFIG = {
  unitSize: 1,
  dataset: {},
  attributes: {
    id: 'canvas',
    preserveAspectRatio: 'xMidYMid meet',
  },
  style: {
    background: '#C7C7C7',
  },
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  get viewBox() {
    return {
      height: 10,
      width: 10,
      get x() { return -(this.width) / 2 },
      get y() { return -(this.height) / 2 },
    }
  }
}

const DEFAULT_ELEMEMT_CONFIG = {
  dataset: {},
  attributes: {
    id: '',
  },
  dims: {
    width: 2,
    height: 2,
  },
  point: {
    x: 0,
    y: 0,
  },
}

const CanvasState = {
  canvas: null,
  canvasElements: new Map(),
  addElement(name, ) {
    return this.canvasElements.set
  }
}

const canvasContainer = document.querySelector('#svg-container');

const canvas = createCanvas('canvas',
  canvasContainer,
  DEFAULT_CANVAS_CONFIG
);

const defaultCanvasElements = new Map([
  ['circ1', document.createElementNS(SVG_NS, 'circle')],
  ['block1', templater.get('block')],
  ['tile1', templater.get('tile')],
  ['tile2', templater.get('tile')],
  ['tile3', templater.get('tile')],
  ['tile4', templater.get('tile')],
  ['tile5', templater.get('tile')],
]);

addCanvasElements(canvas, ...[...defaultCanvasElements.values()])


const pen = new StreamState(canvas);

const penEvents$ = pen.getDrawStream()
  .pipe(
    tap(x => console.warn('[getDrawStream] PEN EVENTS IN SCRIPT', x))
  );

penEvents$.subscribe()

// canvas.append(...[...defaultCanvasElements.values()].map((el) => {
//   return makeDraggable(canvas, el);
// }))


canvasContainer.innerHTML = '';

attachCanvas(canvasContainer, canvas);

const rect1 = document.createElementNS(SVG_NS, 'rect');

// getPointerEvents(canvas, 'click', {
//   down: (e) => { console.warn('In [GET POINTER EVENTS] down Callback') },
//   move: (e) => {},
//   up: (e) => {},
// }).subscribe()

getEventStream(canvas, 'click', evt => {
  const el = getCanvasElementFromPoint({ x: evt.clientX, y: evt.clientY })
  if (el && !(!!el.removeDrag)) {
    makeDraggable(canvas, el);
  }

  return el;
}) //.subscribe()

getEventStream(canvas, 'dblclick', evt => {
  const el = getCanvasElementFromPoint({ x: evt.clientX, y: evt.clientY })

  if (el && !!el.removeDrag) {
    el.removeDrag()
    el.removeDrag = null
  }


  return el;
}) //.subscribe()

const preserveAspectRatioAlignments = [
  'none',
  'xMinYMin',
  'xMidYMin',
  'xMaxYMin',
  'xMinYMid',
  'xMidYMid',
  'xMaxYMid',
  'xMinYMax',
  'xMidYMax',
  'xMaxYMax',
];

const preserveAspectRatioScales = [
  'meet',
  'slice'
];
