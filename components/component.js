import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { Collection } from '../lib/collection.js';
const { template, date, array, utils, text } = ham;




export class Component extends EventEmitter {
  #self = null;

  constructor(name) {
    super();
    if (!name) throw new Error('No name passed to component constructor');
    this.#self = template(name);
  }

  render() {}

  update() {}

  remove() {}

  addCollection(name) {
    this[name] = new Collection(name);

    return this[name];
  }

  get self() { return this.#self };

  get dataset() { return this.self.dataset };

  get boundingBox() {
    return this.self.getBoundingClientRect()
  };

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
