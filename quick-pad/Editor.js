import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
const { template, text } = ham;
// console.log('text', text)
export class Editor {
  #self;

  constructor() {
    // super();
    console.log('fuk');
    this.#self = document.querySelector('#editor');

    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.keyDownHandler = this.handleKeyDown.bind(this);

    this.#self.addEventListener('keyup', this.handleKeyUp)
    this.#self.addEventListener('keydown', this.keyDownHandler)
  }

  get dom() { return this.#self }

  get textContent() { return this.#self.textContent }

  getCaretPosition() {
    let caretPos = 0,
      sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == this.dom) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() == this.dom) {
        const tempEl = document.createElement("span");
   
        this.dom.insertBefore(tempEl, this.dom.firstChild);
     
        const tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  }
  
  insertContent(position = null, content) {
    if (!position) return;
    this.#self.textContent = this.textContent.slice(0, position) + content + this.textContent.slice(position);
  }

  handleKeyDown(e) {
    const tabSpace = '\t';
    if (e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
    
      this.insertContent(this.getCaretPosition(), tabSpace)
    }
    // const temp = 
    console.log('handleKeyDown', e.key);
    console.warn('caretPos', this.getCaretPosition())
  }

  handleKeyUp(e) {
    // new Event().stopPropagation

    console.warn('[[UP]]', e);
    

  }
};
