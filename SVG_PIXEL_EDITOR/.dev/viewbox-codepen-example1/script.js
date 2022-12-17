const positionHandle = document.querySelector("#btn");
const canvas = document.querySelector("#svg-canvas");

const setCanvasPosition = (svg,{ x, y }) => {
  
};

const setCanvasSize = (svg, { width, height }) => {};

const setCanvasViewBox = (svg, { x, y, width, height }) => {};



let a = 0;

// function evento() {
const handleReposition = (e) => {
  console.log('e', e)
  a -= 10;
  canvas.setAttribute("viewBox", a + " " + a + " 200 150");
}


positionHandle.addEventListener('click', handleReposition, false);
