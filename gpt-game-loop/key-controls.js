const events = new Map([
  ['arrow:start', new Set()],
  ['arrow:end', new Set()],
  ['*', new Set()],
])

const fireEvent = (evt, data) => {
  const listeners = [...(events.get(evt) ?? [])];
  const globalListeners = [...(events.get('*') ?? [])];
  
  for (const listener of [...listeners, ...globalListeners]) {
    listener(data, evt);
  }
}

const registerListener = (evt, listener) => {
  const listeners = events.get(evt)
  
  listeners.add(listener)
}

const buttonContainer = document.querySelector('#key-controls');

// const arrrowButtons 

buttonContainer.addEventListener('pointerdown', e => {
  const target = e.target
  
  if (target.dataset.arrow) {
    fireEvent('arrow:start', target.dataset.arrow)
  }
  
});

buttonContainer.addEventListener('pointerup', e => {
  const target = e.target
  
  if (target.dataset.arrow) {
    fireEvent('arrow:end', target.dataset.arrow)
  }
});

export const keyControls = {
  registerListener
}