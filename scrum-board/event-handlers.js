// import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
// const { template } = ham;

class EventCache extends Map {
  #limit;

  constructor(limit = 2, entries) {
    super(entries);

    this.#limit = limit
  };

  get isEmpty() { return super.size === 0 };

  get isFull() { return super.size === this.#limit };

  get limit() { return this.#limit };

  get keys() { return [...super.keys()] };

  get events() { return [...super.values()] };

  each(callback) {
    if (callback) {
      super.forEach(callback)
    }
  }

  calculateTwo() {}

  pointDiff(keyOrIndex1, keyOrIndex2) {
    return {}
  }

  at(i = 0) {
    return i < this.limit && this.keys[i] ? super.get(this.keys[i]) : null;
  }

  indexOf(pointerId) {
    return this.keys.indexOf(pointerId);
  }

  updateCachedEvent(pointerId, updatedEvent) {
    if (super.has(pointerId)) {
      super.set(pointerId, updatedEvent);

      return super.get(pointerId);
    }

    return null;
  }
};


export const eventCache = new EventCache(2);


export const EventState = {
  surface: null,
  previousDifference: -1,
  cache: eventCache,
}

export const PointerEventTypes = {
  down: 'pointerdown',
  move: 'pointermove',
  enter: 'pointerenter',
  over: 'pointerover',
  leave: 'pointerleave',
  cancel: 'pointercancel',
  up: 'pointerup',
}


const handlePointerEvent = (target, eventType = 'down', handler) => {
  if (!(eventType && eventType[eventType] && target && handler)) return;

  target.addEventListener(eventType[eventType], handler);

  return () => {
    target.removeEventListener(eventType[eventType], handler);
  }
};

// const addPointerListeners = (target) => {
//   target.addEventListener('pointerdown', handlePointerDown);
//   target.addEventListener('pointermove', handlePointerMove);
//   target.addEventListener('pointercancel', handlePointerCancel);
//   target.addEventListener('pointerup', handlePointerUp);

//   return () => {
//     target.removeEventListener('pointerdown', handlePointerDown);
//     target.removeEventListener('pointermove', handlePointerMove);
//     target.removeEventListener('pointercancel', handlePointerCancel);
//     target.removeEventListener('pointerup', handlePointerUp);
//   }
// };

// export const initEventHandling = (target) => {
//   EventState.surface = target;

//   return () => addPointerListeners(target)
// };
