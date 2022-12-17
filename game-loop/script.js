import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { frameRate } from './lib/frame-rate.js';
import { mainLoop } from './lib/main-loop.js';
import { store } from './store.js';
import { View } from './view.js';
console.warn('store 4,6', store.grid.tile(4, 4))


const { template, utils, DOM } = ham;

const app = document.querySelector('#app');
const grid = document.querySelector('.grid');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const ui = new View('app');

const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

const state = {
  get target() { return ui.targetTile },
  actorVelocity: 10,
  tileDims: { height: 121, width: 69 },
}

const detectOverlap = (a, b) => {
  const bba = a.getBoundingClientRect();
  const bbb = b.getBoundingClientRect();
  const pt = new DOMPoint(bba.x, bba.y)
  // console.log('pt', pt)
  // console.log('bba', bba)

  console.log('bba.right <= bbb.right', bba.right <= bbb.right)
  return bba.top > bbb.top &&
    bba.bottom <= bbb.bottom &&
    bba.left > bbb.left &&
    bba.right <= bbb.right
};

const detectActorOverlapTarget = () => {
  return detectOverlap(ui.actor, state.target)
}

const handleTileClick = (e) => {
  const tile = e.target.closest('.tile');
  const { row, column } = tile.dataset
  const targ = ui.tile(+row, +column);

  if (targ) {
    ui.setTarget(targ)
  }
};

const updateActor = (delta) => {
  if (!state.target) return;

  const tileOffset = { height: (ui.tileSize.height / 2), width: (ui.tileSize.width / 2) }
  const { row, column } = ui.actor.dataset
  const actorBB = ui.actor.getBoundingClientRect()
  const gridBB = ui.grid.dom.getBoundingClientRect()

  if (
    actorBB.left < 0 || actorBB.right >= gridBB.right ||
    actorBB.top < 0 || actorBB.bottom >= gridBB.bottom
  ) {
    console.warn('OUT OF BOUNDS');

    ui.actor.style.left = (ui.actor.getBoundingClientRect().x - 20) + 'px';

    return;
  }

  const [curr, subtile] = ui.tileAtPoint(
    ui.actorScreenCoordinates.x,
    ui.actorScreenCoordinates.y,
  );
// console.log('curr, subtile', curr, subtile)
  if (
    curr &&
    curr.dataset &&
    curr.dataset.row
    // && detectOverlap(ui.actor, curr)
    // curr.dataset.traversable !== 'false'
  ) {
    ui.actor.dataset.row = curr.dataset.row;
    ui.actor.dataset.column = curr.dataset.column;
    ui.actor.dataset.moving = true;
    // console.log('INSIDE MOVE', {curr}, {actor:ui.actor});
    console.assert(detectOverlap(ui.actor, curr), detectOverlap(ui.actor, curr))
    ui.setOccupiedTile(curr, subtile)

    if (state.target) {
      if (+state.target.dataset.column > +ui.actor.dataset.column) {
        ui.actor.style.left = ((ui.actor.getBoundingClientRect().left + state.actorVelocity) ) + 'px';
      }

      else if (+state.target.dataset.column < +ui.actor.dataset.column) {
        ui.actor.style.left = ((ui.actor.getBoundingClientRect().left - state.actorVelocity)) + 'px';
      }

      else if (+state.target.dataset.row > +ui.actor.dataset.row) {
        ui.actor.style.top = ((ui.actor.getBoundingClientRect().top + state.actorVelocity) - 60) + 'px'
      }

      else if (+state.target.dataset.row < +ui.actor.dataset.row) {
        ui.actor.style.top = ((ui.actor.getBoundingClientRect().top - state.actorVelocity) - 60) + 'px'
      }
    }
  }
};

const fpsDisplay = document.querySelector('#fps-display');

export const renderFPS = (delta = 0) => {
  const fps = frameRate(delta);
  fpsDisplay.textContent = fps
  return fps
}

// ui.grid.addEventListener('click', e => {
//   handleTileClick(e)
// });

const barrierTiles = [
  { row: 1, column: 1, type: 'barrier' },
  { row: 1, column: 2, type: 'barrier' },
  { row: 1, column: 4, type: 'barrier' },
  { row: 4, column: 2, type: 'barrier' },
  { row: 4, column: 3, type: 'barrier' },
  { row: 5, column: 2, type: 'barrier' },
  { row: 5, column: 3, type: 'barrier' },
  { row: 7, column: 2, type: 'barrier' },
  { row: 7, column: 3, type: 'barrier' },
  { row: 8, column: 2, type: 'barrier' },
  { row: 8, column: 3, type: 'barrier' },
]


ui.createGrid(11, 6, ) // { tiles: barrierTiles });

mainLoop.registerUpdates(
  updateActor,
  renderFPS
);

mainLoop.start(1);