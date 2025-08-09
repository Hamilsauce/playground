import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, download } = ham;

const todayDateForFilename = (dateString) => {
  const splitDate = new Date(dateString || Date.now()).toLocaleDateString()
    .split('/');
  
  return `${splitDate[2]}${splitDate[0].length === 1 ? '0' + splitDate[0] : splitDate[0]}${splitDate[1].length === 1 ? '0' + splitDate[1] : splitDate[1]}`;
};


const GIT_TREE_DATE_STRING = '04/09/2023'

const API_URL = 'https://api.github.com/repos/Hamilsauce/playground/git/trees/master?recursive=true'
const JSON_URL = `./data/playground-git-tree_${todayDateForFilename('04/09/2023')}.json`;
const BASEPATH = `https://hamilsauce.github.io/playground`
console.log('JSON_URL', JSON_URL)
// const DATE = new Date(Date.now());
// console.log('toString', DATE.toString());
// console.log('toLocaleString', DATE.toLocaleString())
// console.log('DATE toLocaleDateString', DATE.toLocaleDateString());
// console.log('toUTCString', DATE.toUTCString());
// console.log('toISOString', DATE.toISOString())
// // console.log('to', DATE.to())
// console.log('DATE toLocaleDateString', DATE.toLocaleDateString());


const TODAY_DATE = todayDateForFilename()
console.log('TODAY_DATE', TODAY_DATE)

const blacklist = new Set([
  'rx-datastore',
  'components',
  'lib',
  'SVG_API',
])

/* ~~~~~ DOWNLOAD GIT TREE ~~~~~ */

const getGitTree = async (url) => {
  const response = (await (await fetch(url)).json())
  
  const responseTree = (response.tree ? response.tree : response)
    .filter((_) => _.type === 'tree' && !_.path.includes('/') && !blacklist.has(_.path));
  console.warn('responseT', responseTree)
  
  response.sort((a, b) => a.position - b.position);
  return responseTree
};

/*
// const gitResponse =await getGitTree(API_URL)
// console.warn('gitResponse', gitResponse)
download('playground-git-tree.json', JSON.stringify(await getGitTree(API_URL), null, 2))
*/


const createFolderLink = (folder) => {
  const dom = template('folder');
  const link = dom.firstElementChild;
  link.href = `${BASEPATH}/${folder.path}`;
  link.textContent = folder.path;
  
  return dom;
};

const createFolderList = (folders) => {
  const list = template('folders');
  
  const doc = folders.reduce((frag, curr, i) => {
    frag.append(createFolderLink(curr));
    return frag;
  }, new DocumentFragment());
  
  list.append(doc);
  
  return list;
};



const appBody = document.querySelector('#app-body')
const folderList = createFolderList(await getGitTree(JSON_URL))

appBody.append(folderList);

folderList.addEventListener('click', e => {
  const target = e.target.closest('.folder');
  
  setTimeout(() => {
    target.querySelector('a').click();
  }, 0)
});