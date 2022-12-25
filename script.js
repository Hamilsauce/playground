import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, download } = ham;

const API_URL = 'https://api.github.com/repos/Hamilsauce/playground/git/trees/master?recursive=true'
const JSON_URL = './data/playground-git-tree.json';
const BASEPATH = `https://hamilsauce.github.io/playground`

const blacklist = new Set([
  'rx-datastore',
  'components',
  'lib',
  'SVG_API',
])


const getGitTree = async (url) => {
  const response = await (await fetch(url)).json();
  // console.log('response', response)
  return (response.tree ? response.tree : response).filter((_) => _.type === 'tree' && !_.path.includes('/') && !blacklist.has(_.path))
};

// download('playground-git-tree.json', JSON.stringify(await getGitTree(API_URL), null, 2))

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