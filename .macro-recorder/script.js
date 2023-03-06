import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { Recorder } from './event-recorder.js';

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body');
const appFooter = document.querySelector('#app-footer');
const containers = document.querySelectorAll('.container');
const buttons = document.querySelectorAll('.app-button');
const surface = document.querySelector('#surface');

const { template, utils, DOM } = ham;


const recorder = new Recorder(surface);
let recordedEvents = null;
// recorder.start();


appFooter.addEventListener('click', e => {

  const button = e.target.closest('.app-button')

  if (button) {
    const action = button.id

    if (action === 'stop') {
      recordedEvents = recorder[action]();
      console.log('recordedEvents', recordedEvents)
    } else {
      recorder[action]()
    }

  }
});

const evt = new PointerEvent('click',{
  bubbles: true,
  clientX: 50,
  clientY: 50,
})

surface.addEventListener('click', e => {
  // surface.append(blip)
  // const surf = e.target.closest('#surface')
// console.log('surf.clientTop', surf.getBoundingClientRect())  
  // if (!surf) return console.error('NO SURF');
  const offsetY = surface.getBoundingClientRect().top
  const blip = template('blip') // DOM.createElement({})
  blip.style.top = (e.clientY-offsetY-25) + 'px'
  blip.style.left = (e.clientX) + 'px'

  surface.append(blip)

  setTimeout(() => {
    surface.removeChild(blip)


  }, 500)


});


// setTimeout(() => {
//   console.log('STOPPING');
//   recordedEvents = recorder.stop();
//   console.log('recordedEvents', recordedEvents)

// }, 5000)