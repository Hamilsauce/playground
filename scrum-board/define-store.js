import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
const { template } = ham;

export class Store extends EventEmitter {
  #state;
  #actions;
  #getters;
  #name;

  constructor(name, { state, actions, getters }) {
    super();
    if (!(name && state)) throw new Error('No name or state passed to store constructor for ', this.constructor.name);

    this.#name = name;
    
    this.#state = state;
    this.#actions = actions;
    this.#getters = getters;

  };

  get name() { return this.#name };
};