import { Collection } from './collection.js';
import { template } from './templater.js';


export class UIObject {
  #self;
  #type;

  constructor(type) {
    this.#self = template(type);
    this.#type = type;
  }
  
  addCollection(name, entries) {
    return new Collection(name, entries);
    // this[name] = new Collection(name, entries)
  }

  get self() { return this.#self };
  
  get type() { return this.#type };

  // set prop(newValue) { this.#prop = newValue };
}
