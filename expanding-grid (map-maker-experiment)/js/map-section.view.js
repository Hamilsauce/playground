import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';

const { template } = ham;


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



export class MapSection extends View {
  #self;
  #name;

  constructor(sectionName, options) {
    console.warn('sectionName, options', sectionName, options)
    super('map-section', options);



    console.warn({ sectionName }, this);

  }
};