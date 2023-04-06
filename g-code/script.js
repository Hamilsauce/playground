// import { SVGPNG } from './lib/svgsave.js';
// import { saveSvg } from './lib/save-svg-image.js';
import { GcodeParser, loadFile } from './gcode-parser.js';
import { GcodePrinter } from './gcode-printer.js';
import { Fusible, Infusible } from '../Fusible.js';
import { gcodePaths } from './data/gcode-paths.js';
import { addPanAction } from '../lib/pan-viewport.js';
import { TransformList } from '../lib/TransformList.js';
import { zoom } from '../lib/zoom.js';

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, DOM, download } = ham;

const TRANSFORM_TYPES = {
  SVG_TRANSFORM_MATRIX: 1,
  SVG_TRANSFORM_ROTATE: 4,
  SVG_TRANSFORM_SCALE: 3,
  SVG_TRANSFORM_SKEWX: 5,
  SVG_TRANSFORM_SKEWY: 6,
  SVG_TRANSFORM_TRANSLATE: 2,
  SVG_TRANSFORM_UNKNOWN: 0,
}

const TRANSFORM_TYPE_INDEX = [
  'SVG_TRANSFORM_UNKNOWN',
  'SVG_TRANSFORM_MATRIX',
  'SVG_TRANSFORM_TRANSLATE',
  'SVG_TRANSFORM_SCALE',
  'SVG_TRANSFORM_ROTATE',
  'SVG_TRANSFORM_SKEWX',
  'SVG_TRANSFORM_SKEWY',
];

const INITIAL_STATE = {
  appTitle: 'GCODE',
  filepath: gcodePaths[0],
}

export class AppState {
  #listeners = new Map();

  #state = {
    appTitle: null,
    filepath: null,
  }

  constructor(initialState = {}) {
    this.#state = { ...this.#state, ...initialState }
  }

  emit(propName, data) {
    this.#listeners.get(propName).forEach((handler, i) => {
      handler(data)
    });
  }

  select(propName) { return this.#state[propName] }

  listenOn(propName, handlerFn) {
    if (this.#listeners.has(propName)) {
      this.#listeners.set(propName, [...this.#listeners.get(propName), handlerFn])
    }
    else {
      this.#listeners.set(propName, [handlerFn])
    }

    handlerFn(this.#state[propName]);
  }

  update(propName, value) {
    const propValue = this.#state[propName];
    const propType = propValue ? propValue.constructor.name.toLowerCase() : null;

    if (propType === 'array') {
      this.#state[propName] = [...propValue, ...value];
    }
    else if (propType === 'object') {
      this.#state[propName] = { ...propValue, ...value };
    }
    else {
      this.#state[propName] = value;
    }

    if (this.#listeners.has(propName)) {
      this.emit(propName, this.#state[propName])
    }
  }
}


const ui = {
  _svgTransformList: null,
  _sceneTransformList: null,
  get transformLists() {
    return {
      svg: this._svgTransformList,
      scene: this._sceneTransformList,
    }
  },
  get app() { return document.querySelector('#app') },
  get appTitle() { return this.app.querySelector('#app-title') },
  get appHeader() { return this.app.querySelector('#app-header') },
  get appBody() { return this.app.querySelector('#app-body') },
  get save() { return this.app.querySelector('#save-image') },
  get controls() { return this.appBody.querySelector('#controls') },
  get fileSelect() { return this.controls.querySelector('#gcode-select') },
  get zoom() {
    return {
      container: this.appBody.querySelector('#zoom-buttons'),
      in: this.appBody.querySelector('#zoom-in'),
      out: this.appBody.querySelector('#zoom-out'),
    }
  },

  get svg() { return this.appBody.querySelector('svg') },
  get scene() { return this.svg.querySelector('#scene') },

  createSelect({ id, children, onchange }) {
    const sel = DOM.createElement({
      tag: 'select',
      elementProperties: { id, onchange },
    }, children);

    return sel;
  },

  init() {
    const parentBBox = this.svg.parentElement.getBoundingClientRect();

    this.svg.width.baseVal.value = parentBBox.width - parentBBox.x;
    this.svg.height.baseVal.value = parentBBox.height - parentBBox.y;

    this._svgTransformList = new TransformList(this.svg);
    this._sceneTransformList = new TransformList(this.scene);
    // console.log('this._svgTransformList', this._svgTransformList)

    this.controls.append(
      this.createSelect({
        id: 'gcode-select',
        onchange: (e) => {
          e.preventDefault();
          e.stopPropagation();

          const selection = e.target.selectedOptions[0];

          appState.update('filepath', selection.value);

          e.target.dispatchEvent(new CustomEvent('gcodepath:change', {
            bubbles: true,
            detail: { filepath: selection.value }
          }));
        },
        children: gcodePaths.map((path, i) => DOM.createElement({
          tag: 'option',
          elementProperties: { textContent: path, value: `./data/${path}` },
        }))
      })
    )
  },
}


const appState = new AppState(INITIAL_STATE);

ui.init()

const printer = new GcodePrinter();

/*  @FUSION - Extend printer with fusibility 
      allow extension by interfacing with Infusible
*/
Fusible.fusify(printer);



/*  @FUSION - Extend parser with infusibility 
      allow Fusible to infuse itself with
      methods and data that parser exposes 
      via infuse method
*/
const parser = new GcodeParser(printer);
Infusible.infusify(parser,
  (fusible) => {
    Object.assign(fusible, {
      groupByCommandType: parser.groupByCommandType,
      loadGcode: parser.loadGcode,
    });

    return parser.defuse;
  },
  (fusible) => {
    delete fusible.groupByCommandType;
    delete fusible.loadGcode;
  }
);


const parserFusion = printer.fuse(parser);

const loadGcodeFile = async (path) => {
  appState.update('appTitle', 'loading...')

  const rawGcode = await printer.loadGcode(path)
  const gcodeLines = parser.parse(rawGcode)

  const gcodeCoords = gcodeLines.filter(_ => !!_.x && !!_.y);

  // download(path.slice(0, path.indexOf('.gcode')) + 'grouped.json', JSON.stringify(gcodeLinesByCommand, null, 2))

  ui.scene.innerHTML = '';

  // ui.scene.style.display = 'none'
  window._times = []
  ui.scene.append(...(await Promise.all(
    gcodeCoords.map((async (code, i) => {
      const p = document.createElementNS(ui.svg.namespaceURI, 'circle');

      p.r.baseVal.value = 0.15;
      p.cx.baseVal.value = +code.x || 0;
      p.cy.baseVal.value = +code.y || 0;

      window._times.push([i, performance.now()]);

      return p;
    })))));

  appState.update('appTitle', 'GCODE');

  return true;
};


appState.listenOn('appTitle', async (title) => {
  ui.appTitle.textContent = title
});

appState.listenOn('filepath', async (filepath) => {
  console.time('DRAW POINTS');
  const res = await loadGcodeFile(filepath)
  console.timeEnd('DRAW POINTS');
});


const pan$ = addPanAction(ui.svg, ({ x, y }) => {
  ui.svg.viewBox.baseVal.x = x
  ui.svg.viewBox.baseVal.y = y
});

pan$.subscribe();



// ZOOM style 1 - Mutate SVG viewBox
const setTransformAttr = (el, transforMap = {}) => {
  const transformString = el.getAttribute('transform').trim()

  const tMap = transformString
    .split(') ')
    .reduce((map, curr, i) => {

      const type = curr.slice(0, curr.indexOf('('));
      const valuesString = curr.slice(
        curr.indexOf('(') + 1)

      const values = curr.slice(curr.indexOf('('))
        .split(/\s|,/g)
        .map(_ => +_);

      return { ...map, [type]: values };
    }, {
      translate: [],
      rotate: [],
      scale: [],
    });

  return tMap
};



setTimeout(() => {
  // const zoom = ui.zoom.container
  const svg = ui.svg;
  const scene = svg.querySelector('#scene')

  ui.zoom.container.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    const vb = svg.viewBox.baseVal
    const zoomId = e.target.closest('.zoom-button').id

    // ui.scene.style.display = 'none'

    const sTime = performance.now()

    if (zoomId === 'zoom-in') {
      zoom.in(svg)
    }

    else if (zoomId === 'zoom-out') {
      zoom.out(svg)
    }

    setTimeout(() => {
      const eTime = performance.now()
      const elapsed = ((eTime - sTime) / 1000) / 60

      // ui.scene.style.display = null

      console.group('ZOOM RENDER TIME');
      console.log({ sTime, eTime });
      console.warn('elapsed', elapsed)
      console.groupEnd('ZOOM RENDER TIME');
    }, 0);
  });
}, 1000);