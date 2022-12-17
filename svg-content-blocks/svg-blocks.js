import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { getTemplater, setTemplateSource } from './lib/svg-templater.js';
import { CanvasElement } from './canvas-elements/CanvasElement.js';
const { template, date, array, utils, text } = ham;

const DEFAULT_APP_OPTIONS = {
  components: {}
}

const DEFAULT_CANVAS_OPTIONS = {
  unitSize: 1,
  dataset: {},
  attributes: {
    id: 'canvas',
    preserveAspectRatio: 'xMidYMid meet',
  },
  style: {
    background: '#FFFFFF',
  },
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  layers: [
    'surface',

    // height: window.innerHeight,
  ],
  get viewBox() {
    return {
      height: 10,
      width: 10,
      get x() { return -(this.width) / 2 },
      get y() { return -(this.height) / 2 },
    }
  }
}



export class CanvasLayer extends CanvasElement {
  constructor(name, options) {
    if (!options) return;
    super('canvas-layer')

    this.self.id = name;
    console.warn('name, options', name, options)
    Object.assign(this.self, options)
    
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
  };

  setSize(width, height) {
    this.width = width
    this.height = height
  }


  setPoint(pt = new DOMPoint()) {
    const cpt = this.toCanvasPoint(pt);
    this.x = cpt.x
    this.y = cpt.y;
  }

  setAttribute(name, value) {
    if (!name) return;

    this.backgroundRect.setAttribute(name, value)

    return this.self
  }

  get x() { return this.backgroundRect.x.baseVal.value };
  set x(newValue) { this.backgroundRect.x.baseVal.value = newValue };

  get y() { return this.backgroundRect.y.baseVal.value };
  set y(newValue) { this.backgroundRect.y.baseVal.value = newValue };

  get width() { return this.backgroundRect.width.baseVal.value };
  set width(newValue) { this.backgroundRect.width.baseVal.value = newValue };
  get height() { return this.backgroundRect.height.baseVal.value };
  set height(newValue) { this.backgroundRect.height.baseVal.value = newValue };


  get backgroundRect() { return this.self.querySelector('.canvas-layer--background') };
  get layerObjects() { return this.self.querySelector('.canvas-layer--objects') };
}

export class SimpleCanvas {
  #self;
  // #self;
  #layers = new Map([]);


  constructor(templateSelector = 'svg-canvas', options) {
    this.#self = template(templateSelector);
    this.svgTemplater = setTemplateSource('canvas-elements');
    this.initialize(options);

    this.self = this.#self;
    console.warn('this.#self', this.#self)
    // console.log('this.boundingBox', this.boundingBox)
    this.surface = new CanvasLayer('surface', {...this.viewport, x: 0, y: 0});
    this.addCanvasElement(this.surface.getSVG())
    console.warn('document.querySelector(canvas).getBoundingClientRect()', document.querySelector('#canvas').getBoundingClientRect())
  }

  addCanvasElement(element, zIndex = -1) {
    if (zIndex) {
      this.#self.append(element)
    }

    return element;
  }

  static create(options = DEFAULT_CANVAS_OPTIONS,) {
    const c = new SimpleCanvas('svg-canvas', options);

    console.warn('SimpleCanvas.create > options', options)



    console.log('this.viewBox', c.viewBox) //this.viewBox)
    console.log('this.viewport', c.viewport) //this.viewport)

    return c;
  }

  get viewBox() { return this.#self.viewBox.baseVal }

  get boundingBox() { return this.#self.getBoundingClientRect() }

  // get surface() { return this.#self.querySelector('#surface') }
  get viewBox() { return this.#self.viewBox.baseVal }

  get viewport() {
    return {
      width: this.#self.width.baseVal.value,
      height: this.#self.height.baseVal.value
    }
  }

  initialize(options) {
    console.log('options', options)
    if (options.viewport) this.setViewportSize(options.viewport);

    if (options.viewBox) this.setCoordinateSystem(options.viewBox);

    // if (options.layers) this.setViewportSize(options.viewport);

    // Object.entries(options.layers || {}).forEach((layerElement) => this.addLayer(layerElement));

    Object.entries(options.attributes || {}).forEach(([name, value]) => this.#self.setAttribute(name, value));

    Object.entries(options.style || {}).forEach(([name, value]) => this.#self.style[name] = value);


    return this;
  }

  addLayer(name, layerEl) {
    console.warn('name, layerEl', name, layerEl)
    if (!!layerEl || layerEl.constructor != SVGGElement) return

    layerEl.setAttribute('width', this.viewport.width)
    layerEl.setAttribute('height', this.viewport.height)


    this.#layers.set(name, layerEl)
    this.#self.append(layerEl);
  }

  setViewportSize({ width, height }) {
    this.viewport.width = width;
    this.#self.setAttribute('width', width)
    this.#self.setAttribute('height', height)
    if (this.surface) {


      this.surface.setAttribute('height', 200)
      this.surface.setAttribute('width', width)
    }

    return this;
  }

  setCoordinateSystem({ x, y, width, height }) {
    console.log('setCoordinateSystem', { x, y, width, height })
    Object.assign(this.viewBox, { x, y, width, height });

    return this.#self;
  }

  getViewportSVG() {
    return this.#self;
  }

  // get prop() { return this.#prop };

  // set prop(v) { this.#prop = v };
}



export class App {
  #self;
  #canvas;

  constructor(selector, options = DEFAULT_APP_OPTIONS) {
    this.#self = document.querySelector(selector);

    this.#canvas = SimpleCanvas.create(
      DEFAULT_CANVAS_OPTIONS
      /* Add Options Object */
    )

    this.self = this.#self


  }


  appendCanvas(canvasContainerSelector) {
    const container = this.element(canvasContainerSelector);

    if (!container) throw new Error('[App.appendCanvas]: Couldnt find canvas container. Selector passed: ', canvasContainerSelector);

    container.append(this.#canvas.getViewportSVG());
  }


  element(selector) {
    return this.#self ? this.#self.querySelector(selector) : null;
  }

  elements(selector) {
    return this.#self ? [...this.#self.querySelectorAll(selector)] : null;
  }
}





const app = new App('#app');
app.appendCanvas('#canvas-container')

console.log({ app });
