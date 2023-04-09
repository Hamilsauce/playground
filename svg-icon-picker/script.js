const app = document.querySelector('#app');
const appHeader = document.querySelector('#app-header')
const appBody = document.querySelector('#app-body')
const svgs = [...appBody.querySelectorAll('svg')];
const recentIconContainer = document.querySelector('#icons');
const recentIcons = [...recentIconContainer.querySelectorAll('path')]
console.log('recentIcons', recentIcons)
const svgCount = svgs.length

appHeader.querySelector('#header-stats').textContent = `Icons: ${svgCount}`



const selectAllText = (e) => { window.getSelection().selectAllChildren(e.target) };


const createClipboardItem = (data = '', type = 'text/plain') => new ClipboardItem({
  [type]: new Blob([data], { type })
});

const appendToClipboard = (clipboard = [], clipboardItem) => {
  // const blob = new Blob([text], { type });
  return [...data, clipboardItem];
};

const writeToClipboard = async (data = []) => {
  const resp = await navigator.clipboard.write(data);
  console.log('resp', resp);
  return resp
};




const writeToClipboard2 = async (input = '', type = 'text/plain') => {
  const blob = new Blob([input], { type });
  const data = [new ClipboardItem({
    [type]: blob
  })];
  const resp = await navigator.clipboard.write(data);
  const result = await resp
  console.log('result', result);
  return result
};


app.addEventListener('click', async (e) => {
  console.log('e', e.target);
  // selectAllText(e);

  await writeToClipboard2(e.target.outerHTML)

  alert('Copied!');
});




svgs.forEach((svg, i) => {



});