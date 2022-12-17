import { Component } from './Component.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class Toolbar extends Component {
  #eventSource$;
  #eventStream$;
  #toolEvents$;
  #eventSourceSubscription;
  #self;

  constructor() {
    super('toolbar');

    this.#self = document.querySelector('#toolbar');

    this.#eventStream$ = new BehaviorSubject(null);

    this.#toolEvents$ = this.#eventStream$.asObservable()
      .pipe(
        filter((_) => !!_),
        map((e) => e.target.closest('.tool-button')),
        map((button) => button.dataset.toolName || null),
        filter((_) => !!_),
        map((toolName) => ({ selectedTool: toolName })),
        tap(x => console.warn('toolEvents$', x))
      );

    this.#eventSource$ = fromEvent(this.#self, 'click');

    this.#eventSourceSubscription = this.#eventSource$.subscribe(this.#eventStream$);
  }

  getEvents() {
    return this.#toolEvents$
  }
}