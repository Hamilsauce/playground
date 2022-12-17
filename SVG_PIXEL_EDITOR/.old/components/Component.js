import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
// import { Collection } from '../lib/collection.js';
const { template, date, array, utils, text } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class Component extends EventEmitter {
  static templater = template;

  #self = null;
  // eventsSource$ = null;
  // events$ = null;
  // #events$ = null;
  // eventsStream$ = null;



  constructor(name = '') {
    if (!(!!name)) throw new Error('New CanvasComponent needs a name');
    super();

    this.#self = Component.templater(name);

    // this.events$ = this.eventsStream$.asObservable().pipe(
    //   map(x => x),
    //   tap(x => console.log('IN EVENTS', x))
    // )
  }

  // setEventSource(domEventType) {
  //   const self = this;
  //   return fromEvent(this.#self, domEventType)
  //     .pipe(
  //       tap(x => console.warn('IN SET EVENT PIPE, THIS: ', self)),
  //       tap(this.eventsStream$),
  //     );

  //   return this.events$
  // }

  render() {}


  update() {}

  remove() {}

  // getEvents() {
  //   return this.events$;
  // }

  // addCollection(name) {
  //   this[name] = new Collection(name);

  //   return this[name];
  // }

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