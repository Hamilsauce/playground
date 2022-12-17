import { getTemplater } from './lib/svg-templater.js';
import { Toolbar } from './components/index.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;




export class Store {
  constructor() {
    this.root;
  };
  // get prop() { return this.#prop };
  // set prop(v) { this.#prop = v };
}

// export class DOMEventStream {
//   constructor(target, eventType) {
//     this.activeStream$ = fromEvent(target, eventType);
//   }

//   initialize(target, eventType) {}

//   subscribe(callback) {
//     return this.activeStream$
//       .pipe(
//         tap(x => console.log('activeStream$', x)),
//         tap(callback),
//       )
//       .subscribe();
//   }

//   setTarget() {}

//   // get prop() { return this.#prop };
//   // set prop(v) { this.#prop = v };
// }


export class App {
  #self;
  // #toolState = new BehaviorSubject(null);
  templater = getTemplater();

  constructor(selector) {
    this.canvas = document.querySelector('#canvas');

    this.#self = document.querySelector(selector);

    this.toolbar2 = document.querySelector('#toolbar');
    this.toolbar = new Toolbar();
    this.toolbarEvents$ = this.toolbar.getEvents()
      .pipe(
        map(x => x),
        tap(x => console.log('TOOL EVENT IN APP', x))
      );

    this.toolbarEvents$.subscribe();
  }



  get self() { return this.#self };
}




export class SvgCanvas {
  #self;
  #toolMode;
  #toolState = new BehaviorSubject(null);

  constructor(selector) {

    this.#self = document.querySelector(selector);
  }

  setToolMode(toolName) {
    this.#toolMode = toolName;
  }

  get self() { return this.#self };
}
