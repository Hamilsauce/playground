import { GcodeParser, loadFile } from './gcode-parser.js';
import { GcodePrinter } from './gcode-printer.js';
import { Fusible, Infusible } from '../Fusible.js';
import { gcodePaths } from './data/gcode-paths.js';
import { TransformList, TRANSFORM_TYPES, TRANSFORM_TYPE_INDEX } from '../lib/TransformList.js';
import { Point, delay, zoom, addPanAction } from './lib/index.js';
import { AppState } from './lib/AppState.js';
import { ui } from './lib/UI.js';

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, DOM, download } = ham;

const loadGcodeFile = async (path) => {
  appState.update('appTitle', 'loading...')

  const rawGcode = await printer.loadGcode(path)

  const gcodeLines = await parser.parse(rawGcode)

  // const grouped = printer.groupByCommandType(gcodeLines)
  // console.log('grouped', grouped)

  const gcodeCoords = gcodeLines.filter(_ => !!_.x && !!_.y);

  // download(path.slice(0, path.indexOf('.gcode')) + 'grouped.json', JSON.stringify(gcodeLinesByCommand, null, 2))

  ui.scene.innerHTML = '';

  printer.print(gcodeLines);

  // ui.scene.append(...(
  //   await Promise.all(
  //     gcodeCoords.map((async (code, i) => {
  //       // console.log('code', code)

  //       const p = document.createElementNS(ui.svg.namespaceURI, 'circle');

  //       p.r.baseVal.value = 0.15;
  //       p.cx.baseVal.value = +code.x || 0;
  //       p.cy.baseVal.value = +code.y || 0;
  //       if (code.command === 'G0') {
  //         p.classList.add('G0')
  //       }

  //       return p;
  //     })))));


  appState.update('appTitle', 'GCODE');

  return true;
};


const INITIAL_STATE = {
  appTitle: 'GCODE',
  filepath: gcodePaths[0],
}


const appState = new AppState(INITIAL_STATE);

ui.init(gcodePaths);

/*  @FUSION - Extend printer with fusibility 
      allow extension by interfacing with Infusible
*/
const printer = new GcodePrinter(ui.svg);

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


ui.app.addEventListener('gcodepath:change', ({ detail }) => {
  appState.update('filepath', detail.filepath);
});


appState.listenOn('appTitle', async (title) => {
  ui.appTitle.textContent = title;
});

appState.listenOn('filepath', async (filepath) => {
  console.time('DRAW POINTS');
  
  printer.stop();
  
  await delay(1000);
  
  const res = await loadGcodeFile(filepath);
  
  console.timeEnd('DRAW POINTS');
});


const pan$ = addPanAction(ui.svg, ({ x, y }) => {
  ui.svg.viewBox.baseVal.x = x;
  ui.svg.viewBox.baseVal.y = y;
});

pan$.subscribe();

setTimeout(() => {
  const svg = ui.svg;
  const scene = svg.querySelector('#scene');

  ui.zoom.container.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const vb = svg.viewBox.baseVal;
    const zoomId = e.target.closest('.zoom-button').id;
    const sTime = performance.now();

    if (zoomId === 'zoom-in') {
      zoom.in(svg);
    }

    else if (zoomId === 'zoom-out') {
      zoom.out(svg);
    }

    setTimeout(() => {
      const eTime = performance.now();
      const elapsed = ((eTime - sTime) / 1000) / 60;

      console.group('ZOOM RENDER TIME');
      console.log({ sTime, eTime });
      console.warn('elapsed', elapsed)
      console.groupEnd('ZOOM RENDER TIME');
    }, 0);
  });

  // scene.innerHTML = '<path id="path6" d=" M 30,0 32.3465,15.1847 39.2705,1.4683 36.8099,16.6349 47.6336,5.7295 40.6066,19.3934 54.2705,12.3664 43.3651,23.1901 58.5317,20.7295 44.8153,27.6535 60,30 44.8153,32.3465 58.5317,39.2705 43.3651,36.8099 54.2705,47.6336 40.6066,40.6066 47.6336,54.2705 36.8099,43.3651 39.2705,58.5317 32.3465,44.8153 30,60 27.6535,44.8153 20.7295,58.5317 23.1901,43.3651 12.3664,54.2705 19.3934,40.6066 5.7295,47.6336 16.6349,36.8099 1.4683,39.2705 15.1847,32.3465 0,30 15.1847,27.6535 1.4683,20.7295 16.6349,23.1901 5.7295,12.3664 19.3934,19.3934 12.3664,5.7295 23.1901,16.6349 20.7295,1.4683 27.6535,15.1847 30,0 Z" style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-opacity:1;stroke-linecap:butt;stroke-miterlimit:4;stroke-dashoffset:0;" />'
}, 1000);

appState.update('filepath', './data/whistle.gcode');