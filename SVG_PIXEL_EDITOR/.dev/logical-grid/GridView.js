import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

import { draggable } from '/utils/draggable.service.js'
import { Actor } from '/entities/ActorBase.entity.js';

const { date, array, utils, text } = ham;

const { asObservable, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;



export class GridView {
  constructor(canvas, gridModel, config = {}) {
    this.selected = null;
    this.canvas = canvas;
    this.config = config;
    this.gridModel = gridModel;
    this.scale = 10 //config.scale || 10;

    this.strokeWidth = config.strokeWidth || 4;

    // this.self = document.createElementNS(SVG_NS, 'g');
    this.self = document.querySelector('#grid')
    this.scene = document.querySelector('#scene');
    this.self.classList.add('grid')
    this.self.id = 'grid'

    this.changeY = this.originY;
    this.changeX = this.config.x;
    this.value = this.originY;
    this.tileEvents$ = new Subject();
    
    this.clicks$ = fromEvent(this.self, 'click')
      .pipe(
        map(e => e.target.closest('.tile')),
        tap(pos => this.actor.update.bind(this.actor)(pos)),
        filter(_ => _),
        tap(x => console.log('x', x)),
        map(t => ({ x: +t.dataset.column, y: +t.dataset.row })),

      ).subscribe(this.tileEvents$);

  this.self .addEventListener('click', this.  handleClick.bind(this))
    
    
    this.offset;
    this.xPos = this.changeX;
    this.transform;
    this.translate;
    this.CTM;
    this.coord;

    this.transforms = this.self.transform.baseVal;
    this.transforms = this.self.transform.baseVal;

    this.translate = this.canvas.createSVGTransform();
    this.translate.setTranslate(-5, -5)
    this.transforms.insertItemBefore(this.translate, 0);

    this.scene.appendChild(this.self)

    this.actor = new Actor(document.querySelector('#actor1'), { row: 0, column: 0 })
    
    this.actor.detachSelf()
  }

  translateGrid({ x, y }) {
    this.translate.setTranslate(x || 0, y || 0);
  }

  load(tileModel) {
    this.tileModel = tileModel

    this.tileModel.rows.forEach((r, i) => {
      r.columns.forEach((t, i) => {
        this.insertTile(t, (t) => {})
      })
    });

    this.height = this.tileModel.lastCell.row + this.scale / 2;
    this.width = this.tileModel.lastCell.column + this.scale;
    this.self.appendChild(this.actor.cache)

  }

  subscribe() {
    return this.tileEvents$.asObservable()
  }

  handleClick(e) {
    const tile = e.target.closest('.tile');
    const pos = { row: +tile.dataset.row, column: +tile.dataset.column }
    const detail = { row: tile.dataset.row, column: tile.dataset.column }
    
    this.self.dispatchEvent(new CustomEvent('tile:active', { bubbles: true, detail }));
   
    const all= [...document.querySelectorAll('.tile')]
    const prev= all.filter((t) => t.classList.contains('highlight') );
    const rel= all.filter((t) => +t.dataset.row === pos.row || +t.dataset.column === pos.column)
 
    prev .forEach((t, i) => {

      t.classList.remove('highlight')
    });
    rel .forEach((t, i) => {

      t.classList.add('highlight')
    });
    
  }
  // getTile(point) {
  // }
  insertTile(point, callback = (tile) => {}) {
    const tel = document.createElementNS(SVG_NS, 'g')
    const { row, column } = point
    tel.classList.add('tile')
    tel.dataset.column = column
    tel.dataset.row = row

    tel.innerHTML = `
      <rect transform="translate(0,0)" class="tile-face"  stroke="#F1F1F170" stroke-width="0.2"  width="${this.scale}"  height="${this.scale}"></rect>
        <g transform="translate(0,0)"  class="tile-points">
          <circle fill="#00000090" fill="red" cx="0" cy="0" class="vertex" r="0.5"></circle>
          <circle fill="#00000090" cx="10" cy="0" class="vertex" r="0.5"></circle>
          <circle fill="#00000090" cx="10" cy="10" class="vertex" r="0.5"></circle>
          <circle fill="#00000090" cx="0" cy="10" class="vertex" r="0.5"></circle>
          <circle fill="#FFFFFF70" stroke-width="0.75" stroke="#00000070" cx="5" cy="5" class="tile-point" r="1"></circle>
        </g>
      `;
    this.self.appendChild(tel)
    tel.setAttribute('transform', `translate(${(point.column*this.scale)}, ${point.row * this.scale})`)

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

  get x() { return this.self.x.baseVal.value }

  set x(newValue) {
    this.self.setAttributeNS(null, 'x', newValue * this.scale)
  }

  get y() { return this.self.y.baseVal.value }

  set y(newValue) {
    this.self.setAttributeNS(null, 'y', newValue * this.scale)
  }

  get width() { return this.self.width.baseVal.value }

  set width(newValue) {
    this.self.setAttribute('width', newValue)
  }

  get height() { return this.self.height.baseVal.value }

  set height(newValue) {
    // this.root.setAttribute('height', newValue);
    this.self.setAttribute('height', newValue);
  }

  get heightInPixels() { return this.self }
}
