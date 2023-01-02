// import { getDeck } from './model/deck-gen.model.js';
import { getDeck } from './models/deck-array-gen.model.js';
import { CardView } from './views/card.view.js';
import { GridCard } from './views/grid-card.js';
const deck = getDeck(true);
const dealer = deck.cardGenerator();
const topCard = deck.head
console.warn('topCard', topCard);

const card1 = new CardView(topCard.card.state());
const gridCard = new GridCard(topCard.card.state());

const stringify = (obj) => JSON.stringify(obj, null, 2)


let clickCnt = 0;
const drawnCards = [];


const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body');
const stats = document.querySelector('#stats');
const output = document.querySelector('#drawn-card');

const createCard = (cardOptions = {}) => {
  return new CardView(cardOptions);
};


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

  // el.innerHTML = `${
  // stringify(c.card).split('\n').map(_=>`<div class="card-json-line"><span class="text-bold">${_.slice(0,_.indexOf(':')-1).trim()}</span><span class="line-value">${_.slice(_.indexOf(':')+1, _.length-1)}</span></div>`).join('\n')
  //   .trim()
  //   .replace(/[\{\}\"]/g, '')
  //   .replace(/displayName/g, 'name')
  // }`;
  // el.innerHTML = ''
  console.warn(c);

  stats.innerHTML = getStatsTemplate({ remaining: c.remaining })
console.warn('c', c)
  const card = createCard(c.card)
console.log('card', card)
  output.append(card1.render())

  drawnCards.push(c)
});
// output.innerHTML = '';
// output.append(card1.render())
// console.warn('grid card', card1)