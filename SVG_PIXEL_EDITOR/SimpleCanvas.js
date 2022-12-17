import { getTemplater, setTemplateSource } from './lib/svg-templater.js';
import { CanvasElement, CanvasLayer } from './canvas-elements/index.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { DEFAULT_APP_OPTIONS, DEFAULT_CANVAS_OPTIONS } from './lib/Constants.js';

const { template, array, utils, text } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class SimpleCanvas {
  #self;
  #layers = new Map([]);
  #activeLayerSubject$ = new BehaviorSubject(null);
  #activeLayer$;
 
  constructor(options) {
    this.canvas = canvas;

    this.#self = template(options.id);

    this.svgTemplater = setTemplateSource('canvas-elements');

    this.initialize(options);

    this.addLayer('surface', { ...options.viewport, x: 0, y: 0 })
    console.log('this', this)
    this.self = this.#self;

    this.#activeLayer$ = this.#activeLayerSubject$ //.asObservable()
      .pipe(
        filter(x => x),
        tap(x => console.log('TAP', x)),
        //   map(x => x.self),
      );

  }

  addCanvasElement(element, zIndex = -1) {
    if (zIndex) {
      this.#self.append(element)
    }

    return element;
  }

  static create(options = DEFAULT_CANVAS_OPTIONS, ) {
    console.warn('[SimpleCanvas] CREATE', { options })

    const c = new SimpleCanvas(options);

    return c;
  }

  get viewBox() { return this.#self.viewBox.baseVal }

  get boundingBox() { return this.#self.getBoundingClientRect() }

  // get surface() { return this.#self.querySelector('#surface') }
  get viewBox() { return this.#self.viewBox.baseVal }

  get activeLayer$() { return this.#activeLayer$ }

  get activeLayer() { return this.#self.querySelector('.layer[data-active="true"]') || this.#self }

  set activeLayer(layer) {
    layer = layer || this.#self
    if (this.activeLayer) this.activeLayer.dataset.active = false;

    layer.dataset.active = true;

    this.#activeLayerSubject$.next(this.activeLayer)
  }

  get viewport() {
    return {
      width: this.#self.width.baseVal.value,
      height: this.#self.height.baseVal.value
    }
  }


  initialize(options) {
    if (!options) return;

    if (options.viewport) this.setViewportSize(options.viewport);
    if (options.viewBox) this.setCoordinateSystem(options.viewBox);

    // if (options.layers) this.setViewportSize(options.viewport);

    // Object.entries(options.layers || {}).forEach((layerElement) => this.addLayer(layerElement));

    Object.entries(options.attributes || {}).forEach(([name, value]) => this.#self.setAttribute(name, value));

    Object.entries(options.style || {}).forEach(([name, value]) => this.#self.style[name] = value);

    return this;
  }

  createPoint(x, y, target = this.activeLayer) {
    const pt = this.#self.createSVGPoint();

    pt.x = x;
    pt.y = y;

    return pt.matrixTransform(target.getScreenCTM().inverse());
  }

  initTransforms() {
    const transforms = element.transform.baseVal;

    if (transforms.length === 0) {
      const translate = svg.createSVGTransform();

      translate.setTranslate(0, 0);
      transforms.insertItemBefore(translate, 0);
    }
  }

  setViewportSize({ width, height }) {
    this.#self.setAttribute('width', width)
    this.#self.setAttribute('height', height)

    if (this.surface) {
      this.surface.setAttribute('height', 200)
      this.surface.setAttribute('width', width)
    }

    return this;
  }

  setCoordinateSystem({ x, y, width, height }) {
    console.warn('setCoordinateSystem', { x, y, width, height })

    Object.assign(this.viewBox, { x, y, width, height });

    return this //.#self;
  }

  getViewportSVG() {
    return this.#self;
  }

  activateLayer(layer) {
    this.activeLayer = layer || this.surface;

    return this;
  }

  addLayer(name, options) {
    options = options ? options : { ...this.viewport, x: 0, y: 0 }

    this[name] = new CanvasLayer(name, options);

    this.addCanvasElement(this[name].getSVG())

    if (name === 'surface') this[name].initTransforms([
      { index: 0, type: 'translate', value: [this.viewBox.x, this.viewBox.y] },
      { index: 1, type: 'scale', value: 0.1 },
    ]);

    this.#layers.set(name, this[name])

    this.#self.append(this[name].self);
  }
}
