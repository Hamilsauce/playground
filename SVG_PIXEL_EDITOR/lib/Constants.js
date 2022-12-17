import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { TwoWayMap, date, array, utils, text } = ham;


export const DEFAULT_APP_OPTIONS = {
  components: {}
}

export const DEFAULT_CANVAS_OPTIONS = {
  unitSize: 1,
  dataset: {},
  id: 'svg-canvas',
  attributes: {
    preserveAspectRatio: 'xMidYMid meet',
  },
  style: {
    background: '#FFFFFF',
  },
  viewport: {
    width: 406, //window.innerWidth,
    height: 500, //window.innerHeight,
  },
  layers: [
    'surface',

    // height: window.innerHeight,
  ],
  get viewBox() {
    return {
      height: 10,
      width: 10,
      get x() { return -(this.width) / 2 },
      get y() { return -(this.height) / 2 },
    }
  }
}
