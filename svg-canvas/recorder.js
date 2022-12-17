const appBody = document.querySelector('#app-body')
const canvas = document.querySelector('.canvas')

let isDrawing = false;
let currentPath = null;

let points = []




const createSVGPoint = (targ, x, y) => {
  targ = targ || canvas
  const pt = canvas.createSVGPoint();
  pt.x = Math.round(x);
  pt.y = Math.round(y);

  pt.matrixTransform(targ.getScreenCTM().inverse());
  points.push(pt);

  return pt;
};

const createCircle = (pt, r = 5) => {
  const circ = document.createElementNS(SVG_NS, 'circle');
  circ.setAttribute('r', r);
  circ.setAttribute('cx', pt.x);
  circ.setAttribute('cy', pt.y);

  canvas.append(circ)
};

const createPath = (targ, pt) => {
  const path = document.createElementNS(SVG_NS, 'path');
  const pathContainer = document.createElementNS(SVG_NS, 'g');
  let pathD = path.getAttribute('d')
  path.setAttribute('d', ` M ${pt.x},${pt.y} `)
  path.setAttribute('stroke', `blue`)
  path.setAttribute('stroke-width', `2`)
  path.setAttribute('fill', `none`)

  pathContainer.append(path)
  canvas.append(pathContainer)
  return pathContainer
};

const appendPointToPath = (pathContainer, pt) => {
  const path = pathContainer.querySelector('path')
  let pathD = path.getAttribute('d') || ''
  // pathD = pathD.replace('z', '')  
  console.log('pathD', pathD)
  let addition = pathD + ` ${pt.x} ${pt.y}`;
  path.setAttribute('d', addition)

  return path;
};


const handlePointerUp = (e) => {

  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.removeEventListener('pointermove', handlePointerMove);
  canvas.removeEventListener('pointerup', handlePointerUp);
  console.log('currentPath.getBoundingClientRect', currentPath.getBoundingClientRect())

  canvas.style.touchAction = null;
  currentPath = null;
};

const handlePointerMove = (e) => {
  const { target, clientX, clientY } = e;
  const targ = target.closest('g') || canvas
  const pt = createSVGPoint(targ, clientX, clientY);

  appendPointToPath(currentPath, pt);
  // createPoint(pt)
};

const handlePointerDown = (e) => {
  const { target, clientX, clientY } = e;
  const targ = target.closest('g') || canvas
  canvas.style.touchAction = 'none';

  isDrawing = true;

  const pt = createSVGPoint(targ, clientX, clientY);
  console.log('pt', pt)
  currentPath = createPath(targ, pt);

  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.removeEventListener('pointerdown', handlePointerDown);
};

canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  const { target, clientX, clientY } = e;
  const elAtPoint = document.elementFromPoint(clientX, clientY)
  console.log('elAtPoint', elAtPoint)
  console.log('target', { target })

});
