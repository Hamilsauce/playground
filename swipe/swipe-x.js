// import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// const { template, utils, rxjs } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const dragItem = ({ target, x }) => {
  const currCenter = parseInt(getComputedStyle(target).left) + (parseInt(getComputedStyle(target).width) / 2)
  // console.log('currCenter', currCenter)
  const center = x - (parseInt(getComputedStyle(target).width) / 2)
  target.style.left = center + 'px'
};

const resetItem = ({ target, x }) => {
  const pos1 = parseInt(getComputedStyle(target).left)
  const delta = pos1 - (parseInt(getComputedStyle(target).width) / 2)
  console.log('delta', delta)
  const center = x - (parseInt(getComputedStyle(target).width) / 2)
  target.style.left = null
};

const getDelta = () => {
  this.lastDragPoint.x + (currPoint.x - this.dragStartPoint.x)
}


let isSwiping = false;

const Points = {
  basePoint: { x: 0, y: 0, },
  dragStartPoint: { x: 0, y: 0, },
  lastDragPoint: { x: 0, y: 0, },
}

let start = {
  x: 0,
  y: 0,
}

let curr = {
  x: 0,
  y: 0,
}

let end = {
  x: 0,
  y: 0,
}

let delta = {
  x: 0,
  y: 0,
}


const list = document.querySelector('.list')
const listItems = [...document.querySelectorAll('.list-item')]
const app = document.querySelector('#app')



const pointerDown$ = fromEvent(listItems, 'pointerdown');
const pointerMove$ = fromEvent(listItems, 'pointermove');
const pointerUp$ = fromEvent(listItems, 'pointerup');


const swipe$ = pointerDown$
  .pipe(
    map(({ target, clientX, clientY }) => ({ x: (parseInt(getComputedStyle(target).width) / 2), y: clientY })),
    tap(startPoint => start = startPoint),
    tap(() => isSwiping = true),
    switchMap(startPoint => pointerMove$
      .pipe(
        map(({ clientX, clientY, target }) => ({
          x: clientX, // + (parseInt(getComputedStyle(target).width) / 2),
          y: clientY,
          target
        })),
        // scan((prevPoint, currPoint) => {
        //   console.log('prevPoint, currPoint', prevPoint, currPoint)
        //   Points.dragStartPoint = prevPoint ? Points.dragStartPoint : currPoint;
        
        //   if (!currPoint) {
        //     Points.lastDragPoint = Points.basePoint;
        
        //     return Points.basePoint;
        //   }
        
        //   return {
        //     target: currPoint.target,
        //     x: Points.lastDragPoint.x + (currPoint.x - Points.dragStartPoint.x),
        //     y: Points.lastDragPoint.y + (currPoint.y - Points.dragStartPoint.y),
        //   }
        // }, Points.basePoint),
        tap(dragItem),
        
        switchMap(curr => pointerUp$
          .pipe(
            tap(() => Points.basePoint = curr),
            tap(() => start.x = 0),
            tap(() => isSwiping = false),
            tap(resetItem),
            
            tap(x => console.log('startPoint.x - curr.x', Math.abs(startPoint.x - curr.x))),
            tap(x => console.log('startPoint.x - curr.x', Math.abs(curr.x - startPoint.x) > 200)),
            filter(x => Math.abs(curr.x - startPoint.x) > 200),
            tap(({ target }) => {
              target.remove()
            }),
          )
        )
      )
    )
  );

swipe$.subscribe()

console.log('fuck')