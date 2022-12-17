const CELL_ADDRESS_REGEX = /^[A-Z]{1,5}\d{1,6}$/g;
// const CELL_ADDRESS_REGEX = /^[A-Z]{1,5}\d{1,6}$/;
const evaled1 = eval('43+7')
console.log('evaled1', evaled1)

const testString1 = '=AB32+B25'

const matchAll = testString1.matchAll(CELL_ADDRESS_REGEX)
console.warn('matchAll', [...matchAll])
// console.log('cellAddressPattern.constructor', cellAddressPattern)
// console.log('replace shit', 'A-1'.replace(/^[A-Z]{1,5}\d{1,6}$/, 'FOUND ABC123'));
export const getCellAddress = () => {};
