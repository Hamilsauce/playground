import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { Collection } from '../lib/collection.js';

const { template, date, array, utils, text } = ham;

/*

  KEY FUNCTIONALITY
  
  1. Viewport: Set, query SvgCanvas drawing region;
    
  2. ViewBox: Manage coordinates, origin
  
  3. TransformList
  
  4. Event Mediator?
  
*/

const getViewport = (svg) => {
  return {
    viewBox: {
      x: null,
      y: null,
      width: null,
      height: null,
    },
    dimensions: {
      width: null,
      height: null,
    }
  };
}

export class SvgCanvas extends EventEmitter {
  #self = null;
  #containerElement = null;

  #viewport = {
    viewBox: {},
    dimensions: {}
  };

  #coordinateSystem = null;

  constructor(name = 'svg-canvas') {
    super();

    if (!name) throw new Error('No name passed to component constructor');

    this.#self = template(name);
  }

  setCanvasContainer(selector) {
    if (!selector) return;
    this.#containerElement = document.querySelector(selector);
    return this.#self;
  }

  initialize(viewportDims = DOMRect, coordinateDims) {
    if (!viewportDims) return;

    new DOMRect()
  }

  setViewport() {}

  setCoordinateSystem(origin, unitDimensions) {}

  setSize() {}

  setViewBox() {}

  setZoom() {}

  render() {}

  update() {}

  remove() {}

  addCollection(name) {
    this[name] = new Collection(name);

    return this[name];
  }

  get viewport() { return this.#self };

  get dataset() { return this.#self.dataset };

  get viewBox() { return this.#self.viewBox };

  get bounds() {
    return this.#self.getBoundingClientRect()
  };

  get bounds() {
    return this.#self.getBoundingClientRect()
  };

  get position() {
    return {
      top: +((getComputedStyle(this.#self).top || '').replace(/[^\d.-]/g, '') || 0),
      left: +((getComputedStyle(this.#self).left || '').replace(/[^\d.-]/g, '') || 0),
    }
  }

  set position({ x, y }) {
    this.#self.style.left = `${x}px`;
    this.#self.style.top = `${y}px`;
  }

  // set prop(newValue) { this.#prop = newValue };
}