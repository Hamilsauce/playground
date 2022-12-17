import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template } = ham;

export class Range extends EventEmitter {
  #self;
  #name;
  #start = new DOMPoint();
  #end = new DOMPoint();

  constructor(start, end) {
    super();

    this.#name = name || null;
  };

  get self() { return this.#self };

  get name() { return this.#name };

  setStartPoint({ x, y }) {
    if (!(x || y)) return;
    this.#start = { x, y }

    return this;
  }

  setEndPoint({ x, y }) {
    if (!(x || y)) return;
    this.#end = { x, y }

    return this;
  }

  static create(start, end) {
    if (!start) return;

    end = end || start;

    return new Range(start, end);
  }
};