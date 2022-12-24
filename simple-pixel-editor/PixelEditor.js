import { Pixel } from './Pixel.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, utils, download, event } = ham;
// import {} from './fill-times.js';

export const DRAW_MODE = {
  point: 'POINT',
  line: 'LINE',
  fill: 'FILL',
}

export class PixelEditor extends EventEmitter {
  #pixels = new Map();
  #width;
  #height;
  #scale;
  #self;
  #pixelColor;
  #fillColor = '#FFFFFF';
  #drawMode = DRAW_MODE.point;
  #isDrawing = false;


  constructor(svg, { width, height, scale, pixelColor, fillColor }) {
    super();

    this.#self = svg;
    this.#self.classList.add('pixel-editor');
    this.#width = width;
    this.#height = height;
    this.#scale = scale;
    this.#pixelColor = pixelColor || '#000000';
    this.#fillColor = fillColor || '#FFFFFF';
    this.render();
    // for (let x = 0; x < width; x++) {
    //   for (let y = 0; y < height; y++) {
    //     const color = ((x % 10 === 0 && x != 0) && (y % 10 === 0 && y != 0)) ? '#DADADA' : '#FFFFFF';
    //     const p = new Pixel({ x, y, scale, color });

    //     this.#pixels.set(p.render(), p)
    //   }
    // }
    // this.pixelLayer.append(...this.#pixels.keys());
    // console.log('this.viewbox', this.viewbox)
  }

  setDrawMode(mode = DRAW_MODE.point) {
    this.#drawMode = mode;
  }

  render() {
    for (let x = 0; x < this.#width; x++) {
      for (let y = 0; y < this.#height; y++) {
        // const color = ((x % 10 === 0 && x != 0) && (y % 10 === 0 && y != 0)) ? '#DADADA' : '#FFFFFF';

        this.createPixel({ x, y, color: this.#pixelColor });
      }
    }

    this.pixelLayer.setAttribute('fill', '#FFFFFF');

    this.pixelLayer.append(...this.#pixels.keys());

    return this.#self;
  }


  createPixel(options) {
    const p = new Pixel(options);

    this.#pixels.set(p.render(), p);

    return p;
  }

  line(p0, p1) {
    let points = [];
    let N = this.diagonal_distance(p0, p1);
    for (let step = 0; step <= N; step++) {
      let t = N === 0 ? 0.0 : step / N;
      points.push(this.round_point(this.lerp_point(p0, p1, t)));
    }
    return points;
  }

  diagonal_distance(p0, p1) {
    let dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  }

  round_point(p) {
    return { x: Math.round(p.x), y: Math.round(p.y) };
  }

  lerp_point(p0, p1, t) {
    return this.getPixelTarget(this.lerp(p0.x, p1.x, t),
      this.lerp(p0.y, p1.y, t));
  }

  lerp(start, end, t) {
    return start * (1.0 - t) + t * end;
  }

  setPixelColor(color) { this.#pixelColor = color; }

  setFillColor(color) { this.#pixelColor = color; }

  setPixelSize(size) {
    this.#scale = size;

    this.pixelLayer.setAttribute('transform', `translate(-${this.#scale},-${this.#scale}) scale(${this.#scale})`);
  }

  getPixelTarget(el) { return this.#pixels.get(el.closest('.pixel')) }

  getPoint(x, y) {}

  _getPixelAtPoint(x, y) {
    const pt = new DOMPoint(x, y)
    pt.matrixTransform(this.pixelLayer.getScreenCTM().inverse());

    return this.#pixels.get(document.elementFromPoint(pt.x, pt.y).closest('.pixel'));
  }

  getPixelAtPoint(x, y) {
    const pt = this.canvas.createSVGPoint();
    pt.x = x;
    pt.y = y;

    pt.matrixTransform(this.pixelLayer.getScreenCTM().inverse());
    return this.#pixels.get(document.elementFromPoint(pt.x, pt.y).closest('.pixel'));
  }

  fillPixel(pixel) {
    if (!pixel) return;
    
    pixel.fill(this.#pixelColor);
  }

  clear() {
    this.each(px => px.clear())
  }

  each(fn) {
    this.#pixels.forEach(fn)
  }

  get pixelLayer() { return this.#self.querySelector('#pixels'); }

  get viewbox() { return this.#self.viewBo.baseVal }

  get canvas() { return this.#self }

  get drawMode() { return this.#drawMode }

  get isDrawing() { return this.#isDrawing }

  set isDrawing(v) { this.#isDrawing = v }
}