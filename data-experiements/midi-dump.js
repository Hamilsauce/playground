const midiJSONPath = './json/midi-dump-query-062022.json'

const { midiFiles } = await (await fetch(midiJSONPath)).json();

const onlyTextPlain = midiFiles.filter(file => file.contentType === 'text/plain')
const onlyHTML = midiFiles.filter(file => file.contentType === 'text/html')
// const only = midiFiles.filter(file => file.contentType==='text/plain')
const encoded = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+CiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOCAxLjk5IDAgNS45NyAxLjA5IDYgMy4wOC0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K'
const decoded = atob(encoded)
console.warn('decoded', decoded)
const uniqueTypes = [...new Set(midiFiles.map(file => file.contentType))]
console.log('midiFiles', midiFiles)
console.log('onlyTextPlain', onlyTextPlain)
console.log('onlyHTML', onlyHTML)
console.log('uniqueTypes', uniqueTypes)
