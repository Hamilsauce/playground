import { GcodeParser, loadFile } from './gcode-parser.js';
import { GcodePrinter } from './gcode-printer.js';
import { Fusible, Infusible } from '../Fusible.js';

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body');
const containers = document.querySelectorAll('.container');
const list = document.querySelector('#list');

const svg = document.querySelector('svg');
const scene = document.querySelector('#scene');

const printer = new GcodePrinter();
const parser = new GcodeParser(printer);

const defuseFromParser = printer.fuse(parser);

const lerped = printer.lerp(0, 10, 0.3);
console.log('lerped', lerped);

// defuseFromParser()

const rawGcode = await printer.loadGcode('./cable-hook1.gcode');

const gcodeLines = parser.parse(rawGcode)
const gcodeLinesByCommand = printer.groupByCommandType(gcodeLines);
console.log('[[PRINTER]] gcodeLinesByCommand', gcodeLinesByCommand);


const gcodeCoords = gcodeLines.filter(_ => !!_.x && !!_.y);

console.log('parser.keys', parser.keys);

let lastPoint = { x: 0, y: 0 };
const pointTemplate = svg.querySelector('#point-template') //.cloneNode(true)

console.time('DRAW POINTS')

scene.append(
  ...gcodeCoords.map(
    (code, i) => {
      const p = document.createElementNS(svg.namespaceURI, 'circle');
      p.r.baseVal.value = 0.25
      p.cx.baseVal.value = +code.x || 0
      p.cy.baseVal.value = +code.y || 0
      return p
    })
);

console.timeEnd('DRAW POINTS')
