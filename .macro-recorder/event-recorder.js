import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, DOM, utils } = ham;

export const TimerStates = {}

export class Clock extends EventEmitter {
  #startTime = 0;
  #currentTime = 0;
  #endTime = 0;
  #isRunning = false;
  #invervalHandle = null;
  #interval = 40;

  constructor() {
    super();

  }

  get startTime() { return this.#startTime };
  get currentTime() { return this.#currentTime };
  get endTime() { return this.#endTime };
  get isRunning() { return this.#isRunning };
  get delta() { return Math.floor(Date.now() - this.startTime) };

  start() {
    this.#startTime = Date.now();
    this.#isRunning = true;

    this.#invervalHandle = setInterval(() => {
      this.emit('tick', { time: this.delta });
      console.log('TICK delta: ', this.delta);
    }, this.#interval);
  }

  stop() {
    clearInterval(this.#invervalHandle);
    this.#isRunning = false;
  }

  set() {
    throw 'Must define create in child class of view. Cannot call create on View Class. '
  }

  reset() {
    this.stop();

    this.#currentTime = 0;
    this.#startTime = 0;
    this.#endTime = 0;
  }
};

const clock = new Clock()
console.log('clock', clock)

const clockEventListener = clock.on('tick', delta => {
  // console.warn('ON CLOCK TICK EVENT', delta);
});

console.log('clockEventListener', clockEventListener)

clock.start()

setTimeout(() => {
  clock.stop()
  console.log('CLOCK SHOUKD STOP', );
}, 2000)


export class Recorder {
  #startTime = 0;
  #endTime = null;
  #events = [];
  #eventQueue = [];
  #isRunning = false;
  #isPlaying = false;

  constructor(target) {
    this.target = target;
    this.recordEvent = this.#recordEvent.bind(this);


  }

  #recordEvent(e) {
    clock.reset()

    this.#events.push({
      x: e.clientX,
      y: e.clientY,
      type: e.type,
      timeStamp: e.timeStamp - this.startTime,
    });

    console.warn('[[ Record Event ]]', e.timeStamp, );
  }

  start() {
    this.startTime = performance.now();

    console.warn('[[ Recorder Starting... ]]');

    this.target.addEventListener('pointerdown', this.recordEvent);
  }

  stop() {
    console.warn('[[ Recorder Stopping... ]]');
    this.target.removeEventListener('pointerdown', this.recordEvent);

    return this.#events;
  }

  play() {
    clock.reset()

    const queue = [...this.#events];
    let head = queue.shift();

    const clockEventListener = clock.on('tick', delta => {
      if (this.#isPlaying && head) {
        if (delta >= head.timeStamp) {
          const evt = new PointerEvent('click', {
            bubbles: true,
            clientX: head.x,
            clientY: head.y,
          });

          this.target.dispatchEvent(evt)

          if (queue.length) {
            head = queue.shift()
          }

          else {
            this.#isPlaying = false;
            console.warn('DONE');
          }
        }

      }
    });


    this.#isPlaying = true;

    clock.start()



    // const initTimer = () => {
    //   let startTime = performance.now();
    //   console.log('initTimer', startTime)
    //   return () => {
    //     return performance.now() - startTime;
    //   }
    // }

    // const timer = initTimer();

    // console.log('timer(', timer())


    // let time = timer();

    // let startTime = performance.now();

    // const queue = [...this.#events];
    // let head = queue.shift();

    // console.warn('STARTING PLAYBACK', { time });


    // if (head) {
    //   // const evt = new PointerEvent('click', {
    //   //   bubbles: true,
    //   //   clientX: head.x,
    //   //   clientY: head.y,
    //   // });

    //   // this.target.dispatchEvent(evt)

    //   // if (queue.length) {
    //   //   head = queue.shift()
    //   // }
    // }

    // const intHandle = setInterval(() => {
    //   // if ( !head) {
    //   //   clearInterval(intHandle)
    //   //   console.warn('DONE');
    //   // }

    //   // else {
    //   if (time >= head.timeStamp) {
    //     const evt = new PointerEvent('click', {
    //       bubbles: true,
    //       clientX: head.x,
    //       clientY: head.y,
    //     });

    //     this.target.dispatchEvent(evt)

    //     if (queue.length) {
    //       head = queue.shift()
    //     }
    //     else {
    //       clearInterval(intHandle)
    //       console.warn('DONE');
    //     }
    //   }

    //   time = timer()
    //   console.log('time', time)
    // }, 100)

    // return this.#events;
  }
}