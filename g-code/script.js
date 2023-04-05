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
    this.svg.height.baseVal.value = parentBBox.height-parentBBox.y;

    this._svgTransformList = new TransformList(this.svg);
    this._sceneTransformList = new TransformList(this.scene);
    console.log('this._svgTransformList', this._svgTransformList)

    this.controls.append(
      this.createSelect({
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
      })
    )


  },
}

console.warn('ui.svg.width', ui.svg.width)

const appState = new AppState(INITIAL_STATE);

// const fileSelect = createSelect({
//   id: 'gcode-select',
//   onchange: (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const selection = e.target.selectedOptions[0];

//     appState.update('filepath', selection.value)
//     e.target.dispatchEvent(new CustomEvent('gcodepath:change', { bubbles: true, detail: { filepath: selection.value } }))
//   },
//   children: gcodePaths.map((path, i) => DOM.createElement({
//     tag: 'option',
//     elementProperties: { textContent: path, value: `./data/${path}` },
//   }))
// });

ui.init()
// ui.controls.append(fileSelect);


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


  appState.update('appTitle', 'GCODE');

  return true;
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
  const res = await loadGcodeFile(filepath)
  console.timeEnd('DRAW POINTS');
});




const pan$ = addPanAction(ui.svg, ({ x, y }) => {
  // console.log('e', e)
  ui.svg.viewBox.baseVal.x = x
  ui.svg.viewBox.baseVal.y = y
})
pan$.subscribe();



// ZOOM style 2 - Scale #Scene
// setTimeout(() => {
//   const zoom = ui.zoom.container
//   const scene = ui.svg.querySelector('#scene')

//   // console.log('hud.dom', hud.dom);

//   zoom.addEventListener('click', e => {
//     e.preventDefault()
//     e.stopPropagation()
//     e.stopImmediatePropagation()

//     const zoomId = e.target.closest('.zoom-button').id

//     const sceneTransforms = ui.transformLists.scene
//     const currSceneScale = sceneTransforms.scale
//     const currSceneRotate = sceneTransforms.rotation

//     console.log('currSceneScale', currSceneScale)
//     console.log('currSceneRotate', currSceneRotate)
//     console.log('sceneTransforms.getMatrixAt(0)', sceneTransforms.getMatrixAt(0))
//     console.log('sceneTransforms.getMatrixAt(1)', sceneTransforms.getMatrixAt(1))
//     console.log('sceneTransforms.getMatrixAt(2)', sceneTransforms.getMatrixAt(2))
//     // console.log('scaleTransform', scaleTransform)
//     // console.log('svgBBox', svgBBox)
//     // console.log('svgBCR', svgBCR)

//     if (zoomId === 'zoom-in') {
//       sceneTransforms.scaleTo(
//         currSceneScale.x + 0.2,
//         currSceneScale.y + 0.2,
//       )
//       // sceneTransforms.rotateTo(
//       //   currSceneRotate.x + 20,
//       // )
//     }

//     else if (zoomId === 'zoom-out' && currSceneScale.x > 0.2) {
//       sceneTransforms.scaleTo(
//         currSceneScale.x - 0.2,
//         currSceneScale.y - 0.2,
//       )
//     }


//     // if (isZoomIn && Math.abs(zoom.level) < zoom.limit) {
//     // if (zoomIn) {
//     //   // zoom.direction++

//     //   Object.assign(vb, {
//     //     width: vb.width - vb.width / 6,
//     //     height: vb.height - vb.height / 4,
//     //     y: (vb.y - vb.height / -8),
//     //     x: (vb.x - vb.width / -12),
//     //   })
//     // }

//     // else if (isZoomOut && Math.abs(zoom.level) < zoom.limit) {
//     // else if (zoomOut) {
//     //   // zoom.direction--

//     //   Object.assign(vb, {
//     //     width: vb.width + vb.width / 6,
//     //     height: vb.height + vb.height / 4,
//     //     y: (vb.y - vb.height / 8),
//     //     x: (vb.x - vb.width / 12),
//     //   })
//     // }
//   });



// }, 1000)



// ZOOM style 1 - Mutate SVG viewBox

const setTransformAttr = (el, transforMap = {}) => {
  const transformString = el.getAttribute('transform').trim()
  const poop = transformString.replace(/\(|\)/g, ' ')
  // console.log('poop', poop);

  const tMap = transformString
    // .replace(/\(*\)/g, 'poop')
    .split(') ')
    .reduce((map, curr, i) => {
      // console.warn('curr', curr)

      const type = curr.slice(0, curr.indexOf('('));
      const valuesString = curr.slice(
        curr.indexOf('(') + 1)
      // .split(/\s|,/g)
      // .map(_ => +_);
      // console.warn({ type, valuesString });

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
    // console.log('scene.getAttribute(transform', scene.getAttribute('transform'));
    // console.log('zoom');
    // console.log(zoom);
    const vb = svg.viewBox.baseVal
    // const zoomIn = e.target.closest('#hud-zoomIn')
    // const zoomOut = e.target.closest('#hud-zoomOut')
    // const isZoomIn = e.composedPath().some(el => el === hud.zoomIn)
    // const isZoomOut = e.composedPath().some(el => el === hud.zoomOut)
    const zoomId = e.target.closest('.zoom-button').id
    const svgTrans = setTransformAttr(svg)
    const sceneTrans = setTransformAttr(scene)
    // console.warn({
    //   svgTrans,
    //   sceneTrans
    // });


    // if (isZoomIn && Math.abs(zoom.level) < zoom.limit) {
    if (zoomId === 'zoom-in') {
      zoom.in(svg)
      // zoom.direction++

      // Object.assign(vb, {
      //   height: vb.height - vb.height / 4,
      //   width: vb.width - vb.width / 4,
      //   x: (vb.x + (-12)),
      //   // width: vb.width + (vb.x - (vb.width)),
      //   y: (vb.y - (vb.height / -8)),
      // })
    }

    // else if (isZoomOut && Math.abs(zoom.level) < zoom.limit) {
    else if (zoomId === 'zoom-out') {
      // zoom.direction--
      zoom.out(svg)

      // Object.assign(vb, {
      //   width: vb.width + vb.width / 6,
      //   height: vb.height + vb.height / 4,
      //   y: (vb.y - vb.height / 8),
      //   x: (vb.x - vb.width / 12),
      // })
    }
  });



}, 1000)