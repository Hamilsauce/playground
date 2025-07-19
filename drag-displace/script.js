// import { GraphConfig } from './app.js';

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

// console.warn('draggable', draggable)
// import draggable from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, addDragAction } = ham;

const app = document.querySelector('#app');
const appBody = app.querySelector('#app-body')
const svgCanvas = appBody.querySelector('#svg-canvas')
const scene = svgCanvas.querySelector('#scene')

svgCanvas.style.touchAction = 'none'

const block1 = scene.querySelector('#block-group1')
const block2 = scene.querySelector('#block-group2')

const blocks = [block1, block2]

const moveBlock = (block, { x, y }) => {
  block.setAttribute('transform', `translate(${x},${y})`)
};

const block1Drag = draggable(svgCanvas, block1);
const block2Drag = draggable(svgCanvas, block2);

block1.addEventListener('dragstart', e => {
  const targ = e.target.closest('.block-group')
  targ.dataset.selected = true;
  scene.appendChild(targ)
});
block1.addEventListener('drag', e => {
  const { target, detail } = e
  const { x, y } = detail
  // const targetCBR = target.getBoundingClientRect();
  // const targetBBox = target.getBBox();
  const targWidth = target.firstElementChild.width.baseVal.value
  const targHeight = target.firstElementChild.height.baseVal.value
  
  const box = {
    left: x,
    right: x + targWidth,
    top: y,
    bottom: y + targHeight,
  }
  
  // console.warn('box', box)
  // console.warn('x, y', x, y)
  // console.log('targetCBR, targetBBox', targetCBR, targetBBox, target.id)
  const otherBlocks = blocks.filter((b, i) => b != target);
  otherBlocks.forEach((block, i) => {
    // console.warn('block', block)
    // const targetBBox = target.getBBox();
    const blockBBox = block.getBBox();
    const blockCBR = block.getBoundingClientRect();
    const blockWidth = block.firstElementChild.width.baseVal.value
    const blockx = block.firstElementChild.x.baseVal.value
    const blockHeight = block.firstElementChild.height.baseVal.value
    // console.warn('blockBBox,blockCBR', blockBBox,blockCBR)
    
    const bPoint = geom.domPoint(block, blockBBox.x, blockBBox.y)
    
    // console.warn('bPoint, blockWidth,blockHeight ', bPoint )
    // if (targetBBox) {
    
    // }
    
  });
  
  e.target.dataset.selected = true;
});

svgCanvas.addEventListener('dragstart', ({detail}) => {
  const targ = detail.target.closest('.block-group')
  targ.dataset.selected = true;
  scene.appendChild(targ)
  
});

svgCanvas.addEventListener('dragend', ({detail}) => {
  
  const targ = detail.target.closest('.block-group')
  targ.dataset.selected = false;
  // scene.appendChild(targ)
  
});

/* 
  const block1Drag$ = addDragAction(block1, (pt) => {
  const point = geom.domPoint(svgCanvas, pt.x, pt.y)
  point.x = point.x-7.5
  point.y = point.y-7.5
  
  console.warn('block 1 drag: ', point.x, point.y)
  moveBlock(block1, point)
})
const block2Drag$ = addDragAction(block2, (pt) => {
  moveBlock(block2, pt)

  // console.warn('block 2 drag: ', pt.x, pt.y)
  
})
block1Drag$.subscribe()
block2Drag$.subscribe()
*/
// const gg1Bbox = graphGroup1.getBoundingClientRect()


// console.log('gg1Bbox', gg1Bbox)
const getSlots = () => {
  return [...document.querySelectorAll('.slot')]
}

const geom = {
  domPoint(element, x, y) {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
  },
}

const handlePointerDown = (e) => {
  const v = e.target.closest('.vertex');
  if (!v) return;
  
  // console.warn('graph', graph)
  graph.activateVertex(v);
  
  v.addEventListener('pointermove', handlePointerMove);
  graph.self.addEventListener('pointerup', handlePointerUp)
  graph.self.removeEventListener('pointerdown', handlePointerDown);
};

const handlePointerMove = (e) => {
  graph.moveVertex(e);
};

const handlePointerUp = (e) => {
  const v = graph.activeVertex;
  
  v.deactivate();
  
  v.removeEventListener('pointermove', handlePointerMove)
  graph.self.removeEventListener('pointerup', handlePointerUp)
  graph.self.addEventListener('pointerdown', handlePointerDown)
};

export class Graph {
  constructor() {
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerUp = this.handlePointerUp.bind(this);
    
    this.self.addEventListener('pointerdown', this.onPointerDown)
  }
  
  get self() { return document.querySelector('#graph'); }
  
  get vertices() { return [...document.querySelectorAll('.vertex')]; }
  
  get edges() { return [...document.querySelectorAll('.edge')]; }
  
  get activeVertex() {
    return document.querySelector('.vertex[data-active=true]');
  }
  
  get activeEdge() { return document.querySelector(`.edge[data-vertices*=${this.activeVertex.id}]`); }
  
  activateVertex(v) {
    if (this.activeVertex) this.activeVertex.deactivate();
    
    v.parentElement.append(v);
    v.dataset.active = true;
    
    if (this.activeEdge) this.activeEdge.dataset.active = true;
    
    v.deactivate = () => {
      this.activeEdge.dataset.active = false;
      v.dataset.active = false;
      delete v.deactivate;
    }
  }
  
  moveVertex(evt) {
    const v = this.activeVertex;
    
    if (!v) return;
    
    let point = geom.domPoint(this.activeVertex, evt.pageX, evt.pageY)
    
    let epoint = {
      x: point.x + 5.6,
      y: point.y + 5.6,
    }
    
    this.activeVertex.cx.baseVal.value = point.x;
    this.activeVertex.cy.baseVal.value = point.y;
    
    if (this.activeEdge) {
      const e = this.activeEdge;
      const verts = e.dataset.vertices.split(' ');
      const activeVertPos = verts.indexOf(this.activeVertex.id);
      
      if (activeVertPos === 0) {
        e.x1.baseVal.value = point.x //+ this.activeVertex.r.baseVal.value
        e.y1.baseVal.value = point.y //+ this.activeVertex.r.baseVal.value
      }
      
      else {
        e.x2.baseVal.value = point.x - this.activeVertex.r.baseVal.value
        e.y2.baseVal.value = point.y - this.activeVertex.r.baseVal.value
      }
    }
    
  }
  
  handlePointerDown(e) {
    const v = e.target.closest('.vertex');
    if (!v) return;
    
    this.activateVertex(v);
    
    this.self.addEventListener('pointermove', this.onPointerMove);
    this.self.addEventListener('pointerup', this.onPointerUp)
    this.self.removeEventListener('pointerdown', this.onPointerDown);
  };
  
  handlePointerMove(e) {
    this.moveVertex(e);
  };
  
  handlePointerUp(e) {
    const v = this.activeVertex;
    
    v.deactivate();
    
    this.self.removeEventListener('pointermove', this.onPointerMove)
    this.self.removeEventListener('pointerup', this.onPointerUp)
    this.self.addEventListener('pointerdown', this.onPointerDown)
  };
  
}

// const graph = new Graph()
// const graph = {
//   get self() { return document.querySelector('#graph'); },
//   get vertices() { return [...document.querySelectorAll('.vertex')]; },
//   get edges() { return [...document.querySelectorAll('.edge')]; },
//   get activeVertex() {
//     return document.querySelector('.vertex[data-active=true]');
//   },

//   get activeEdge() { return document.querySelector(`.edge[data-vertices*=${this.activeVertex.id}]`); },

//   activateVertex(v) {
//     if (this.activeVertex) this.activeVertex.deactivate();

//     v.parentElement.append(v);
//     v.dataset.active = true;

//     if (this.activeEdge) this.activeEdge.dataset.active = true;

//     v.deactivate = () => {
//       this.activeEdge.dataset.active = false;
//       v.dataset.active = false;
//       delete v.deactivate;
//     }
//   },

//   moveVertex(evt) {
//     const v = this.activeVertex;
//     if (!v) return;

//     // let point = geom.domPoint(this.activeVertex, evt.pageX, evt.pageY)
//     let point = geom.domPoint(graph.self, evt.pageX, evt.pageY)

//     let epoint = {
//       x: point.x + 5.6,
//       y: point.y + 5.6,
//     }

//     this.activeVertex.cx.baseVal.value = point.x;
//     this.activeVertex.cy.baseVal.value = point.y;

//     if (this.activeEdge) {
//       const e = this.activeEdge;
//       const verts = e.dataset.vertices.split(' ');
//       const activeVertPos = verts.indexOf(this.activeVertex.id);

//       if (activeVertPos === 0) {
//         e.x1.baseVal.value = point.x //+ this.activeVertex.r.baseVal.value
//         e.y1.baseVal.value = point.y //+ this.activeVertex.r.baseVal.value
//       }

//       else {
//         e.x2.baseVal.value = point.x - (this.activeVertex.r.baseVal.value)
//         e.y2.baseVal.value = point.y + (this.activeVertex.r.baseVal.value)
//       }
//     }

//     const slots = getSlots();
//     // console.log('slots', slots)
//     slots.forEach((slot, i) => {
//       const r = this.activeVertex.r.baseVal.value
//       let slotP = geom.domPoint(graph.self, slot.cx.baseVal.value, slot.cy.baseVal.value)
//       const pointbb = {
//         top: point.y - r,
//         left: point.x - r,
//         right: point.x + r,
//         bottom: point.y + r,
//       }

//       // {
//       //   console.group('POINTS');
//       //   console.log('slot.cx.baseVal.value, slot.cy.baseVal.value', slot.cx.baseVal.value, slot.cy.baseVal.value)
//       //   console.log('slotP', slotP)
//       //   console.log('point', point)
//       //   console.warn('pointbb', pointbb)
//       //   console.warn('r', r)
//       //   console.groupEnd('POINTS');
//       // }

//       const slotbb = slot.getBoundingClientRect();
//       const activebb = slot.getBoundingClientRect();
//       // const isInside =
//       const isInside =
//         pointbb.top >= slotbb.top ||
//         pointbb.bottom <= slotbb.bottom ||
//         pointbb.left >= slotbb.left ||
//         pointbb.right <= slotbb.right

//       // console.log({ i, isInside });
//     });
//   },

//   createGroupRect(group, vertexA, vertexB) {
//     const bbox = group.getBoundingClientRect()

//     // pt = this.getMarkPoint(pt.x, pt.y)
//     const selectBox = document.createElementNS(SVG_NS, 'rect');

//     selectBox.setAttribute('stroke', `lightgrey`);
//     selectBox.setAttribute('stroke-width', `2`);
//     selectBox.setAttribute('fill', `red`);
//     selectBox.setAttribute('width', bbox.width);
//     selectBox.setAttribute('height', bbox.height);
//     selectBox.setAttribute('x', 0) //bbox.x);
//     selectBox.setAttribute('y', 0) //bbox.y);
//     // console.log('bbox.width', bbox.width)
//     // selectBox.style.display = 'none';
//     group.prepend(selectBox)

//     return selectBox;
//   }


// }

// graph.self.addEventListener('pointerdown', handlePointerDown);

// const encodedGraph = btoa(graph.self.innerHTML)
// const encodedIcon = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+CiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOCAxLjk5IDAgNS45NyAxLjA5IDYgMy4wOC0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K'
// console.log('encodedGraph.length', encodedGraph.length)
// console.log('encodedGraph.length', encodedGraph.length)
// graph.createGroupRect(graphGroup1)

// graph.vertices.forEach((v, i) => {
//   v.addEventListener('pointerdown', handlePointerDown)
// });