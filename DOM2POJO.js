const _DOM2POJO = (element, pojo = {}) => {
  for (var prop in element) {
    if (prop === 'baseVal' || prop === 'animVal') {
      pojo[prop] = element[prop];
    }
    else {
      const propValue = element[prop];
      if (!!propValue && typeof propValue === 'object' && propValue !== null) {
        if (Array.isArray(propValue)) {
          try {
            pojo[prop] = [...propValue].map((ch, i) => {
              return DOM2POJO(ch);
            });
          } catch (e) {}
        }

        else if (!!propValue) {
          for (var childProp in propValue) {
            if (childProp === 'baseVal' || childProp === 'animVal') {}
            else {
              try {
                pojo[prop][childProp] = DOM2POJO(propValue[childProp]);
              }
              catch (e) {
                if (childProp === 'baseVal' || childProp === 'animVal') {}
              }
            }
          }
        }
      }
      else pojo[prop] = propValue;
    }
  }

  return pojo;
};

const DOM2POJO = (element, pojo = {}) => {
  for (var prop in canvas) {
    if (prop === 'children' && !!canvas.children) {
      const { children } = canvas;

      pojo.children = [...children].map((ch, i) => {
        const childPojo = {};

        for (var prop in canvas) {
          childPojo[prop] = ch[prop]
        }

        return childPojo;
      });

    } else pojo[prop] = canvas[prop];
  }

  const pojoJson = JSON.stringify(pojo, null, 2)

  console.log({ pojo });

  download('svg-element-json.json', pojoJson)
  document.body.firstElementChild.innerHTML = `<pre>${pojoJson}</pre>`
};