// import { SVGPNG } from './lib/svgsave.js';
// import { saveSvg } from './lib/save-svg-image.js';
import { GcodeParser, loadFile } from './gcode-parser.js';
import { GcodePrinter } from './gcode-printer.js';
import { Fusible, Infusible } from '../Fusible.js';
import { gcodePaths } from './data/gcode-paths.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, DOM, download } = ham;

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

    handlerFn(this.#state[propName])
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


const createSelect = ({ id, children, onchange }) => {
  const sel = DOM.createElement({
    tag: 'select',
    elementProperties: { id, onchange },
  }, children);

  return sel;
};


const ui = {
  get app() { return document.querySelector('#app') },
  get appTitle() { return this.app.querySelector('#app-title') },
  get appHeader() { return this.app.querySelector('#app-header') },
  get appBody() { return this.app.querySelector('#app-body') },
  get save() { return this.app.querySelector('#save-image') },
  get controls() { return this.appBody.querySelector('#controls') },
  get svg() { return this.appBody.querySelector('svg') },
  get scene() { return this.svg.querySelector('#scene') },
}

const appState = new AppState(INITIAL_STATE);

const fileSelect = createSelect({
  id: 'gcode-select',
  onchange: (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selection = e.target.selectedOptions[0];

    appState.update('filepath', selection.value)
    e.target.dispatchEvent(new CustomEvent('gcodepath:change', { bubbles: true, detail: { filepath: selection.value } }))
  },
  children: gcodePaths.map((path, i) => DOM.createElement({
    tag: 'option',
    elementProperties: { textContent: path, value: `./data/${path}` },
  }))
});

ui.controls.append(fileSelect);


const printer = new GcodePrinter();
Fusible.fusify(printer);

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
  const gcodeLinesByCommand = printer.groupByCommandType(gcodeLines);

  const gcodeCoords = gcodeLines.filter(_ => !!_.x && !!_.y);
  console.log('gcodeLinesByCommand', { gcodeLinesByCommand });
  // download(path.slice(0, path.indexOf('.gcode')) + 'grouped.json', JSON.stringify(gcodeLinesByCommand, null, 2))

  ui.scene.innerHTML = '';

  ui.scene.append(
    ...gcodeCoords.map(
      (code, i) => {
        const p = document.createElementNS(ui.svg.namespaceURI, 'circle');
        p.r.baseVal.value = 0.15
        p.cx.baseVal.value = +code.x || 0
        p.cy.baseVal.value = +code.y || 0
        return p // Promise.resolve(p)
      })
  );


  appState.update('appTitle', 'GCODE')
};


// ui.save.addEventListener('click', (e) => {
//   console.log('click');
//   SVGPNG(ui.svg, (src, canvas, img) => {
//     console.log('src, canvas, img', src, canvas, img)
//   })
// });


appState.listenOn('appTitle', async (title) => {
  ui.appTitle.textContent = title
});

appState.listenOn('filepath', async (filepath) => {
  console.time('DRAW POINTS');
  await loadGcodeFile(filepath)
  console.timeEnd('DRAW POINTS')
});