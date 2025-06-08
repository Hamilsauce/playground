export class PenMark {
  #markGroup;
  #selectBox;
  #markPath;
  #markPoints;
  
  constructor(svg, layer, downPoint) {
    this.svg = svg;
    this.layer = layer;
    
    this.createPath(downPoint);
    console.warn('this penmark', this)
  }
  
  get boundingBox() {
    return this.#markPath.getBoundingClientRect()
  }
  
  get d() {
    return this.#markPath.getAttribute('d');
  }
  
  static create(layerEl, downPoint = new DOMPoint()) {
    const mark = new PenMark(layer, downPoint)
  }
  
  isPointInBoundingBox(pt) {
    const { top, right, bottom, left } = this.boundingBox;
    return pt.x >= top &&
      pt.x <= right &&
      pt.y >= top &&
      pt.y <= bottom
    
  }
  
  createPath(pt) {
    pt = this.getMarkPoint(pt.x, pt.y);
    this.#markPath = document.createElementNS(SVG_NS, 'path');
    this.#markGroup = document.createElementNS(SVG_NS, 'g');
    console.log('this.#selectBox ', this.#selectBox)
    // this.#selectBox = document.createElementNS(SVG_NS, 'rect');
    
    this.#markPath.setAttribute('d', ` M ${pt.x},${pt.y} `);
    this.#markPath.setAttribute('stroke', `blue`);
    this.#markPath.setAttribute('stroke-width', `2`);
    this.#markPath.setAttribute('fill', `none`);
    this.#selectBox = this.createSelectBox();
    this.#markGroup.append(this.#selectBox, this.#markPath);
    this.svg.append(this.#markGroup);
    this.#markPoints.push(pt);
    
    return this.#markGroup;
  }
  
  
  toggleSelectBox(pt) {
    this.#selectBox.style.display = this.#selectBox.style.display === 'none' ? null : 'none';
    
  }
  createSelectBox() {
    // pt = this.getMarkPoint(pt.x, pt.y)
    this.#selectBox = document.createElementNS(SVG_NS, 'rect');
    
    this.#selectBox.setAttribute('stroke', `lightgrey`);
    this.#selectBox.setAttribute('stroke-width', `2`);
    this.#selectBox.setAttribute('fill', `red`);
    this.#selectBox.setAttribute('width', this.boundingBox.width);
    this.#selectBox.setAttribute('height', this.boundingBox.height);
    this.#selectBox.setAttribute('x', this.boundingBox.x);
    this.#selectBox.setAttribute('y', this.boundingBox.y);
    console.log('this.boundingBox.width', this.boundingBox.width)
    // this.#selectBox.style.display = 'none';
    
    
    return this.#selectBox;
  };
  
  appendPointToPath(pt) {
    if (!this.#markPath) return;
    
    pt = this.getMarkPoint(pt.x, pt.y)
    
    let addition = this.d + ` ${pt.x} ${pt.y}`;
    
    this.#markPath.setAttribute('d', addition);
    
    return this.#markPath;
  };
  
  
  getMarkPoint(x, y) {
    const pt = this.svg.createSVGPoint();
    
    pt.x = Math.round(x);
    pt.y = Math.round(y);
    
    pt.matrixTransform((this.layer || this.svg).getScreenCTM().inverse());
    
    return pt;
  };
}


const appBody = document.querySelector('#app-body')
const canvas = document.querySelector('.canvas')

let isDrawing = false;
let currentPath = null;
let points = []

const createSVGPoint = (targ, x, y) => {
  targ = targ || canvas;
  
  const pt = canvas.createSVGPoint();
  
  pt.x = Math.round(x);
  pt.y = Math.round(y);
  
  pt.matrixTransform(targ.getScreenCTM().inverse());
  points.push(pt);
  
  return pt;
};

const createPath = (targ, pt) => {
  const path = document.createElementNS(SVG_NS, 'path');
  const pathContainer = document.createElementNS(SVG_NS, 'g');
  
  path.setAttribute('d', ` M ${pt.x},${pt.y} `);
  path.setAttribute('stroke', `blue`);
  path.setAttribute('stroke-width', `2`);
  path.setAttribute('fill', `none`);
  
  pathContainer.append(path);
  
  canvas.append(pathContainer);
  
  pathContainer.prepend(createSelectBox(path.getBoundingClientRect()))
  
  return pathContainer;
};

const createCircle = (pt, r = 5) => {
  const circ = document.createElementNS(SVG_NS, 'circle');
  
  circ.setAttribute('r', r);
  circ.setAttribute('cx', pt.x)
  circ.setAttribute('cy', pt.y);
  
  canvas.append(circ);
};

const createSelectBox = (boundingBox) => {
  const selectBox = document.createElementNS(SVG_NS, 'rect');
  selectBox.classList.add('select-box')
  
  selectBox.setAttribute('width', boundingBox.width + 10);
  selectBox.setAttribute('height', boundingBox.height + 10);
  selectBox.setAttribute('x', boundingBox.x - 5);
  selectBox.setAttribute('y', boundingBox.y - 5);
  
  return selectBox;
};

const updateSelectBox = (selectBox, boundingBox) => {
  selectBox.setAttribute('width', boundingBox.width + 10);
  selectBox.setAttribute('height', boundingBox.height + 10);
  selectBox.setAttribute('x', boundingBox.x - 5);
  selectBox.setAttribute('y', boundingBox.y - 5);
  
  return selectBox;
};

/* Append Point */
const appendPointToPath = (pathContainer, pt) => {
  const path = pathContainer.querySelector('path');
  const box = pathContainer.querySelector('rect');
  
  let pathD = path.getAttribute('d') || '';
  
  let addition = pathD + ` ${pt.x} ${pt.y}`;
  
  path.setAttribute('d', addition);
  
  updateSelectBox(box, path.getBoundingClientRect())
  return path;
};

/* Pointer UP Handler */
const handlePointerUp = (e) => {
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.removeEventListener('pointermove', handlePointerMove);
  canvas.removeEventListener('pointerup', handlePointerUp);
  console.log('currentPath.getBoundingClientRect', currentPath.getBoundingClientRect())
  
  canvas.style.touchAction = null;
  currentPath = null;
};

const handlePointerMove = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const { target, clientX, clientY } = e;
  const targ = target.closest('g') || canvas
  const pt = createSVGPoint(targ, clientX, clientY);
  
  appendPointToPath(currentPath, pt);
};


const handlePointerDown = (e) => {
  const { target, clientX, clientY } = e;
  const targ = target.closest('g') || canvas
  
  canvas.style.touchAction = 'none';
  
  isDrawing = true;
  
  const pt = createSVGPoint(targ, clientX, clientY);
  currentPath = createPath(targ, pt);
  
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.removeEventListener('pointerdown', handlePointerDown);
};

/* Get Element by Bounding Box  */
const handleClick = ({ x, y }) => {
  const { target, clientX, clientY } = e;
  
  const targ = target.closest('g') || canvas
  canvas.style.touchAction = 'none';
  
  isDrawing = true;
  
  const pt = createSVGPoint(targ, clientX, clientY);
  currentPath = createPath(targ, pt);
  
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.removeEventListener('pointerdown', handlePointerDown);
};


canvas.addEventListener('click', e => {
  e.preventDefault()
  e.stopPropagation()
  canvas.removeEventListener('pointerdown', handlePointerDown);
  
  const { target, clientX, clientY } = e;
  const pt = createSVGPoint(target, clientX, clientY)
  
  if (currentPath && currentPath.isPointInBoundingBox(pt)) {
    console.log('suk me');
    console.log('currentPath.getBoundingClientRect(', currentPath.getBoundingClientRect())
    currentPath.toggleSelectBox()
  }
  
  
  const elAtPoint = document.elementFromPoint(clientX, clientY)
  console.log('elAtPoint', elAtPoint)
  canvas.addEventListener('pointerdown', handlePointerDown);
  
})

canvas.addEventListener('pointerdown', handlePointerDown);