import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;
console.log('utils.uuid(', 'g' + utils.uuid())

export const GraphConfig = {
  id: 'geqxstdc45kqmf1lwfea',
  name: 'network',
  type: 'undirected'
}

const roads = [
  "Alice's House-Bob's House", "Alice's House-Cabin",
  "Alice's House-Post Office", "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop", "Marketplace-Farm",
  "Marketplace-Post Office", "Marketplace-Shop",
  "Marketplace-Town Hall", "Shop-Town Hall"
];


function buildGraphObject(edges) {
  // let graph = Object.create(null);
  let graph = new Map();

  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const buildGraphMap = (edges) => {
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

const roadGraph = buildGraphMap(roads);

console.log('roadGraph', [...roadGraph.get("Alice's House")])