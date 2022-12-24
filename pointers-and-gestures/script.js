import { EventState } from './event-handlers.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils } = ham;

const { combineLatest, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const ui = {
  get app() { return document.querySelector('#app') },
  get appBody() { return this.app.querySelector('#app-body') },
  get stateOutput() { return this.appBody.querySelector('#state-output') },
  get surface() { return this.appBody.querySelector('#surface') },
  get surfaceBG() { return this.surface.querySelector('.background') },
  get surfaceMarkers() { return this.surface.querySelector('.pointer-markers') },
  get allMarkers() { return [...this.surface.querySelectorAll('.pointer-marker')] },
  get containers() { return document.querySelectorAll('.container') },
}

const GlobalState = {
  ui: ui,
  markerSize: 75,
  // eventCache: {},
  pointerMarkers: new Map(),
  previousPointDifference: {
    x: -1,
    y: -1,
  },
  isDragging: false,
}

const eventCache = EventState.cache;


const createMarker = (pointerId, options) => {
  const m = template('pointer-marker');

  if (pointerId) m.id = pointerId;
  if (pointerId) m.dataset.pointerId = pointerId;

  if (options) { Object.assign(m, options); }

  return m;
};

const insertMarker = (el, point) => {
  const style = getComputedStyle(el)
  // point = {x: 
  console.log('style', style)
  el.style.left = `${point.x - (GlobalState.markerSize/2)}px`
  el.style.top = `${point.y - (GlobalState.markerSize/2)}px`
  ui.surfaceMarkers.append(el);

};

const moveMarker = (el, point) => {
  // const style = getComputedStyle(el)
  // point = {x: 
  // console.log('style', style)
  el.style.left = `${point.x - (+getComputedStyle(el).width.replace('px', '')/2)}px`
  el.style.top = `${point.y - (+getComputedStyle(el).height.replace('px', '')/2)}px`
  ui.surfaceMarkers.append(el);
};

// const moveMarker = (source$, ...keys) => {};

const removeMarker = (idOrRef) => {
  if (!idOrRef) return;

  const m = typeof idOrRef === 'string' ? findMarker((marker) => marker.dataset.pointerId === idOrRef) : idOrRef;

  return ui.surfaceMarkers.removeChild(m)
};

const getMarkersBy = (filterFn) => {
  if (filterFn) {
    return [...ui.surface.querySelectorAll('.pointer-marker')]
      .filter(filterFn);
  }
  return [...ui.surface.querySelectorAll('.pointer-marker')]
};

const findMarker = (findFn) => {
  return [...ui.surface.querySelectorAll('.pointer-marker')].find(findFn)
};

const getEventTarget = (event, selector) => {
  return selector ? event.target.closest(selector) : event.target;
};

const getEventPoint = ({ offsetX, offsetY }, element) => {
  return new DOMPoint(offsetX, offsetY)
};

const getDelta = (pointA, pointB) => {};

// Find this eent in the cache and update its record with this eent
const pointerMarkers = new Map()

const handlePointerDown = (e) => {
  if (e.target === ui.surface) {
    const point = getEventPoint(e);

    const m = createMarker(e.pointerId);

    eventCache.set(e.pointerId, e);

    insertMarker(m, point);

    pointerMarkers.set(e.pointerId, m);

    GlobalState.isDragging = true;
  }

}

const handlePointerMove = (e) => {
  if (e.target === ui.surface) {

    // This function implements a 2-pointer horizontal pinch/zoom gesture.

    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".

    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move eent.

    e.target.style.border = "dashed";

    eventCache.updateCachedEvent(e.pointerId, e);

    moveMarker(pointerMarkers.get(e.pointerId), getEventPoint(e))

    // If two pointers are down, check for pinch gestures
    if (eventCache.size === 2) {

      const curDiffXY = {
        x: Math.abs(
          eventCache.at(0).clientX -
          eventCache.at(1).clientX
        ),
        y: Math.abs(
          eventCache.at(0).clientY -
          eventCache.at(1).clientY
        ),
      }

      const isZoomingIn =
        (curDiffXY.y > (GlobalState.previousPointDifference.y)) ||
        (curDiffXY.x > (GlobalState.previousPointDifference.x))

      const isZoomingOut =
        (curDiffXY.x < (GlobalState.previousPointDifference.x)) ||
        (curDiffXY.y < (GlobalState.previousPointDifference.y))

      let fsize = +ui.surfaceBG.style.fontSize.replace('px', '')

      if (GlobalState.previousPointDifference.x > 0 || GlobalState.previousPointDifference.y > 0) {
        if (isZoomingIn) {
          if (pointerMarkers.size > 0) {

            pointerMarkers.forEach((m, i) => {
              let width = +getComputedStyle(m).width.replace('px', '')
              let height = +getComputedStyle(m).height.replace('px', '')

              m.style.width = width + (4) + 'px';
              m.style.height = height + (4) + 'px';
            });
          }

          ui.surfaceBG.style.fontSize = (fsize + 12) + 'px';
          ui.surfaceBG.textContent = 'IN';
        }

        if (isZoomingOut) {
          if (pointerMarkers.size > 0) {
            pointerMarkers.forEach((m, i) => {
              let width = +getComputedStyle(m).width.replace('px', '');
              let height = +getComputedStyle(m).height.replace('px', '');

              m.style.width = width - 4 + 'px';
              m.style.height = height - 4 + 'px';
            });
          }

          ui.surfaceBG.style.fontSize = (fsize - 12) + 'px';
          ui.surfaceBG.textContent = 'OUT';
        }
      }


      pointerMarkers.forEach((m, i) => {
        const id = [...pointerMarkers.keys()][i] 
        console.log('pointerMarkers', [...pointerMarkers.keys()]) 
        const { clientX, clientY } = eventCache.at(id)

        let el = m.querySelector('.marker-text')
        if (!el) {
          el = document.createElement('div');
          el.classList.add('marker-text');
          m.append(el)
        }
        
        el.textContent = `${Math.round(clientX)}px, ${Math.round(clientY)}px`;

      });



      GlobalState.previousPointDifference = curDiffXY;
    }
  }


  else if (ui.markers.includes(getEventTarget(e, '.pointer-marker'))) {
    const point = getEventPoint(e)
    const m = getEventTarget(e, '.pointer-marker');

    m.style.left = `${e.offsetX - (GlobalState.markerSize/2)}px`
    m.style.top = `${e.offsetY - (GlobalState.markerSize/2)}px`
  }
}

const handlePointerCancel = (e) => {
  console.warn('handlePointerCancel', { e });
}

const handlePointerUp = (e) => {
  eventCache.delete(e.pointerId)
  pointerMarkers.delete(e.pointerId)
  GlobalState.isDragging = false
  ui.surfaceMarkers.innerHTML = ''
  console.warn('handlePointerUp, eventCache.size', eventCache.size);
}

const addPointerListeners = (target) => {
  target.addEventListener('pointerdown', handlePointerDown);
  ui.app.addEventListener('pointermove', handlePointerMove);
  ui.app.addEventListener('pointerup', handlePointerUp);
  target.addEventListener('pointercancel', handlePointerCancel);

  return () => {
    target.removeEventListener('pointerdown', handlePointerDown);
    ui.app.removeEventListener('pointermove', handlePointerMove);
    ui.app.removeEventListener('pointerup', handlePointerUp);
    target.removeEventListener('pointercancel', handlePointerCancel);
  }
};



// const handlePointerEvents = initEventHandling(ui.surface);
const stopHandlingPointerEvents = addPointerListeners(ui.surface);