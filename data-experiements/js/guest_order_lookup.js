import { fetchData } from '../lib/fetch.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, date } = ham;
// console.log('date', date.isValidDateValue)

const nullTest = [
  [null, { fuck: 'me null 1' }],
  [null, { fuck: 'me null 2' }],
  ['abc', { fuck: 'me abc 1' }],
  ['abc', { fuck: 'me abc 2' }],
]

const onlyNulls = nullTest.filter((x, i) => x[0] === null);

console.warn('nullTest', nullTest)
console.warn('onlyNulls', onlyNulls)


const coerce = (value) => {
  if (+value) return +value

  if (value === 'T' || value === 'F') return value === 'T' ? true : false;

  return value;
}

const normalizeAddress = (addressString = '') => {
  const address = addressString.split('\n');
  return address
}

const normalizeRecord = (record) => {
  const normed = Object.entries(record)
    .map(([key, value]) => {

      return [key, coerce(value)]
    })

  return Object.fromEntries(normed)
}

const multiTrackingOrderUrl = './json/multi-tracking-order.json'
const orderUrl = './json/sales-order-record-wb3413681114.json'

const orderData = normalizeRecord(await fetchData(multiTrackingOrderUrl, 'json'))
// const order = await (await fetch(orderUrl)).json();

orderData.itemsByTrackingNumber = orderData.items.reduce((acc, curr, i) => {
  return { ...acc, [`'${curr.trackingNumbers}'`]: acc[`'${curr.trackingNumbers}'`] ? [...acc[`'${curr.trackingNumbers}'`], normalizeRecord(curr)] : [normalizeRecord(curr)] }
}, {});

console.log('orderData', orderData)
// console.log('normalizeRecord(orderData)', normalizeRecord(orderData))
