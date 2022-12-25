import { MapView } from './js/map.view.js';

const { combineLatest, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const mapOptions = {
  width: document.querySelector('#width-input'),
  height: document.querySelector('#height-input'),
  scale: document.querySelector('#scale-input'),
}

// mapOptions.width.value = 10;
// mapOptions.height.value = 10;
// mapOptions.scale.value = 30;

const dimensionsSubject$ = new BehaviorSubject({ width: +mapOptions.width.value, height: +mapOptions.width.value, scale: +mapOptions.width.value })

const mapOptionsValues$ = combineLatest(
  fromEvent(mapOptions.width, 'change').pipe(
    startWith({ target: { value: 50 } }),
    map(_ => +_.target.value)
  ),
  fromEvent(mapOptions.height, 'change').pipe(
    startWith({ target: { value: 50 } }),
    map(_ => +_.target.value)
  ),
  fromEvent(mapOptions.scale, 'change').pipe(
    startWith({ target: { value: 30 } }),
    map(_ => +_.target.value)
  ),
  (width, height, scale) => ({ width, height, scale })
).pipe(
  tap(x => console.warn('map Options Values$', x))
);

mapOptionsValues$.subscribe(dimensionsSubject$)
dimensionsSubject$
  .pipe(
    tap(x => console.warn('dimensionsSubject$', x))
  )
  .subscribe()

const mapView = new MapView(dimensionsSubject$);

appBody.append(mapView.self);