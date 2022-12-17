const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const tileTemplate = `
  <g class="tile" id="tile-r0c0" transform="translate(0,0)" data-row="4" data-column="4">
    <rect class="tile-face" x="0" y="0" transfdorm=" scale(1.5)" width="10" height="10"></rect>
    <g class="tile-points">
      <circle fill="red" cx="0" cy="0" class="vertex" r="1"></circle>
      <circle cx="10" cy="0" class="vertex" r="1"></circle>
      <circle cx="10" cy="10" class="vertex" r="1"></circle>
      <circle cx="0" cy="10" class="vertex" r="1"></circle>
      <circle cx="5" cy="5" class="tile-point" r="1"></circle>
    </g>
  </g>
`;

export class Tile {
  constructor(canvas, element, config ={}) {
    this.selected = null;
    this.canvas = canvas;
    this.config = config;
    // this.handleRadius = this.config.handleRadius;
    this.strokeWidth = config.strokeWidth || 4;
    this.self = element || document.createElementNS(SVG_NS, 'g');
    // this.adjusterHeight = this.config.adjusterHeight || 15;
    this.originY = this.height / 2; //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.changeY = this.originY;
    this.changeX = this.config.x;
    this.value$ = new BehaviorSubject(this.originY);
    this.value = this.originY;

    // this.drag$;

    this._children = new Map([
      ['text', this.createText()],
      ['face', document.createElementNS(SVG_NS, 'circle')],
      ['handleGroup', document.createElementNS(SVG_NS, 'g')],
      ['track', document.createElementNS(SVG_NS, 'line')],
      ['face', document.createElementNS(SVG_NS, 'rect')],
      ['sliderAdjuster', document.createElementNS(SVG_NS, 'rect')],
      ['root', this.self],
    ]);

    this.self = this.getElement('root');
    this.face = this.getElement('face');
    this.textNode = this.getElement('text');

    this.trackHeight = (this.y2 - this.y1); //- this.handleRadius * 2
    this.offset;
    this.xPos = this.changeX;
    this.transform;
    this.translate;
    this.CTM;
    this.coord;

    this.init();

    this.transforms = this.self.transform.baseVal;

    // this.handleTransforms = this.handleGroup.transform.baseVal;

    // this.textNodeTransforms = this.textNode.transform.baseVal;

    if (this.handleTransforms.length === 0) {
      this.translate = this.canvas.createSVGTransform();
      this.translate.setTranslate(this.config.x, this.config.y);
      this.transforms.insertItemBefore(this.translate, 0);

      // this.handleScale = this.canvas.createSVGTransform();

      // this.handleTranslate = this.canvas.createSVGTransform();
      // this.handleTranslate.setTranslate(0, this.originY);
      // this.handleTransforms.insertItemBefore(this.handleTranslate, 0);

      // this.handleRotate = this.canvas.createSVGTransform();
      // this.handleRotate.setRotate(0, this.config.x, this.originY);
      // this.handleTransforms.insertItemBefore(this.handleRotate, 1);

      // this.textNodeRotate = this.canvas.createSVGTransform();
      // this.textNodeRotate.setRotate(0, 0, 0);
      // this.textNodeTransforms.insertItemBefore(this.textNodeRotate, 0);
    }
  }






  createText() {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(this.value);

    textNode.appendChild(text);
    return textNode;
  }

  setAttr(childKey = '', attr = '', value) {
    this.getElement(childKey).setAttribute(attr, value);

    return this.getElement(childKey);
  }

  getAttr(childKey = '', attr = '') { return parseInt(this.getElement(childKey).getAttributeNS(null, attr)); }

  getElement(key = '') { return this.children.has(key) ? this.children.get(key) : null; }

  getMousePosition(evt) {
    const CTM = this.canvas.getScreenCTM();
    if (evt.touches) { evt = evt.targetTouches[0]; }

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  init() {
    this.width = this.config.width;
    this.height = this.config.height;
    this.self.classList.add('sliderGroup');

    this.setAttr('background', 'width', this.width);
    this.setAttr('background', 'height', this.height);
    this.setAttr('background', 'rx', '22px');

    this.face.classList.add('slider-bg');

    this.setAttr('sliderAdjuster', 'x', this.width / 4);
    this.setAttr('sliderAdjuster', 'y', this.height + 5);
    this.setAttr('sliderAdjuster', 'width', this.width / 2);
    this.setAttr('sliderAdjuster', 'height', this.adjusterHeight);
    this.setAttr('sliderAdjuster', 'rx', '8px');
    this.setAttr('sliderAdjuster', 'fill', '#18181890');
    this.setAttr('sliderAdjuster', 'stroke', '#00000050');

    this.face.classList.add('sliderAdjuster');

    this.setAttr('track', 'x1', this.width / 2);
    this.setAttr('track', 'x2', this.width / 2);
    this.setAttr('track', 'y1', this.handleRadius);
    this.setAttr('track', 'y2', this.height - this.handleRadius);

    this.track.classList.add('slider-track');

    this.setAttr('handle', 'r', this.handleRadius);
    this.setAttr('handle', 'cx', this.width / 2);
    this.setAttr('handle', 'fill', 'url(#handleGradient)');
    this.setAttr('handle', 'stroke', '#00000050');
    this.setAttr('handle', 'stroke-width', '1px');

    this.handle.classList.add('at-origin');

    this.setAttr('text', 'x', this.handleRadius);
    this.setAttr('text', 'y', this.handleRadius / 4);


    this.textNode.classList.add('text-node');
    this.textNode.setAttributeNS(null, 'text-anchor', 'middle');

    this.handleGroup.appendChild(this.handle);
    this.handleGroup.appendChild(this.textNode);

    this.self.appendChild(this.face);
    this.self.appendChild(this.track);
    this.self.appendChild(this.handleGroup);
    this.self.appendChild(this.adjuster);

    this.canvas.appendChild(this.self);

    this.self.addEventListener('touchmove', this.repositionX.bind(this));

    this.self.addEventListener('mousedown', this.startDrag.bind(this));
    this.self.addEventListener('mousemove', this.drag.bind(this));
    this.self.addEventListener('mouseup', this.endDrag.bind(this));
    this.self.addEventListener('touchstart', this.startDrag.bind(this));
    this.self.addEventListener('touchmove', this.drag.bind(this));
    this.self.addEventListener('touchend', this.endDrag.bind(this));
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
