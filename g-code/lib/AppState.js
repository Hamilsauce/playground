import { files } from '../files/index.js';

export class AppState {
  #listeners = new Map();
  #fileDir = './files'

  #state = {
    appTitle: null,
    filepath: null,
    files: new Map(files.map(({name,...file}) => [name, file])),
  }

  constructor(initialState = {}) {
    this.#state = { ...this.#state, ...initialState }
  }

  emit(propName, data) {
    this.#listeners.get(propName).forEach((handler, i) => {
      handler(data)
    });
  }

  select(propName) { return this.#state[propName] }

  listenOn(propName, handlerFn) {
    if (this.#listeners.has(propName)) {
      this.#listeners.set(propName, [...this.#listeners.get(propName), handlerFn])
    }
    else {
      this.#listeners.set(propName, [handlerFn])
    }

    handlerFn(this.#state[propName]);
  }

  update(propName, value) {
    const propValue = this.#state[propName];
    const propType = propValue ? propValue.constructor.name.toLowerCase() : null;

    if (propType === 'array') {
      this.#state[propName] = [...propValue, ...value];
    }
    else if (propType === 'object') {
      this.#state[propName] = { ...propValue, ...value };
    }
    else {
      this.#state[propName] = value;
    }

    if (this.#listeners.has(propName)) {
      this.emit(propName, this.#state[propName])
    }
  }
}