import { getTemplater, setTemplateSource } from './lib/svg-templater.js';
import { CanvasElement } from './canvas-elements/CanvasElement.js';
import { SimpleCanvas } from './SimpleCanvas.js';
import { DrawingPointer } from './lib/DrawingPointer.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

import { DEFAULT_APP_OPTIONS, DEFAULT_CANVAS_OPTIONS } from './lib/Constants.js';

const { template, date, array, utils, text } = ham;

export class App {
  #self;
  #canvas;

  #pointer = null;

  constructor(selector, options = DEFAULT_APP_OPTIONS) {
    this.#self = document.querySelector(selector);

    const containerSize = {
      width: parseInt(getComputedStyle(this.canvasContainer).width),
      height: parseInt(getComputedStyle(this.canvasContainer).height),

    }

    this.#canvas = SimpleCanvas.create(
    {
      ...DEFAULT_CANVAS_OPTIONS,
      ...{
        viewport: {
          width: this.getBoundingBox(this.canvasContainer).width - 4,
          height: this.getBoundingBox(this.canvasContainer).height - 8,
        }
      }
    })

    this.self = this.#self

    this.#pointer = new DrawingPointer()
    this.#pointer.initialize(this.#canvas);
    this.#canvas.activateLayer()
  }

  get canvasContainer() { return this.element('#canvas-container') }

  appendCanvas(canvasContainerSelector) {
    const container = this.element(canvasContainerSelector);

    if (!container) throw new Error('[App.appendCanvas]: Couldnt find canvas container. Selector passed: ', canvasContainerSelector);

    container.append(this.#canvas.getViewportSVG());
  }

  getBoundingBox(el) { return el.getBoundingClientRect() }

  element(selector) {
    return this.#self ? this.#self.querySelector(selector) : null;
  }

  elements(selector) {
    return this.#self ? [...this.#self.querySelectorAll(selector)] : null;
  }
}
