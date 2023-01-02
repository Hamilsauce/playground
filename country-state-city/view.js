
const selects = {
  country: document.querySelector('#country-select'),
  state: document.querySelector('#state-select'),
  city: document.querySelector('#city-select'),
}



export const createSelectOptions = (selectName, items = []) => {
  const select = selects[selectName.replace('-select', '')];
console.log('items', items)
  const opts = items.map(({ id, name, iso2 }, i) => {
    const opt = document.createElement('option');

    opt.textContent = name;
    opt.value = iso2 || name;
    return opt;
  });

  select.innerHTML = '';

  select.append(...opts);
};


const action = (type, data) => {
  return new CustomEvent(type, { bubbles: true, detail: data })
}


const handleSelectChange = (e) => {
  const select = e.target.closest('select');
  const id = select.id.replace('-select', '')
  // new HTMLSelectElement().selectedOptions[0]
  select.dispatchEvent(action('selectchange', {
    name: id,
    value: select.selectedOptions[0].value
  }));

  console.log('select.selectedOptions[0]', select.selectedOptions[0])
};

document.querySelectorAll('select').forEach((sel, i) => {
  sel.addEventListener('change', handleSelectChange);
});

