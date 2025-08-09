import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { frequencyDiffs } from '../plot-freq-diffs/FREQ_COMPARE.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, sleep } = ham;

const app = document.querySelector('#app');
const appBody = app.querySelector('#app-body')
const appHeaderRight = app.querySelector('#app-header-right')
const svgCanvas = appBody.querySelector('#svg-canvas')
const viewport = svgCanvas.querySelector('#viewport')
const scene = viewport.querySelector('#scene')
const objectLayer = scene.querySelector('#object-layer')


const useTemplate = (templateName, options = {}) => {
  const el = document.querySelector(`[data-template="${templateName}"]`).cloneNode(true);
  
  delete el.dataset.template;
  
  if (options.dataset) Object.assign(el.dataset, options.dataset);
  
  if (options.id) el.id = options.id;
  
  if (options.fill) el.style.fill = options.fill;
  
  return el;
};


const toSvgPoint = (svg, x, y) => {
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = x
  svgPoint.y = y
  
  return svgPoint.matrixTransform(svg.getScreenCTM().inverse());
  
}
// const svgCanvas = document.querySelector('#svg-canvas')
// const scene = svgCanvas.querySelector('#scene')

const pointNameDelayMap = {
  diff: 2,
  freq: 5,
  myfreq: 3,
}

const renderPoint = async (svg, point, freqDiff, freqKey = 'diff') => {
  const { time, diff, myFreq, freq } = freqDiff
  const circ = useTemplate('plot-point');
  const delay = pointNameDelayMap[freqKey]
  
  Object.assign(circ.dataset, { key: freqKey })
  
  circ.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(0) scale(1)`)
  
  objectLayer.append(circ)
  
  await sleep(delay / 10)
  return circ;
};

const appState = {
  currentViewportScale: 1,
  zoomIn() {
    this.currentViewportScale = this.currentViewportScale + 0.2
    return this.currentViewportScale;
  },
  zoomOut() {
    this.currentViewportScale = this.currentViewportScale - 0.5
    return this.currentViewportScale;
  },
}


draggable(svgCanvas, viewport)

svgCanvas.addEventListener('dblclick', e => {
  appState.zoomIn()
  const input = viewport.getAttribute('transform')
  const output = input.replace(/scale\(([^)]*)\)/g, `scale(${appState.currentViewportScale})`);
  viewport.setAttribute('transform', output)
  
});

svgCanvas.addEventListener('_contextmenu', e => {
  appState.zoomOut()
  const input = viewport.getAttribute('transform')
  const output = input.replace(/scale\(([^)]*)\)/g, `scale(${appState.currentViewportScale})`);
  viewport.setAttribute('transform', output)
});

let perf = {
  start: 0,
  end: 0,
}

let shouldFollow = true;
let pressDuration = 500;
let pressCount = 500;
let longPressIntervalId = null;

viewport.addEventListener('pointerdown', e => {
  shouldFollow = false;
  
  longPressIntervalId = setTimeout(() => {}, pressDuration)
});

viewport.addEventListener('pointerup', e => {
  shouldFollow = true;
  clearTimeout(longPressIntervalId)
  longPressIntervalId = null
});

let diffKey = 'myfreq';

frequencyDiffs.reduce(async (acc, d, i) => {
  acc = await acc
  perf.start = performance.now()
  
  const {
    myfreq,
    freq,
    time,
    diff,
  } = d;
  
  d.myfreq = Math.round(myfreq)
  d.freq = Math.round(freq)
  d.time = (Math.round(time) / 3)
  d.diff = Math.round(diff);
  
  const point = toSvgPoint(svgCanvas, d.time, d['freq'], );
  const point2 = toSvgPoint(svgCanvas, d.time, d['myfreq']);
  const point3 = toSvgPoint(svgCanvas, d.time, d['diff'], );
  
  const p = await renderPoint(svgCanvas, point, d, 'freq')
  
  const p2 = await renderPoint(svgCanvas, point2, d, 'myfreq')
  // p2.classList.add('show');
  
  const p3 = await renderPoint(svgCanvas, point3, d, 'diff')
  // p3.classList.add('show');
  
  
  setTimeout(() => {
    p.classList.add('show');
    
    setTimeout(() => {
      p.classList.remove('show');
      
      setTimeout(() => {
        p.remove()
      }, 500)
    }, 750)
  }, 50)
  
  setTimeout(() => {
    p2.classList.add('show');
    
    setTimeout(() => {
      p2.classList.remove('show');
      
      setTimeout(() => {
        p2.remove()
      }, 1000)
    }, 500)
  }, 75)
  
  setTimeout(() => {
    p3.classList.add('show');
    
    setTimeout(() => {
      p3.classList.remove('show');
      
      setTimeout(() => {
        p3.remove()
      }, 50)
    }, 1000)
  }, 0)
  
  
  const vpTrans = viewport.getAttribute('transform')
  let output
  const match = vpTrans.match(/translate\(([^)]*)\)/);
  
  if (match) {
    const [x, y] = match[1].split(',').map(Number);
    const point2 = toSvgPoint(svgCanvas, x, y);
    output = vpTrans.replace(/translate\(([^)]*)\)/g, `translate(-${point3.x-450},${y})`);
 
    if (shouldFollow) {
      viewport.setAttribute('transform', output)
    }
  }
  
  perf.end = performance.now();
  
  
  const fps = 1000 / (perf.end - perf.start);
  
  appHeaderRight.textContent = `FPS ${Math.round(fps)}`
  
  return [...acc, p]
}, Promise.resolve([]));

// perf.end = performance.now()
// console.warn(' perf', perf.end - perf.start)