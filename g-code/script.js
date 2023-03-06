import { GcodeParser, loadFile } from './gcode-parser.js';
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const list = document.querySelector('#list');

const svg = document.querySelector('svg');

const scene = document.querySelector('#scene');

const parser = new GcodeParser()


const rawGcode = await loadFile('./whistle.gcode')

const gcodeLines = parser.parse(rawGcode)

const gcodeCoords = gcodeLines.filter(_ => _.x && _.y);

gcodeCoords.forEach((code, i) => {
  const p = document.createElementNS(svg.namespaceURI, 'circle');
  
  p.classList.add('point')
  p.setAttribute('r', 1);
  p.setAttribute('cx', code.x);
  p.setAttribute('cy', code.y);
  
  scene.append(p)
  
});

console.log('gcodeCoords', gcodeCoords);