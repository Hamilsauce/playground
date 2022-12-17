// import { getDeck } from './model/deck-gen.model.js';
import { getDeck } from './model/deck-array-gen.js';

const deck = getDeck(true);
const dealer = deck.cardGenerator();
const topCard = deck.head
console.warn('topCard', topCard);

const stringify = (obj) => JSON.stringify(obj, null, 2)

const getJson = (topCard) => {
  let c = topCard
  let output = []

  while (c) {
    output.push(stringify(c))
    c = c.next
  }
  return output.join('\n')
}

const getJson2 = (cards) => {
  return cards.reduce((json, curr, i) => {
      return `
      ${json}
      <div class="card-json">${
      stringify(curr).split('\n').map(_=>`<div class="card-json-line"><span class="text-bold">${_.slice(0,_.indexOf(':')-1).trim()}</span><span class="line-value">${_.slice(_.indexOf(':')+1, _.length-1)}</span></div>`).join('\n')
      }</div>
    `;
    }, '')
    .trim()
    .replace(/[\{\}\"]/g, '')
    .replace(/displayName/g, 'name')

  let c = topCard
  let output = []

  while (c) {
    output.push(stringify(c))
    c = c.next
  }
  return output.join('\n')
}

let clickCnt = 0;
const drawnCards = [];


const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body');
const stats = document.querySelector('#stats');
const output = document.querySelector('#drawn-card');

const getStatsTemplate = (options = {}) => {
  return `<div class="card-json-line">Cards Left: ${options.remaining}</div>`
}

app.addEventListener('click', e => {
  let c;
  if (clickCnt === 0) {
    c = dealer.next();
  } else {
    c = dealer.next();
  }

  if (c.done) return console.warn('DONE');
  c = c.value
  const el = document.createElement('div');
  el.className = 'card-json'

  output.innerHTML = ''

  el.innerHTML = `${
  stringify(c.card).split('\n').map(_=>`<div class="card-json-line"><span class="text-bold">${_.slice(0,_.indexOf(':')-1).trim()}</span><span class="line-value">${_.slice(_.indexOf(':')+1, _.length-1)}</span></div>`).join('\n')
    .trim()
    .replace(/[\{\}\"]/g, '')
    .replace(/displayName/g, 'name')
  }`;
  console.warn(c);
  stats.innerHTML = getStatsTemplate({remaining:c.remaining})
  output.append(el)

  drawnCards.push(c)
});