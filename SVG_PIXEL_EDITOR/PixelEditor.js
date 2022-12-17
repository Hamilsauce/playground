import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, rxjs } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class PixelEditor extends EventEmitter {
  #canvas;
  #name;
  #dims = {
    height: 100,
    width: 100,
    pixelSize: 1,
  }
  
  #pointerEvents$ = {
    down: null,
    move: null,
    up: null,
  }

  constructor(name='svg-canvas') {
    super();

    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;

    this.#canvas = PixelEditor.#getTemplate(name);
  };

  get canvas() { return this.#canvas };

  get name() { return this.#name };
  
  get dims() { return this.#dims };

  static #getTemplate(name) {
    return template(name);
  }

  render() {
    return this.canvas
  }
  
  createPixel() {}

  getPixelAtPoint() {}


};
