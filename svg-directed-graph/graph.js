import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { utils } = ham;

export class MapGraph extends Map {
  #name;
  #type;
  #edges;

  constructor(name, type, entries) {
    super();
    if (entries) {
      entries.forEach(([value, adjacent], i) => {

        this.addVertex(value, adjacent)
      });
    }
    this.#name = name;

    this.#type = type || 'undirected';
    console.log('this', this)
  }

  get name() { return this.#name };

  get type() { return this.#type };

  set(value, adjacent) {
    if (!this.has(value)) {
    super.set(value, new Set([adjacent]));
    } else {
        this.get(value).add(adjacent);
    }
  }

  addEdge(from, to) {
    this.set(from, to);

    if (this.type === 'undirected') {
      this.set(to, from);
    }
  }

  addVertex(value, adjacent) {
    this.set(value, adjacent);
    if (!this.has(value)) {}
  }

  static buildGraphMap(edges) {
    let graph = new Map();

    //  const addEdge = (from, to) => {
    //     if (!graph.has(from)) {
    //       graph.set(from, new Set([to]));
    //     } else {
    //       graph.get(from).add(to);
    //     }
    //   }

    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to);
      addEdge(to, from);
    }

    return graph;
  }

};