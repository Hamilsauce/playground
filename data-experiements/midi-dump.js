const midiJSONPath = './json/midi-dump-query-062022.json'

const { midiFiles } = await (await fetch(midiJSONPath)).json();

const onlyTextPlain = midiFiles.filter(file => file.contentType === 'text/plain')
const onlyHTML = midiFiles.filter(file => file.contentType === 'text/html')
// const only = midiFiles.filter(file => file.contentType==='text/plain')

const uniqueTypes = [...new Set(midiFiles.map(file => file.contentType))]
console.log('midiFiles', midiFiles)
console.log('onlyTextPlain', onlyTextPlain)
console.log('onlyHTML', onlyHTML)
console.log('uniqueTypes', uniqueTypes)
