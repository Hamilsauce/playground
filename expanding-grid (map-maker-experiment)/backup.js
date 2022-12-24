import { tileBrushStore } from './store/tile-brush.store.js';
import { toolGroupStore } from './store/tool-group.store.js';
import { MapView } from './view/map.view.js';
import { MapModel } from './store/map.model.js';
import { getStream } from './view/tile-view-updates.stream.js';
// import { MapLoader } from '../lib/map-loader.js';
import { gridOptions } from './view/grid-options.view.js';
import { AppMenu } from './view/app-menu.view.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { DEFAULT_STATE } from './store/StateModel.js';
const { download, template, utils } = ham;
import { LOCALSTORAGE_KEY } from './lib/constants.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, shareReplay, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
import { Application } from './Application.js';

import { AppFooter, AppHeader, AppBody } from './view/app-components/index.js';

// const afoot = new AppFooter()
// console.log('afoot', afoot)

export class Vector {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  get x() { return this.#x };
  get y() { return this.#y };
}


const handleFileSelection = (e) => {
  console.warn('handleFileSelection', { e });
  ui.inputs.file.addEventListener('change', handleFileSelection);
};


const handleCancel = () => {
  ui.setActiveView(ui.viewHistory[ui.viewHistory.length - 1]);
}

console.log(JSON.parse(localStorage.getItem('MAP_MAKER')));

// const mapModel = new MapModel();
const mapView = new MapView();
const appMenu = new AppMenu();

// const ui = new Application('app');
const ui = {
  get mapView() { return mapView },
  get appMenu() { return appMenu },
  get activeView() { return this.views[this.viewHistory[this.viewHistory.length - 1]] },
  get mapList() { return this.views.load.querySelector('.saved-map-list') },
  viewHistory: [],
  app: document.querySelector('#app'),
  body: document.querySelector('#app-body'),
  header: document.querySelector('#app-header'),
  menu: document.querySelector('#app-menu'),
  views: {
    save: template('save-view'),
    load: template('load-view'),
    map: mapView.render(),
  },
  buttons: {
    menuOpen: document.querySelector('#menu-open'),
    save: document.querySelector('#save-map'),
    load: document.querySelector('#load-map'),
    tileBrushes: document.querySelectorAll('#controls'),
    toolLabels: document.querySelectorAll('.tool-label'),
    cancelButtons: document.querySelectorAll('.cancel-button'),
  },
  inputs: {
    file: document.querySelector('#file-input'),
  },
  handleCancel: handleCancel.bind(this),
  setActiveView(name, options) {
    if (!name) return;

    const viewHistoryHead = this.viewHistory[this.viewHistory.length - 1];

    ui.buttons.cancelButtons.forEach((b) => {
      b.removeEventListener('click', handleCancel);
    });

    if (this.activeView && this.viewHistory.length > 0) {
      this.activeView.remove();
    }

    if (name === viewHistoryHead) {
      this.viewHistory.pop();
    }

    else this.viewHistory.push(name);

    const newViewHistoryHead = this.viewHistory[this.viewHistory.length - 1];

    if ([undefined, null].includes(this.activeView)) return;

    this.body.append(this.activeView);

    this.activeView.querySelectorAll('.cancel-button')
      .forEach((b) => {
        b.addEventListener('click', handleCancel);
      });

    if (newViewHistoryHead === 'save') {
      this.activeView.querySelector('#map-name-input').focus();
    }
  },
}

window.ui = ui

const tileBrushSelectionEvents$ = fromEvent(ui.buttons.tileBrushes, 'click')
  .pipe(
    tap(e => e.stopPropagation()),
    map(e => e.target.closest('.tile-selector')),
    filter(b => b),
    tap(b => {
      document.querySelectorAll('.tile-selector').forEach((el, i) => {
        if (b !== el) el.dataset.active = false;
        else el.dataset.active = true;
      });
    }),
    map(b => ({ activeBrush: b.dataset.tileType })),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );


const toolGroupSelectionEvents$ = fromEvent(ui.buttons.toolLabels, 'click')
  .pipe(
    tap(e => e.stopPropagation()),
    map(e => e.target.closest('.tool-label')),
    filter(b => b),
    tap(x => console.log('toolGroupSelectionEvents$', x.dataset.toolGroup)),
    tap(b => {
      document.querySelectorAll('.tool-label').forEach((el, i) => {
        if (b !== el) {
          el.dataset.active = false;
        }

        else el.dataset.active = true;

      });
    }),
    map(b => ({ activeToolGroup: b.dataset.toolGroup })),
  );

toolGroupSelectionEvents$.subscribe(selection => toolGroupStore.update(selection))

tileBrushSelectionEvents$.subscribe(selection => tileBrushStore.update(selection))

const activeToolGroup$ = toolGroupStore.select({ key: 'activeToolGroup' })
  .pipe(
    // tap((activeToolGroup) => this.activeToolGroup = activeToolGroup),
    tap(x => console.warn('[ACTIVE TOOL GROUP IN APP]', x)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

activeToolGroup$.subscribe();


ui.header.querySelector('#map-options').innerHTML = '';
ui.header.querySelector('#map-options').append(gridOptions);

ui.app.append(ui.appMenu.dom);

ui.app.addEventListener('option:change', ({ detail }) => {
  ui.mapView.setDimensions({
    [detail.name]: detail.value
  });
});

ui.buttons.menuOpen.addEventListener('click', e => {
  ui.appMenu.open();
});

ui.appMenu.on('menu:save-map', e => {
  ui.setActiveView('save');
});


const buildLoadView = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || DEFAULT_STATE;

  ui.mapList.innerHTML = '';

  Object.values(data.savedMaps)
    .forEach((m, i) => {
      const item = template('map-list-item');

      item.dataset.mapKey = m.key;

      item.textContent = m.mapName;

      ui.mapList.append(item);

      let dragPoints = [];

      let total = 0;

      item.addEventListener('contextmenu', e => {
        item.dataset.armed = true;

        item.addEventListener('pointermove', e => {
          const resetDrag = () => {
            dragPoints = [];
            total = 0;
            item.style.transform = `translate(-${total}px,0px)`;
            item.style.filter = 'hue-rotate(0deg) contrast(100%) brightness(100%)';
            item.removeEventListener('pointerup', resetDrag);
          };

          dragPoints.push({
            x: e.clientX,
            y: e.clientY,
          });

          if (dragPoints.length > 1) {
            const a = dragPoints[dragPoints.length - 2];
            const b = dragPoints[dragPoints.length - 1];
            const delta = Math.abs(b.x - a.x);

            if (delta) {
              total = total + delta;
              item.style.transform = `translate(-${total}px,0px)`;
            }
            else item.style.transform = `translate(0,0)`;

            if (total > 100) {
              item.style.filter = 'hue-rotate(120deg) contrast(150%) brightness(200%)';
            } else {
              item.style.filter = 'hue-rotate(0deg) contrast(100%) brightness(100%)';
            }
          }
          if (total > 100) {
            deleteMap(item.dataset.mapKey);
          }

          item.addEventListener('pointerup', resetDrag);
        });

        item.style.filter = 'hue-rotate(120deg) contrast(150%) brightness(200%)';
      });
    });
}


const deleteMap = (mapKey) => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || DEFAULT_STATE;
  const map = data.savedMaps[mapKey];
  delete data.savedMaps[mapKey];
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));

  buildLoadView();
};


ui.appMenu.on('menu:load-map', e => {
  ui.setActiveView('load');
  buildLoadView();
});


ui.mapList.addEventListener('click', e => {
  const item = e.target.closest('.map-list-item');

  if (item && item.dataset.mapKey) {
    const mapData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) //|| DEFAULT_STATE;
    const map2 = mapData.savedMaps[item.dataset.mapKey];

    ui.setActiveView('map');

    ui.mapView.loadMap(map2);

    ui.header.querySelector('#header-center-bottom').firstElementChild.textContent = map2.mapName
  }
});

ui.views.save.querySelector('#map-name-submit').addEventListener('click', e => {
  const input = ui.views.save.querySelector('#map-name-input');

  if (!input.value) prompt('Enter Name');

  else {
    const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || DEFAULT_STATE

    if (data) {
      const map = ui.mapView.getMapState();

      map['tile'] = map.tiles;
      map.mapName = input.value;
      map.key = map.key ? map.key : 'm' + utils.uiid();
      data.savedMaps[map.key] = map;

      ui.setActiveView('map');
    }

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  }

  ui.inputs.file.click();

  ui.inputs.file.addEventListener('change', handleFileSelection);

  const map = localStorage.getItem('map-maker-save-1');

  if (map) {
    const parsed = JSON.parse(map);
    ui.mapView.loadMap(parsed);
  }
});

ui.header.querySelector('#header-center-bottom')
  .addEventListener('click', e => {
    ui.header.querySelector('svg').dataset.expand = ui.header.querySelector('svg').dataset.expand === 'true' ? 'false' : 'true';
    gridOptions.dataset.show = gridOptions.dataset.show === 'true' ? 'false' : 'true';
  })

ui.setActiveView('map', { message: 'called after render' })


// ui.buttons.toolLabels.forEach((label, i) => {
//   label.addEventListener('click', e => {
//     const t = e.target.closest('.tool-label');
//     if (!t) return;

//     ui.buttons.toolLabels.forEach((l) => {
//       if (t === l) return;
//       l.dataset.active = false;
//     })
//     t.dataset.active = true;
//   })

// });

// const appBody = document.querySelector('#app-body')
// const mapBody = document.querySelector('#map-body')

// const scale = 32;
// const screen = {
//   width: ui.map.body.dom.getBoundingClientRect().width,
//   height: ui.map.body.dom.getBoundingClientRect().height,
//   // width: innerWidth,
//   // height: innerHeight,
// }
// const unit = {
//   width: screen.width / scale,
//   height: screen.height / scale,
// }
// console.warn('screen', screen)
// console.warn('unit', unit)