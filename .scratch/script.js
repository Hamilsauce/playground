import { DocumentParser } from '../lib/dom-parser.js';

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const output = document.querySelector('#output');

const xmlUrl = '../jenkins-atom-feed.xml'

const rawXML = await (await fetch(xmlUrl)).text();


const jenkinsReportDoc = DocumentParser.parse(rawXML);
const docString = JSON.stringify(jenkinsReportDoc, null, 2)
// output.innerHTML = docString;
const getChildByIndex = (doc, index) => {
  const child = doc.children[index]

  return child
}

const getJenkinsBuild = (index) => {
  return getChildByIndex(jenkinsReportDoc, index)
}

console.log('getJenkinsBuild\n', )
const selectedBuild = getJenkinsBuild(5)
// output.append(sele f  fctedBuild.outerHTML)

console.log('getJenkinsBuild\n', getJenkinsBuild(300))
console.log('jenkinsReportDoc', { jenkinsReportDoc })
// appBody.append(build300)

console.log('jenkinsReportDoc', JSON.stringify(jenkinsReportDoc, null, 2))

let graph = Object.create(null);
console.log('graph', graph)