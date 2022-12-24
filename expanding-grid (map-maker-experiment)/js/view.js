import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, DOM } = ham;

console.log('DOM', DOM.createElement)

export const ElementProperties = {
  id: String,
  classList: Array,
  dataset: Object,
}

export const ViewOptions = {
  templateName: 'map',
  elementProperties: ElementProperties,
  children: [],
}

export class View extends EventEmitter {
  #self;
  #name;

  constructor(name, options = ViewOptions) {
    super();
    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;

    if (options && options !== ViewOptions) {
      this.#self = DOM.createElement(options)
    }

    else this.#self = View.#getTemplate(name);
  }

  get self() { return this.#self };

  get dataset() { return this.#self.dataset };

  get id() { return this.#self.id };

  get dom() { return this.#self };

  get name() { return this.#name };

  static #getTemplate(name) {
    return template(name);
  }

  selectDOM(selector) {
    const result = [...this.#self.querySelectorAll(selector)];

    return result.length === 1 ? result[0] : result;
  }
};