import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

const url = 'https://api.github.com/repos/Hamilsauce/playground/git/trees/5861ace89a194d1e48da2b342220a6388a0559dc?recursive=true'
const BASEPATH = `https://hamilsauce.github.io/playground`

const getGitTree = async (url) => {
  const response = await (await fetch(url)).json();

  return response.tree.filter((_) => _.type === 'tree' && !_.path.includes('/'))
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



const appBody = document.querySelector('#app-body')
const folderList = createFolderList(await getGitTree(url))

appBody.append(folderList);

folderList.addEventListener('click', e => {
  const target = e.target.closest('.folder');

  setTimeout(() => {
    target.querySelector('a').click();
  }, 300)
});