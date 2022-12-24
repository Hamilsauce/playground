import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';
import { MapSection } from './map-section.view.js';
const { template, DOM } = ham;


/*

REQS:

Init
 - Instantiate Sections: Corner, Headers, Body
 - Set initial dims: 
    Corner gets unit w and h
    row header gets unit height and map height
    col header gets unit width and map width
    body gets all
    

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
  #name;
  #sections = new Map();

  constructor() {
    super('map', MapViewOptions);

    this.init(MapSectionOptions);
  }

  init(sectionOptions = []) {
    sectionOptions.forEach((opts, i) => {
      this.#sections.set(
        opts.elementProperties.dataset.mapSection,
        new MapSection(opts.elementProperties.id, opts)
      );
    });

    this.self.append(...[...this.#sections.values()].map(_ => _.self))
  }

  get body() { return this.#sections.get('body') }

  get rowHeader() { return this.#sections.get('rows') }

  get columnHeader() { return this.#sections.get('columns') }

  get corner() { return this.#sections.get('corner') }
};