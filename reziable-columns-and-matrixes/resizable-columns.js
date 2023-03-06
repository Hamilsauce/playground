const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const table = document.querySelector('#matrix');

const headers = [...table.querySelectorAll('.header')]

let resizingHeader = null

headers.filter(_ => !_.classList.contains('last'))
  .forEach((header, i) => {
    header.dataset.column = i;

    header.addEventListener('pointerdown', e => {
      const t = e.target.closest('.handle');

      if (t) {
        resizingHeader = header.dataset.column
      }
    });

    header.parentElement.addEventListener('pointermove', e => {
      const t = e.target.closest('.handle');

      if (t && resizingHeader === header.dataset.column) {
        const x = e.clientX;
        
        header.style.width = x + 'px'
      }
    })


    header.addEventListener('pointerup', e => {
      const t = e.target.closest('.handle');
      header.dataset.column = null;

      if (t) {
        console.log('p up n t');
        
        const x = e.clientX;
        
        header.style.width = x + 'px';
      }
    });

  });
// headers.filter(_ => !_.classList.contains('last')).forEach(header => {});
// headers.filter(_ => !_.classList.contains('last')).forEach(header => {});