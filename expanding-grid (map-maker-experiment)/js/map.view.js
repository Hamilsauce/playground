import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';
import { MapSection } from './map-section.view.js';
const { template, DOM } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

/*

REQS:

Init
 - Instantiate Sections: Corner, Headers, Body

 - Set initial dims: 
    Corner gets unit w and h
    row header gets unit height and map height
    col header gets unit width and map width
    body gets all
    
Properties
  dimensions$


*/

const MapViewOptions = {
  templateName: 'map',
  elementProperties: {
    id: 'map',
    classList: ['gradient'],
  },
  children: []
}

const MapSectionOptions = [
  {
    templateName: 'map-section',
    elementProperties: {
      id: 'map-body',
      dataset: {
        mapSection: 'body',
        mapSectionType: 'body',
      },
    },
  },
  {
    templateName: 'map-section',
    elementProperties: {
      id: 'map-rows',
      dataset: {
        mapSection: 'rows',
        mapSectionType: 'header',
      },
    },
  },
  {
    templateName: 'map-section',
    elementProperties: {
      id: 'map-cols',
      dataset: {
        mapSection: 'columns',
        mapSectionType: 'header',
      },
    },
  },
  {
    templateName: 'map-section',
    elementProperties: {
      id: 'map-corn',
      dataset: {
        mapSection: 'corner',
        mapSectionType: 'corner',
      },
    }
  }
];

export class MapView extends View {
  #self;
  #dimensions$;
  #sections = new Map();

  constructor(dimensions$) {
    super('map', MapViewOptions);
    this.#dimensions$ = dimensions$;
    this.init(MapSectionOptions);

    // this.#dimensions$.pipe(
    //   map(x => x),
    //   tap(x => console.log('TAP', x))
    // );
  }

  init(sectionOptions = []) {
    sectionOptions.forEach((opts, i) => {
      this.#sections.set(
        opts.elementProperties.dataset.mapSection,
        new MapSection(opts.elementProperties.dataset.mapSection, this.#dimensions$, opts)
      );
    });

    this.self.append(...[...this.#sections.values()].map(_ => _.self))
  }

  get body() { return this.#sections.get('body') }

  get rowHeader() { return this.#sections.get('rows') }

  get columnHeader() { return this.#sections.get('columns') }

  get corner() { return this.#sections.get('corner') }
};