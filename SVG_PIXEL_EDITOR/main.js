import { App } from './App.js'
import {PixelEditor} from './PixelEditor.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

// const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const canvasContainer = document.querySelector('#canvas-container')
const containers = document.querySelectorAll('.container')


const pixelEditor = new PixelEditor()

// canvasContainer.append(pixelEditor.render())

const bhs = new BehaviorSubject(null);
const bhsObs1 = bhs.asObservable()
const bhsObs2 = bhs.asObservable()

// console.log('bhs === bhsObs1', {bhs})
console.log('bhs === bhsObs1.source', bhs ===  bhsObs1.source)
// console.log('bhsObs1', bhsObs1)

const app = new App('#app');
app.appendCanvas('#canvas-container')

console.log({ app });
