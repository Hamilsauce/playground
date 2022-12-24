import { MapView } from './js/map.view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')


const mapView = new MapView();

appBody.append(mapView.self);

console.log('mapView.body', mapView.body)
console.log('duxk');
