import { Sheet } from './lib/Sheet.js';

const { combineLatest, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


const getCellTargetFromEvent = (e) => {
  return !!e.target ? e.target.closest('.cell') : null;
};

export const getCellValueByAddrress = (source$, ...keys) => {
  return merge(
    ...keys.map(key => source$.pipe(
      filter(group$ => group$.key === key),
      mergeMap(group$ => group$.pipe()),
    ))
  )
};

const getCellAddressAndValue = (e) => {
  const value = e.target.value;
  const address = !!e.target ? e.target.closest('.cell').dataset.address : null;

  return { value, address };
};


const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const sheetContainer = document.querySelector('#sheet-container');
const cells = document.querySelectorAll('.cell')

console.log('document.constructor === HTMLDocument', document.constructor === HTMLDocument)



const sheet1 = new Sheet({ rows: 2, columns: 2 })


const sheet1Dom = sheet1.render();
sheetContainer.innerHTML = '';
sheetContainer.append(sheet1Dom);

const cellChanges$ = fromEvent(sheet1Dom, 'change');

const cellValues$ = cellChanges$.pipe(
  map(getCellAddressAndValue),
  groupBy(cellMap => cellMap.address),
);



/*
  SELECT STREAMS
*/
export const selectCellStream = (...address) => getCellValueByAddrress(cellValues$, ...address)



const a1$ = getCellValueByAddrress(cellValues$, '0,0');

a1$.pipe(
  map(x => x),
  tap(x => console.warn('getValueStreamByAddress', x)),
).subscribe();

const cellValuesSub = cellValues$
  .pipe(
    // map(x => x),
    // tap(x => console.warn('cellValuesSub', x))
  )
// .subscribe()

// combineLatest
