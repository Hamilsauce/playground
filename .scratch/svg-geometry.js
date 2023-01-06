const app = document.querySelector('#app');
const svg = document.querySelector('svg');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const svgGroup = document.createElementNS(SVG_NS, 'g');
      
svgGroup.innerHTML = '<rect fill="#FFFFFF" id="hour-hand" x="50.386px" y="100.291px" width="100.227px" height="126px" />'

console.log('svgGroup.firstElementChild', svgGroup.firstElementChild)

svg.innerHTML = ''
svg.append(svgGroup)