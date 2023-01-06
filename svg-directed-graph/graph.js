import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { utils } = ham;

export class MapGraph extends Map {
  #name;
  #edges;

  constructor(name, entries) {
    super();

    // if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;
  }

  set(value, ...adjacents) {
    if (!this.has(value)) {
      super.set(value, new Set([...adjacents]));
    } else {
      adjacents.forEach((to, i) => {
        this.get(value).add(to);
      });
    }
  }

  addEdge(from, to) {
    if (!this.has(from)) {
      this.set(from, new Set([to]));
    } else {
      this.get(from).add(to);
    }
  }

  addVertex(value, ...adjacents) {
    if (!graph.has(value)) {
      graph.set(value, new Set([...adjacents]));
    } else {
      adjacents.forEach((to, i) => {
        graph.get(from).add(to);
      });
    }
  }

  get name() { return this.#name };

  static buildGraphMap(edges) {
    let graph = new Map();

    const addEdge = (from, to) => {
      if (!graph.has(from)) {
        graph.set(from, new Set([to]));
      } else {
        graph.get(from).add(to);
      }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to);
      addEdge(to, from);
    }

    return graph;
  }

};

export class Graph extends EventEmitter {
  #name;
  #edges;

  constructor(name) {
    super();

    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    this.#name = name;

  };


  get name() { return this.#name };

  static buildGraphMap(edges) {
    let graph = new Map();

    const addEdge = (from, ...adjacents) => {
      if (!graph.has(from)) {
        graph.set(from, new Set([...adjacents]));
      } else {
        adjacents.forEach((to, i) => {
          graph.get(from).add(to);
        });
      }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to);
      addEdge(to, from);
    }

    return graph;
  }

};