import { Point } from './Point.js';
export class Pixel {
  #point = { x: null, y: null }
  #self = null;
  #content = null;
  #x = null;
  #y = null;
  #scale = null;
  #strokeWidth = 0.75;
  #stroke = '#D1D1D1';
  #color = null;

  constructor({ x, y, scale, color }) {
    this.#self = document.createElementNS(SVG_NS, 'g');
    this.#self.classList.add('pixel')
    this.#content = document.createElementNS(SVG_NS, 'rect');
    this.#x = x
    this.#y = y
    this.#scale = scale
    this.color = color || 'none'


    // this.#self.dataset.color = color || '#FFFFFF';
  }

  render() {
    this.#self.append(this.#content);
    this.#content.setAttribute('width', `${this.scale}`);
    this.#content.setAttribute('height', `${this.scale}`);
    this.#content.setAttribute('fill', `${this.color}`);
    this.#content.setAttribute('stroke-width', this.#strokeWidth);
    this.#content.setAttribute('stroke', this.stroke);

    this.#self.setAttribute('transform', `translate(${this.x},${this.y}) scale(${this.scale/1.075})`)

    return this.#self;
  }

  get isFilled() { return this.color !== 'none'; }

  get x() { return this.#x || 1 }

  get y() { return this.#y || 1 }

  get scale() { return this.#scale || 1 }

  set scale(v) {
    this.#scale = v;
    // this.#content.setAttribute('width', `${this.scale}`);
    // this.#content.setAttribute('height', `${this.scale}`);
    // this.#content.setAttribute('stroke-width', `${this.#strokeWidth}`);
    this.#self.setAttribute('transform', `translate(${this.x},${this.y}) scale(${v})`)
  }

  get color() { return this.#content.getAttribute('fill') };

  set color(v) {
    this.#color = v;
    if (!(v === this.color)) this.#content.setAttribute('fill', v)
  }

  static #create() {}

  fill(color) {
    this.color = color;
  }

  setScale(size) {
    this.scale = size;
  }

  clear() {
    this.color = 'none';
  }
}