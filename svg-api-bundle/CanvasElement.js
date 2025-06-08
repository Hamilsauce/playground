import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { getTemplater } from '../lib/svg-templater.js';

import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, date, array, utils, text } = ham;

export const ElementTypes = new Set([
  'path',
  'rect',
  'circle',
  'line',
  'polygon',
  'polyline',
  'text',
  'g',
  'canvas-layer',
]);


/*
   
    #Canvas Element
    
    SVG Wrapper exposing Action methods
    for interacting with wrapped svg element.

*/

console.log('getTemplater', getTemplater())

export class CanvasElement extends EventEmitter {
  #self = null;
  #type = null;
  static templater = getTemplater();

  constructor(type) {
    if (!ElementTypes.has(type)) throw new Error('Invald type passed to CanvasElement constructor', { type });
    else super();

    this.#type = type;

    this.#self = CanvasElement.templater.get(type);
    // new SVGElement().viewportElement
  }

  toCanvasPoint({ x, y }) {
    // return new DOMPoint(x, y)
    const pt = this.viewportCanvas.createSVGPoint();
    pt.x = x;
    pt.y = y;

    return pt.matrixTransform(
      this.parent.getScreenCTM().inverse()
    );
  }

  setAttribute(name, value) {
    if (!name) return;
    this.#self.setAttribute(name, value)

    return this.#self
  }

  setAttributes(attrs = {}) {
    if (!attrs) return;

    for (var attr in attrs) {
      this.#self.setAttribute(attr, attrs[attr])
    }

    return this.#self
  }

  getSVG() {
    return this.#self
  }

  setSize(width, height) {}

  setPoint(point) {}

  update() {}

  remove() {}

  initTransforms(initialTransformList = []) {
    if (!this.viewportCanvas) return
    this.transforms = this.self.transform.baseVal;

    if (!initialTransformList) {
      const t = this.viewportCanvas.createSVGTransform();
      this.transform(0, 'translate', [0, 0])

      t.setTranslate(0, 0);
      this.transforms.insertItemBefore(t, 0);
    }

    if (this.transforms.length === 0) {
      initialTransformList
        .sort((a, b) => a.index - b.index)
        .filter(({ index, type, value }) => !index || !type || !value)
        .forEach(({ index, type, value }, i) => {
          this.transform(index, type, value)
        });
    }
  }

  transform(index, type, value) {
    if (!this.viewportCanvas) return;
    if (!index || !type || !value) return;

    const t = this.viewportCanvas.createSVGTransform();

    if (type == 'translate') t.setTranslate(...value);
    else if (type == 'scale') t.setScale(value);

    this.transforms.insertItemBefore(t, index)
  }

  get self() { return this.#self };

  // console.log('this.surface.getSVG().viewportElement', this.surface.getSVG().viewportElement)
  get viewportCanvas() { return this.#self.viewportElement };

  get type() { return this.#type };

  get dataset() { return this.self.dataset };

  get width() { return this.#self.width.baseVal.value };

  set width(newValue) { this.#self.width.baseVal.value = newValue };

  get height() { return this.#self.height.baseVal.value };

  set height(newValue) { this.#self.height.baseVal.value = newValue };

  get fill() { return this.self.getAttribute('fill'); };

  set fill(v) { return this.self.setAttribute('fill', v); };

  get stroke() { return this.self.getAttribute('stroke'); };

  set stroke(v) { return this.self.setAttribute('stroke', v); };

  get baseVal() { return this.self.baseVal };

  get parent() { return this.self.parentElement };

  get parent() { return this.self.parentElement };

  get boundingBox() {
    return this.self.getBoundingClientRect()
  };

  get position() {
    return {
      top: +((getComputedStyle(this.self).top || '').replace(/[^\d.-]/g, '') || 0),
      left: +((getComputedStyle(this.self).left || '').replace(/[^\d.-]/g, '') || 0),
    }
  }

  set position({ x, y }) {
    this.self.style.left = `${x}px`;
    this.self.style.top = `${y}px`;
  }


  // get boundingBox() {
  //   return this.self.getBoundingClientRect()
  // };

  // set prop(newValue) { this.#prop = newValue };
}
