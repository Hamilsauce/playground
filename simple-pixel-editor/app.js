import { Pixel } from './Pixel.js';
import { DRAW_MODE, PixelEditor } from './PixelEditor.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, utils, download, event } = ham;
// import {} from './fill-times.js';


const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

let start;
let end;
let line;


const pixelEditor = new PixelEditor(document.querySelector('#svg-canvas'), {
  width: 50,
  height: 100,
  scale: 1,
})

pixelEditor.pixelLayer.addEventListener('pointerdown', e => {
  pixelEditor.isDrawing = true;
  if (pixelEditor.drawMode === DRAW_MODE.point) {
    const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)
    pixelEditor.fillPixel(pixel)
  }

  else if (pixelEditor.drawMode === DRAW_MODE.line) {
    const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)
    // console.log('pixel', pixel)
    let curr

    if (!start && pixel) {
      start = pixel
    }

    else if (pixel) end = { x: pixel.x, y: pixel.y }

    line = pixelEditor.line(start, end);


  }
});

pixelEditor.pixelLayer.addEventListener('pointermove', e => {
  if (!pixelEditor.isDrawing) return;
  if (pixelEditor.drawMode === DRAW_MODE.point) {
    const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)
    pixelEditor.fillPixel(pixel)
  }

  else if (pixelEditor.drawMode === DRAW_MODE.line) {
    const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)
    // console.log('pixel', pixel)
    let curr

    if (!start && pixel) {
      start = pixel
    }

    else if (pixel) end = { x: pixel.x, y: pixel.y }

    line = pixelEditor.line(start, end);


  }
});


pixelEditor.pixelLayer.addEventListener('pointerup', e => {

  if (pixelEditor.drawMode === DRAW_MODE.line) {
    end = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)

    line = pixelEditor.line(start, end);

    console.log('POINTER UP', { line })

    line.forEach((px, i) => {

      console.warn('px', px)

      // const pixel = pixelEditor.getPixelAtPoint(x, y)
      pixelEditor.fillPixel(px);
    });
  }

  const pt = pixelEditor.canvas.createSVGPoint();

  pt.matrixTransform(pixelEditor.pixelLayer.getScreenCTM().inverse());

  const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY)

  pixelEditor.fillPixel(pixel)
  pixelEditor.isDrawing = false;
});

// event.longPress(pixelEditor.pixelLayer, 300, e => {
//   const pixel = pixelEditor.getPixelAtPoint(e.clientX, e.clientY);
//   start = pixel // { x: pixel.x, y: pixel.y }
//   console.log('start', start)
//   // pixel
//   // line = [start]
//   pixelEditor.setDrawMode(DRAW_MODE.line);
// });



const fillPicker = document.querySelector('#color-picker');
const pixelSizeInput = document.querySelector('#pixel-size');


pixelSizeInput.addEventListener('change', e => {
  const size = +e.target.value

  pixelEditor.setPixelSize(size)
})

fillPicker.addEventListener('change', e => {
  const color = e.target.value

  pixelEditor.setFillColor(color)
})