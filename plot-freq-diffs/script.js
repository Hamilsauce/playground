import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { frequencyDiffs } from '../plot-freq-diffs/FREQ_COMPARE.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, sleep } = ham;

const app = document.querySelector('#app');
const appBody = app.querySelector('#app-body')
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

const renderPoint = async (svg, point, freqDiff, freqKey = 'diff') => {
  const { time, diff, myFreq, freq } = freqDiff
  // const point = toSvgPoint(svg, time, freqDiff[freqKey]);
  const circ = useTemplate('plot-point');
  
  Object.assign(circ.dataset, { key: freqKey })
  circ.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(0) scale(1)`)
  objectLayer.append(circ)
  await sleep(2)
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

svgCanvas.addEventListener('contextmenu', e => {
  appState.zoomOut()
  const input = viewport.getAttribute('transform')
  const output = input.replace(/scale\(([^)]*)\)/g, `scale(${appState.currentViewportScale})`);
  viewport.setAttribute('transform', output)
  
  
});

// const plotPoint = renderPoint(svgCanvas, frequencyDiffs[0])
let perf = {
  start: 0,
  end: 0,
}

// perf.start = performance.now()
// frequencyDiffs.forEach((d, i) => {
//   const {
//     myfreq,
//     freq,
//     time,
//     diff,
//   } = d;
//   d.myfreq = Math.round(myfreq)
//   d.freq = Math.round(freq)
//   d.time = Math.round(time)
//   d.diff = Math.round(diff)

//   renderPoint(svgCanvas, d, 'freq')
// });

let diffKey = 'myfreq'
frequencyDiffs.reduce(async (acc, d, i) => {
  acc = await acc
  if (i === 0) {
    perf.start = performance.now()
    
  }
  
  const {
    myfreq,
    freq,
    time,
    diff,
  } = d;
  d.myfreq = Math.round(myfreq)
  d.freq = Math.round(freq)
  d.time = (Math.round(time) / 3)
  d.diff = Math.round(diff)
  const point = toSvgPoint(svgCanvas, d.time, d['freq'], );
  const point2 = toSvgPoint(svgCanvas, d.time, d['myfreq']);
  const point3 = toSvgPoint(svgCanvas, d.time, d['diff'], );
  
  
  const p = await renderPoint(svgCanvas, point, d, 'freq')
  setTimeout(() => {
    p.classList.add('show');
    setTimeout(() => {
      p.classList.remove('show');
    }, 500)
    
  }, 8.5)
  
  const p2 = await renderPoint(svgCanvas, point2, d, 'myfreq')
  
  setTimeout(() => {
    p2.classList.add('show');
    setTimeout(() => {
      p2.classList.remove('show');
    }, 500)
    
  }, 200)
  
  // p.classList.remove('show');
  const p3 = await renderPoint(svgCanvas, point3, d, 'diff')
  // p3.classList.add('show');
  setTimeout(() => {
    p3.classList.add('show');
    setTimeout(() => {
      p3.classList.remove('show');
    }, 500)
    
  }, 0)
  
  // p2.classList.remove('show');
  // await sleep(2);
  // p3.classList.remove('show');
  
  const vpTrans = viewport.getAttribute('transform')
  // const vpTrans = viewport.getAttribute('transform')
  let output
  // const input = 'scale(2.5, 3.5)';
  const match = vpTrans.match(/translate\(([^)]*)\)/);
  
  if (match) {
    const [x, y] = match[1].split(',').map(Number);
    const point2 = toSvgPoint(svgCanvas, x, y);
    
    // console.log(values); // => [2.5, 3.5]
    output = vpTrans.replace(/translate\(([^)]*)\)/g, `translate(-${point3.x-500},${point3.y+100})`);
    viewport.setAttribute('transform', output)
    
  }
  
  
  
  
  
  return [...acc, p]
}, Promise.resolve([]));

// perf.end = performance.now()
// console.warn(' perf', perf.end - perf.start)