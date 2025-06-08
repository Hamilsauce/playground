const events = new Map([
  ['arrow:start', new Set()],
  ['arrow:end', new Set()],
  ['*', new Set()],
])

const fireEvent = (evt, data) => {
  const listeners = events.get(evt)
  const globalListeners = events.get('*')
  
  const combined = new Set([...listeners, ...globalListeners])
  
  console.group(`[ ${evt}: ${data} ] `)
  
  console.warn(`listeners:  `, [...listeners])
  console.warn(`Global listeners:  `, [...globalListeners])
  console.warn('combined listeners', [...combined])
  
  console.groupEnd(`[ ${evt}: ${data} ] `)

  combined.forEach((listener, i) => {
    listener(data)
  });
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