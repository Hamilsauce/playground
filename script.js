import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, download } = ham;

const todayDateForFilename = (dateString) => {
  const splitDate = new Date(dateString || Date.now()).toLocaleDateString()
    .split('/');
  return `${splitDate[2]}${splitDate[0].length === 1 ? '0' + splitDate[0] : splitDate[0]}${splitDate[1].length === 1 ? '0' + splitDate[1] : splitDate[1]}`;
};


const GIT_TREE_DATE_STRING = '08/01/2025'

const API_URL = 'https://api.github.com/repos/Hamilsauce/playground/git/trees/master?recursive=true'
const JSON_URL = `./data/playground-git-tree_${todayDateForFilename(GIT_TREE_DATE_STRING)}.json`;
const BASEPATH = `https://hamilsauce.github.io/playground`
// const DATE = new Date(Date.now());
// console.log('toString', DATE.toString());
// console.log('toLocaleString', DATE.toLocaleString())
// console.log('DATE toLocaleDateString', DATE.toLocaleDateString());
// console.log('toUTCString', DATE.toUTCString());
// console.log('toISOString', DATE.toISOString())
// // console.log('to', DATE.to())
// console.log('DATE toLocaleDateString', DATE.toLocaleDateString());


const TODAY_DATE = todayDateForFilename()

const blacklist = new Set([
  'rx-datastore',
  'components',
  'lib',
  'SVG_API',
])

const whitelist = new Set([
  'plot-freq-diffs',
  'card-deck-with-generator',
  'lib',
  'SVG_API',
])

/* ~~~~~ DOWNLOAD GIT TREE ~~~~~ */

const getGitTree = async (url) => {
  try {
    const response = (await (await fetch(url)).json())
    
    const responseTree = (response.tree ? response.tree : response)
      .filter((_) => _.type === 'tree' && !_.path.includes('/') && !blacklist.has(_.path));
    
    responseTree.sort((a, b) => a.position - b.position);
    
    return {
      folders: [
        ...responseTree,
      ],
      lastUpdated: new Date(Date.now()).toLocaleDateString(),
    }
    
  } catch (e) {
    console.error(e)
  }
};

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


const init = async (url) => {
  let localFolders = JSON.parse(localStorage.getItem('playgroundFolders'));
  let gitResponse
  let monthsDiff
  
  if (localFolders) {
    const today = new Date(Date.now()).getMonth()
    const recentPast = new Date(Date.parse(localFolders.lastUpdated)).getMonth()
    const elapsed = +today - +recentPast;
    
    if (elapsed >= 1) {
      gitResponse = await getGitTree(API_URL)
      localStorage.setItem('playgroundFolders', JSON.stringify(gitResponse))
      localFolders = JSON.parse(localStorage.getItem('playgroundFolders'));
    }
  }
  else {
      gitResponse = await getGitTree(API_URL)
      localStorage.setItem('playgroundFolders', JSON.stringify(gitResponse))
      localFolders = JSON.parse(localStorage.getItem('playgroundFolders'));
  }
  
  download('playground-git-tree.json', JSON.stringify(localFolders, null, 2))
  
  const appBody = document.querySelector('#app-body')
  const folderList = createFolderList(localFolders.folders)
  
  appBody.append(folderList);
  
  folderList.addEventListener('click', e => {
    const target = e.target.closest('.folder');
    
    setTimeout(() => {
      target.querySelector('a').click();
    }, 0)
  });
}

init()