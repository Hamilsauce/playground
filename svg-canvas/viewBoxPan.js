const canvas = document.querySelector('#canvas');
const drawSurface = canvas.querySelector('#draw-surface');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const getPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

const getDrawingPoint = (x, y) => () => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


const vbox = drawSurface.viewBox
console.log('vbox', vbox)

// let lastPoint = {
//   x: 0,
//   y: 0
// }

let lastPoint = getPoint(drawSurface, {
  x: 0,
  y: 0
})

const getDelta = (pointA, pointB) => {
  console.log('pointA, pointB', pointA, pointB)
  return {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y,
  }
};



drawSurface.addEventListener('pointermove', e => {
  const nextPoint = getPoint(drawSurface, { x: e.clientX, y: e.clientY })
  const delta = getDelta(lastPoint, nextPoint)
  // console.warn('[[pointermove]]delta', delta)
  // Object.assign(lastPoint, nextPoint)
  lastPoint = nextPoint
  // console.log('lastPoint, nextPoint', lastPoint, nextPoint)
  // console.log('vbox.x + delta.x', vbox.x + delta.x)
  vbox.baseVal.x = vbox.baseVal.x + delta.x
  vbox.baseVal.y = vbox.baseVal.y + delta.y
  vbox.baseVal.width = vbox.baseVal.width + delta.x
  vbox.baseVal.height = vbox.baseVal.height + delta.y
  console.log('vbox', vbox)

});