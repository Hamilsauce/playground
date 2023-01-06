import { GraphConfig } from './app.js';
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const graphGroup1 = document.querySelector('.graph-group')
const containers = document.querySelectorAll('.container')

const gg1Bbox = graphGroup1.getBoundingClientRect()


console.log('gg1Bbox', gg1Bbox)
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

    graph.activateVertex(v);

    this.self.addEventListener('pointermove', handlePointerMove);
    this.self.addEventListener('pointerup', handlePointerUp)
    this.self.removeEventListener('pointerdown', handlePointerDown);
  };

  handlePointerMove(e) {
    this.moveVertex(e);
  };

  handlePointerUp(e) {
    const v = this.activeVertex;

    v.deactivate();

    v.removeEventListener('pointermove', handlePointerMove)
    v.removeEventListener('pointerup', handlePointerUp)
    this.self.addEventListener('pointerdown', handlePointerDown)
  };

}

const graph = {
  get self() { return document.querySelector('#graph'); },
  get vertices() { return [...document.querySelectorAll('.vertex')]; },
  get edges() { return [...document.querySelectorAll('.edge')]; },
  get activeVertex() {
    return document.querySelector('.vertex[data-active=true]');
  },

  get activeEdge() { return document.querySelector(`.edge[data-vertices*=${this.activeVertex.id}]`); },

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
  },

  moveVertex(evt) {
    const v = this.activeVertex;
    if (!v) return;

    // let point = geom.domPoint(this.activeVertex, evt.pageX, evt.pageY)
    let point = geom.domPoint(graph.self, evt.pageX, evt.pageY)

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
        e.x2.baseVal.value = point.x - (this.activeVertex.r.baseVal.value)
        e.y2.baseVal.value = point.y + (this.activeVertex.r.baseVal.value)
      }
    }

    const slots = getSlots();
    // console.log('slots', slots)
    slots.forEach((slot, i) => {
      const r = this.activeVertex.r.baseVal.value
      let slotP = geom.domPoint(graph.self, slot.cx.baseVal.value, slot.cy.baseVal.value)
 const pointbb = {
        top: point.y - r,
        left: point.x - r,
        right: point.x + r,
        bottom: point.y + r,
      }

      console.group('POINTS');
      console.log('slot.cx.baseVal.value, slot.cy.baseVal.value', slot.cx.baseVal.value, slot.cy.baseVal.value)
      console.log('slotP', slotP)
      console.log('point', point)
      console.warn('pointbb', pointbb)
      console.warn('r', r)
      console.groupEnd('POINTS');

     
      const slotbb = slot.getBoundingClientRect();
      const activebb = slot.getBoundingClientRect();
      // const isInside =
      const isInside =
        pointbb.top >= slotbb.top &&
        pointbb.bottom <= slotbb.bottom &&
        pointbb.left >= slotbb.left &&
        pointbb.right <= slotbb.right

      console.log({ i, isInside });
    });
  },
  
  createGroupRect(group, vertexA, vertexB) {
    const bbox = group.getBoundingClientRect()

    // pt = this.getMarkPoint(pt.x, pt.y)
    const selectBox = document.createElementNS(SVG_NS, 'rect');

    selectBox.setAttribute('stroke', `lightgrey`);
    selectBox.setAttribute('stroke-width', `2`);
    selectBox.setAttribute('fill', `red`);
    selectBox.setAttribute('width', bbox.width);
    selectBox.setAttribute('height', bbox.height);
    selectBox.setAttribute('x', 0) //bbox.x);
    selectBox.setAttribute('y', 0) //bbox.y);
    // console.log('bbox.width', bbox.width)
    // selectBox.style.display = 'none';
    group.prepend(selectBox)

    return selectBox;
  }


}

graph.self.addEventListener('pointerdown', handlePointerDown);

// graph.createGroupRect(graphGroup1)

// graph.vertices.forEach((v, i) => {
//   v.addEventListener('pointerdown', handlePointerDown)
// });