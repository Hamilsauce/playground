import { SUITS, CARD_RANKS } from '../data/constants.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;


const cardValues = [...CARD_RANKS]
const suits = [...SUITS]

export const newDeck = (shuffle = true) => shuffle === true ?
  utils.shuffle(cardValues.reduce(
    (acc, curr, i) => [
    ...acc,
    ...suits.map(suit => ({ ...curr, suit, name: `${curr.value} of ${suit}s` }))
  ], [])) :
  cardValues.reduce(
    (acc, curr, i) => [
    ...acc,
    ...suits.map(suit => ({ ...curr, suit }))
  ], []);
