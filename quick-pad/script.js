import { Editor } from './Editor.js';
const editor = new Editor()

function performAction(command) {
  document.execCommand(command, false, null);
  editor.dom.focus();
  console.log(editor.dom.firstChild);
}


const toolbar = document.querySelector('#toolbar');
const app = document.querySelector('#app');





app.addEventListener('click', e => {
  console.warn('clicl');

});

toolbar.addEventListener('pointerdown', e => {
  console.log('pointerdown')
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();

});

toolbar.addEventListener('pointerup', e => {
  console.log('pointerup')
  e.stopImmediatePropagation();
  e.preventDefault();

});


editor.dom.addEventListener('dblclick', e => {
  performAction('bold')
});

// export class Toolbar {
//   #self;

//   constructor() {
//     this.#self = document.querySelector('#toolbar');
//   }

//   toggleExpand() {}

//   handleDrag(e) {}

//   handleClick(e) {}
// }


// export class Application {
//   #self;

//   constructor() {
//     this.#self = document.querySelector('#app');
//   }

//   toggleExpand() {}

//   handleDrag(e) {}

//   handleClick(e) {}
// }
