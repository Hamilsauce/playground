import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, date, array, utils, text } = ham;

export const ElementTypes = new Set([
  'path',
  'rect',
  'circle',
  'line',
  'polygon',
  'polyline',
  'text',
  'g',
]);

/*
  CanvasObject: 
*/

// export class CanvasObject extends EventEmitter {
//   #self = null;
//   #type = null;

//   constructor(type) {
//     super();

//     if (!ElementTypes.has(type)) throw new Error('Invald type passed to CanvasElement constructor', { type });

//     this.#type = type;

//     this.#self = template(type);
//   }

//   render() {}

//   update() {}

//   remove() {}

//   // addCollection(name) {
//   //   this[name] = new Collection(name);

//   //   return this[name];
//   // }

//   get self() { return this.#self };
  
//   get type() { return this.#type };

//   get dataset() { return this.self.dataset };
  
//   get baseVal() { return this.self.baseVal };

//   get boundingBox() {
//     return this.self.getBoundingClientRect()
//   };

//   get boundingBox() {
//     return this.self.getBoundingClientRect()
//   };


//   get position() {
//     return {
//       top: +((getComputedStyle(this.self).top || '').replace(/[^\d.-]/g, '') || 0),
//       left: +((getComputedStyle(this.self).left || '').replace(/[^\d.-]/g, '') || 0),
//     }
//   }

//   set position({ x, y }) {
//     this.self.style.left = `${x}px`;
//     this.self.style.top = `${y}px`;
//   }


//   // get boundingBox() {
//   //   return this.self.getBoundingClientRect()
//   // };

//   // set prop(newValue) { this.#prop = newValue };
// }
